-- ============================================
-- CONFIGURAR POLÍTICAS DO BUCKET (VERSÃO FINAL)
-- ============================================
-- RLS já está habilitado por padrão no Supabase Storage
-- Apenas criamos as políticas necessárias
-- ============================================

-- Política 1: Qualquer um pode VER imagens (públicas)
CREATE POLICY IF NOT EXISTS "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'rooms-images');

-- Política 2: Usuários autenticados podem FAZER UPLOAD
CREATE POLICY IF NOT EXISTS "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);

-- Política 3: Usuários autenticados podem DELETAR
CREATE POLICY IF NOT EXISTS "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);

-- Verificar se funcionou
SELECT 
  policyname,
  cmd as operation
FROM pg_policies
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%images%'
ORDER BY policyname;

