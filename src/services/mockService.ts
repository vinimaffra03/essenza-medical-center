// @ts-nocheck
/**
 * Mock Service - Simula a API do Supabase
 * Permite testar a aplicação sem backend real
 */

import { loadMockData, saveMockData } from './mockData'

// Simula delay de rede
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Estado da sessão atual
let currentSession = null
let authListeners = []

// Carregar sessão do localStorage
const loadSession = () => {
    const stored = localStorage.getItem('worknow_session')
    if (stored) {
        try {
            currentSession = JSON.parse(stored)
            return currentSession
        } catch {
            currentSession = null
        }
    }
    return null
}

// Salvar sessão no localStorage
const saveSession = (session) => {
    currentSession = session
    if (session) {
        localStorage.setItem('worknow_session', JSON.stringify(session))
    } else {
        localStorage.removeItem('worknow_session')
    }
}

// Notificar listeners de mudança de auth
const notifyAuthListeners = (event, session) => {
    authListeners.forEach(callback => {
        try {
            callback(event, session)
        } catch (e) {
            console.error('Auth listener error:', e)
        }
    })
}

// Inicializar sessão
loadSession()

/**
 * Mock do cliente Supabase Auth
 */
const mockAuth = {
    getSession: async () => {
        await delay(100)
        return { data: { session: currentSession }, error: null }
    },

    signInWithPassword: async ({ email, password }) => {
        await delay(500)
        const data = loadMockData()
        const user = data.users.find(u => u.email === email && u.password === password)

        if (!user) {
            return { data: { user: null, session: null }, error: { message: 'Credenciais inválidas' } }
        }

        const session = {
            user: { id: user.id, email: user.email },
            access_token: 'mock_token_' + Date.now(),
            expires_at: Date.now() + 3600000,
        }

        saveSession(session)
        notifyAuthListeners('SIGNED_IN', session)

        return { data: { user: session.user, session }, error: null }
    },

    signUp: async ({ email, password }) => {
        await delay(500)
        const data = loadMockData()

        // Verificar se email já existe
        if (data.users.find(u => u.email === email)) {
            return { data: { user: null }, error: { message: 'Email já cadastrado' } }
        }

        const newUser = {
            id: 'user-' + Date.now(),
            email,
            password,
            created_at: new Date().toISOString(),
        }

        data.users.push(newUser)
        saveMockData(data)

        const session = {
            user: { id: newUser.id, email: newUser.email },
            access_token: 'mock_token_' + Date.now(),
            expires_at: Date.now() + 3600000,
        }

        saveSession(session)
        notifyAuthListeners('SIGNED_IN', session)

        return { data: { user: session.user, session }, error: null }
    },

    signOut: async () => {
        await delay(200)
        saveSession(null)
        notifyAuthListeners('SIGNED_OUT', null)
        return { error: null }
    },

    resetPasswordForEmail: async (email) => {
        await delay(300)
        console.log('📧 Reset password email enviado para:', email)
        return { error: null }
    },

    onAuthStateChange: (callback) => {
        authListeners.push(callback)

        // Chamar imediatamente com sessão atual (usa SIGNED_IN para compatibilidade)
        if (currentSession) {
            setTimeout(() => callback('SIGNED_IN', currentSession), 50)
        }

        return {
            data: {
                subscription: {
                    unsubscribe: () => {
                        authListeners = authListeners.filter(cb => cb !== callback)
                    }
                }
            }
        }
    },
}

/**
 * Mock Query Builder - Simula queries do Supabase
 */
class MockQueryBuilder {
    constructor(table) {
        this.table = table
        this.filters = []
        this.orderByColumn = null
        this.orderAscending = true
        this.limitCount = null
        this.selectColumns = '*'
        this.isSingle = false
    }

    select(columns = '*') {
        this.selectColumns = columns
        return this
    }

    eq(column, value) {
        this.filters.push({ type: 'eq', column, value })
        return this
    }

    neq(column, value) {
        this.filters.push({ type: 'neq', column, value })
        return this
    }

    gt(column, value) {
        this.filters.push({ type: 'gt', column, value })
        return this
    }

    gte(column, value) {
        this.filters.push({ type: 'gte', column, value })
        return this
    }

    lt(column, value) {
        this.filters.push({ type: 'lt', column, value })
        return this
    }

    lte(column, value) {
        this.filters.push({ type: 'lte', column, value })
        return this
    }

    ilike(column, pattern) {
        this.filters.push({ type: 'ilike', column, pattern })
        return this
    }

    or(conditions) {
        this.filters.push({ type: 'or', conditions })
        return this
    }

    order(column, { ascending = true } = {}) {
        this.orderByColumn = column
        this.orderAscending = ascending
        return this
    }

    limit(count) {
        this.limitCount = count
        return this
    }

    single() {
        this.isSingle = true
        return this
    }

