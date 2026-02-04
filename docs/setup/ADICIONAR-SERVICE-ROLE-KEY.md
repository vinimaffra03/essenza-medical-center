# 🔐 Como Adicionar SERVICE_ROLE_KEY

## ⚠️ Problema

O Supabase não permite adicionar secrets que começam com `SUPABASE_` (são reservados).

## ✅ Solução

Adicione a SERVICE_ROLE_KEY com um nome diferente: `SERVICE_ROLE_KEY` (sem o prefixo `SUPABASE_`)

---

## 📝 Passo a Passo

### 1. Obter a SERVICE_ROLE_KEY

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Role até a seção "Project API keys"
5. Procure por **"service_role" (secret)**
6. Clique em **"Reveal"** para revelar a chave
7. **Copie a chave completa**

### 2. Adicionar como Secret

1. No Supabase Dashboard → **Edge Functions** → **stripe-webhook**
2. Vá em **Settings** → **Secrets**
3. Adicione um novo secret:
   - **Name:** `SERVICE_ROLE_KEY` (sem o prefixo SUPABASE_)
   - **Value:** Cole a chave que você copiou
4. Clique em **"Bulk save"**

---

## ✅ Pronto!

Agora a função `stripe-webhook` conseguirá acessar a SERVICE_ROLE_KEY através do nome `SERVICE_ROLE_KEY`.

O código já foi ajustado para procurar por `SERVICE_ROLE_KEY` primeiro, então funcionará automaticamente!

---

## 🧪 Testar

Depois de adicionar, teste criando uma reserva e fazendo o pagamento. O webhook deve atualizar o status para "paid" corretamente.

