# 🔧 Resolver Erro: "must be owner of table objects"

## ⚠️ Erro Atual
```
ERROR: 42501: must be owner of table objects
```

## 🔍 Causa
O script anterior tentava fazer `ALTER TABLE` na tabela `storage.objects`, que é uma tabela do sistema do Supabase. Usuários normais não têm permissão para alterar essa tabela.

## ✅ Solução

### Use o Script Simplificado

1. **Acesse:** Supabase Dashboard → SQL Editor
2. **Abra o arquivo:** `FIX-STORAGE-RLS-SIMPLES.sql`
3. **Copie todo o conteúdo**
4. **Cole no SQL Editor**
5. **Execute (RUN)**

Este script:
- ✅ **NÃO** tenta fazer ALTER TABLE (que causa o erro)
- ✅ Apenas cria/remove políticas (que é permitido)
- ✅ Usa `DO $$ ... END $$` para tratar erros ao remover políticas
- ✅ Usa `auth.uid() IS NOT NULL` (mais confiável)

---

## 🧪 Testar Após Executar

1. **Tente fazer upload de uma imagem novamente**
2. **Deve funcionar agora!**

---

## 🔍 Se Ainda Não Funcionar

### Alternativa: Configurar via Dashboard

1. **Acesse:** Supabase Dashboard → Storage → Buckets
2. **Clique no bucket:** `rooms-images`
3. **Vá em:** Policies
4. **Delete todas as políticas existentes**
5. **Crie novas políticas manualmente:**

**Política 1 - SELECT (Ver imagens):**
- Policy name: `Images are publicly accessible`
- Allowed operation: `SELECT`
- Policy definition:
```sql
bucket_id = 'rooms-images'
```

**Política 2 - INSERT (Upload):**
- Policy name: `Authenticated users can upload images`
- Allowed operation: `INSERT`
- Policy definition:
```sql
bucket_id = 'rooms-images' AND auth.uid() IS NOT NULL
```

**Política 3 - UPDATE:**
- Policy name: `Authenticated users can update images`
- Allowed operation: `UPDATE`
- Policy definition:
```sql
bucket_id = 'rooms-images' AND auth.uid() IS NOT NULL
```

**Política 4 - DELETE:**
- Policy name: `Authenticated users can delete images`
- Allowed operation: `DELETE`
- Policy definition:
```sql
bucket_id = 'rooms-images' AND auth.uid() IS NOT NULL
```

---

## ✅ Pronto!

Execute o script simplificado ou configure manualmente via Dashboard!

