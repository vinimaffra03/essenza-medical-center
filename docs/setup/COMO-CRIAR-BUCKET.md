# 🪣 Como Criar o Bucket de Storage

## ⚠️ Problema
O erro "Bucket not found" acontece porque o bucket `rooms-images` não foi criado no Supabase Storage.

## ✅ Solução Rápida (2 minutos)

### Passo 1: Criar o Bucket

1. **No Supabase Dashboard:**
   - Vá em **Storage** (menu lateral)
   - Clique em **New bucket**
   - Nome: `rooms-images`
   - Marque **Public bucket** (para imagens serem acessíveis)
   - Clique em **Create bucket**

### Passo 2: Configurar Políticas (Opcional mas Recomendado)

**Opção A: Via Dashboard (Mais Fácil)**
1. No bucket `rooms-images`, vá em **Policies**
2. Clique em **New Policy**
3. Selecione **For full customization**, cole o SQL abaixo:

```sql
-- Política para SELECT (qualquer um pode ver)
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'rooms-images');

-- Política para INSERT (usuários autenticados podem fazer upload)
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);

-- Política para DELETE (usuários podem deletar)
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'rooms-images' 
  AND auth.role() = 'authenticated'
);
```

**Opção B: Via SQL Editor**
1. Abra o arquivo `CRIAR-BUCKET-STORAGE.sql`
2. Copie e cole no SQL Editor
3. Execute (RUN)

---

## ✅ Verificar se Funcionou

1. Tente fazer upload de uma imagem novamente
2. Se funcionar, você verá a imagem aparecer na galeria
3. Se ainda der erro, verifique:
   - O bucket foi criado? (Storage > Buckets)
   - As políticas estão ativas? (Storage > Buckets > rooms-images > Policies)

---

## 🎯 Pronto!

Agora você pode fazer upload de imagens ao criar/editar salas!

