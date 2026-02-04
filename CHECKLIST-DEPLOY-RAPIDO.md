# ✅ Checklist Rápido de Deploy - WorkNow

## 🎯 Passos para Deploy no Vercel

### 1️⃣ Preparação (5 min)
- [ ] Build local funciona: `npm run build`
- [ ] Código commitado no Git
- [ ] Repositório no GitHub criado/push feito

### 2️⃣ Vercel Setup (10 min)
- [ ] Criar conta em https://vercel.com
- [ ] Conectar repositório GitHub
- [ ] Importar projeto WorkNow

### 3️⃣ Variáveis de Ambiente (5 min)
No Vercel → Settings → Environment Variables, adicionar:

```
VITE_SUPABASE_URL=https://tyhqjxaguwuamyftdqth.supabase.co
VITE_SUPABASE_ANON_KEY=[sua-chave-anon]
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SShvlHs27Q72lAkBHUxNNyoBLu4tkwtDCZlgy9cQJSgDJCM8Gu7sKVRjccy60XrMCNk31ZE9fTobD74VIBDLmVY00SwaDmlpT
```

### 4️⃣ Atualizar Edge Functions (5 min)
No Supabase Dashboard → Edge Functions → checkout → Settings:
- Atualizar `PUBLIC_APP_URL` para: `https://seu-app.vercel.app`

### 5️⃣ Deploy (2 min)
- [ ] Clicar em "Deploy" no Vercel
- [ ] Aguardar build completar
- [ ] Copiar URL gerada

### 6️⃣ Testar (10 min)
- [ ] Acessar Landing Page (`/`)
- [ ] Testar botão "Teste Agora"
- [ ] Fazer login
- [ ] Verificar listagem de salas
- [ ] Testar criação de reserva
- [ ] Verificar checkout Stripe

---

## 📝 URLs Importantes

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Stripe Dashboard:** https://dashboard.stripe.com

---

## 🆘 Problemas Comuns

**Build falha:**
- Verificar variáveis de ambiente
- Verificar se `npm run build` funciona localmente

**Imagens não aparecem:**
- Verificar Storage bucket `rooms-images` está público
- Verificar RLS policies

**Checkout não funciona:**
- Verificar `PUBLIC_APP_URL` na Edge Function `checkout`
- Verificar se função está deployada

---

**Tempo total estimado: ~40 minutos**

