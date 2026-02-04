-- ============================================
-- CORRIGIR ERRO RLS: Versão Simples (Sem ALTER TABLE)
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Garantir que o bucket existe e está público
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

-- 2. Remover políticas antigas (se existirem)
-- Usar IF EXISTS para evitar erros
DO $$
BEGIN
  -- Remover políticas antigas
  DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignorar erros se as políticas não existirem
    NULL;
END $$;

-- 3. Criar políticas corretas

-- Política 1: Qualquer um pode VER imagens (públicas)
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'rooms-images');

-- Política 2: Usuários autenticados podem FAZER UPLOAD
-- Usar auth.uid() IS NOT NULL (mais confiável)
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

-- 4. Verificar se as políticas foram criadas
SELECT 
  policyname,
  cmd as operation
FROM pg_policies
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%images%'
ORDER BY policyname;

-- 5. Verificar bucket
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'rooms-images';

