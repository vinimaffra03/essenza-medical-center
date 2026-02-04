-- ============================================
-- FIX: Adicionar colunas Stripe na tabela bookings
-- ============================================
-- Execute este script ANTES de executar SEEDS-COMPLETO.sql
-- ============================================

-- Adicionar colunas Stripe (se não existirem)
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- Criar índice único para stripe_session_id (quando não for NULL)
CREATE UNIQUE INDEX IF NOT EXISTS bookings_stripe_session_unique
  ON bookings (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

-- Verificar se funcionou
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'bookings'
  AND column_name IN ('stripe_session_id', 'payment_intent_id')
ORDER BY ordinal_position;

