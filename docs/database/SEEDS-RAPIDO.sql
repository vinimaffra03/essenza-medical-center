-- ============================================
-- SEEDS RÁPIDOS - SEM SUBSTITUIÇÃO MANUAL
-- ============================================
-- Este script pega automaticamente os UUIDs dos usuários
-- que você criou no Auth (via Dashboard)
-- 
-- PRÉ-REQUISITO: Crie os 4 usuários no Auth primeiro!
-- (Veja CRIAR-USUARIOS-TESTE.md)
-- ============================================

-- Criar perfis automaticamente usando os emails
INSERT INTO profiles (id, email, name, role, phone)
SELECT 
  u.id,
  u.email,
  CASE 
    WHEN u.email = 'owner1@worknow.com' THEN 'João Silva - Proprietário'
    WHEN u.email = 'owner2@worknow.com' THEN 'Maria Santos - Proprietária'
    WHEN u.email = 'tenant1@worknow.com' THEN 'Carlos Oliveira - Locatário'
    WHEN u.email = 'tenant2@worknow.com' THEN 'Ana Costa - Locatária'
  END,
  CASE 
    WHEN u.email = 'owner1@worknow.com' THEN 'owner'
    WHEN u.email = 'owner2@worknow.com' THEN 'owner'
    WHEN u.email = 'tenant1@worknow.com' THEN 'tenant'
    WHEN u.email = 'tenant2@worknow.com' THEN 'tenant'
  END,
  CASE 
    WHEN u.email = 'owner1@worknow.com' THEN '+5511999999999'
    WHEN u.email = 'owner2@worknow.com' THEN '+5511888888888'
    WHEN u.email = 'tenant1@worknow.com' THEN '+5511777777777'
    WHEN u.email = 'tenant2@worknow.com' THEN '+5511666666666'
  END
