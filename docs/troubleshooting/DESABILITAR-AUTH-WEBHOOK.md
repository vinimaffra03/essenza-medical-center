# 🔧 Desabilitar Autenticação no Webhook

## 🐛 Problema

O erro 401 "Missing authorization header" acontece porque:

- **Supabase Edge Functions exigem autenticação JWT por padrão**
- **Webhooks do Stripe não enviam Authorization header**
- **Webhooks precisam ser públicos**

## ✅ Solução

Criei o arquivo `config.json` na função `stripe-webhook` para desabilitar a autenticação.

### Arquivo criado:
- `supabase/functions/stripe-webhook/config.json`

### Conteúdo:
```json
{
  "auth": false
}
```

---

## 🚀 Fazer Deploy

Execute:

```powershell
npx supabase functions deploy stripe-webhook
```

---

## ✅ Depois do Deploy

1. **Reenvie o webhook no Stripe:**
   - Stripe Dashboard → Webhooks → Seu webhook
   - Clique no evento que falhou (401 ERR)
   - Clique em **"Reenviar"**

2. **Verifique os logs:**
   - Supabase Dashboard → Edge Functions → `stripe-webhook` → **Logs**
   - Deve aparecer a requisição com sucesso (200 OK)

3. **Verifique o banco:**
   - A reserva deve ter `status = 'paid'`

---

## 🔒 Segurança

Mesmo sem autenticação JWT, o webhook está seguro porque:

- ✅ Valida a assinatura do Stripe (`stripe-signature`)
- ✅ Verifica o `STRIPE_WEBHOOK_SECRET`
- ✅ Apenas o Stripe conhece o secret

---

## ✅ Pronto!

Após fazer o deploy, o webhook deve funcionar corretamente!

