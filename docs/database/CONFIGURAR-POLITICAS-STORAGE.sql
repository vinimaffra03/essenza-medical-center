-- ============================================
-- CONFIGURAR POLÍTICAS DO BUCKET rooms-images
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- APÓS criar o bucket via Dashboard
-- ============================================

-- 1. Habilitar RLS no storage.objects (se ainda não estiver)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- 3. Política: Qualquer um pode VER imagens (públicas)
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'rooms-images');

-- 4. Política: Usuários autenticados podem FAZER UPLOAD
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);

-- 5. Política: Usuários autenticados podem DELETAR
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);

-- Verificar se funcionou
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%images%';

