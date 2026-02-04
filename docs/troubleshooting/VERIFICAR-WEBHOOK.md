# 🔍 Verificar se o Webhook Está Funcionando

## ✅ O que funcionou

1. ✅ Edge Function `checkout` criou a reserva
2. ✅ Stripe Checkout processou o pagamento
3. ✅ Você foi redirecionado de volta

## ⚠️ O que falta

O webhook do Stripe ainda não atualizou o status de "pending" para "paid".

---

## 🔍 Como Verificar

### 1. Verificar no Stripe Dashboard

1. Acesse: https://dashboard.stripe.com
2. Vá em **Developers** → **Webhooks**
3. Clique no webhook que você criou
4. Vá na aba **"Events"** ou **"Logs"**
5. Verifique se há eventos `checkout.session.completed` recentes
6. Clique no evento para ver os detalhes
7. Verifique se há erros

### 2. Verificar Logs da Edge Function

1. Acesse: https://supabase.com/dashboard
2. Vá em **Edge Functions** → **stripe-webhook**
3. Clique em **"Logs"**
4. Verifique se há:
   - Requisições recebidas
   - Erros
   - Mensagens de sucesso

### 3. Verificar no Banco de Dados

1. No Supabase Dashboard → **Table Editor** → `bookings`
2. Encontre a reserva que você acabou de fazer
3. Verifique:
   - `status` - deve ser "pending" ou "paid"
   - `stripe_session_id` - deve estar preenchido
   - `payment_intent_id` - pode estar vazio se o webhook não rodou

---

## 🐛 Possíveis Problemas

### Problema 1: Webhook não está sendo chamado

**Sintomas:**
- Não há eventos no Stripe Dashboard
- Não há logs na Edge Function

**Solução:**
- Verifique se a URL do webhook está correta
- Verifique se o evento `checkout.session.completed` está selecionado
- Teste manualmente enviando um evento de teste no Stripe

### Problema 2: Webhook está falhando

**Sintomas:**
- Há eventos no Stripe, mas com erro
- Há logs na Edge Function com erro

**Solução:**
- Verifique os logs da Edge Function para ver o erro específico
- Verifique se os secrets estão configurados corretamente
- Verifique se a SERVICE_ROLE_KEY está acessível

### Problema 3: Webhook está funcionando, mas não atualiza

**Sintomas:**
- Há eventos de sucesso no Stripe
- Há logs de sucesso na Edge Function
- Mas o status não muda no banco

**Solução:**
- Verifique se o `booking_id` está sendo passado corretamente
- Verifique se há problemas de RLS (Row Level Security)
- Verifique os logs da Edge Function para ver se a atualização foi executada

---

## 🧪 Testar Manualmente

### Opção 1: Enviar Evento de Teste no Stripe

1. No Stripe Dashboard → **Webhooks** → Seu webhook
2. Clique em **"Send test webhook"**
3. Selecione o evento: `checkout.session.completed`
4. Envie
5. Verifique se a Edge Function recebeu

### Opção 2: Verificar Manualmente no Banco

Se o webhook não funcionar, você pode atualizar manualmente:

```sql
-- No Supabase SQL Editor, execute:
UPDATE bookings
SET status = 'paid'
WHERE stripe_session_id = 'SEU_SESSION_ID_AQUI'
```

---

## ✅ Próximos Passos

1. Verifique os logs do webhook no Stripe
2. Verifique os logs da Edge Function no Supabase
3. Me envie o que você encontrar

Com essas informações, posso ajudar a resolver o problema específico!

