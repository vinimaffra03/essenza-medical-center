# WorkNow - README Original

Este é o conteúdo do arquivo `README.md` original do projeto.

---

# 🏢 WorkNow - Plataforma de Locação de Salas Comerciais

<div align="center">

![WorkNow Logo](https://via.placeholder.com/200x60/3b82f6/ffffff?text=WorkNow)

**Plataforma moderna para locação de salas comerciais. Conecte proprietários e locatários de forma simples e eficiente.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple.svg)](https://stripe.com)

</div>

## 📋 Sobre o Projeto

WorkNow é uma plataforma completa de locação de salas comerciais que permite:

- **Proprietários** cadastrarem e gerenciarem suas salas
- **Locatários** buscarem e reservarem salas de forma rápida
- **Pagamentos** integrados via Stripe
- **Interface moderna** e responsiva

O projeto foi desenvolvido com arquitetura modular, facilitando a migração futura para React Native.

## ✨ Funcionalidades

### 🔐 Autenticação
- ✅ Login e cadastro com Supabase Auth
- ✅ Dois perfis: Proprietário (Owner) e Locatário (Tenant)
- ✅ Proteção de rotas baseada em autenticação
- ✅ Gerenciamento de perfil de usuário

### 🏢 Gestão de Salas (Proprietários)
- ✅ Criar, editar e deletar salas
- ✅ Upload de múltiplas imagens
- ✅ Configuração de preço por hora
- ✅ Definição de capacidade e comodidades
- ✅ Ativação/desativação de salas

### 🔍 Busca e Filtros (Locatários)
- ✅ Busca por texto (título, descrição, endereço)
- ✅ Filtros avançados:
  - Preço (mínimo/máximo)
  - Capacidade
  - Cidade
  - Comodidades (Wi-Fi, Ar condicionado, etc.)
- ✅ Ordenação por preço ou data

### 📅 Sistema de Reservas
- ✅ Criação de reservas com validação de conflitos
- ✅ Visualização de reservas próprias
- ✅ Cancelamento de reservas
- ✅ Cálculo automático de preço

### 💳 Pagamentos
- ✅ Integração com Stripe Checkout
- ✅ Processamento seguro de pagamentos
- ✅ Webhook para atualização de status

### 📊 Dashboard
- ✅ Estatísticas para proprietários
- ✅ Visão geral de reservas
- ✅ Métricas de uso

## 🚀 Tecnologias

- **Frontend:**
  - React 18.3.1
  - React Router DOM 6.28.0
  - Tailwind CSS 3.4.14
  - Lucide React (Ícones)

- **Estado e Formulários:**
  - Zustand 4.5.5 (Gerenciamento de estado)
  - React Hook Form 7.53.0
  - Zod 3.23.8 (Validação)

- **Backend:**
  - Supabase (Auth, Database, Storage)
  - Stripe (Pagamentos)

- **Build Tools:**
  - Vite 5.4.8
  - ESLint

## 🔧 Instalação e Configuração
... (O restante do README segue o mesmo padrão do original) ...
