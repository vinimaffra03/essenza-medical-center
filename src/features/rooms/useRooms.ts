// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'
import { useAuthStore } from '../../store/useAuthStore'

/**
 * Hook customizado para gerenciar operações CRUD de salas
 * @returns {Object} Objeto contendo estado e funções para gerenciar salas
 */
export const useRooms = () => {
  const { profile } = useAuthStore()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Busca salas com filtros opcionais
   * Para proprietários: retorna apenas suas salas
   * Para locatários: retorna todas as salas ativas
   * @param {Object} filters - Objeto com filtros de busca
   * @param {string} [filters.search] - Busca por texto (título, descrição, endereço)
   * @param {number} [filters.price_min] - Preço mínimo
   * @param {number} [filters.price_max] - Preço máximo
   * @param {string} [filters.city] - Cidade
   * @param {number} [filters.capacity] - Capacidade mínima
   * @param {string[]} [filters.amenities] - Array de comodidades
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  const fetchRooms = async (filters = {}, sortBy = 'created_at', sortOrder = 'desc') => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase.from('rooms').select('*')

      // Se for proprietário, buscar apenas suas salas
      if (profile?.role === 'owner') {
        query = query.eq('owner_id', profile.id)
      }

      // Aplicar filtros
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%`
        )
      }

      if (filters.price_min) {
        // Filtrar por price_per_day (compatibilidade: também filtra price_per_hour no client-side se necessário)
        query = query.gte('price_per_day', filters.price_min)
      }

      if (filters.price_max) {
        // Filtrar por price_per_day (compatibilidade: também filtra price_per_hour no client-side se necessário)
        query = query.lte('price_per_day', filters.price_max)
      }

      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`)
      }

      if (filters.capacity) {
        query = query.gte('capacity', parseInt(filters.capacity))
      }

      // Filtro por amenities (array contém)
      if (filters.amenities && filters.amenities.length > 0) {
        // Filtrar no client side pois ameneties é JSONB
        // Em produção, isso poderia ser feito com uma função PostgreSQL
      }

      // Aplicar ordenação
      const ascending = sortOrder === 'asc'
      
      // Para ordenação por preço, usar price_per_day (ou price_per_hour como fallback)
      const orderColumn = sortBy === 'price' ? 'price_per_day' : 'created_at'
      
      const { data, error: queryError } = await query.order(orderColumn, {
        ascending,
        nullsFirst: sortBy === 'price' ? false : true, // Preços nulos por último
      })

      if (queryError) throw queryError

      // Filtrar amenities no client side se necessário
      let filteredData = data || []
      if (filters.amenities && filters.amenities.length > 0) {
        filteredData = filteredData.filter(room => {
          const roomAmenities = room.amenities || []
          return filters.amenities.every(amenity => roomAmenities.includes(amenity))
        })
      }

      setRooms(filteredData)
      return { success: true, data: filteredData }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Busca uma sala específica por ID
   * @param {string} roomId - ID da sala
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  const fetchRoom = async (roomId) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single()

      if (queryError) throw queryError

      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Cria uma nova sala (apenas para proprietários)
   * @param {Object} roomData - Dados da sala a ser criada
   * @param {string} roomData.title - Título da sala
   * @param {string} [roomData.description] - Descrição
   * @param {string} [roomData.address] - Endereço
   * @param {string} [roomData.city] - Cidade
   * @param {number} roomData.price_per_day - Preço por dia (ou price_per_hour para compatibilidade)
   * @param {number} [roomData.capacity] - Capacidade
   * @param {string[]} [roomData.amenities] - Array de comodidades
   * @param {string[]} [roomData.images] - Array de URLs de imagens
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  const createRoom = async (roomData) => {
    try {
      setLoading(true)
      setError(null)

      if (profile?.role !== 'owner') {
        throw new Error('Apenas proprietários podem criar salas')
      }

      const { data, error: insertError } = await supabase
        .from('rooms')
        .insert({
          ...roomData,
          owner_id: profile.id,
          // Garantir que price_per_hour seja NULL se não fornecido (compatibilidade)
          price_per_hour: roomData.price_per_hour || null,
        })
        .select()
        .single()

      if (insertError) throw insertError

      setRooms((prev) => [data, ...prev])
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Atualiza uma sala existente
   * @param {string} roomId - ID da sala a ser atualizada
   * @param {Object} updates - Objeto com campos a serem atualizados
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  const updateRoom = async (roomId, updates) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: updateError } = await supabase
        .from('rooms')
        .update(updates)
        .eq('id', roomId)
        .select()
        .single()

      if (updateError) throw updateError

      setRooms((prev) => prev.map((r) => (r.id === roomId ? data : r)))
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Deleta uma sala
   * @param {string} roomId - ID da sala a ser deletada
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const deleteRoom = async (roomId) => {
    try {
      setLoading(true)
      setError(null)

      const { error: deleteError } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId)

      if (deleteError) throw deleteError

      setRooms((prev) => prev.filter((r) => r.id !== roomId))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Busca as 3 melhores salas (mais recentes e ativas) para o carrossel
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  const fetchFeaturedRooms = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('rooms')
        .select('id, title, price_per_day, price_per_hour, city, state, images, created_at')
        .eq('is_active', true)
        // Idealmente seria por popularidade (bookings count), mas created_at é um bom proxy inicial
        .order('created_at', { ascending: false })
        .limit(3)

      if (queryError) throw queryError

      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    fetchRoom,
    fetchFeaturedRooms,
    createRoom,
    updateRoom,
    deleteRoom,
  }
}

