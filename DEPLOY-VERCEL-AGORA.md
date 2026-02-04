# 🚀 Deploy no Vercel - Próximos Passos

## ✅ GitHub Configurado!
- Repositório: https://github.com/DeLazzari808/worknow
- Branch main: ✅ Push completo

---

## 🎯 Passo 1: Conectar no Vercel (5 min)

1. **Acesse:** https://vercel.com
2. **Faça login** com GitHub (mesma conta)
3. **Clique em:** "Add New..." → "Project"
4. **Importe o repositório:**
   - Procure por `DeLazzari808/worknow`
   - Clique em **"Import"**

---

## ⚙️ Passo 2: Configurar Build (Automático)

O Vercel detecta Vite automaticamente:
- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Install Command: `npm install`

**Não precisa mudar nada!** Clique em **"Deploy"** ou configure as variáveis primeiro.

---

## 🔐 Passo 3: Adicionar Variáveis de Ambiente (5 min)

**ANTES de fazer deploy**, vá em **"Environment Variables"** e adicione:

### Variáveis Obrigatórias:

```
Nome: VITE_SUPABASE_URL
Valor: https://tyhqjxaguwuamyftdqth.supabase.co
Ambiente: Production, Preview, Development (marque todos)

Nome: VITE_SUPABASE_ANON_KEY
Valor: [cole sua chave anon do Supabase]
Ambiente: Production, Preview, Development (marque todos)

Nome: VITE_STRIPE_PUBLISHABLE_KEY
Valor: pk_test_51SShvlHs27Q72lAkBHUxNNyoBLu4tkwtDCZlgy9cQJSgDJCM8Gu7sKVRjccy60XrMCNk31ZE9fTobD74VIBDLmVY00SwaDmlpT
Ambiente: Production, Preview, Development (marque todos)
```

**Como obter VITE_SUPABASE_ANON_KEY:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie a **"anon public" key**

---

## 🚀 Passo 4: Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde ~2-3 minutos
3. Quando terminar, você verá:
   - ✅ **"Deployment successful"**
   - 🌐 **URL:** `https://worknow-xxxxx.vercel.app`

---

## 🔧 Passo 5: Atualizar Edge Function (5 min)

Após o deploy, você terá uma URL do Vercel. Atualize a Edge Function:

1. **No Supabase Dashboard:**
   - Vá em **Edge Functions** → **checkout**
   - Clique em **Settings** (ou **Secrets**)
   - Encontre `PUBLIC_APP_URL`
   - Atualize para: `https://worknow-xxxxx.vercel.app` (sua URL do Vercel)
   - Salve

---

## ✅ Passo 6: Testar

1. Acesse a URL do Vercel
2. Verifique:
   - ✅ Landing Page carrega (`/`)
   - ✅ Botão "Teste Agora" funciona
   - ✅ Login funciona
   - ✅ Listagem de salas aparece
   - ✅ Imagens carregam
   - ✅ Checkout Stripe abre

---

## 🎉 Pronto!

Seu MVP está no ar e pronto para apresentar para investidores!

**URL de produção:** `https://worknow-xxxxx.vercel.app`

---

## 📝 Checklist Final

- [ ] Repositório GitHub criado ✅
- [ ] Código pushado ✅
- [ ] Vercel conectado ao GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] Edge Function atualizada
- [ ] Testes realizados

---

**Tempo total estimado: ~20 minutos**

