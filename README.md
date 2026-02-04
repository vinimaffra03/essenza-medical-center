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

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Stripe](https://stripe.com) (para pagamentos - opcional)

## 🔧 Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/yourusername/worknow.git
cd worknow
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
VITE_STRIPE_PUBLISHABLE_KEY=sua_chave_publica_do_stripe
```

**Como obter as credenciais do Supabase:**
1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em **Settings > API**
4. Copie a **Project URL** e a **anon/public key**

**Como obter as credenciais do Stripe:**
1. Acesse [stripe.com](https://stripe.com) e crie uma conta
2. Vá em **Developers > API keys**
3. Copie a **Publishable key**

### 4. Configurar Banco de Dados

Execute o script SQL no **SQL Editor** do Supabase. O arquivo completo está em `database.sql` na raiz do projeto.

**Resumo das tabelas:**
- `profiles` - Perfis de usuário
- `rooms` - Salas comerciais
- `bookings` - Reservas

### 5. Configurar Storage (Imagens)

No Supabase, vá em **Storage** e crie um bucket chamado `room-images` com permissões públicas para leitura.

### 6. Executar o projeto

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
worknow/
├── src/
│   ├── components/          # Componentes UI reutilizáveis
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Loading.jsx
│   │   ├── Layout.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Toast.jsx
│   │   └── ImageUploader/
│   ├── features/           # Funcionalidades organizadas por domínio
│   │   ├── auth/           # Autenticação
│   │   │   ├── LoginScreen.jsx
│   │   │   └── RegisterScreen.jsx
│   │   ├── dashboard/      # Dashboard
│   │   │   └── Dashboard.jsx
│   │   ├── rooms/          # Gestão de salas
│   │   │   ├── useRooms.js      # Hook reutilizável
│   │   │   ├── RoomList.jsx
│   │   │   ├── RoomCard.jsx
│   │   │   ├── RoomDetails.jsx
│   │   │   ├── RoomForm.jsx
│   │   │   └── FiltersPanel.jsx
│   │   └── bookings/       # Reservas
│   │       └── BookingList.jsx
│   ├── services/           # Serviços externos
│   │   └── supabase.js
│   ├── store/              # Estado global (Zustand)
│   │   ├── useAuthStore.js
│   │   └── useBookingStore.js
│   ├── contexts/           # Contextos React
│   │   └── ToastContext.jsx
│   ├── lib/                # Utilitários
│   │   ├── availability.js
│   │   └── price.js
│   ├── App.jsx             # Rotas e estrutura principal
│   ├── main.jsx            # Entry point
│   └── index.css           # Estilos globais
├── supabase/
│   └── functions/          # Edge Functions
│       ├── checkout/
│       └── stripe-webhook/
├── database.sql            # Schema do banco de dados
├── .env.example            # Exemplo de variáveis de ambiente
├── LICENSE                 # Licença MIT
└── README.md               # Este arquivo
```

## 🏗️ Arquitetura

### Por que é facilmente migrável para React Native?

1. **Separação de Lógica e UI**: Toda lógica de negócios está em hooks (`useRooms.js`, `useAuthStore.js`) que podem ser importados diretamente no React Native
2. **Gerenciamento de Estado**: Zustand funciona nativamente no React Native sem alterações
3. **Serviços**: A configuração do Supabase é 100% reutilizável
4. **Estrutura Modular**: Features organizadas por domínio facilitam a migração

### Como migrar para React Native:

1. Criar projeto React Native: `npx create-expo-app worknow-mobile`
2. Copiar pastas reutilizáveis:
   - `/features` (hooks e lógica)
   - `/services` (configurações)
   - `/store` (estado global)
3. Reescrever apenas `/components` usando componentes nativos (`<View>`, `<Text>`)
4. Reescrever telas de UI usando os mesmos hooks

## 🔐 Autenticação

### Perfis de Usuário

- **Owner (Proprietário)**: Pode cadastrar, editar e gerenciar salas comerciais
- **Tenant (Locatário)**: Pode buscar, visualizar e reservar salas

### Proteção de Rotas

- Rotas públicas: `/login`, `/register`
- Rotas protegidas: Todas as outras rotas requerem autenticação
- Redirecionamento automático baseado no estado de autenticação

## 🚀 Deploy

### Build para produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

### Deploy no Vercel

1. Conecte seu repositório ao [Vercel](https://vercel.com)
2. Adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
3. Deploy automático a cada push

### Deploy no Netlify

1. Conecte seu repositório ao [Netlify](https://netlify.com)
2. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Adicione as variáveis de ambiente
4. Deploy automático

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**WorkNow Team**

- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Agradecimentos

- [Supabase](https://supabase.com) pela infraestrutura backend
- [Stripe](https://stripe.com) pela solução de pagamentos
- Comunidade React pelo ecossistema incrível

---

<div align="center">

Feito com ❤️ usando React e Supabase

⭐ Se este projeto foi útil, considere dar uma estrela!

</div>
