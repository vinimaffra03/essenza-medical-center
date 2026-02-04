# 🔧 Resolver Erro RLS: "new row violates row-level security policy"

## ⚠️ Erro Atual
```
StorageApiError: new row violates row-level security policy
```

## 🔍 Causa
As políticas RLS do Supabase Storage estão bloqueando o INSERT porque:
- A política pode estar usando `auth.role()` que pode não funcionar corretamente
- As políticas podem não estar aplicadas corretamente
- O bucket pode não estar configurado como público

## ✅ Solução

### Execute o Script SQL

1. **Acesse:** Supabase Dashboard → SQL Editor
2. **Abra o arquivo:** `FIX-STORAGE-RLS-ERROR.sql`
3. **Copie todo o conteúdo**
4. **Cole no SQL Editor**
5. **Execute (RUN)**

Este script:
- ✅ Remove todas as políticas antigas
- ✅ Garante que o bucket existe e está público
- ✅ Cria políticas corretas usando `auth.uid() IS NOT NULL` (mais confiável)
- ✅ Verifica se tudo foi criado corretamente

---

## 🧪 Testar Após Executar

1. **Tente fazer upload de uma imagem novamente**
2. **Deve funcionar agora!**

---

## 🔍 Se Ainda Não Funcionar

### Verificar 1: Bucket Existe?
```sql
SELECT id, name, public FROM storage.buckets WHERE id = 'rooms-images';
```
- Deve retornar uma linha com `public = true`

### Verificar 2: Políticas Existem?
```sql
SELECT policyname, cmd 
FROM pg_policies
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%images%';
```
- Devem existir 4 políticas (SELECT, INSERT, UPDATE, DELETE)

### Verificar 3: Usuário Está Autenticado?
- Abra o console do navegador (F12)
- Verifique se há erros de autenticação
- Tente fazer logout e login novamente

---

## ✅ Pronto!

Após executar o script, o upload deve funcionar perfeitamente!

