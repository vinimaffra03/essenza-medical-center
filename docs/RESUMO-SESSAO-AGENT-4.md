# 📝 Resumo de Sessão - WorkNow
**Data:** 10 de Dezembro de 2025
**Status:** Funcional (Beta Fechado)

Este documento serve como um ponto de salvamento para retomar o desenvolvimento sem perder contexto.

---

## 🚀 1. O Que Foi Feito Hoje

### 🔒 Segurança & Backend
1.  **Correção de RLS (Row Level Security):**
    *   Tabela `profiles`: Agora usuários só podem visualizar seu próprio perfil. Evita vazamento de dados (PII).
    *   Arquivo: `docs/database/FIX-SECURITY-AND-INTEGRITY.sql`.
2.  **Integridade de Dados (Anti-Overbooking):**
    *   Adicionada **Constraint de Exclusão** no PostgreSQL. O banco agora rejeita fisicamente reservas sobrepostas na mesma sala.
    *   Arquivo: `docs/database/FIX-OVERLAPPING-BOOKINGS.sql`.
3.  **Edge Functions (Supabase):**
    *   `checkout`: Atualizada para verificar disponibilidade no banco **antes** de gerar o link do Stripe. Retorna erro 409 se ocupado.
    *   Deploy realizado com sucesso.

### 🎨 Frontend & Arquitetura
1.  **Separação Landing Page vs App:**
    *   **Landing Page (`/`):** Totalmente pública, focada em marketing.
    *   **App (`/app/*`):** Rotas funcionais movidas para `/app/dashboard`, `/app/rooms`, etc.
2.  **Controle de Acesso (Whitelist):**
    *   Implementado em `src/utils/accessControl.js`.
    *   Apenas e-mails permitidos podem acessar as rotas `/app/*`.
    *   Usuários não autorizados são redirecionados para `/unauthorized`.
3.  **Carrossel Dinâmico:**
    *   A Landing Page agora busca as **3 salas mais recentes e ativas** do banco de dados para exibir no Hero.
    *   Fallback automático para dados de demonstração se o banco estiver vazio ou der erro.

---

## 🔑 Credenciais e Acesso

### Sistema de Whitelist Ativo
Apenas os seguintes e-mails têm acesso ao `/app`:
1.  `joaopepe@gmail.com`
2.  `admin@worknow.com`
3.  `owner1@worknow.com`
4.  `tenant1@worknow.com`

### Para Testar Agora
*   **Login:** Use `owner1@worknow.com`
*   **Senha:** `senha123` (ou a que você definiu no painel do Supabase)
*   **Fluxo:** Ao logar, você será redirecionado automaticamente para `/app/dashboard`.

---

## 📂 Arquivos Críticos Modificados

*   `src/App.jsx`: Definição das rotas protegidas e estrutura `/app`.
*   `src/utils/accessControl.js`: Lista de e-mails permitidos.
*   `src/features/landing/LandingPage.jsx`: Carrossel dinâmico e links atualizados.
*   `src/features/rooms/useRooms.js`: Nova função `fetchFeaturedRooms`.
*   `supabase/functions/checkout/index.ts`: Lógica de validação de disponibilidade.
*   `docs/database/*.sql`: Scripts de correção executados.

---

## ⚠️ Lembretes para Próxima Sessão

1.  **Testes:** Verificar se o fluxo de reserva (Booking) está redirecionando corretamente para `/app/bookings` após o sucesso do Stripe.
2.  **Emails:** Se criar novos usuários no Supabase, lembre-se de adicionar o e-mail deles em `src/utils/accessControl.js` ou eles cairão na tela de "Acesso Restrito".
3.  **Banco de Dados:** A constraint de exclusão está ativa. Se precisar testar overbooking, o banco deve retornar erro.

---

## 🛠️ Comandos Úteis

```bash
# Iniciar Frontend
npm run dev

# Deploy de Edge Functions (se alterar algo)
npx supabase functions deploy checkout
npx supabase functions deploy stripe-webhook
```
