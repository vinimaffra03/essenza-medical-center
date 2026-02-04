// @ts-nocheck
import { create } from 'zustand'
import { supabase } from '../services/supabase'

// Estado inicial
const initialState = {
  user: null,
  profile: null,
  loading: true,
  error: null,
}

// Create store - Auth is now handled by Clerk
// This store manages the Supabase profile data only
export const useAuthStore = create((set, get) => ({
  ...initialState,

  // Initialize profile for a Clerk user
  initProfile: async (clerkUserId, clerkEmail, clerkName) => {
    try {
      set({ loading: true })
      set({ user: { id: clerkUserId, email: clerkEmail } })
      await get().fetchProfile(clerkUserId)

      // If no profile exists yet, create one
      const { profile } = get()
      if (!profile && clerkUserId) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: clerkUserId,
            email: clerkEmail,
            name: clerkName || clerkEmail,
            role: 'tenant',
          })

        if (!insertError) {
          await get().fetchProfile(clerkUserId)
        }
      }

      set({ loading: false })
    } catch (error) {
      console.error('Init profile error:', error)
      set({ error: error.message, loading: false })
    }
  },

  // Buscar perfil do usuário
  fetchProfile: async (userId) => {
    try {
      if (!userId) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error)
        }
        return null
      }

      set({ profile: data })
      return data
    } catch (error) {
      console.error('Error in fetchProfile:', error)
      set({ error: error.message })
      return null
    }
  },

  // Atualizar perfil
  updateProfile: async (updates) => {
    try {
      const { user } = get()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      set({ profile: data })
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Clear state on sign out
  clearAuth: () => {
    set({ ...initialState, loading: false })
  },

  // Verificar se é proprietário
  isOwner: () => {
    return get().profile?.role === 'owner'
  },

  // Verificar se é locatário
  isTenant: () => {
    return get().profile?.role === 'tenant'
  },
}))
