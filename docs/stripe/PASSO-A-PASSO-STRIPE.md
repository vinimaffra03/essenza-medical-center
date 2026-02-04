# 🎯 Passo a Passo: Configurar Stripe (Ordem Correta)

## 📋 Checklist Rápido

Siga esta ordem para configurar o Stripe corretamente:

- [ ] 1. Obter chaves do Stripe
- [ ] 2. Criar Edge Functions no Supabase
- [ ] 3. Configurar Secrets nas Edge Functions
- [ ] 4. Fazer Deploy das Edge Functions
- [ ] 5. Configurar Webhook no Stripe
- [ ] 6. Testar

---

## 🔧 Passo 1: Obter Chaves do Stripe

1. Acesse: https://dashboard.stripe.com
2. Faça login
3. Certifique-se de estar em **"Test mode"** (toggle no canto superior direito)
4. Vá em **Developers** → **API keys**
5. Copie:
   - **Publishable key** (`pk_test_...`) → Vai no `.env.local`
   - **Secret key** (`sk_test_...`) → Vai nas Edge Functions

---

## 🔧 Passo 2: Criar Edge Functions no Supabase

### 2.1 Instalar Supabase CLI (se ainda não tiver)

```bash
npm install -g supabase
```

### 2.2 Fazer Login

```bash
supabase login
```

### 2.3 Linkar ao Projeto

```bash
# No diretório do projeto
cd C:\Dev\WorkNow
supabase link --project-ref SEU_PROJECT_ID
```

**Onde encontrar o Project ID:**
- Supabase Dashboard → Settings → General → Reference ID

### 2.4 Verificar se as Funções Existem

As funções já devem estar em:
- `supabase/functions/checkout/index.ts`
- `supabase/functions/stripe-webhook/index.ts`

Se não existirem, crie as pastas e arquivos.

---

## 🔧 Passo 3: Configurar Secrets nas Edge Functions

### 3.1 No Supabase Dashboard

1. Vá em **Edge Functions** → **Settings** (ou **Secrets**)
2. Para a função **`checkout`**, adicione:

```
STRIPE_SECRET_KEY=sk_test_... (cole sua chave secreta)
PUBLIC_APP_URL=http://localhost:5173 (ou sua URL de produção)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
```

3. Para a função **`stripe-webhook`**, adicione:

```
STRIPE_SECRET_KEY=sk_test_... (mesma chave)
STRIPE_WEBHOOK_SECRET=whsec_... (você obterá isso no Passo 5)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

**⚠️ IMPORTANTE:** 
- `SUPABASE_SERVICE_ROLE_KEY` está em **Settings** → **API** → **service_role** (mantenha segura!)

---

## 🔧 Passo 4: Fazer Deploy das Edge Functions

### 4.1 Via CLI (Recomendado)

```bash
# No diretório do projeto
cd C:\Dev\WorkNow

# Deploy da função checkout
supabase functions deploy checkout

# Deploy da função stripe-webhook
supabase functions deploy stripe-webhook
```

### 4.2 Verificar Deploy

1. No Supabase Dashboard → **Edge Functions**
2. Você deve ver `checkout` e `stripe-webhook` listadas
3. Clique em cada uma para verificar se está deployada

---

## 🔧 Passo 5: Configurar Webhook no Stripe

### 5.1 Criar Webhook Endpoint

1. No Stripe Dashboard → **Developers** → **Webhooks**
2. Clique em **"Add endpoint"**
3. Preencha:
   - **Endpoint URL:** `https://SEU_PROJECT_ID.supabase.co/functions/v1/stripe-webhook`
     - Substitua `SEU_PROJECT_ID` pelo ID do seu projeto Supabase
     - Exemplo: `https://tyhqjxaguwuamyftdqth.supabase.co/functions/v1/stripe-webhook`
   - **Description:** "WorkNow - Webhook para confirmar pagamentos"

### 5.2 Selecionar Eventos

1. Em **"Events to send"**, selecione:
   - ✅ **`checkout.session.completed`**

2. Clique em **"Add endpoint"**

### 5.3 Obter Signing Secret

1. Após criar, clique no endpoint
2. Na seção **"Signing secret"**, clique em **"Reveal"**
3. Copie o valor (`whsec_...`)
4. **Volte ao Passo 3.1** e adicione como `STRIPE_WEBHOOK_SECRET` na função `stripe-webhook`

---

## 🔧 Passo 6: Configurar Variáveis de Ambiente no Frontend

### 6.1 Arquivo `.env.local`

Crie/atualize o arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (cole sua chave pública)
```

### 6.2 Reiniciar o Servidor

```bash
# Pare o servidor (Ctrl+C) e reinicie
npm run dev
```

---

## 🧪 Passo 7: Testar

1. **Recarregue a página** do app
2. **Selecione uma sala**
3. **Preencha data/hora**
4. **Clique em "Continuar para Pagamento"**
5. **Deve redirecionar para o Stripe Checkout**

### Cartão de Teste

- Número: `4242 4242 4242 4242`
- Data: Qualquer data futura (ex: `12/34`)
- CVC: Qualquer 3 dígitos (ex: `123`)
- CEP: Qualquer (ex: `12345-678`)

---

## 🆘 Troubleshooting

### Erro: "Failed to send a request to the Edge Function"

**Causa:** Edge Function não deployada ou CORS não configurado.

**Solução:**
1. Verifique se fez deploy: `supabase functions deploy checkout`
2. Verifique se a função aparece no Dashboard
3. Verifique os logs da função no Dashboard

### Erro: "Unauthorized"

**Causa:** Secrets não configurados corretamente.

**Solução:**
1. Verifique se todos os secrets estão configurados
2. Verifique se as chaves estão corretas (sem espaços extras)
3. Verifique se `SUPABASE_ANON_KEY` está correto

### Erro: CORS

**Causa:** Edge Function não permite requisições do localhost.

**Solução:**
- As Edge Functions do Supabase já permitem CORS por padrão
- Se ainda der erro, verifique se a função foi deployada corretamente

---

## ✅ Pronto!

Após seguir todos os passos, o Stripe deve estar funcionando!

Se ainda tiver problemas, me envie:
1. Mensagem de erro completa
2. Screenshot do console do navegador
3. Logs da Edge Function (Supabase Dashboard → Edge Functions → Logs)

