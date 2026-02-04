-- Configurar Supabase Storage para upload de imagens de salas
-- Execute este SQL no Supabase Dashboard

-- Criar bucket para imagens de salas (se ainda não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('rooms-images', 'rooms-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para upload de imagens
-- Permitir que qualquer usuário veja as imagens (públicas)
CREATE POLICY IF NOT EXISTS "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'rooms-images');

-- Permitir que proprietários façam upload
CREATE POLICY IF NOT EXISTS "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);

-- Permitir que proprietários atualizem suas próprias imagens
CREATE POLICY IF NOT EXISTS "Users can update own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'rooms-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir que proprietários deletem suas próprias imagens
CREATE POLICY IF NOT EXISTS "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'rooms-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

