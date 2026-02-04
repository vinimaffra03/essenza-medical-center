# 🚀 Guia Completo de Deploy - WorkNow MVP

Este guia detalha todos os passos necessários para fazer deploy do WorkNow MVP para produção, pronto para apresentar a investidores.

---

## 📋 Checklist Pré-Deploy

Antes de fazer o deploy, certifique-se de que:

- [ ] ✅ Todas as funcionalidades principais estão funcionando localmente
- [ ] ✅ Edge Functions (`checkout` e `stripe-webhook`) estão deployadas no Supabase
- [ ] ✅ Banco de dados está configurado e populado com dados de teste
- [ ] ✅ Storage bucket (`rooms-images`) está configurado com RLS correto
- [ ] ✅ Variáveis de ambiente estão documentadas
- [ ] ✅ Build de produção funciona sem erros (`npm run build`)
- [ ] ✅ Logo está na pasta `public/assets/images/`
- [ ] ✅ Landing Page está implementada e funcionando na rota `/`

---

## 🎯 Opção 1: Deploy no Vercel (Recomendado)

### Passo 1: Preparar o Projeto

1. **Verificar se o build funciona:**
   ```powershell
   npm run build
   ```
   
   Se houver erros, corrija antes de continuar.

2. **Verificar arquivos importantes:**
   - ✅ `package.json` tem script `build`
   - ✅ `vite.config.js` está configurado
   - ✅ `.gitignore` inclui `.env*` e `node_modules`

### Passo 2: Criar Conta no Vercel

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"** (recomendado) ou crie conta com email
4. Autorize o Vercel a acessar seus repositórios

### Passo 3: Conectar Repositório

1. No Dashboard do Vercel, clique em **"Add New..."** → **"Project"**
2. Se você já tem o código no GitHub:
   - Selecione o repositório `WorkNow`
   - Clique em **"Import"**
3. Se você ainda não tem no GitHub:
   - Crie um repositório no GitHub
   - Faça push do código:
     ```powershell
     git init
     git add .
     git commit -m "Initial commit - MVP ready"
     git branch -M main
     git remote add origin https://github.com/SEU_USUARIO/worknow.git
     git push -u origin main
     ```
   - Depois, importe no Vercel

### Passo 4: Configurar Build no Vercel

O Vercel detecta automaticamente projetos Vite, mas verifique:

- **Framework Preset:** Vite
- **Build Command:** `npm run build` (automático)
- **Output Directory:** `dist` (automático)
- **Install Command:** `npm install` (automático)

### Passo 5: Configurar Variáveis de Ambiente

No Vercel Dashboard, vá em **Settings** → **Environment Variables** e adicione:

#### Para Produção (Production):

```env
VITE_SUPABASE_URL=https://tyhqjxaguwuamyftdqth.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (ou pk_live_... em produção)
```

**Como adicionar:**
1. Clique em **"Add New"**
2. Digite o nome da variável (ex: `VITE_SUPABASE_URL`)
3. Cole o valor
4. Selecione **"Production"** (e opcionalmente Preview/Development)
5. Clique em **"Save"**
6. Repita para todas as variáveis

**⚠️ IMPORTANTE:**
- Use chaves de **produção** do Stripe (`pk_live_...`) se quiser processar pagamentos reais
- Use chaves de **teste** (`pk_test_...`) para demonstração para investidores
- A `VITE_SUPABASE_ANON_KEY` é a mesma para dev e produção

### Passo 6: Atualizar Edge Functions para Produção

As Edge Functions precisam saber a URL de produção:

1. **No Supabase Dashboard:**
   - Vá em **Edge Functions** → **checkout** → **Settings**
   - Atualize o secret `PUBLIC_APP_URL`:
     ```
     PUBLIC_APP_URL=https://seu-app.vercel.app
     ```
   - Substitua `seu-app.vercel.app` pela URL que o Vercel gerar

2. **Atualizar Webhook do Stripe:**
   - No Stripe Dashboard → **Developers** → **Webhooks**
   - Edite o webhook existente
   - Atualize a URL se necessário (geralmente não precisa mudar)
   - Certifique-se de que está apontando para:
     ```
     https://tyhqjxaguwuamyftdqth.supabase.co/functions/v1/stripe-webhook
     ```

### Passo 7: Fazer Deploy

1. No Vercel, clique em **"Deploy"**
2. Aguarde o build completar (geralmente 1-3 minutos)
3. Quando terminar, você verá:
   - ✅ **"Deployment successful"**
   - 🌐 **URL do site:** `https://seu-app.vercel.app`

### Passo 8: Verificar Deploy

1. **Acesse a URL gerada** e teste:
   - ✅ Login funciona
   - ✅ Listagem de salas carrega
   - ✅ Imagens aparecem
   - ✅ Reservas funcionam
   - ✅ Checkout do Stripe abre

