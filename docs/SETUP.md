# 🚀 Setup Rápido - WorkNow

## Passo a Passo para Começar

### 1. Instalar Dependências
```bash
npm install
```
✅ Concluído!

### 2. Configurar Supabase

**A. Criar Conta no Supabase**
1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Aguarde a criação (pode levar alguns minutos)

**B. Obter Credenciais**
1. No dashboard do Supabase, vá em **Settings > API**
2. Copie:
   - `Project URL` (ex: https://xxxxx.supabase.co)
   - `anon` `public` key

**C. Criar Arquivo .env**
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### 3. Configurar Banco de Dados

**A. No Supabase Dashboard:**
1. Vá em **SQL Editor** (ícone do menu lateral)
2. Clique em **New Query**
3. Abra o arquivo `database.sql` deste projeto
4. Copie e cole o conteúdo
5. Clique em **RUN** (ou pressione Ctrl+Enter)

**B. Verificar Tabelas Criadas:**
1. Vá em **Table Editor** (ícone do menu lateral)
2. Você deve ver 3 tabelas: `profiles`, `rooms`, `bookings`

### 4. Executar o Projeto

```bash
npm run dev
```

O app estará disponível em: **http://localhost:5173**

### 5. Testar a Aplicação

**A. Criar Conta de Proprietário:**
1. Acesse http://localhost:5173
2. Vá em "Cadastre-se"
3. Escolha "Proprietário"
4. Preencha os dados e crie a conta

**B. Criar Conta de Locatário:**
1. Faça logout
2. Vá em "Cadastre-se" novamente
3. Escolha "Locatário"
4. Crie uma nova conta

**C. Testar Funcionalidades:**
1. **Como Proprietário**: Adicionar salas
2. **Como Locatário**: Buscar e reservar salas

## 📁 Estrutura Criada

```
WorkNow/
├── src/
│   ├── components/          # UI reutilizáveis
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Loading.jsx
│   │   ├── Layout.jsx
│   │   └── EmptyState.jsx
│   ├── features/
│   │   ├── auth/            # Autenticação
│   │   │   ├── LoginScreen.jsx
│   │   │   └── RegisterScreen.jsx
│   │   ├── dashboard/       # Dashboard
│   │   │   └── Dashboard.jsx
│   │   ├── rooms/           # Salas
│   │   │   ├── useRooms.js  # ⭐ Hook reutilizável
│   │   │   ├── RoomList.jsx
│   │   │   ├── RoomCard.jsx
│   │   │   └── RoomDetails.jsx
│   │   └── bookings/         # Reservas
│   │       └── BookingList.jsx
│   ├── services/
│   │   └── supabase.js      # Config Supabase
│   ├── store/               # Zustand stores
│   │   ├── useAuthStore.js  # ⭐ Hook reutilizável
│   │   └── useBookingStore.js
│   ├── App.jsx              # Rotas e navegação
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind CSS
├── database.sql              # Schema do banco
├── README.md                 # Documentação completa
└── package.json
```

## ✅ Checklist de Setup

- [x] Dependências instaladas
- [ ] Conta Supabase criada
- [ ] Arquivo .env configurado
- [ ] Banco de dados criado (database.sql)
- [ ] Aplicação rodando localmente
- [ ] Conta de teste criada

## 🎯 Próximos Passos (Futuro)

Para migrar para React Native:

1. **Criar projeto React Native**
```bash
npx create-expo-app worknow-mobile
```

2. **Copiar código reutilizável**
- ✅ `src/features/*` (hooks e lógica)
- ✅ `src/services/*` (configurações)
- ✅ `src/store/*` (estado global)

3. **Reescrever UI** (usando componentes nativos)
- 🔄 `src/components/*` (adaptar para View, Text, etc)
- 🔄 Telas de UI (usar os mesmos hooks!)

4. **Pronto!** 🎉

## 🐛 Troubleshooting

**Erro: "Missing Supabase environment variables"**
→ Verifique se o arquivo `.env` existe e tem as variáveis corretas

**Erro: "relation does not exist"**
→ Execute o arquivo `database.sql` no SQL Editor do Supabase

**App não carrega dados**
→ Verifique as políticas RLS no Supabase Dashboard

## 📞 Suporte

Se tiver problemas, verifique:
1. Console do navegador (F12)
2. Network tab (F12)
3. Supabase Dashboard > Logs

