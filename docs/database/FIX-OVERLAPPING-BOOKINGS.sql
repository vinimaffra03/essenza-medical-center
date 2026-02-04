-- FIX AUTOMÁTICO DE CONFLITOS DE AGENDAMENTO
-- Este script resolve o erro "could not create exclusion constraint"
-- removendo (cancelando) agendamentos conflitantes antes de aplicar a regra.

-- ==============================================================================
-- 1. LIMPEZA INTELIGENTE DE CONFLITOS
-- ==============================================================================
-- Estratégia: Identificar pares de reservas que se sobrepõem e cancelar a "pior".
-- Critérios de sobrevivência (em ordem):
-- 1. Status 'paid'/'completed' ganha de 'pending'/'confirmed'.
-- 2. Se status for igual, a reserva criada PRIMEIRO (created_at menor) ganha.

DO $$
DECLARE
    r RECORD;
    score1 INT;
    score2 INT;
BEGIN
    -- Loop para encontrar pares conflitantes
    FOR r IN
        SELECT
            b1.id as id1, b1.status as status1, b1.created_at as created1,
            b2.id as id2, b2.status as status2, b2.created_at as created2
        FROM bookings b1
        JOIN bookings b2 ON b1.room_id = b2.room_id
            AND b1.id < b2.id -- Evita espelhamento (A vs B e B vs A)
            AND b1.status != 'cancelled'
            AND b2.status != 'cancelled'
            AND b1.start_time < b2.end_time
            AND b1.end_time > b2.start_time
    LOOP
        -- Calcular score (Paid/Completed = 3, Confirmed = 2, Pending = 1)
        score1 := CASE WHEN r.status1 IN ('paid', 'completed') THEN 3 WHEN r.status1 = 'confirmed' THEN 2 ELSE 1 END;
        score2 := CASE WHEN r.status2 IN ('paid', 'completed') THEN 3 WHEN r.status2 = 'confirmed' THEN 2 ELSE 1 END;

        IF score1 > score2 THEN
            -- b1 ganha, cancela b2
            UPDATE bookings SET status = 'cancelled', notes = COALESCE(notes, '') || ' [Auto-cancelled: Overlap Conflict]' WHERE id = r.id2;
        ELSIF score2 > score1 THEN
            -- b2 ganha, cancela b1
            UPDATE bookings SET status = 'cancelled', notes = COALESCE(notes, '') || ' [Auto-cancelled: Overlap Conflict]' WHERE id = r.id1;
        ELSE
            -- Empate de status: ganha o mais antigo
            IF r.created1 <= r.created2 THEN
                UPDATE bookings SET status = 'cancelled', notes = COALESCE(notes, '') || ' [Auto-cancelled: Overlap Conflict]' WHERE id = r.id2;
            ELSE
                UPDATE bookings SET status = 'cancelled', notes = COALESCE(notes, '') || ' [Auto-cancelled: Overlap Conflict]' WHERE id = r.id1;
            END IF;
        END IF;
    END LOOP;
END $$;

-- ==============================================================================
-- 2. APLICAR A CONSTRAINT (AGORA DEVE FUNCIONAR)
-- ==============================================================================

-- Garantir extensão
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Tentar aplicar a constraint novamente
ALTER TABLE bookings 
ADD CONSTRAINT no_overlap_bookings 
EXCLUDE USING gist (
  room_id WITH =, 
  tstzrange(start_time, end_time, '[)') WITH &&
) WHERE (status != 'cancelled');

-- Se o comando acima passar, o banco está protegido contra novos conflitos!
