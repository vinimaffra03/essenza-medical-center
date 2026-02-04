// Supabase Edge Function: checkout
// Cria booking 'pending' e gera Stripe Checkout Session
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!
const PUBLIC_APP_URL = Deno.env.get('PUBLIC_APP_URL')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })

type Body = {
  room_id: string
  start_time: string
  end_time: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { 
      status: 405,
      headers: corsHeaders 
    })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }

    const { room_id, start_time, end_time } = (await req.json()) as Body
    if (!room_id || !start_time || !end_time) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })

    // Obter usuário logado
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }

    // 1. Verificar disponibilidade (Check de colisão)
    // O range filter do Supabase ou overlap manual
    const { data: conflicts, error: conflictErr } = await supabase
      .from('bookings')
      .select('id')
      .eq('room_id', room_id)
      .neq('status', 'cancelled') // Ignora cancelados
      // Lógica de overlap: (StartA < EndB) AND (EndA > StartB)
      .lt('start_time', end_time)
      .gt('end_time', start_time)
      .limit(1)

    if (conflictErr) {
       console.error('Availability check error:', conflictErr)
       throw new Error('Failed to check availability')
    }

    if (conflicts && conflicts.length > 0) {
      return new Response(JSON.stringify({ error: 'Selected time slot is not available.' }), { 
        status: 409,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }

    // Carregar sala
    const { data: room, error: roomErr } = await supabase
      .from('rooms')
      .select('id,title,price_per_day,price_per_hour')
      .eq('id', room_id)
      .single()
    if (roomErr || !room) {
      return new Response(JSON.stringify({ error: 'Room not found' }), { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }

    const start = new Date(start_time)
    const end = new Date(end_time)
    if (!(start < end)) {
      return new Response(JSON.stringify({ error: 'Invalid interval' }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }
    
    // Calcular dias (arredondado para cima)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    const days = Math.ceil(diffHours / 24)
    
    // Usar price_per_day se disponível, senão calcular a partir de price_per_hour (assumindo 8h/dia)
    const pricePerDay = room.price_per_day || (room.price_per_hour ? room.price_per_hour * 8 : 0)
    
    // Aplicar descontos progressivos
    let discountPercent = 0
    if (days >= 31) {
      discountPercent = 35 // 1 mês ou mais: 35%
    } else if (days >= 14) {
      discountPercent = 25 // 2 semanas ou mais: 25%
    } else if (days >= 7) {
      discountPercent = 15 // 1 semana ou mais: 15%
    } else if (days >= 2) {
      discountPercent = Math.min((days - 1) * 5, 25) // 2-6 dias: 5% por dia adicional (máx 25%)
    }
    // 1 dia: sem desconto (0%)
    
    const basePrice = pricePerDay * days
    const discount = (basePrice * discountPercent) / 100
    const finalPrice = basePrice - discount
    const totalCents = Math.round(finalPrice * 100)

    // Inserir booking pending (RLS com usuário logado)
    const { data: booking, error: bookErr } = await supabase
      .from('bookings')
      .insert({
        room_id,
        user_id: user.id,
        start_time,
        end_time,
        total_price: (totalCents / 100).toFixed(2),
        status: 'pending',
      })
      .select('id')
      .single()
    if (bookErr || !booking) {
      console.error('Booking Insert Error:', bookErr)
      // Pode estourar exclusão por overlap
      return new Response(JSON.stringify({ error: 'Reserva indisponível ou conflito de horário.' }), { 
        status: 409,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${PUBLIC_APP_URL}/bookings?status=success`,
      cancel_url: `${PUBLIC_APP_URL}/rooms/${room_id}?status=cancel`,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: { name: `Reserva: ${room.title}` },
            unit_amount: totalCents,
          },
          quantity: 1,
        },
      ],
      metadata: { booking_id: booking.id, room_id },
    })

    // Persistir stripe_session_id
    await supabase.from('bookings').update({ stripe_session_id: session.id }).eq('id', booking.id)

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      },
      status: 200,
    })
  } catch (e) {
    console.error('Checkout Function Error:', e)
    return new Response(JSON.stringify({ error: 'Erro interno ao processar pagamento.' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  }
})


