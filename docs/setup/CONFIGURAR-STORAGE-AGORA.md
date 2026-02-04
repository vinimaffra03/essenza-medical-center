# 🪣 Configurar Storage - PASSO A PASSO RÁPIDO

## ⚠️ Erro Atual
"Bucket de storage não configurado"

## ✅ Solução (2 minutos)

### Opção 1: Via Dashboard (Mais Fácil) ⭐

1. **Acesse:** https://supabase.com/dashboard
2. **Vá em:** Storage (menu lateral esquerdo)
3. **Clique em:** "New bucket" ou "Create bucket"
4. **Preencha:**
   - **Name:** `rooms-images` (exatamente assim, com hífen)
   - **Public bucket:** ✅ Marque esta opção
   - **File size limit:** 5 MB (ou deixe padrão)
   - **Allowed MIME types:** `image/jpeg, image/png, image/webp` (opcional)
5. **Clique em:** "Create bucket"

### Opção 2: Via SQL Editor

1. **Acesse:** Supabase Dashboard → SQL Editor
2. **Cole e execute** o script abaixo:

```sql
-- Criar bucket 'rooms-images'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'rooms-images',
  'rooms-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Política: Qualquer um pode ver imagens
CREATE POLICY IF NOT EXISTS "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'rooms-images');

-- Política: Usuários autenticados podem fazer upload
CREATE POLICY IF NOT EXISTS "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);

-- Política: Usuários podem deletar
CREATE POLICY IF NOT EXISTS "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);
```

---

## ✅ Verificar se Funcionou

1. **No Dashboard:**
   - Storage → Buckets
   - Deve aparecer `rooms-images` na lista

2. **Testar Upload:**
   - Tente fazer upload de uma imagem novamente
   - Deve funcionar agora!

---

## 🐛 Se Ainda Não Funcionar

1. **Verifique se o bucket existe:**
   - Storage → Buckets
   - Procure por `rooms-images`

2. **Verifique as políticas:**
   - Storage → Buckets → `rooms-images` → Policies
   - Devem existir 3 políticas (SELECT, INSERT, DELETE)

3. **Tente deletar e recriar:**
   - Delete o bucket (se existir)
   - Crie novamente seguindo os passos acima

---

## ✅ Pronto!

Após configurar, o upload de imagens deve funcionar perfeitamente!

