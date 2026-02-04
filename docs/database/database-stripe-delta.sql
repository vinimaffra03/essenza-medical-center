-- Delta para Stripe e disponibilidade segura

-- Extensão necessária para exclusion constraint com room_id + range
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Ajustar enum/status e colunas Stripe
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Unique parcial em stripe_session_id quando presente
CREATE UNIQUE INDEX IF NOT EXISTS bookings_stripe_session_unique
  ON bookings (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

-- Gerar coluna de range para validar sobreposição [start, end)
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS time_range tstzrange GENERATED ALWAYS AS (tstzrange(start_time, end_time, '[)')) STORED;

-- Excluir sobreposição por sala quando status relevante (pending/confirmed/paid)
-- Nota: alguns esquemas usam 'confirmed' ou 'paid'. Incluí ambos para retrocompatibilidade.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_no_overlap_per_room'
  ) THEN
    ALTER TABLE bookings
      ADD CONSTRAINT bookings_no_overlap_per_room
      EXCLUDE USING gist (
        room_id WITH =,
        time_range WITH &&
      ) WHERE (status IN ('pending','confirmed','paid'));
  END IF;
END$$;

-- Índices úteis
CREATE INDEX IF NOT EXISTS bookings_room_start_idx ON bookings (room_id, start_time);
CREATE INDEX IF NOT EXISTS bookings_user_start_idx ON bookings (user_id, start_time DESC);

-- Política RLS para donos verem reservas de suas salas (caso não exista)
-- Ajuste o nome se já existir política semelhante no projeto.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'bookings'
      AND policyname = 'owners_can_view_room_bookings'
  ) THEN
    CREATE POLICY owners_can_view_room_bookings ON bookings
      FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM rooms r
          WHERE r.id = bookings.room_id AND r.owner_id = auth.uid()
        )
      );
  END IF;
END$$;


