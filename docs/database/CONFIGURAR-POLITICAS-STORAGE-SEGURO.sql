-- ============================================
-- CONFIGURAR POLÍTICAS DO BUCKET (VERSÃO SEGURA)
-- ============================================
-- Esta versão NÃO remove políticas existentes
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Habilitar RLS no storage.objects (se ainda não estiver)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Criar políticas (apenas se não existirem)
DO $$
BEGIN
  -- Política: Qualquer um pode VER imagens (públicas)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Images are publicly accessible'
  ) THEN
    CREATE POLICY "Images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'rooms-images');
  END IF;

  -- Política: Usuários autenticados podem FAZER UPLOAD
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload images'
  ) THEN
    CREATE POLICY "Authenticated users can upload images"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'rooms-images' 
      AND auth.role() = 'authenticated'
    );
  END IF;

  -- Política: Usuários autenticados podem DELETAR
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete images'
  ) THEN
    CREATE POLICY "Authenticated users can delete images"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'rooms-images' 
      AND auth.role() = 'authenticated'
    );
  END IF;
END $$;

-- Verificar se funcionou
SELECT 
  policyname,
  cmd as operation
FROM pg_policies
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%images%'
ORDER BY policyname;

