-# 🚀 Como Rodar o App Localmente

## Passo 1: Verificar se tem .env

Se já tem o arquivo `.env` na raiz com suas credenciais do Supabase, pule para o Passo 2.

Se não tem, crie o arquivo `.env` na raiz com:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-key
```

## Passo 2: Instalar dependências (se ainda não instalou)

Abra o terminal na pasta do projeto e rode:
```bash
npm install
```

## Passo 3: Iniciar o servidor

```bash
npm run dev
```

## Passo 4: Abrir no navegador

O terminal vai mostrar algo como:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Abra:** http://localhost:5173

## ✅ Pronto!

Você vai ver a tela de login. Use suas credenciais do Supabase para entrar.

---

## 🐛 Se der erro:

### Erro: "Cannot find module"
```bash
# Delete node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Missing environment variables"
- Verifique se o arquivo `.env` está na raiz (mesma pasta do package.json)
- Verifique se as variáveis começam com `VITE_`
- Reinicie o servidor (`Ctrl+C` e `npm run dev` novamente)

### Porta já em uso?
```bash
# Use outra porta
npm run dev -- --port 3000


---

## 📝 Rotas disponíveis:

- `/login` - Login
- `/register` - Cadastro
- `/dashboard` - Dashboard (após login)
- `/rooms` - Lista de salas
- `/rooms/new` - Criar nova sala (owner)
- `/rooms/:id` - Detalhes da sala
- `/bookings` - Minhas reservas

