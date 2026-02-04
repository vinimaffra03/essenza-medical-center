-- ============================================
-- TORNAR PRICE_PER_HOUR OPCIONAL (NULLABLE)
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Tornar price_per_hour opcional (remover NOT NULL)
ALTER TABLE rooms
  ALTER COLUMN price_per_hour DROP NOT NULL;

-- 2. Definir valor padrão NULL para novas salas
ALTER TABLE rooms
  ALTER COLUMN price_per_hour SET DEFAULT NULL;

-- 3. Verificar se funcionou
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'rooms'
  AND column_name IN ('price_per_hour', 'price_per_day')
ORDER BY column_name;

