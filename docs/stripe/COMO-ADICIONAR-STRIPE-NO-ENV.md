# 📝 Como Adicionar Stripe no .env Existente

## ✅ Você pode usar o `.env` que já tem!

Não precisa criar `.env.local` se já tem um `.env` funcionando. Só precisa **adicionar** a linha do Stripe.

---

## 🎯 Passo a Passo

### 1. Abrir o arquivo `.env`

Abra o arquivo `.env` que você já tem no projeto.

### 2. Adicionar a linha do Stripe

Adicione esta linha no final do arquivo:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SShvlHs27Q72lAkBHUxNNyoBLu4tkwtDCZlgy9cQJSgDJCM8Gu7sKVRjccy60XrMCNk31ZE9fTobD74VIBDLmVY00SwaDmlpT
```

### 3. Formato Final

Seu `.env` deve ficar assim (exemplo):

```env
VITE_SUPABASE_URL=https://tyhqjxaguwuamyftdqth.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SShvlHs27Q72lAkBHUxNNyoBLu4tkwtDCZlgy9cQJSgDJCM8Gu7sKVRjccy60XrMCNk31ZE9fTobD74VIBDLmVY00SwaDmlpT
```

### 4. Reiniciar o Servidor

```powershell
# Pare o servidor (Ctrl+C) e reinicie
npm run dev
```

---

## 🤔 Por que `.env.local`?

- **`.env`**: Carregado sempre, pode ser commitado (não recomendado)
- **`.env.local`**: Carregado sempre, **NUNCA** commitado (mais seguro)

**Mas ambos funcionam!** Se você já usa `.env` e está no `.gitignore`, pode continuar usando.

---

## ✅ Pronto!

Agora o Stripe está configurado no seu `.env`!

