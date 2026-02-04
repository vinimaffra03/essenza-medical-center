# 🎯 Configuração Completa do Stripe - WorkNow

Este guia detalha todos os passos necessários para configurar o pagamento via Stripe no WorkNow.

---

## 📋 Pré-requisitos

- ✅ Conta Stripe criada (https://stripe.com)
- ✅ Projeto Supabase configurado
- ✅ Edge Functions criadas (`checkout` e `stripe-webhook`)

---

## 🔧 Passo 1: Obter Chaves do Stripe

### 1.1 Acessar o Dashboard do Stripe

1. Acesse: https://dashboard.stripe.com
2. Faça login na sua conta

### 1.2 Obter as Chaves

#### **Modo Teste (Development)**
1. No Dashboard, certifique-se de estar em **"Test mode"** (toggle no canto superior direito)
2. Vá em **Developers** → **API keys**
3. Copie:
   - **Publishable key** (começa com `pk_test_...`) → Usar no frontend
   - **Secret key** (começa com `sk_test_...`) → Usar nas Edge Functions

#### **Modo Produção (Production)**
1. Mude para **"Live mode"** (toggle no canto superior direito)
2. Repita o processo acima
3. Use as chaves que começam com `pk_live_...` e `sk_live_...`

---

## 🔐 Passo 2: Configurar Secrets nas Edge Functions

### 2.1 Edge Function: `checkout`

1. No Supabase Dashboard, vá em **Edge Functions**
2. Clique na função **`checkout`**
3. Vá na aba **Settings** ou **Secrets**
4. Adicione os seguintes secrets:

```
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_... em produção)
PUBLIC_APP_URL=https://seu-app.vercel.app (ou http://localhost:5173 em dev)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
```

**Como adicionar:**
- Clique em **"Add secret"** ou **"Manage secrets"**
- Cole o nome e o valor de cada secret
- Salve

### 2.2 Edge Function: `stripe-webhook`

1. Vá na função **`stripe-webhook`**
2. Adicione os seguintes secrets:

```
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_... em produção)
STRIPE_WEBHOOK_SECRET=whsec_... (você obterá isso no Passo 3)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

**⚠️ IMPORTANTE:** 
- Use a **SERVICE_ROLE_KEY**, não a ANON_KEY
- A SERVICE_ROLE_KEY está em **Settings** → **API** → **service_role** (mantenha segura!)

---

## 🔗 Passo 3: Configurar Webhook no Stripe

### 3.1 Criar Webhook Endpoint

1. No Stripe Dashboard, vá em **Developers** → **Webhooks**
2. Clique em **"Add endpoint"** ou **"Create endpoint"**
3. Preencha:
   - **Endpoint URL:** `https://SEU_PROJETO.supabase.co/functions/v1/stripe-webhook`
     - Substitua `SEU_PROJETO` pelo ID do seu projeto Supabase
     - Exemplo: `https://abcdefghijklmnop.supabase.co/functions/v1/stripe-webhook`
   - **Description:** "WorkNow - Webhook para confirmar pagamentos"

### 3.2 Selecionar Eventos

1. Em **"Events to send"**, selecione:
   - ✅ **`checkout.session.completed`** (obrigatório)

2. Clique em **"Add endpoint"**

### 3.3 Obter Signing Secret

1. Após criar o endpoint, clique nele
2. Na seção **"Signing secret"**, clique em **"Reveal"** ou **"Click to reveal"**
3. Copie o valor (começa com `whsec_...`)
4. **Cole este valor no secret `STRIPE_WEBHOOK_SECRET` da Edge Function `stripe-webhook`** (Passo 2.2)

---

## 🚀 Passo 4: Fazer Deploy das Edge Functions

### 4.1 Via Supabase CLI (Recomendado)

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Fazer login
supabase login

# Linkar ao projeto
supabase link --project-ref SEU_PROJECT_ID

# Fazer deploy das funções
supabase functions deploy checkout
supabase functions deploy stripe-webhook
```

### 4.2 Via Dashboard (Alternativa)

1. No Supabase Dashboard, vá em **Edge Functions**
2. Para cada função (`checkout` e `stripe-webhook`):
   - Clique na função
   - Vá em **Deploy** ou use o editor de código
   - Certifique-se de que o código está atualizado
   - Clique em **Deploy**

---

## ✅ Passo 5: Configurar Variáveis de Ambiente no Frontend

### 5.1 Arquivo `.env.local` (Desenvolvimento)

Crie/atualize o arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (ou pk_live_... em produção)
```

### 5.2 Vercel (Produção)

1. No Vercel Dashboard, vá no seu projeto
2. Vá em **Settings** → **Environment Variables**
3. Adicione as mesmas variáveis:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
4. Faça redeploy do projeto

---

## 🧪 Passo 6: Testar o Fluxo Completo

### 6.1 Testar em Modo Desenvolvimento

1. **Iniciar o app localmente:**
   ```bash
   npm run dev
   ```

2. **Fazer uma reserva:**
   - Acesse uma sala
   - Selecione data/hora de início e término
   - Clique em "Continuar para Pagamento"

3. **Usar cartão de teste:**
   - Número: `4242 4242 4242 4242`
   - Data: Qualquer data futura (ex: `12/34`)
   - CVC: Qualquer 3 dígitos (ex: `123`)
   - CEP: Qualquer (ex: `12345-678`)

4. **Verificar resultado:**
   - Após o pagamento, você deve ser redirecionado para `/bookings?status=success`
   - A reserva deve aparecer com status **"paid"**

### 6.2 Verificar Logs

**Stripe Dashboard:**
- Vá em **Payments** → Deve aparecer o pagamento de teste

**Supabase Dashboard:**
- Vá em **Edge Functions** → **Logs**
- Verifique se não há erros nas funções `checkout` e `stripe-webhook`

**Supabase Database:**
- Vá em **Table Editor** → `bookings`
- Verifique se a reserva foi criada com:
  - `status = 'paid'`
  - `stripe_session_id` preenchido
  - `payment_intent_id` preenchido

---

## 🔍 Troubleshooting

### Erro: "Unauthorized" ao chamar checkout

**Causa:** Usuário não autenticado ou token inválido.

**Solução:**
- Verifique se o usuário está logado
- Verifique se o `Authorization` header está sendo enviado corretamente

### Erro: "Missing signature" no webhook

**Causa:** `STRIPE_WEBHOOK_SECRET` não configurado ou incorreto.

**Solução:**
- Verifique se o secret está correto na Edge Function `stripe-webhook`
- Certifique-se de copiar o `whsec_...` completo

### Pagamento concluído, mas status não muda para "paid"

**Causa:** Webhook não está sendo chamado ou há erro na função.

**Solução:**
1. Verifique os logs da Edge Function `stripe-webhook`
2. Verifique se o webhook está configurado corretamente no Stripe
3. Verifique se a URL do webhook está correta
4. Teste manualmente o webhook no Stripe Dashboard (clicando em "Send test webhook")

### Erro: "Bucket not found" ao fazer upload de imagens

**Causa:** Bucket do Supabase Storage não configurado.

**Solução:**
- Execute o script `CONFIGURAR-POLITICAS-STORAGE-FINAL.sql` no Supabase SQL Editor

---

## 📝 Checklist Final

Antes de considerar o Stripe configurado, verifique:

- [ ] Chaves do Stripe obtidas (teste e produção)
- [ ] Secrets configurados na Edge Function `checkout`
- [ ] Secrets configurados na Edge Function `stripe-webhook`
- [ ] Webhook criado no Stripe Dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` configurado corretamente
- [ ] Edge Functions deployadas
- [ ] Variáveis de ambiente configuradas no frontend (`.env.local` e Vercel)
- [ ] Teste de pagamento realizado com sucesso
- [ ] Reserva aparece como "paid" após pagamento
- [ ] Logs verificados (sem erros)

---

## 🎉 Pronto!

Se todos os itens do checklist estão marcados, o Stripe está configurado e funcionando!

O WorkNow está pronto para processar pagamentos reais (quando mudar para modo Live no Stripe).

---

## 📚 Recursos Adicionais

- [Documentação Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Documentação Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Testing](https://stripe.com/docs/testing)

