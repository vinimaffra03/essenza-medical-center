# 🪣 Configurar Storage via Dashboard (Método Visual)

## ✅ Passo 1: Criar o Bucket (Você já fez!)

Se já criou o bucket `rooms-images`, pule para o Passo 2.

---

## ✅ Passo 2: Configurar Políticas (IMPORTANTE!)

O bucket foi criado, mas precisa de políticas para permitir upload.

### Opção A: Via SQL Editor (Recomendado - 1 minuto)

1. **No Supabase Dashboard:**
   - Vá em **SQL Editor**
   - Clique em **New Query** (ou botão "+")
   - Abra o arquivo `CONFIGURAR-POLITICAS-STORAGE.sql`
   - Copie e cole todo o conteúdo
   - Clique em **RUN** (ou Ctrl+Enter)

2. **Verificar:**
   - Deve aparecer uma tabela com 3 políticas criadas
   - Se aparecer erro, me avise qual foi

---

### Opção B: Via Dashboard (Mais Visual)

1. **No Supabase Dashboard:**
   - Vá em **Storage** > **Policies**
   - Ou vá em **Storage** > **rooms-images** > **Policies**

2. **Criar Política 1 - SELECT (Ver imagens):**
   - Clique em **New Policy**
   - Nome: `Images are publicly accessible`
   - Allowed operation: **SELECT**
   - Target roles: `public`
   - USING expression: `bucket_id = 'rooms-images'`
   - Clique em **Review** > **Save policy**

3. **Criar Política 2 - INSERT (Fazer upload):**
   - Clique em **New Policy**
   - Nome: `Authenticated users can upload images`
   - Allowed operation: **INSERT**
   - Target roles: `authenticated`
   - WITH CHECK expression: `bucket_id = 'rooms-images' AND auth.role() = 'authenticated'`
   - Clique em **Review** > **Save policy**

4. **Criar Política 3 - DELETE (Deletar imagens):**
   - Clique em **New Policy**
   - Nome: `Authenticated users can delete images`
   - Allowed operation: **DELETE**
   - Target roles: `authenticated`
   - USING expression: `bucket_id = 'rooms-images' AND auth.role() = 'authenticated'`
   - Clique em **Review** > **Save policy**

---

## ✅ Passo 3: Testar

1. **Recarregue a página** do app (`Ctrl+R` ou `F5`)
2. **Tente fazer upload** de uma imagem novamente
3. **Deve funcionar!** ✅

---

## 🆘 Se ainda não funcionar

Verifique:
- ✅ Bucket `rooms-images` existe? (Storage > Buckets)
- ✅ Bucket está marcado como **Public**?
- ✅ Políticas foram criadas? (Storage > Policies)
- ✅ Você está logado? (precisa estar autenticado)

Me avise se ainda der erro!

