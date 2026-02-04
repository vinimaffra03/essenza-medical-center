# 📋 Exemplo de Distribuição de Tarefas

Este arquivo mostra um exemplo prático de como distribuir as tarefas do relatório de auditoria para os agentes corretos.

## Relatório de Auditoria (Exemplo)

```
🛡️ Relatório de Auditoria de Engenharia de Software
Projeto: WorkNow
Data: 10/12/2025

1. 🚨 Vulnerabilidades Críticas

A. Vazamento de Dados de Usuários (Privacy Leak)
- Local: Banco de Dados (profiles table - RLS Policy)
- O Problema: A política RLS "Users can view all profiles" está definida como USING (true).
- Impacto: Qualquer usuário logado pode baixar o banco de dados inteiro de usuários.

B. Autenticação Frágil & Race Conditions
- Local: src/store/useAuthStore.js
- O Problema: O sistema usa setTimeout para tentar "adivinhar" quando o token está pronto.
- Impacto: Logins falham aleatoriamente em conexões lentas.

C. Vazamento de Detalhes de Erro (Info Disclosure)
- Local: supabase/functions/checkout e stripe-webhook
- O Problema: As Edge Functions retornam o objeto de erro "cru" do Stripe/Supabase.
- Impacto: Expor detalhes da infraestrutura para atacantes.

2. 🏗️ Arquitetura & Escalabilidade

A. Gargalo de Performance em Filtros
- Local: src/features/rooms/useRooms.js
- O Problema: O filtro de "comodidades" (amenities) roda no navegador do cliente.
- Impacto: Com 1.000 quartos, o app vai travar o celular do usuário.

B. Race Condition em Reservas
- Local: src/store/useBookingStore.js vs checkout function
- O Problema: Entre verificar e pagar, outro usuário pode reservar o mesmo horário.
- Solução: Utilizar "Reservas Temporárias" (locks) no banco.
```

---

## Distribuição de Tarefas

### 📌 Tarefa #1: Corrigir RLS Policy de Profiles

**Agente:** 🏗️ Agente Arquitetura

**Prioridade:** Crítico

**Contexto:**
A política RLS "Users can view all profiles" na tabela `profiles` está permitindo que qualquer usuário logado veja todos os perfis (nomes, e-mails, telefones), violando LGPD/GDPR.

**Localização:**
- Arquivo: `docs/database/database.sql` ou Supabase Dashboard
- Política: "Users can view all profiles"
- Categoria: Segurança

**Tarefa:**
Criar script SQL para corrigir a política RLS, permitindo que usuários vejam apenas seu próprio perfil (auth.uid() = id).

**Critérios de Aceite:**
- [ ] Script SQL criado e testável
- [ ] Política antiga removida (DROP POLICY)
- [ ] Nova política criada com restrição correta
- [ ] Documentação explicando o impacto da mudança

---

**Prompt para o Agente Arquitetura:**
```
Você precisa corrigir uma vulnerabilidade crítica de segurança na política RLS da tabela `profiles`. 

A política atual "Users can view all profiles" usa `USING (true)`, permitindo que qualquer usuário logado veja todos os perfis. 

Crie um script SQL que:
1. Remove a política antiga usando DROP POLICY IF EXISTS
2. Cria nova política permitindo apenas visualização do próprio perfil (auth.uid() = id)
3. Testa a política para garantir que funciona corretamente
4. Documenta o impacto da mudança

Arquivo de referência: docs/database/database.sql
```

---

### 📌 Tarefa #2: Corrigir Autenticação Frágil em useAuthStore

**Agente:** 🔧 Agente Debugger

**Prioridade:** Crítico

**Contexto:**
O sistema de autenticação usa `setTimeout` para tentar "adivinhar" quando o token está pronto, e desativou o listener `onAuthStateChange`. Isso causa falhas aleatórias de login em conexões lentas e estado desincronizado.

**Localização:**
- Arquivo: `src/store/useAuthStore.js`
- Linhas: ~100-101, ~233-262 (listener comentado)
- Categoria: Runtime Bug

**Tarefa:**
Refatorar `useAuthStore.js` para usar o listener oficial `onAuthStateChange` do Supabase ao invés de `setTimeout`, garantindo sincronização correta do estado de autenticação.

**Critérios de Aceite:**
- [ ] Remover todos os `setTimeout` relacionados a auth
- [ ] Reativar e corrigir o listener `onAuthStateChange`
- [ ] Garantir que o estado seja atualizado em tempo real
- [ ] Testar login/logout em conexões lentas

---

**Prompt para o Agente Debugger:**
```
Você precisa corrigir um bug crítico de autenticação no arquivo `src/store/useAuthStore.js`.

O problema:
- O código usa `setTimeout` (linha ~101, ~135) para tentar "adivinhar" quando o token está pronto
- O listener `onAuthStateChange` está desabilitado (linhas 233-262 comentadas)
- Isso causa falhas aleatórias de login e estado desincronizado

A solução:
1. Remover todos os `setTimeout` relacionados a autenticação
2. Reativar o listener `onAuthStateChange` do Supabase
3. Garantir que o estado seja atualizado corretamente em tempo real
4. Manter compatibilidade com o código existente

Arquivo: src/store/useAuthStore.js
```

---

### 📌 Tarefa #3: Sanitizar Erros nas Edge Functions

**Agente:** 🔧 Agente Debugger

**Prioridade:** Alto

