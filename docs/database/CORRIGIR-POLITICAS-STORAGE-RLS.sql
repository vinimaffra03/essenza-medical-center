-- ============================================
-- CORRIGIR POLÍTICAS RLS DO STORAGE
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- 2. Criar políticas corretas

-- Política 1: Qualquer um pode VER imagens (públicas)
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'rooms-images');

-- Política 2: Usuários autenticados podem FAZER UPLOAD
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);

-- Política 3: Usuários autenticados podem ATUALIZAR
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);

-- Política 4: Usuários autenticados podem DELETAR
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);

-- 3. Verificar se as políticas foram criadas
SELECT 
  policyname,
  cmd as operation,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%images%'
ORDER BY policyname;

-- 4. Verificar se o bucket existe e está público
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'rooms-images';

