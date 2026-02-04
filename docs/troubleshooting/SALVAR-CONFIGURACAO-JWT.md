# ⚠️ IMPORTANTE: Salvar Configuração JWT no Dashboard

## 🐛 Problema

O erro 401 "Missing authorization header" ainda está aparecendo porque o toggle **"Verify JWT with legacy secret"** não foi **SALVO** no Dashboard.

## ✅ Solução

### 1. Acessar o Dashboard

1. Acesse: https://supabase.com/dashboard/project/tyhqjxaguwuamyftdqth/functions
2. Clique na função **`stripe-webhook`**
3. Vá na aba **"Details"**

### 2. Verificar o Toggle

Na seção **"Function Configuration"**, você verá:

- **"Verify JWT with legacy secret"**
- Um **toggle switch** ao lado

### 3. Garantir que está OFF

- O toggle deve estar na posição **OFF** (esquerda, cinza)
- Se estiver ON (direita, verde), **clique nele para desligar**

### 4. SALVAR (CRÍTICO!)

- **Role até o final da página**
- Clique no botão **"Save changes"** (verde)
- **AGUARDE** a confirmação de que foi salvo

### 5. Verificar

- Após salvar, o toggle deve permanecer **OFF**
- A página deve mostrar uma mensagem de sucesso

---

## ⚠️ ATENÇÃO

**Apenas mudar o toggle NÃO é suficiente!** Você **DEVE** clicar em **"Save changes"** para que a configuração seja aplicada.

---

## 🧪 Testar Após Salvar

1. **Aguarde 10-15 segundos** após salvar
2. **Reenvie o webhook no Stripe:**
   - Stripe Dashboard → Webhooks → Seu webhook
   - Clique no evento que falhou (401 ERR)
   - Clique em **"Reenviar"**
3. **Verifique os logs:**
   - Deve aparecer 200 OK em vez de 401

---

## ✅ Pronto!

Após salvar a configuração, o erro 401 deve desaparecer!

