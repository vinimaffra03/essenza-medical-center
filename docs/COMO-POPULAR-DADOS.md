# 📦 Como Popular o Banco com Dados de Teste

## 🎯 Objetivo
Criar usuários, salas e reservas de exemplo para demonstrar o app funcionando.

---

## 📋 Passo a Passo Simplificado

### 1️⃣ Criar Usuários no Supabase Auth (5 min)

**No Supabase Dashboard:**
1. Vá em **Authentication** > **Users**
2. Clique em **Add user** > **Create new user**
3. Crie os 4 usuários:

| Email | Password | Tipo |
|-------|----------|------|
| `owner1@worknow.com` | `senha123` | Proprietário |
| `owner2@worknow.com` | `senha123` | Proprietário |
| `tenant1@worknow.com` | `senha123` | Locatário |
| `tenant2@worknow.com` | `senha123` | Locatário |

✅ **Anote os UUIDs** de cada usuário (ou execute a query abaixo para pegar todos)

---

### 2️⃣ Popular os Dados (2 opções)

#### **Opção A: Automático (Recomendado) ⚡**

Execute no **SQL Editor** do Supabase:
```sql
-- Abra o arquivo SEEDS-RAPIDO.sql
-- Copie e cole no SQL Editor
-- Clique em RUN
```

Este script pega automaticamente os UUIDs dos usuários que você criou!

#### **Opção B: Manual (Mais controle)**

1. Pegue os UUIDs dos usuários:
   ```sql
   SELECT id, email FROM auth.users 
   WHERE email IN (
     'owner1@worknow.com',
     'owner2@worknow.com',
     'tenant1@worknow.com',
     'tenant2@worknow.com'
   );
   ```

2. Abra `SEEDS-COMPLETO.sql`
3. Substitua os placeholders pelos UUIDs reais
4. Execute no SQL Editor

---

### 3️⃣ Verificar se Funcionou

Execute esta query:
```sql
SELECT 
  (SELECT COUNT(*) FROM profiles) as total_profiles,
  (SELECT COUNT(*) FROM rooms WHERE is_active = true) as total_rooms,
  (SELECT COUNT(*) FROM bookings) as total_bookings;
```

**Resultado esperado:**
- `total_profiles`: 4
- `total_rooms`: 6
- `total_bookings`: 2 (ou mais)

---

## 🧪 Testar no App

### Login como Tenant:
1. Abra http://localhost:5173
2. Login: `tenant1@worknow.com` / `senha123`
3. Vá em **Salas** → deve ver 6 salas disponíveis
4. Clique em uma sala → ver detalhes
5. Vá em **Reservas** → deve ver 1 reserva paga

### Login como Owner:
1. Logout
2. Login: `owner1@worknow.com` / `senha123`
3. Vá em **Salas** → deve ver 3 salas (suas)
4. Pode criar novas salas, editar, etc.

---

## 🔄 Se Precisar Resetar

Para limpar tudo e começar de novo:

```sql
-- CUIDADO: Isso apaga TODOS os dados!
DELETE FROM bookings;
DELETE FROM rooms;
DELETE FROM profiles;
-- Os usuários no Auth precisam ser deletados manualmente
```

---

## 📝 O que será criado:

✅ **4 Perfis:**
- 2 Proprietários (João e Maria)
- 2 Locatários (Carlos e Ana)

✅ **6 Salas:**
- 3 do Owner 1 (Av. Paulista, Vila Madalena, Faria Lima)
- 3 do Owner 2 (Centro, Jardins, Pinheiros)

✅ **2 Reservas:**
- 1 reserva paga do Tenant 1
- 1 reserva paga do Tenant 2

---

## 🆘 Problemas?

**Erro: "relation profiles does not exist"**
→ Execute primeiro o `database-fixed.sql` ou `database.sql`

**Erro: "duplicate key value"**
→ Os dados já existem! Tudo certo, pode pular.

**Não aparecem salas no app**
→ Verifique se `is_active = true` nas salas
→ Verifique RLS policies no Supabase

---

**Pronto! Agora você tem dados de teste para demonstrar o app! 🎉**

