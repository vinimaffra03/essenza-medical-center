# 👥 Como Criar Usuários de Teste

## Método 1: Via Dashboard do Supabase (Recomendado)

### Passo a Passo:

1. **Acesse o Supabase Dashboard**
   - Vá em **Authentication** > **Users** (no menu lateral)

2. **Criar os 4 usuários de teste:**

   **Owner 1:**
   - Email: `owner1@worknow.com`
   - Password: `senha123` (ou qualquer senha de sua escolha)
   - Clique em **Add user** > **Create new user**
   
   **Owner 2:**
   - Email: `owner2@worknow.com`
   - Password: `senha123`
   
   **Tenant 1:**
   - Email: `tenant1@worknow.com`
   - Password: `senha123`
   
   **Tenant 2:**
   - Email: `tenant2@worknow.com`
   - Password: `senha123`

3. **Copiar os UUIDs:**
   - Após criar cada usuário, anote o **UUID** (User UID)
   - Você verá algo como: `91836fde-0173-48d8-b60f-24497f3f4075`

4. **Pegar todos os UUIDs de uma vez:**
   - No SQL Editor, execute:
   ```sql
   SELECT id, email FROM auth.users 
   WHERE email IN (
     'owner1@worknow.com',
     'owner2@worknow.com',
     'tenant1@worknow.com',
     'tenant2@worknow.com'
   );
   ```
   - Copie os UUIDs retornados

---

## Método 2: Via API (Script)

Se preferir, pode usar este script no SQL Editor:

```sql
-- Criar usuários via função (requer permissões administrativas)
-- Nota: Este método pode não funcionar dependendo das permissões
-- Recomendado usar o Método 1 (Dashboard)
```

---

## Após Criar os Usuários:

1. **Abra o arquivo `SEEDS-COMPLETO.sql`**
2. **Substitua os placeholders pelos UUIDs reais:**
   ```sql
   owner1_id UUID := '91836fde-0173-48d8-b60f-24497f3f4075'; -- Substitua aqui
   owner2_id UUID := '...'; -- Substitua aqui
   tenant1_id UUID := '...'; -- Substitua aqui
   tenant2_id UUID := '...'; -- Substitua aqui
   ```

3. **Execute o `SEEDS-COMPLETO.sql` no SQL Editor**

4. **Verifique se funcionou:**
   ```sql
   SELECT 
     (SELECT COUNT(*) FROM profiles) as total_profiles,
     (SELECT COUNT(*) FROM rooms WHERE is_active = true) as total_rooms,
     (SELECT COUNT(*) FROM bookings) as total_bookings;
   ```
   - Deve retornar: 4 profiles, 6 rooms, 3 bookings

---

## ✅ Credenciais de Teste:

Após criar os usuários e executar os seeds, você pode fazer login com:

**Proprietários:**
- `owner1@worknow.com` / `senha123`
- `owner2@worknow.com` / `senha123`

**Locatários:**
- `tenant1@worknow.com` / `senha123`
- `tenant2@worknow.com` / `senha123`

---

## 🎯 Teste Rápido:

1. Login como `tenant1@worknow.com`
2. Vá em `/rooms` - deve ver 6 salas
3. Clique em uma sala → fazer reserva
4. Veja em `/bookings` - deve ter 2 reservas pagas e 1 pendente

