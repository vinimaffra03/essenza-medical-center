-- Seeds de demonstração (ajuste emails antes de rodar)
-- Necessário criar usuários via Auth primeiro para obter seus UUIDs

-- Exemplo: substitua pelos IDs reais dos usuários de teste
-- SELECT * FROM auth.users;
-- UPDATE abaixo com os UUIDs retornados

-- perfis
INSERT INTO profiles (id, email, name, role, phone)
VALUES
  ('00000000-0000-0000-0000-000000000001','owner1@example.com','Owner 1','owner','+55000000001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, name, role, phone)
VALUES
  ('00000000-0000-0000-0000-000000000002','tenant1@example.com','Tenant 1','tenant','+55000000002')
ON CONFLICT (id) DO NOTHING;

-- salas
INSERT INTO rooms (owner_id, title, description, address, city, price_per_hour, capacity, amenities, images, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001','Sala Paulista','Sala moderna na Av. Paulista','Av. Paulista, 1000','São Paulo', 120.00, 12, '["wifi","ar","projetor"]', '[]', true),
  ('00000000-0000-0000-0000-000000000001','Sala Centro RJ','Sala equipada no Centro','Rua da Quitanda, 50','Rio de Janeiro', 95.00, 8, '["wifi","tv"]', '[]', true),
  ('00000000-0000-0000-0000-000000000001','Sala BH','Estação de trabalho em BH','Rua da Bahia, 200','Belo Horizonte', 60.00, 6, '["wifi"]', '[]', true);


