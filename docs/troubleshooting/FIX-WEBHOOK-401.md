# 🔧 Fix: Erro 401 "Missing authorization header" no Webhook

## 🐛 Problema

O webhook do Stripe está retornando erro 401 "Missing authorization header". Isso acontece porque:

1. O Supabase pode estar exigindo autenticação na Edge Function
2. Webhooks do Stripe **não enviam** Authorization header (eles usam `stripe-signature`)
3. A Edge Function precisa ser **pública** para receber webhooks

## ✅ Solução

### Opção 1: Verificar se a Edge Function está pública

As Edge Functions do Supabase são públicas por padrão, mas vamos garantir:

1. No Supabase Dashboard → **Edge Functions** → `stripe-webhook`
2. Vá em **Settings** ou **Details**
3. Verifique se não há configuração de autenticação obrigatória

### Opção 2: Adicionar SERVICE_ROLE_KEY como secret

O erro pode estar acontecendo porque a `SERVICE_ROLE_KEY` não está disponível:

1. No Supabase Dashboard → **Edge Functions** → `stripe-webhook`
2. Vá em **Settings** → **Secrets**
3. Adicione:
   - **Name:** `SERVICE_ROLE_KEY`
   - **Value:** Sua SERVICE_ROLE_KEY (Settings → API → service_role → Reveal)
4. Clique em **"Bulk save"**

### Opção 3: Fazer deploy da função atualizada

O código foi atualizado para melhor tratamento de erros:

```powershell
npx supabase functions deploy stripe-webhook
```

---

## 🧪 Testar

Após fazer as correções:

1. **Reenvie o webhook no Stripe:**
   - Stripe Dashboard → Webhooks → Seu webhook
   - Clique no evento que falhou
   - Clique em **"Reenviar"**

2. **Verifique os logs:**
   - Supabase Dashboard → Edge Functions → `stripe-webhook` → **Logs**
   - Deve aparecer a requisição e o resultado

3. **Verifique o banco:**
   - Supabase Dashboard → Table Editor → `bookings`
   - A reserva deve ter `status = 'paid'`

---

## 📝 Nota Importante

O erro "Missing authorization header" **não está vindo do nosso código** - está vindo do Supabase antes de chegar ao nosso código. Isso pode indicar:

- A Edge Function está configurada para exigir autenticação (improvável)
- A SERVICE_ROLE_KEY não está disponível (mais provável)
- Há algum problema de configuração no Supabase

A solução mais provável é adicionar o secret `SERVICE_ROLE_KEY` e fazer deploy novamente.

