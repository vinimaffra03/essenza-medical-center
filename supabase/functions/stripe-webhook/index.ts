// Supabase Edge Function: stripe-webhook
// Confirma booking como 'paid' após checkout.session.completed
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!

// Tentar obter SERVICE_ROLE_KEY de diferentes formas
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY') || 
                                   Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ||
                                   Deno.env.get('SUPABASE_SERVICE_KEY') ||
                                   Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') // Fallback para variável automática do Supabase

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SERVICE_ROLE_KEY not found in environment variables')
}

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })

serve(async (req) => {
  // Webhooks do Stripe não precisam de Authorization header
  // Eles usam stripe-signature para validação
  
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ 
      code: 405, 
      message: 'Method Not Allowed' 
    }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Verificar se SERVICE_ROLE_KEY está disponível
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('SERVICE_ROLE_KEY is missing')
    return new Response(JSON.stringify({ 
      code: 500, 
      message: 'Server configuration error: SERVICE_ROLE_KEY not found' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return new Response(JSON.stringify({ 
      code: 400, 
      message: 'Missing stripe-signature header' 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const rawBody = await req.text()
  let event: Stripe.Event

  try {
    // Deno requer constructEventAsync em vez de constructEvent
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Stripe webhook verification error:', err)
    return new Response(JSON.stringify({ 
      code: 400, 
      message: 'Webhook Error: Invalid Signature or Payload'
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.booking_id
      const sessionId = session.id
      const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id

      if (bookingId) {
        await supabase
          .from('bookings')
          .update({ status: 'paid', stripe_session_id: sessionId, payment_intent_id: paymentIntentId ?? null })
          .eq('id', bookingId)
      } else {
        // fallback por session id
        await supabase
          .from('bookings')
          .update({ status: 'paid', payment_intent_id: paymentIntentId ?? null })
          .eq('stripe_session_id', sessionId)
      }
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    console.error('Webhook Handler Error:', e)
    return new Response(JSON.stringify({ 
      code: 500, 
      message: 'Internal Server Error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})


