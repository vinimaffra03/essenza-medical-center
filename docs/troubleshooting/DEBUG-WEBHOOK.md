# 🔍 Debug: Webhook não aparece nos logs

## 🐛 Problema

Os logs do Supabase não mostram nada, mesmo após o deploy.

## ✅ Possíveis Causas

1. **Webhook ainda não foi reenviado após o deploy**
   - O deploy foi feito às 20:43 (aproximadamente)
   - O último evento foi às 20:43:05
   - Pode ter sido reenviado ANTES do deploy

2. **Logs podem ter delay**
   - Os logs do Supabase podem levar alguns segundos para aparecer

3. **Webhook pode estar indo para outro endpoint**
   - Verifique se a URL do webhook no Stripe está correta

---

## 🧪 Passos para Debug

### 1. Verificar URL do Webhook no Stripe

1. Stripe Dashboard → **Developers** → **Webhooks**
2. Clique no seu webhook
3. Verifique se a URL está:
   ```
   https://tyhqjxaguwuamyftdqth.supabase.co/functions/v1/stripe-webhook
   ```

### 2. Reenviar o Webhook NOVAMENTE

1. Stripe Dashboard → **Developers** → **Webhooks**
2. Clique no webhook
3. Vá na aba **"Events"** ou **"Logs"**
4. Encontre o evento mais recente (o que falhou com 400)
5. Clique nele
6. Clique em **"Reenviar"** (Reenviar)

### 3. Verificar Logs do Supabase

1. Supabase Dashboard → **Edge Functions** → `stripe-webhook`
2. Clique na aba **"Logs"**
3. Aguarde alguns segundos após reenviar
4. Verifique se aparece uma nova entrada

### 4. Verificar se o Deploy foi bem-sucedido

1. Supabase Dashboard → **Edge Functions** → `stripe-webhook`
2. Vá na aba **"Code"**
3. Verifique se o código mostra `constructEventAsync` (não `constructEvent`)

---

## 🔍 O que Procurar nos Logs

Se aparecer algo, você deve ver:

- **Requisição recebida:** `POST /functions/v1/stripe-webhook`
- **Status:** `200 OK` (sucesso) ou `400/500` (erro)
- **Mensagens de erro:** Se houver algum problema

---

## 🚀 Teste Manual (Opcional)

Se quiser testar manualmente, você pode usar:

```bash
curl -X POST https://tyhqjxaguwuamyftdqth.supabase.co/functions/v1/stripe-webhook \
  -H "stripe-signature: test" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

Mas isso vai falhar porque precisa da assinatura válida do Stripe.

---

## ✅ Próximos Passos

1. **Reenvie o webhook no Stripe** (após o deploy)
2. **Aguarde 10-15 segundos**
3. **Verifique os logs novamente**
4. **Me avise o que apareceu!**

---

## 📝 Nota

Se os logs continuarem vazios após reenviar, pode ser:
- Problema de delay nos logs
- Webhook não está chegando na função
- URL do webhook está incorreta

Verifique a URL do webhook no Stripe primeiro!

