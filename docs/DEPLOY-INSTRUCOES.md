# 🚀 Instruções de Deploy - WorkNow MVP

## ✅ Checklist Pré-Deploy

### 1. Banco de Dados (Supabase)
- [ ] Execute `database-stripe-delta.sql` no SQL Editor do Supabase
- [ ] Execute `seed-demo.sql` (ajuste UUIDs dos perfis conforme seus usuários)
- [ ] Verifique se RLS está habilitado em todas as tabelas

### 2. Edge Functions (Supabase)
- [ ] Publique a função `checkout`:
  ```bash
  supabase functions deploy checkout
  ```
- [ ] Publique a função `stripe-webhook`:
  ```bash
  supabase functions deploy stripe-webhook
  ```
- [ ] Configure variáveis de ambiente nas Edge Functions:
  - **checkout**:
    - `STRIPE_SECRET_KEY` (sk_test_... ou sk_live_...)
    - `PUBLIC_APP_URL` (https://seu-dominio.vercel.app)
    - `SUPABASE_URL` (https://xxx.supabase.co)
    - `SUPABASE_ANON_KEY` (sua chave anon)
  - **stripe-webhook**:
    - `STRIPE_SECRET_KEY`
    - `STRIPE_WEBHOOK_SECRET` (whsec_... do Stripe)
    - `SUPABASE_URL`
    - `SUPABASE_SERVICE_ROLE_KEY` (sua service role key)

### 3. Stripe
- [ ] Crie conta no Stripe (modo teste ou produção)
- [ ] Configure webhook endpoint:
  - URL: `https://xxx.supabase.co/functions/v1/stripe-webhook`
  - Eventos: `checkout.session.completed`
  - Copie o `STRIPE_WEBHOOK_SECRET` gerado

### 4. Frontend (Vercel)
- [ ] Crie conta no Vercel (ou use CLI)
- [ ] Conecte o repositório GitHub/GitLab
- [ ] Configure variáveis de ambiente:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] Deploy automático ou manual:
  ```bash
  npm run build
  vercel --prod
  ```

## 📝 Passo a Passo Detalhado

### A. Configurar Supabase Edge Functions

1. **Instalar Supabase CLI** (se ainda não tiver):
   ```bash
   npm install -g supabase
   ```

2. **Fazer login**:
   ```bash
   supabase login
   ```

3. **Linkar projeto**:
   ```bash
   supabase link --project-ref seu-project-ref
   ```

4. **Deploy das funções**:
   ```bash
   # Deploy checkout
   supabase functions deploy checkout
   
   # Deploy webhook
   supabase functions deploy stripe-webhook
   ```

5. **Configurar secrets** (no Supabase Dashboard > Edge Functions > Secrets):
   - Vá em cada função e adicione os secrets necessários

### B. Configurar Stripe Webhook

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Clique em "Add endpoint"
3. Cole a URL da função: `https://seu-projeto.supabase.co/functions/v1/stripe-webhook`
4. Selecione evento: `checkout.session.completed`
5. Copie o `Signing secret` (whsec_...) e configure na função

### C. Deploy no Vercel

1. **Via Dashboard**:
   - Conecte repositório
   - Configure env vars
   - Deploy automático

2. **Via CLI**:
   ```bash
   npm install -g vercel
   vercel login
   vercel
   # Configure env vars quando solicitado ou depois no dashboard
   ```

## 🔒 Segurança

- ✅ RLS habilitado em todas as tabelas
- ✅ Service Role Key usado apenas no webhook (server-side)
- ✅ Webhook verifica assinatura Stripe
- ✅ Constraint de exclusão previne double-booking

## 🧪 Teste o MVP

1. **Login como Owner**:
   - Crie uma sala
   - Faça upload de imagens

2. **Login como Tenant**:
   - Busque salas
   - Filtre por preço/localização
   - Clique em "Fazer Reserva"
   - Preencha horários
   - Clique em "Confirmar Reserva" → redireciona para Stripe

3. **Pagamento (modo teste)**:
   - Use cartão de teste: `4242 4242 4242 4242`
   - Data qualquer futura
   - CVC qualquer (ex: 123)
   - Complete o pagamento

4. **Verificar**:
   - Volte ao app (`/bookings`)
   - Deve ver a reserva com status "Pago"

## 📞 Suporte

Se algo não funcionar:
1. Verifique logs das Edge Functions no Supabase Dashboard
2. Verifique webhooks no Stripe Dashboard
3. Verifique RLS policies no Supabase
4. Console do navegador para erros do frontend

---

**Status do MVP**: ✅ Pronto para demo aos investidores!

