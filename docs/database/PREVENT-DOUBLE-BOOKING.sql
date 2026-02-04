-- Habilita extensão para constraints de intervalo
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Adiciona constraint para evitar sobreposição de horários (Double Booking)
-- Impede inserção se (room_id igual) E (horários se sobrepõem)
-- Ignora reservas canceladas ('cancelled')
ALTER TABLE bookings
ADD CONSTRAINT no_double_booking
EXCLUDE USING gist (
  room_id WITH =,
  tstzrange(start_time, end_time, '[)') WITH &&
)
WHERE (status != 'cancelled');
