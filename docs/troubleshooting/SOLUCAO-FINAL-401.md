# 🔧 Solução Final: Erro 401 no Webhook

## 🐛 Problema

O erro 401 "Missing authorization header" **está vindo do Supabase antes de chegar ao nosso código**. Isso significa que o Supabase está bloqueando a requisição no nível da infraestrutura.

## ✅ Soluções (Tente nesta ordem)

### 1. Verificar no Supabase Dashboard

O `config.toml` pode não estar sendo reconhecido. Vamos verificar no Dashboard:

1. Acesse: https://supabase.com/dashboard
2. Vá em **Edge Functions** → `stripe-webhook`
3. Vá em **Settings** ou **Configuration**
4. Procure por uma opção como:
   - **"Verify JWT"** ou **"Require Authentication"**
   - **"Public Function"** ou **"Allow Unauthenticated"**
5. **Desabilite** a verificação JWT se houver essa opção

### 2. Verificar se o config.toml foi incluído

O arquivo `config.toml` precisa estar no diretório da função. Verifique:

- ✅ Arquivo existe: `supabase/functions/stripe-webhook/config.toml`
- ✅ Conteúdo: `[function]\nverify_jwt = false`

Se não estiver funcionando, tente também criar `supabase.functions.config.json`:

```json
{
  "auth": false
}
```

### 3. Fazer deploy incluindo o config.toml explicitamente

```powershell
# Verificar se o arquivo está lá
Get-Content supabase/functions/stripe-webhook/config.toml

# Fazer deploy
npx supabase functions deploy stripe-webhook
```

### 4. Alternativa: Usar Supabase CLI com flag

Alguns projetos precisam usar:

```powershell
npx supabase functions deploy stripe-webhook --no-verify-jwt
```

Mas essa flag pode não existir. Se não funcionar, ignore.

---

## 🔍 Verificar Logs

Após fazer as mudanças:

1. **Supabase Dashboard** → **Edge Functions** → `stripe-webhook` → **Logs**
2. Procure por requisições recentes
3. Veja se há erros diferentes de 401

---

## 🧪 Testar

1. **Reenvie o webhook no Stripe:**
   - Stripe Dashboard → Webhooks → Seu webhook
   - Clique no evento que falhou (401 ERR)
   - Clique em **"Reenviar"**

2. **Verifique os logs do Supabase:**
   - Deve aparecer 200 OK em vez de 401

3. **Verifique o banco:**
   - A reserva deve ter `status = 'paid'`

---

## 📝 Nota Importante

Se **nada funcionar**, pode ser que o Supabase esteja exigindo autenticação no nível da plataforma. Nesse caso:

1. Verifique se há alguma configuração de **"Project Settings"** → **"Edge Functions"** que force autenticação
2. Entre em contato com o suporte do Supabase se necessário

---

## ✅ Próximos Passos

1. Verifique o Dashboard primeiro (Passo 1)
2. Se não houver opção, tente fazer deploy novamente
3. Reenvie o webhook no Stripe
4. Me avise o resultado!

