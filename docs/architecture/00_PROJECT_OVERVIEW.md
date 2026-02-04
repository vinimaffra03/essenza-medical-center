# Análise Detalhada do Projeto: WorkNow

Este documento fornece uma análise detalhada do projeto `WorkNow`, ideal para ser usado como contexto para assistentes de IA como o NotebookLLM.

## 1. Visão Geral do Projeto

- **Nome:** WorkNow
- **Descrição:** Uma plataforma web moderna para o aluguel de salas comerciais, conectando proprietários e locatários de forma eficiente.
- **Licença:** MIT

### Funcionalidades Principais:
- **Autenticação:** Cadastro e login para "Proprietários" (Owners) e "Locatários" (Tenants) usando Supabase Auth.
- **Gestão de Salas:** Proprietários podem criar, editar, deletar e gerenciar suas salas, incluindo upload de imagens e definição de preços.
- **Busca e Filtros:** Locatários podem buscar salas por texto e aplicar filtros avançados (preço, capacidade, cidade, etc.).
- **Sistema de Reservas:** Usuários podem criar, visualizar e cancelar reservas, com validação de conflitos de horário.
- **Pagamentos:** Integração com Stripe para processamento seguro de pagamentos.
- **Dashboard:** Painel com estatísticas para proprietários e visão geral de reservas.

## 2. Tecnologias Utilizadas

- **Frontend:**
  - **Framework:** React 18.3.1
  - **Roteamento:** React Router DOM 6.28.0
  - **Estilização:** Tailwind CSS 3.4.14
  - **Gerenciamento de Estado:** Zustand 4.5.5
  - **Formulários:** React Hook Form 7.53.0
  - **Validação:** Zod 3.23.8
  - **Build Tool:** Vite 5.4.8
- **Backend:**
  - **BaaS (Backend as a Service):** Supabase (Auth, Database, Storage)
  - **Pagamentos:** Stripe
- **Banco de Dados:** PostgreSQL (via Supabase)

## 3. Arquitetura do Projeto

O projeto segue uma arquitetura modular e organizada por funcionalidades, facilitando a manutenção e uma futura migração para React Native.

- **`src/components`**: Componentes de UI reutilizáveis (`Button`, `Input`, `Card`).
- **`src/features`**: Lógica de negócio e telas, separadas por domínio (`auth`, `rooms`, `bookings`).
- **`src/services`**: Configuração e inicialização de serviços externos, como o cliente Supabase (`supabase.js`).
- **`src/store`**: Armazenamento de estado global com Zustand (`useAuthStore.js`).
- **`src/lib`**: Funções utilitárias.
- **`database.sql`**: Script principal para a criação do esquema do banco de dados e políticas de segurança (RLS).

## 4. Arquivos Recomendados para Contexto

Para obter a melhor assistência de uma IA, forneça os seguintes arquivos, começando pelo `README.md`.

1.  **`01_README.md`**: O arquivo mais importante, com a visão geral completa.
2.  **`02_PACKAGE_JSON.md`**: Lista de dependências e scripts do projeto.
3.  **`03_DATABASE_SCHEMA.md`**: Estrutura do banco de dados e regras de segurança.
4.  **`04_APP_STRUCTURE.md`**: Ponto de entrada da aplicação e configuração das rotas.
5.  **`05_CORE_LOGIC.md`**: Hooks e stores centrais que contêm a maior parte da lógica de negócio.
