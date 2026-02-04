# ⚡ Quick Start - WorkNow MVP

## 🎯 Setup Rápido (30 minutos)

### 1. Banco de Dados (5 min)
```sql
-- No Supabase Dashboard > SQL Editor, execute:
```
1. Abra `database-stripe-delta.sql` e execute no SQL Editor
2. Abra `seed-demo.sql`, ajuste os UUIDs (pegar de `auth.users`) e execute

### 2. Edge Functions (10 min)
```bash
# Instalar Supabase CLI (se necessário)
npm install -g supabase

# Login
supabase login

# Linkar projeto
supabase link --project-ref SEU_PROJECT_REF

# Deploy
supabase functions deploy checkout
supabase functions deploy stripe-webhook
```

**Configurar Secrets** (Supabase Dashboard > Edge Functions):
- **checkout**: `STRIPE_SECRET_KEY`, `PUBLIC_APP_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- **stripe-webhook**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### 3. Stripe (5 min)
1. Crie conta em https://stripe.com
2. Vá em Webhooks > Add endpoint
3. URL: `https://SEU_PROJECT.supabase.co/functions/v1/stripe-webhook`
4. Evento: `checkout.session.completed`
5. Copie o `Signing secret` → configure em `stripe-webhook` secrets

### 4. Vercel (10 min)
```bash
# Via CLI
npm install -g vercel
vercel login
vercel

# Ou via Dashboard:
# 1. Conecte repositório
# 2. Configure env vars:
#    - VITE_SUPABASE_URL
#    - VITE_SUPABASE_ANON_KEY
# 3. Deploy
```

### 5. Teste (5 min)
1. Login como Owner → Criar sala
2. Login como Tenant → Buscar → Reservar → Pagar (cartão teste: 4242 4242 4242 4242)
3. Verificar reserva marcada como "Pago"

## ✅ Pronto!

Siga `DEPLOY-INSTRUCOES.md` para detalhes completos.

