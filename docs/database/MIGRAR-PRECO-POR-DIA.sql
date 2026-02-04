-- ============================================
-- MIGRAÇÃO: PRICE_PER_HOUR → PRICE_PER_DAY
-- ============================================
-- Este script migra o campo price_per_hour para price_per_day
-- e converte os valores existentes (assumindo 8 horas por dia)
-- ============================================

-- 1. Adicionar nova coluna price_per_day
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS price_per_day DECIMAL(10, 2);

-- 2. Migrar dados existentes (assumindo 8 horas = 1 dia)
-- Se price_per_hour = 50, então price_per_day = 50 * 8 = 400
UPDATE rooms
SET price_per_day = COALESCE(price_per_hour, 0) * 8
WHERE price_per_day IS NULL;

-- 3. Tornar a coluna obrigatória (após migração)
ALTER TABLE rooms
  ALTER COLUMN price_per_day SET NOT NULL;

-- 4. (OPCIONAL) Remover coluna antiga após verificar que tudo funciona
-- Descomente a linha abaixo APENAS após testar tudo:
-- ALTER TABLE rooms DROP COLUMN IF EXISTS price_per_hour;

-- 5. Adicionar constraint para garantir preço positivo
ALTER TABLE rooms
  ADD CONSTRAINT rooms_price_per_day_positive CHECK (price_per_day > 0);

-- Verificar migração
SELECT 
  id,
  title,
  price_per_hour as preco_antigo_por_hora,
  price_per_day as preco_novo_por_dia,
  ROUND(price_per_day / NULLIF(price_per_hour, 0), 2) as fator_conversao
FROM rooms
LIMIT 10;

