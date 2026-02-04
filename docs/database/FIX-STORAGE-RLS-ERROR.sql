-- ============================================
-- CORRIGIR ERRO RLS: "new row violates row-level security policy"
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Remover TODAS as políticas antigas do bucket rooms-images
DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- 2. Garantir que o bucket existe e está público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'rooms-images',
  'rooms-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 3. Garantir que RLS está habilitado
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas corretas (sem IF NOT EXISTS para garantir substituição)

-- Política 1: Qualquer um pode VER imagens (públicas)
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'rooms-images');

-- Política 2: Usuários autenticados podem FAZER UPLOAD
-- IMPORTANTE: Usar auth.uid() IS NOT NULL em vez de auth.role()
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'rooms-images' 
  AND auth.uid() IS NOT NULL
);

-- Política 3: Usuários autenticados podem ATUALIZAR
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'rooms-images' 
  AND auth.uid() IS NOT NULL
)
WITH CHECK (
  bucket_id = 'rooms-images' 
  AND auth.uid() IS NOT NULL
);

-- Política 4: Usuários autenticados podem DELETAR
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'rooms-images' 
  AND auth.uid() IS NOT NULL
);

-- 5. Verificar se as políticas foram criadas corretamente
SELECT 
  policyname,
  cmd as operation,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || qual::text
    ELSE 'No USING'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check::text
    ELSE 'No WITH CHECK'
  END as with_check_clause
FROM pg_policies
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%images%'
ORDER BY policyname;

-- 6. Verificar bucket
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'rooms-images';

