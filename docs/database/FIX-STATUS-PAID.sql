-- ============================================
-- FIX: Adicionar 'paid' como status válido em bookings
-- ============================================
-- Execute este script ANTES de executar SEEDS-COMPLETO.sql
-- ============================================

-- 1. Remover constraint antiga (se existir)
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- 2. Criar nova constraint incluindo 'paid'
ALTER TABLE bookings
  ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled', 'completed'));

-- 3. Verificar se funcionou
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.bookings'::regclass 
  AND conname = 'bookings_status_check';

-- Deve mostrar: CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'paid'::text, 'cancelled'::text, 'completed'::text])))