    async insert(record) {
        await delay(300)
        const data = loadMockData()

        const newRecord = {
            id: `${this.table}-${Date.now()}`,
            ...record,
            created_at: new Date().toISOString(),
        }

        if (!data[this.table]) {
            data[this.table] = []
        }

        data[this.table].push(newRecord)
        saveMockData(data)

        if (this.isSingle) {
            return { data: newRecord, error: null }
        }
        return { data: [newRecord], error: null }
    }

    async update(updates) {
        await delay(300)
        const data = loadMockData()
        let updated = null

        if (data[this.table]) {
            data[this.table] = data[this.table].map(item => {
                if (this.matchesFilters(item)) {
                    updated = { ...item, ...updates, updated_at: new Date().toISOString() }
                    return updated
                }
                return item
            })
            saveMockData(data)
        }

        if (this.isSingle) {
            return { data: updated, error: updated ? null : { message: 'Not found', code: 'PGRST116' } }
        }
        return { data: updated ? [updated] : [], error: null }
    }

    async delete() {
        await delay(300)
        const data = loadMockData()
        let deleted = null

        if (data[this.table]) {
            const before = data[this.table].length
            data[this.table] = data[this.table].filter(item => {
                if (this.matchesFilters(item)) {
                    deleted = item
                    return false
                }
                return true
            })
            saveMockData(data)
        }

        return { data: deleted, error: null }
    }

    matchesFilters(item) {
        return this.filters.every(filter => {
            switch (filter.type) {
                case 'eq':
                    return item[filter.column] === filter.value
                case 'neq':
                    return item[filter.column] !== filter.value
                case 'gt':
                    return item[filter.column] > filter.value
                case 'gte':
                    return item[filter.column] >= filter.value
                case 'lt':
                    return item[filter.column] < filter.value
                case 'lte':
                    return item[filter.column] <= filter.value
                case 'ilike': {
                    const pattern = filter.pattern.replace(/%/g, '.*')
                    const regex = new RegExp(pattern, 'i')
                    return regex.test(item[filter.column] || '')
                }
                case 'or': {
                    // Simplificado - apenas verifica se algum campo contém o texto
                    const conditions = filter.conditions
                    return conditions.split(',').some(cond => {
                        const match = cond.match(/(\w+)\.ilike\.%(.+)%/)
                        if (match) {
                            const [, col, text] = match
                            return (item[col] || '').toLowerCase().includes(text.toLowerCase())
                        }
                        return false
                    })
                }
                default:
                    return true
            }
        })
    }

    async then(resolve) {
        await delay(200)
        const data = loadMockData()
        let results = data[this.table] || []

        // Aplicar filtros
        results = results.filter(item => this.matchesFilters(item))

        // Aplicar ordenação
        if (this.orderByColumn) {
            results.sort((a, b) => {
                const aVal = a[this.orderByColumn]
                const bVal = b[this.orderByColumn]
                if (aVal < bVal) return this.orderAscending ? -1 : 1
                if (aVal > bVal) return this.orderAscending ? 1 : -1
                return 0
            })
        }

        // Aplicar limit
        if (this.limitCount) {
            results = results.slice(0, this.limitCount)
        }

        // Expandir relacionamentos se select contém nested fields
        if (this.selectColumns.includes(':')) {
            results = results.map(item => this.expandRelations(item, data))
        }

        if (this.isSingle) {
            if (results.length === 0) {
                resolve({ data: null, error: { message: 'Not found', code: 'PGRST116' } })
            } else {
                resolve({ data: results[0], error: null })
            }
        } else {
            resolve({ data: results, error: null })
        }
    }

    expandRelations(item, allData) {
        const expanded = { ...item }

        // Simples expansão de relações baseada no select
        // Ex: room:rooms(*) ou user:profiles(*)
        const relationMatch = this.selectColumns.match(/(\w+):(\w+)\s*\(/g)
        if (relationMatch) {
            relationMatch.forEach(rel => {
                const [alias, table] = rel.replace('(', '').split(':')
                const foreignKey = alias + '_id'
                if (item[foreignKey] && allData[table]) {
                    expanded[alias] = allData[table].find(r => r.id === item[foreignKey]) || null
                }
            })
        }

        return expanded
    }
}

/**
 * Mock do cliente Supabase Storage
 */
const mockStorage = {
    from: (bucket) => ({
        upload: async (path, file) => {
            await delay(500)
            // Simula upload criando URL local
            const url = URL.createObjectURL(file)
            console.log('📁 Mock upload:', bucket, path)
            return { data: { path }, error: null }
        },
        getPublicUrl: (path) => {
            // Retorna URL placeholder ou a imagem original se disponível
            return {
                data: {
                    publicUrl: `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80`
                }
            }
        },
        remove: async (paths) => {
            await delay(200)
            console.log('🗑️ Mock delete:', bucket, paths)
            return { data: paths, error: null }
        }
    })
}

/**
 * Cliente Mock Supabase completo
 */
export const mockSupabase = {
    auth: mockAuth,
    storage: mockStorage,
    from: (table) => new MockQueryBuilder(table),
}

export default mockSupabase
