-- ============================================
-- CRIAR BUCKET DE STORAGE PARA IMAGENS
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Criar bucket 'rooms-images' (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'rooms-images',
  'rooms-images',
  true,
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Habilitar RLS no storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Política: Qualquer um pode ver imagens (públicas)
DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'rooms-images');

-- 4. Política: Usuários autenticados podem fazer upload
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);

-- 5. Política: Usuários podem atualizar suas próprias imagens
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);

-- 6. Política: Usuários podem deletar suas próprias imagens
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);

-- Verificar se foi criado
SELECT id, name, public FROM storage.buckets WHERE id = 'rooms-images';

