# 🔒 Segurança do Webhook Stripe

## ✅ Configuração Atual

O toggle **"Verify JWT with legacy secret"** está **OFF** (desabilitado) para a função `stripe-webhook`.

**Isso está CORRETO e SEGURO** para webhooks do Stripe.

---

## 🔐 Por que é Seguro?

Mesmo sem JWT, o webhook está protegido por **3 camadas de segurança**:

### 1. ✅ Validação de Assinatura do Stripe
```typescript
const sig = req.headers.get('stripe-signature')
event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)
```
- O Stripe assina cada webhook com um hash único
- Apenas o Stripe conhece o `STRIPE_WEBHOOK_SECRET`
- Se a assinatura não corresponder, a requisição é rejeitada

### 2. ✅ Verificação do Webhook Secret
- O `STRIPE_WEBHOOK_SECRET` é um secret único gerado pelo Stripe
- Está armazenado como **secret** no Supabase (não exposto)
- Apenas requisições com assinatura válida são processadas

### 3. ✅ Validação do Evento
- Apenas eventos `checkout.session.completed` são processados
- O evento é validado pelo Stripe antes de chegar na função

---

## 🛡️ Comparação de Segurança

| Método | JWT | Stripe Signature |
|--------|-----|------------------|
| **Quem valida?** | Supabase | Stripe SDK |
| **Secret único?** | ✅ Sim | ✅ Sim |
| **Proteção contra replay?** | ❌ Não | ✅ Sim (timestamp) |
| **Proteção contra falsificação?** | ✅ Sim | ✅ Sim |
| **Adequado para webhooks?** | ❌ Não | ✅ Sim |

**Conclusão:** A validação de assinatura do Stripe é **mais segura** que JWT para webhooks.

---

## ⚠️ Warnings do Security Advisor

### 1. Function Search Path Mutable
- **Aviso:** Função `update_updated_at_column` tem `search_path` mutável
- **Impacto:** Não afeta o webhook
- **Ação:** Pode ser corrigido depois (não urgente)

### 2. Leaked Password Protection Disabled
- **Aviso:** Proteção contra senhas vazadas está desabilitada
- **Impacto:** Usuários podem usar senhas comprometidas
- **Ação Recomendada:** Habilitar em **Settings** → **Auth** → **Password Protection**

---

## ✅ Checklist de Segurança

- [x] JWT desabilitado para webhook (correto)
- [x] Validação de assinatura Stripe implementada
- [x] `STRIPE_WEBHOOK_SECRET` configurado como secret
- [x] Apenas eventos `checkout.session.completed` processados
- [x] `SERVICE_ROLE_KEY` configurada como secret
- [ ] Leaked Password Protection habilitada (recomendado)

---

## 🚀 Próximos Passos

1. **Testar o webhook:**
   - Reenvie o webhook no Stripe
   - Deve funcionar agora (sem erro 401)

2. **Habilitar Leaked Password Protection (opcional mas recomendado):**
   - Settings → Auth → Password Protection
   - Habilitar "Leaked password protection"

3. **Corrigir Function Search Path (opcional):**
   - Pode ser feito depois, não é urgente

---

## 📝 Nota Final

A configuração atual do webhook está **segura e correta**. O erro 401 deve estar resolvido agora que o JWT está desabilitado.

