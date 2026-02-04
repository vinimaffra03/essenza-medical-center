-- FIX DE SEGURANÇA E INTEGRIDADE
-- 1. Corrige RLS de Profiles (Evita vazamento de dados)
-- 2. Adiciona Constraint de Exclusão em Bookings (Evita Overbooking)

-- ==============================================================================
-- 1. SEGURANÇA (RLS Profiles)
-- ==============================================================================

-- Remover a policy antiga permissiva
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

-- Criar policy restrita: Usuário só vê seu próprio perfil
-- NOTA: Se o app precisar exibir nome do dono da sala, precisaremos de uma policy adicional 
-- ou uma view segura. Por enquanto, priorizando segurança máxima.
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Caso precisemos permitir ver dados publicos de outros (ex: para mostrar dono da sala)
-- Podemos criar uma policy específica para "Leitura de dados públicos" se profiles tiver flag is_public
-- Ou simplesmente permitir leitura se souber o ID (muito comum em redes sociais)
-- Por ora, vamos manter estrito. Se o frontend quebrar ao listar salas (tentando buscar owner),
-- ajustaremos para permitir ver profiles APENAS se tiver o ID específico na query.

-- Ajuste alternativo (Permitir ver profile se souber o ID - útil para UI de detalhes da sala):
-- CREATE POLICY "Users can view profiles by ID" 
--   ON profiles FOR SELECT 
--   USING (true); 
-- (Isso volta ao estado anterior, então vamos manter o restrito e observar)


-- ==============================================================================
-- 2. INTEGRIDADE DE DADOS (Anti-Overbooking)
-- ==============================================================================

-- Habilita extensão para índices avançados (GIST)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Adiciona constraint que impede fisicamente sobreposição de horários
-- Explicação: 
-- Para o mesmo room_id, não pode haver interseção (&&) dos intervalos de tempo (tstzrange)
-- Ignoramos bookings com status 'cancelled'
ALTER TABLE bookings 
ADD CONSTRAINT no_overlap_bookings 
EXCLUDE USING gist (
  room_id WITH =, 
  tstzrange(start_time, end_time, '[)') WITH &&
) WHERE (status != 'cancelled');