FROM auth.users u
WHERE u.email IN (
  'owner1@worknow.com',
  'owner2@worknow.com',
  'tenant1@worknow.com',
  'tenant2@worknow.com'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone;

-- Salas do Owner 1
INSERT INTO rooms (owner_id, title, description, address, city, state, zip_code, price_per_hour, capacity, amenities, images, is_active)
SELECT 
  p.id,
  'Sala Executiva Av. Paulista',
  'Sala moderna e espaçosa no coração da Av. Paulista, ideal para reuniões executivas e apresentações. Equipada com projetor 4K, sistema de som profissional e mobiliário de alta qualidade.',
  'Av. Paulista, 1000 - Bela Vista',
  'São Paulo',
  'SP',
  '01310-100',
  150.00,
  15,
  '["Wi-Fi", "Ar condicionado", "Projetor", "Estacionamento"]'::jsonb,
  '[]'::jsonb,
  true
FROM profiles p
WHERE p.email = 'owner1@worknow.com'
ON CONFLICT DO NOTHING;

INSERT INTO rooms (owner_id, title, description, address, city, state, zip_code, price_per_hour, capacity, amenities, images, is_active)
SELECT 
  p.id,
  'Espaço Criativo Vila Madalena',
  'Ambiente descontraído e inspirador no coração de Vila Madalena. Perfeito para workshops, brainstorming e sessões criativas. Decoração moderna com plantas e iluminação natural.',
  'Rua Harmonia, 500 - Vila Madalena',
  'São Paulo',
  'SP',
  '05435-000',
  95.00,
  10,
  '["Wi-Fi", "Ar condicionado", "Café grátis", "Escritório"]'::jsonb,
  '[]'::jsonb,
  true
FROM profiles p
WHERE p.email = 'owner1@worknow.com'
ON CONFLICT DO NOTHING;

INSERT INTO rooms (owner_id, title, description, address, city, state, zip_code, price_per_hour, capacity, amenities, images, is_active)
SELECT 
  p.id,
  'Sala de Reuniões Faria Lima',
  'Sala profissional equipada com tecnologia de ponta. Localizada em prédio moderno na região de Faria Lima. Ideal para apresentações corporativas.',
  'Av. Brigadeiro Faria Lima, 2000 - Itaim Bibi',
  'São Paulo',
  'SP',
  '01452-000',
  180.00,
  20,
  '["Wi-Fi", "Ar condicionado", "Projetor", "Equipamentos de vídeo", "Pontos de energia"]'::jsonb,
  '[]'::jsonb,
  true
FROM profiles p
WHERE p.email = 'owner1@worknow.com'
ON CONFLICT DO NOTHING;

-- Salas do Owner 2
INSERT INTO rooms (owner_id, title, description, address, city, state, zip_code, price_per_hour, capacity, amenities, images, is_active)
SELECT 
  p.id,
  'Coworking Premium Centro',
  'Espaço de coworking com salas privativas. Ambiente profissional com internet de alta velocidade, café premium e suporte administrativo.',
  'Rua São Bento, 300 - Centro',
  'São Paulo',
  'SP',
  '01010-100',
  70.00,
  8,
  '["Wi-Fi", "Ar condicionado", "Café grátis", "Escritório", "Pontos de energia"]'::jsonb,
  '[]'::jsonb,
  true
FROM profiles p
WHERE p.email = 'owner2@worknow.com'
ON CONFLICT DO NOTHING;

INSERT INTO rooms (owner_id, title, description, address, city, state, zip_code, price_per_hour, capacity, amenities, images, is_active)
SELECT 
  p.id,
  'Sala de Eventos Jardins',
  'Amplo espaço para eventos corporativos, palestras e workshops. Capaz de receber até 30 pessoas. Inclui palco e sistema de som profissional.',
  'Alameda Santos, 500 - Jardins',
  'São Paulo',
  'SP',
  '01418-000',
  220.00,
  30,
  '["Wi-Fi", "Ar condicionado", "Projetor", "Estacionamento", "Equipamentos de vídeo"]'::jsonb,
  '[]'::jsonb,
  true
FROM profiles p
WHERE p.email = 'owner2@worknow.com'
ON CONFLICT DO NOTHING;

INSERT INTO rooms (owner_id, title, description, address, city, state, zip_code, price_per_hour, capacity, amenities, images, is_active)
SELECT 
  p.id,
  'Escritório Compacto Pinheiros',
  'Escritório pequeno e aconchegante, perfeito para reuniões íntimas ou trabalho individual. Localizado em prédio comercial moderno.',
  'Rua dos Pinheiros, 800 - Pinheiros',
  'São Paulo',
  'SP',
  '05422-000',
  60.00,
  4,
  '["Wi-Fi", "Ar condicionado"]'::jsonb,
  '[]'::jsonb,
  true
FROM profiles p
WHERE p.email = 'owner2@worknow.com'
ON CONFLICT DO NOTHING;

-- Reservas de exemplo (apenas se não existirem)
INSERT INTO bookings (room_id, user_id, start_time, end_time, total_price, status, stripe_session_id, notes)
SELECT 
  r.id,
  t.id,
  NOW() + INTERVAL '2 days' + INTERVAL '10 hours',
  NOW() + INTERVAL '2 days' + INTERVAL '12 hours',
  300.00,
  'paid',
  'pi_test_' || gen_random_uuid()::text,
  'Reunião de planejamento trimestral'
FROM rooms r
CROSS JOIN profiles t
WHERE r.owner_id = (SELECT id FROM profiles WHERE email = 'owner1@worknow.com')
  AND t.email = 'tenant1@worknow.com'
  AND NOT EXISTS (
    SELECT 1 FROM bookings b 
    WHERE b.room_id = r.id 
    AND b.user_id = t.id
    AND b.status = 'paid'
  )
LIMIT 1;

INSERT INTO bookings (room_id, user_id, start_time, end_time, total_price, status, stripe_session_id, notes)
SELECT 
  r.id,
  t.id,
  NOW() + INTERVAL '5 days' + INTERVAL '14 hours',
  NOW() + INTERVAL '5 days' + INTERVAL '16 hours',
  190.00,
  'paid',
  'pi_test_' || gen_random_uuid()::text,
  'Workshop de design thinking'
FROM rooms r
CROSS JOIN profiles t
WHERE r.owner_id = (SELECT id FROM profiles WHERE email = 'owner2@worknow.com')
  AND t.email = 'tenant2@worknow.com'
  AND NOT EXISTS (
    SELECT 1 FROM bookings b 
    WHERE b.room_id = r.id 
    AND b.user_id = t.id
    AND b.status = 'paid'
  )
LIMIT 1;

-- Verificação final
DO $$
DECLARE
  profile_count INT;
  room_count INT;
  booking_count INT;
BEGIN
  SELECT COUNT(*) INTO profile_count FROM profiles;
  SELECT COUNT(*) INTO room_count FROM rooms WHERE is_active = true;
  SELECT COUNT(*) INTO booking_count FROM bookings;
  
  RAISE NOTICE '✅ Seeds criados com sucesso!';
  RAISE NOTICE '📊 Perfis: % | Salas: % | Reservas: %', profile_count, room_count, booking_count;
END $$;

