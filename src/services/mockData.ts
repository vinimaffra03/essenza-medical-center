// @ts-nocheck
/**
 * Mock Data - Dados iniciais para simular backend
 * Usado quando Supabase não está disponível
 */

// Usuários de teste
export const mockUsers = [
    {
        id: 'user-owner-001',
        email: 'owner@test.com',
        password: '123456',
        created_at: new Date().toISOString(),
    },
    {
        id: 'user-tenant-001',
        email: 'tenant@test.com',
        password: '123456',
        created_at: new Date().toISOString(),
    },
    {
        id: 'user-tenant-002',
        email: 'maria@test.com',
        password: '123456',
        created_at: new Date().toISOString(),
    },
]

// Perfis de usuário
export const mockProfiles = [
    {
        id: 'user-owner-001',
        email: 'owner@test.com',
        name: 'João Proprietário',
        role: 'owner',
        phone: '(11) 99999-0001',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        created_at: new Date().toISOString(),
    },
    {
        id: 'user-tenant-001',
        email: 'tenant@test.com',
        name: 'Carlos Locatário',
        role: 'tenant',
        phone: '(11) 99999-0002',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        created_at: new Date().toISOString(),
    },
    {
        id: 'user-tenant-002',
        email: 'maria@test.com',
        name: 'Maria Silva',
        role: 'tenant',
        phone: '(11) 99999-0003',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        created_at: new Date().toISOString(),
    },
]

// Salas disponíveis
export const mockRooms = [
    {
        id: 'room-001',
        owner_id: 'user-owner-001',
        title: 'Sala Executiva Paulista',
        description: 'Sala executiva completa no coração da Avenida Paulista. Ideal para reuniões de negócios, apresentações e eventos corporativos. Equipada com projetor, ar-condicionado e café cortesia.',
        address: 'Av. Paulista, 1000 - Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        price_per_day: 350,
        price_per_hour: 50,
        capacity: 12,
        area: 45,
        amenities: ['wifi', 'ar-condicionado', 'projetor', 'café', 'estacionamento'],
        images: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
        ],
        is_active: true,
        created_at: '2025-01-15T10:00:00Z',
    },
    {
        id: 'room-002',
        owner_id: 'user-owner-001',
        title: 'Coworking Faria Lima',
        description: 'Espaço moderno de coworking na região da Faria Lima. Ambiente colaborativo com mesas compartilhadas, salas de reunião e área de descanso.',
        address: 'Av. Brigadeiro Faria Lima, 2000',
        city: 'São Paulo',
        state: 'SP',
        price_per_day: 180,
        price_per_hour: 25,
        capacity: 30,
        area: 120,
        amenities: ['wifi', 'ar-condicionado', 'café', 'impressora', 'copa'],
        images: [
            'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
        ],
        is_active: true,
        created_at: '2025-01-10T14:00:00Z',
    },
    {
        id: 'room-003',
        owner_id: 'user-owner-001',
        title: 'Estúdio Criativo Vila Madalena',
        description: 'Estúdio perfeito para criativos, designers e fotógrafos. Ampla iluminação natural, parede de tijolos aparentes e ambiente inspirador.',
        address: 'Rua Aspicuelta, 500 - Vila Madalena',
        city: 'São Paulo',
        state: 'SP',
        price_per_day: 280,
        price_per_hour: 40,
        capacity: 8,
        area: 60,
        amenities: ['wifi', 'ar-condicionado', 'iluminação-natural', 'copa'],
        images: [
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80',
        ],
        is_active: true,
        created_at: '2025-01-08T09:00:00Z',
    },
    {
        id: 'room-004',
        owner_id: 'user-owner-001',
        title: 'Sala de Treinamento Itaim',
        description: 'Sala ampla para treinamentos, workshops e cursos. Cadeiras universitárias, quadro branco e equipamento audiovisual completo.',
        address: 'Rua Joaquim Floriano, 800 - Itaim Bibi',
        city: 'São Paulo',
        state: 'SP',
        price_per_day: 450,
        price_per_hour: 65,
        capacity: 25,
        area: 80,
        amenities: ['wifi', 'ar-condicionado', 'projetor', 'quadro-branco', 'microfone'],
        images: [
            'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        ],
        is_active: true,
        created_at: '2025-01-05T11:00:00Z',
    },
    {
        id: 'room-005',
        owner_id: 'user-owner-001',
        title: 'Consultório Médico Moema',
        description: 'Consultório completo para profissionais da saúde. Ambiente discreto, climatizado e com sala de espera.',
        address: 'Alameda dos Maracatins, 300 - Moema',
        city: 'São Paulo',
        state: 'SP',
        price_per_day: 320,
        price_per_hour: 45,
        capacity: 4,
        area: 35,
        amenities: ['wifi', 'ar-condicionado', 'recepção', 'acessibilidade'],
        images: [
            'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
        ],
        is_active: true,
        created_at: '2025-01-02T16:00:00Z',
    },
]

// Reservas de exemplo
export const mockBookings = [
    {
        id: 'booking-001',
        room_id: 'room-001',
        user_id: 'user-tenant-001',
        start_time: '2025-01-28T09:00:00Z',
        end_time: '2025-01-28T18:00:00Z',
        total_price: 350,
        status: 'confirmed',
        notes: 'Reunião de planejamento anual',
        created_at: '2025-01-20T10:00:00Z',
    },
    {
        id: 'booking-002',
        room_id: 'room-002',
        user_id: 'user-tenant-002',
        start_time: '2025-01-29T08:00:00Z',
        end_time: '2025-01-29T12:00:00Z',
        total_price: 100,
        status: 'confirmed',
        notes: 'Trabalho remoto',
        created_at: '2025-01-21T14:00:00Z',
    },
    {
        id: 'booking-003',
        room_id: 'room-003',
        user_id: 'user-tenant-001',
        start_time: '2025-01-30T14:00:00Z',
        end_time: '2025-01-30T20:00:00Z',
        total_price: 240,
        status: 'pending',
        notes: 'Sessão de fotos',
        created_at: '2025-01-22T09:00:00Z',
    },
]

// Função para carregar dados do localStorage ou usar os mocks
export const loadMockData = () => {
    const stored = localStorage.getItem('worknow_mock_data')
    if (stored) {
        try {
            return JSON.parse(stored)
        } catch {
            // Se erro ao parsear, usa dados padrão
        }
    }

    const initialData = {
        users: mockUsers,
        profiles: mockProfiles,
        rooms: mockRooms,
        bookings: mockBookings,
    }

    localStorage.setItem('worknow_mock_data', JSON.stringify(initialData))
    return initialData
}

// Função para salvar dados no localStorage
export const saveMockData = (data) => {
    localStorage.setItem('worknow_mock_data', JSON.stringify(data))
}

// Função para resetar dados mock
export const resetMockData = () => {
    const initialData = {
        users: mockUsers,
        profiles: mockProfiles,
        rooms: mockRooms,
        bookings: mockBookings,
    }
    localStorage.setItem('worknow_mock_data', JSON.stringify(initialData))
    return initialData
}
