# Lógica de Negócio Principal (Core Logic)

Este arquivo compila a lógica de negócio central da aplicação, incluindo o cliente Supabase, o hook de gerenciamento de salas (`useRooms`) e o store de autenticação (`useAuthStore`).

---

## `src/services/supabase.js`

Inicializa e configura o cliente Supabase, que é a ponte para todo o backend.

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const USER_ROLES = {
  OWNER: 'owner',
  TENANT: 'tenant',
}

export default supabase
```

---

## `src/features/rooms/useRooms.js`

Hook customizado (`useRooms`) que encapsula toda a lógica CRUD (Criar, Ler, Atualizar, Deletar) para as salas. Inclui funções para buscar salas com filtros, buscar uma sala específica, criar, atualizar e deletar salas.

```javascript
import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'
import { useAuthStore } from '../../store/useAuthStore'

export const useRooms = () => {
  const { profile } = useAuthStore()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Busca salas com filtros, ordenação e lógica de permissão
  const fetchRooms = async (filters = {}, sortBy = 'created_at', sortOrder = 'desc') => {
    // ... (lógica de construção da query com base no perfil e filtros)
  }

  // Busca uma sala única por ID
  const fetchRoom = async (roomId) => {
    // ... (lógica para buscar um único registro)
  }

  // Cria uma nova sala (apenas para 'owner')
  const createRoom = async (roomData) => {
    // ... (lógica de inserção com verificação de permissão)
  }

  // Atualiza uma sala existente
  const updateRoom = async (roomId, updates) => {
    // ... (lógica de atualização)
  }

  // Deleta uma sala
  const deleteRoom = async (roomId) => {
    // ... (lógica de deleção)
  }

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    fetchRoom,
    createRoom,
    updateRoom,
    deleteRoom,
  }
}
```

---

## `src/store/useAuthStore.js`

Store do Zustand (`useAuthStore`) que gerencia o estado global de autenticação. Controla o usuário logado, seu perfil, e expõe métodos para `signIn`, `signUp`, `signOut`, `fetchProfile`, etc.

```javascript
import { create } from 'zustand'
import { supabase } from '../services/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,

  // Verifica a sessão ativa ao iniciar a app
  init: async () => {
    // ... (lógica para verificar supabase.auth.getSession())
  },

  // Busca o perfil do usuário na tabela 'profiles'
  fetchProfile: async (userId) => {
    // ... (lógica de busca de perfil)
  },

  // Autentica o usuário com email e senha
  signIn: async (email, password) => {
    // ... (lógica de login e busca de perfil)
  },

  // Registra um novo usuário e cria seu perfil
  signUp: async (email, password, role = 'tenant', name) => {
    // ... (lógica de registro e inserção de perfil)
  },

  // Desconecta o usuário
  signOut: async () => {
    // ... (lógica de logout e limpeza do estado)
  },

  // Atualiza o perfil do usuário
  updateProfile: async (updates) => {
    // ... (lógica de atualização de perfil)
  },

  // Funções utilitárias para verificar o papel do usuário
  isOwner: () => get().profile?.role === 'owner',
  isTenant: () => get().profile?.role === 'tenant',
}))
```
