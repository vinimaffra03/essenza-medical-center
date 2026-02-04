# 🤖 Sistema de Agentes - WorkNow

Esta pasta contém os prompts e documentação para o sistema de múltiplos agentes do WorkNow.

## 📋 Visão Geral

O sistema utiliza **4 agentes especializados** para manter e melhorar o projeto:

1. **🤖 Agente Analista** - Realiza auditorias técnicas e identifica problemas
2. **🎨 Agente Designer** - Melhora UI/UX e experiência do usuário
3. **🔧 Agente Debugger** - Corrige erros de console e bugs técnicos
4. **🏗️ Agente Arquitetura** - Trabalha com backend, banco de dados e infraestrutura

## 📁 Arquivos

- **`00-SISTEMA-DISTRIBUICAO.md`** - Sistema para distribuir tarefas do relatório de auditoria para os agentes corretos
- **`01-AGENTE-ANALISTA.md`** - Prompt completo do Agente Analista
- **`02-AGENTE-DESIGNER.md`** - Prompt completo do Agente Designer
- **`03-AGENTE-DEBUGGER.md`** - Prompt completo do Agente Debugger
- **`04-AGENTE-ARQUITETURA.md`** - Prompt completo do Agente Arquitetura
- **`EXEMPLO-DISTRIBUICAO.md`** - Exemplo prático de distribuição de tarefas

## 🚀 Como Usar

### 1. Análise Inicial (Agente Analista)
```
Copie o conteúdo de `01-AGENTE-ANALISTA.md` e cole no chat do Agente Analista.
Peça para ele analisar o código/projeto.
```

### 2. Distribuição de Tarefas
```
Copie o conteúdo de `00-SISTEMA-DISTRIBUICAO.md` e cole no chat.
Cole o relatório do Agente Analista e peça para distribuir as tarefas.
```

### 3. Resolução de Problemas
```
Para cada tarefa distribuída, copie o prompt específico e cole no agente correto:
- Problemas de UI/UX → Agente Designer
- Erros de console → Agente Debugger
- RLS, Edge Functions, Database → Agente Arquitetura
```

## 📊 Fluxo de Trabalho

```
1. Agente Analista
   ↓
   [Relatório de Auditoria]
   ↓
2. Sistema de Distribuição
   ↓
   [Tarefas Distribuídas]
   ↓
3. Agentes Especializados
   ├─→ Agente Designer (UI/UX)
   ├─→ Agente Debugger (Erros)
   └─→ Agente Arquitetura (Backend)
```

## 🎯 Mapeamento Rápido

| Tipo de Problema | Agente Responsável |
|-----------------|-------------------|
| RLS Policy, SQL, Database | 🏗️ Arquitetura |
| Edge Functions, Backend Security | 🏗️ Arquitetura |
| Erros de Console, Runtime Bugs | 🔧 Debugger |
| CORS, 401, 403, Network Errors | 🔧 Debugger |
| useAuthStore, State Management | 🔧 Debugger |
| UI/UX, Design, Acessibilidade | 🎨 Designer |
| Responsividade, Feedback Visual | 🎨 Designer |

---

**Última atualização:** Janeiro 2025

