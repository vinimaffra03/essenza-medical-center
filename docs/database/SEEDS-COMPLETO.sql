-- ============================================
-- SEEDS COMPLETOS PARA DEMONSTRAÇÃO
-- ============================================
-- 
-- ANTES DE EXECUTAR:
-- 1. Crie os usuários no Supabase Auth (Authentication > Users > Add user)
--    Use os emails abaixo e anote os UUIDs retornados
-- 2. Substitua os UUIDs placeholder neste script pelos UUIDs reais
-- 3. Execute este script no SQL Editor
--
-- ============================================

-- PASSO 1: Pegar os UUIDs dos usuários criados no Auth
-- Execute isso PRIMEIRO e anote os UUIDs:
-- SELECT id, email FROM auth.users WHERE email IN (
--   'owner1@worknow.com',
--   'owner2@worknow.com',
--   'tenant1@worknow.com',
--   'tenant2@worknow.com'
-- );

-- ============================================
-- PASSO 2: Substitua os UUIDs abaixo pelos UUIDs reais
-- ============================================

-- Variáveis para os UUIDs (substitua pelos valores reais)
-- Exemplo: '91836fde-0173-48d8-b60f-24497f3f4075'

-- Owner 1
DO $$
DECLARE
  owner1_id UUID := 'b43a17d3-c5dc-4cda-abbb-17529210d838'; -- email: owner1@worknow.com
  owner2_id UUID := '13a95818-2840-4933-a846-de4c85491470'; -- email: owner2@worknow.com
  tenant1_id UUID := 'd49b8165-8ba0-4815-af1a-383a5e2b3eab'; -- email: tenant1@worknow.com
  tenant2_id UUID := 'ff33185a-20c5-4ba8-843c-00676f89a00e'; -- email: tenant2@worknow.com
