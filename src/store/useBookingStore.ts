// @ts-nocheck
import { create } from 'zustand'
import { supabase } from '../services/supabase'

export const useBookingStore = create((set) => ({
  bookings: [],
  loading: false,
  error: null,

  // Buscar reservas do usuário logado
  fetchBookings: async (userId) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          room:rooms (
            id,
            title,
            address,
            price_per_day,
            price_per_hour
          )
        `)
        .eq('user_id', userId)
        .order('start_time', { ascending: false })

      if (error) throw error

      set({ bookings: data })
      return { success: true, data }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    } finally {
      set({ loading: false })
    }
  },

  // Buscar reservas de uma sala (para proprietário)
  fetchRoomBookings: async (roomId) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:profiles (
            id,
            name,
            email
          )
        `)
        .eq('room_id', roomId)
        .order('start_time', { ascending: false })

      if (error) throw error

      set({ bookings: data })
      return { success: true, data }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    } finally {
      set({ loading: false })
    }
  },

  // Criar nova reserva
  createBooking: async (bookingData) => {
    try {
      set({ loading: true, error: null })

      // Validar conflito de horários
      const { data: conflicting, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('room_id', bookingData.room_id)
        .or(`and(start_time.lt.${bookingData.end_time},end_time.gt.${bookingData.start_time})`)

      if (checkError) throw checkError
      if (conflicting && conflicting.length > 0) {
        throw new Error('Já existe uma reserva neste horário')
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        bookings: [data, ...state.bookings],
      }))

      return { success: true, data }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    } finally {
      set({ loading: false })
    }
  },

  // Cancelar reserva
  cancelBooking: async (bookingId) => {
    try {
      set({ loading: true, error: null })

      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (error) throw error

      set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== bookingId),
      }))

      return { success: true }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    } finally {
      set({ loading: false })
    }
  },

  // Limpar reservas
  clearBookings: () => {
    set({ bookings: [] })
  },
}))