**Contexto:**
As Edge Functions `checkout` e `stripe-webhook` retornam objetos de erro "crus" do Stripe/Supabase para o cliente, expondo detalhes da infraestrutura.

**Localização:**
- Arquivos: `supabase/functions/checkout/index.ts` (linha ~184), `supabase/functions/stripe-webhook/index.ts`
- Categoria: Segurança / Info Disclosure

**Tarefa:**
Sanitizar todos os erros retornados pelas Edge Functions, retornando mensagens genéricas para o cliente e logando detalhes apenas no servidor.

**Critérios de Aceite:**
- [ ] Erros sanitizados em `checkout/index.ts`
- [ ] Erros sanitizados em `stripe-webhook/index.ts`
- [ ] Mensagens genéricas retornadas ao cliente
- [ ] Detalhes completos logados no servidor (console.error)

---

**Prompt para o Agente Debugger:**
```
Você precisa corrigir um problema de segurança nas Edge Functions que estão expondo detalhes de erro para o cliente.

Problema:
- `supabase/functions/checkout/index.ts` (linha ~184) retorna `e?.message ?? 'unknown'` diretamente
- `supabase/functions/stripe-webhook/index.ts` também pode expor erros raw
- Isso expõe detalhes da infraestrutura para atacantes

Solução:
1. Criar função helper para sanitizar erros
2. Retornar mensagens genéricas para o cliente ("Erro ao processar pagamento")
3. Logar detalhes completos no servidor (console.error)
4. Manter CORS headers em todas as respostas

Arquivos:
- supabase/functions/checkout/index.ts
- supabase/functions/stripe-webhook/index.ts
```

---

### 📌 Tarefa #4: Mover Filtro de Amenities para Backend

**Agente:** 🏗️ Agente Arquitetura

**Prioridade:** Médio

**Contexto:**
O filtro de amenities está sendo executado no client-side (navegador), o que causará problemas de performance com 1000+ salas.

**Localização:**
- Arquivo: `src/features/rooms/useRooms.js`
- Linhas: ~66-91 (filtro client-side)
- Categoria: Performance

**Tarefa:**
Mover o filtro de amenities para o backend (PostgreSQL) usando operadores JSONB, melhorando performance e escalabilidade.

**Critérios de Aceite:**
- [ ] Filtro movido para query PostgreSQL
- [ ] Uso de operadores JSONB (@>, ?|, ?&)
- [ ] Remoção do filtro client-side
- [ ] Teste com múltiplas amenities

---

**Prompt para o Agente Arquitetura:**
```
Você precisa otimizar o filtro de amenities que está rodando no client-side, causando problemas de performance.

Problema atual:
- `src/features/rooms/useRooms.js` (linhas 66-91) filtra amenities no navegador
- Com 1000+ salas, isso trava o celular do usuário

Solução:
1. Mover filtro para query PostgreSQL usando operadores JSONB
2. Usar `amenities @> '["wifi"]'::jsonb` ou `amenities ?| array['wifi', 'ac']`
3. Remover filtro client-side (linhas 86-91)
4. Manter compatibilidade com filtros existentes

Arquivo: src/features/rooms/useRooms.js
Referência: PostgreSQL JSONB operators
```

---

### 📌 Tarefa #5: Implementar Lock de Reservas (Race Condition)

**Agente:** 🏗️ Agente Arquitetura

**Prioridade:** Alto

**Contexto:**
Existe uma race condition entre verificar disponibilidade e criar a reserva, permitindo que dois usuários reservem o mesmo horário.

**Localização:**
- Arquivos: `src/store/useBookingStore.js` (linha ~76-86), `supabase/functions/checkout/index.ts`
- Categoria: Race Condition / Segurança

**Tarefa:**
Implementar sistema de "reservas temporárias" (locks) no banco de dados com expiração de 15 minutos, garantindo que apenas um usuário possa reservar um horário por vez.

**Critérios de Aceite:**
- [ ] Tabela ou coluna para locks temporários
- [ ] Lock criado antes do checkout
- [ ] Expiração automática de 15 minutos
- [ ] Limpeza de locks expirados

---

**Prompt para o Agente Arquitetura:**
```
Você precisa corrigir uma race condition crítica no sistema de reservas que permite reservas duplicadas.

Problema:
- Entre verificar disponibilidade e criar reserva, outro usuário pode reservar o mesmo horário
- Isso acontece em `useBookingStore.js` (verificação) e `checkout/index.ts` (criação)

Solução:
1. Criar sistema de "reservas temporárias" (locks) no banco
2. Lock criado assim que usuário inicia checkout (status='locked')
3. Expiração automática de 15 minutos
4. Verificação de lock antes de criar reserva definitiva
5. Limpeza periódica de locks expirados (cron job ou trigger)

Arquivos:
- src/store/useBookingStore.js
- supabase/functions/checkout/index.ts
- Script SQL para adicionar coluna/tabela de locks
```

---

## Resumo da Distribuição

| Tarefa | Agente | Prioridade | Tipo |
|--------|--------|------------|------|
| #1: RLS Policy | 🏗️ Arquitetura | Crítico | Segurança |
| #2: useAuthStore | 🔧 Debugger | Crítico | Runtime Bug |
| #3: Sanitizar Erros | 🔧 Debugger | Alto | Segurança |
| #4: Filtro Amenities | 🏗️ Arquitetura | Médio | Performance |
| #5: Race Condition | 🏗️ Arquitetura | Alto | Segurança |

---

**Como usar:** Copie cada prompt específico e cole no agente correto para resolver o problema.

