-- Tabela para períodos de faxina/manutenção
-- Execute no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS maintenance_periods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cleaning', 'maintenance', 'unavailable')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE maintenance_periods ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Owners can view maintenance periods for their rooms"
  ON maintenance_periods FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = maintenance_periods.room_id
      AND rooms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can create maintenance periods for their rooms"
  ON maintenance_periods FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = maintenance_periods.room_id
      AND rooms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can update maintenance periods for their rooms"
  ON maintenance_periods FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = maintenance_periods.room_id
      AND rooms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can delete maintenance periods for their rooms"
  ON maintenance_periods FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = maintenance_periods.room_id
      AND rooms.owner_id = auth.uid()
    )
  );

-- Índice para performance
CREATE INDEX IF NOT EXISTS maintenance_periods_room_id_idx ON maintenance_periods(room_id);
CREATE INDEX IF NOT EXISTS maintenance_periods_time_range_idx ON maintenance_periods(start_time, end_time);

-- Trigger para updated_at
CREATE TRIGGER update_maintenance_periods_updated_at
  BEFORE UPDATE ON maintenance_periods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