BEGIN
  -- Criar perfis (se não existirem)
  INSERT INTO profiles (id, email, name, role, phone)
  VALUES
    (owner1_id, 'owner1@worknow.com', 'João Silva - Proprietário', 'owner', '+5511999999999'),
    (owner2_id, 'owner2@worknow.com', 'Maria Santos - Proprietária', 'owner', '+5511888888888'),
    (tenant1_id, 'tenant1@worknow.com', 'Carlos Oliveira - Locatário', 'tenant', '+5511777777777'),
    (tenant2_id, 'tenant2@worknow.com', 'Ana Costa - Locatária', 'tenant', '+5511666666666')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone;

  -- Salas do Owner 1
  INSERT INTO rooms (owner_id, title, description, address, city, state, zip_code, price_per_hour, capacity, amenities, images, is_active)
  VALUES
    (
      owner1_id,
      'Sala Executiva Av. Paulista',
      'Sala moderna e espaçosa no coração da Av. Paulista, ideal para reuniões executivas e apresentações. Equipada com projetor 4K, sistema de som profissional e mobiliário de alta qualidade. Vista panorâmica da cidade.',
      'Av. Paulista, 1000 - Bela Vista',
      'São Paulo',
      'SP',
      '01310-100',
      150.00,
      15,
      '["Wi-Fi", "Ar condicionado", "Projetor", "Estacionamento"]'::jsonb,
      '[]'::jsonb,
      true
    ),
    (
      owner1_id,
      'Espaço Criativo Vila Madalena',
      'Ambiente descontraído e inspirador no coração de Vila Madalena. Perfeito para workshops, brainstorming e sessões criativas. Decoração moderna com plantas, iluminação natural e área de descanso.',
      'Rua Harmonia, 500 - Vila Madalena',
      'São Paulo',
      'SP',
      '05435-000',
      95.00,
      10,
      '["Wi-Fi", "Ar condicionado", "Café grátis", "Escritório"]'::jsonb,
      '[]'::jsonb,
      true
    ),
    (
      owner1_id,
      'Sala de Reuniões Faria Lima',
      'Sala profissional equipada com tecnologia de ponta. Localizada em prédio moderno na região de Faria Lima. Ideal para apresentações corporativas e reuniões importantes com clientes.',
      'Av. Brigadeiro Faria Lima, 2000 - Itaim Bibi',
      'São Paulo',
      'SP',
      '01452-000',
      180.00,
      20,
      '["Wi-Fi", "Ar condicionado", "Projetor", "Equipamentos de vídeo", "Pontos de energia"]'::jsonb,
      '[]'::jsonb,
      true
    );

  -- Salas do Owner 2
  INSERT INTO rooms (owner_id, title, description, address, city, state, zip_code, price_per_hour, capacity, amenities, images, is_active)
  VALUES
    (
      owner2_id,
      'Coworking Premium Centro',
      'Espaço de coworking com salas privativas. Ambiente profissional com internet de alta velocidade, café premium e suporte administrativo. Ideal para freelancers e pequenas equipes.',
      'Rua São Bento, 300 - Centro',
      'São Paulo',
      'SP',
      '01010-100',
      70.00,
      8,
      '["Wi-Fi", "Ar condicionado", "Café grátis", "Escritório", "Pontos de energia"]'::jsonb,
      '[]'::jsonb,
      true
    ),
    (
      owner2_id,
      'Sala de Eventos Jardins',
      'Amplo espaço para eventos corporativos, palestras e workshops. Capaz de receber até 30 pessoas. Inclui palco, sistema de som profissional e serviço de coffee break disponível.',
      'Alameda Santos, 500 - Jardins',
      'São Paulo',
      'SP',
      '01418-000',
      220.00,
      30,
      '["Wi-Fi", "Ar condicionado", "Projetor", "Estacionamento", "Equipamentos de vídeo"]'::jsonb,
      '[]'::jsonb,
      true
    ),
    (
      owner2_id,
      'Escritório Compacto Pinheiros',
      'Escritório pequeno e aconchegante, perfeito para reuniões íntimas ou trabalho individual. Localizado em prédio comercial moderno com fácil acesso ao metrô.',
      'Rua dos Pinheiros, 800 - Pinheiros',
      'São Paulo',
      'SP',
      '05422-000',
      60.00,
      4,
      '["Wi-Fi", "Ar condicionado"]'::jsonb,
      '[]'::jsonb,
      true
    );

  -- Reservas de exemplo (já pagas - para demonstração)
  INSERT INTO bookings (room_id, user_id, start_time, end_time, total_price, status, stripe_session_id, notes)
  SELECT 
    r.id,
    tenant1_id,
    NOW() + INTERVAL '2 days' + INTERVAL '10 hours',
    NOW() + INTERVAL '2 days' + INTERVAL '12 hours',
    300.00,
    'paid',
    'pi_test_' || gen_random_uuid()::text,
    'Reunião de planejamento trimestral'
  FROM rooms r
  WHERE r.owner_id = owner1_id
  LIMIT 1;

  INSERT INTO bookings (room_id, user_id, start_time, end_time, total_price, status, stripe_session_id, notes)
  SELECT 
    r.id,
    tenant2_id,
    NOW() + INTERVAL '5 days' + INTERVAL '14 hours',
    NOW() + INTERVAL '5 days' + INTERVAL '16 hours',
    190.00,
    'paid',
    'pi_test_' || gen_random_uuid()::text,
    'Workshop de design thinking'
  FROM rooms r
  WHERE r.owner_id = owner2_id
  LIMIT 1;

  -- Reserva pendente (aguardando pagamento)
  INSERT INTO bookings (room_id, user_id, start_time, end_time, total_price, status, notes)
  SELECT 
    r.id,
    tenant1_id,
    NOW() + INTERVAL '7 days' + INTERVAL '9 hours',
    NOW() + INTERVAL '7 days' + INTERVAL '11 hours',
    180.00,
    'pending',
    'Reunião de alinhamento'
  FROM rooms r
  WHERE r.owner_id = owner1_id
  LIMIT 1 OFFSET 1;

  RAISE NOTICE 'Seeds criados com sucesso!';
END $$;

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Execute para verificar se tudo foi criado:
-- SELECT 
--   (SELECT COUNT(*) FROM profiles WHERE role = 'owner') as total_owners,
--   (SELECT COUNT(*) FROM profiles WHERE role = 'tenant') as total_tenants,
--   (SELECT COUNT(*) FROM rooms WHERE is_active = true) as total_rooms,
--   (SELECT COUNT(*) FROM bookings) as total_bookings;