2. **Verificar Console do Navegador:**
   - Abra DevTools (F12)
   - Vá em **Console**
   - Não deve haver erros relacionados a variáveis de ambiente

3. **Testar Fluxo Completo:**
   - Criar conta
   - Fazer login
   - Buscar salas
   - Criar reserva
   - Processar pagamento de teste

---

## 🎯 Opção 2: Deploy no Netlify

### Passo 1: Criar Conta no Netlify

1. Acesse: https://netlify.com
2. Clique em **"Sign up"**
3. Escolha **"Sign up with GitHub"** (recomendado)

### Passo 2: Conectar Repositório

1. No Dashboard, clique em **"Add new site"** → **"Import an existing project"**
2. Selecione seu repositório do GitHub
3. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** (deixe vazio)

### Passo 3: Configurar Variáveis de Ambiente

1. Vá em **Site settings** → **Environment variables**
2. Adicione as mesmas variáveis do Vercel:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_STRIPE_PUBLISHABLE_KEY
   ```

### Passo 4: Deploy

1. Clique em **"Deploy site"**
2. Aguarde o build
3. Acesse a URL gerada: `https://seu-app.netlify.app`

---

## 🔧 Configurações Adicionais

### Domínio Personalizado (Opcional)

**No Vercel:**
1. Vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `worknow.com.br`)
3. Siga as instruções de DNS

**No Netlify:**
1. Vá em **Domain settings**
2. Adicione domínio customizado
3. Configure DNS conforme instruções

### Configurar Redirects (SPA)

Crie arquivo `vercel.json` na raiz (para Vercel):

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Ou `public/_redirects` (para Netlify):

```
/*    /index.html   200
```

---

## ✅ Checklist Pós-Deploy

Após o deploy, verifique:

- [ ] ✅ **Landing Page** carrega na rota `/` sem erros
- [ ] ✅ Botão "Teste Agora" redireciona para `/register`
- [ ] ✅ Botão "Entrar" redireciona para `/login`
- [ ] ✅ Site carrega sem erros
- [ ] ✅ Login e cadastro funcionam
- [ ] ✅ Listagem de salas aparece
- [ ] ✅ Imagens das salas carregam
- [ ] ✅ Filtros e busca funcionam
- [ ] ✅ Criação de reservas funciona
- [ ] ✅ Checkout do Stripe abre corretamente
- [ ] ✅ Webhook do Stripe recebe eventos
- [ ] ✅ Reservas aparecem após pagamento
- [ ] ✅ Dashboard do proprietário funciona
- [ ] ✅ Calendário de gestão funciona

---

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"

**Causa:** Variáveis de ambiente não foram configuradas no Vercel/Netlify.

**Solução:**
1. Verifique se todas as variáveis estão em **Settings** → **Environment Variables**
2. Certifique-se de que começam com `VITE_`
3. Faça um novo deploy após adicionar

### Erro: "Failed to fetch" ao criar reserva

**Causa:** Edge Function `checkout` não está deployada ou `PUBLIC_APP_URL` está errado.

**Solução:**
1. Verifique se a função está deployada no Supabase
2. Verifique o secret `PUBLIC_APP_URL` na função `checkout`
3. Certifique-se de que a URL está correta (com `https://`)

### Imagens não aparecem

**Causa:** Storage bucket não está público ou RLS está bloqueando.

**Solução:**
1. No Supabase → **Storage** → **rooms-images**
2. Verifique se o bucket está público
3. Execute o script `CONFIGURAR-POLITICAS-STORAGE-FINAL.sql` novamente

### Webhook do Stripe retorna 401

**Causa:** JWT verification está habilitado na função `stripe-webhook`.

**Solução:**
1. No Supabase Dashboard → **Edge Functions** → **stripe-webhook**
2. Vá em **Settings**
3. Certifique-se de que **"Verify JWT"** está **OFF**
4. Ou verifique se `config.toml` existe com `verify_jwt = false`

---

## 📝 URLs Importantes

Após o deploy, você terá:

- **Frontend:** `https://seu-app.vercel.app` (ou `.netlify.app`)
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Vercel Dashboard:** https://vercel.com/dashboard

---

## 🎯 Próximos Passos

Após o deploy bem-sucedido:

1. ✅ **Teste completo:** Faça um teste end-to-end completo
2. ✅ **Documente:** Anote a URL de produção
3. ✅ **Landing Page:** A Landing Page já está implementada na rota `/` com botão "Teste Agora"
4. ✅ **Apresentação:** Prepare demo para investidores usando a Landing Page como ponto de entrada

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no Vercel/Netlify
2. Verifique os logs das Edge Functions no Supabase
3. Verifique o console do navegador (F12)
4. Consulte os guias de troubleshooting acima

---

**🎉 Parabéns! Seu MVP está no ar!**

