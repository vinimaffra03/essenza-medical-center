# 📝 Como Criar o Arquivo .env.local

## 🎯 Passo a Passo

### 1. Criar o Arquivo

No diretório raiz do projeto (`C:\Dev\WorkNow`), crie um arquivo chamado **`.env.local`**

**Como criar:**
- No VS Code: Clique com botão direito → New File → Digite `.env.local`
- Ou use o PowerShell:
  ```powershell
  New-Item -Path .env.local -ItemType File
  ```

### 2. Copiar o Conteúdo

Copie e cole este conteúdo no arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://tyhqjxaguwuamyftdqth.supabase.co
VITE_SUPABASE_ANON_KEY=COLE_SUA_ANON_KEY_AQUI
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SShvlHs27Q72lAkBHUxNNyoBLu4tkwtDCZlgy9cQJSgDJCM8Gu7sKVRjccy60XrMCNk31ZE9fTobD74VIBDLmVY00SwaDmlpT
```

### 3. Substituir a ANON_KEY

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie a **"anon public" key**
5. Cole no lugar de `COLE_SUA_ANON_KEY_AQUI`

### 4. Formato Final

Seu arquivo `.env.local` deve ficar assim:

```env
VITE_SUPABASE_URL=https://tyhqjxaguwuamyftdqth.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (sua chave completa)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SShvlHs27Q72lAkBHUxNNyoBLu4tkwtDCZlgy9cQJSgDJCM8Gu7sKVRjccy60XrMCNk31ZE9fTobD74VIBDLmVY00SwaDmlpT
```

### 5. Reiniciar o Servidor

Após criar/editar o arquivo:

```powershell
# Pare o servidor (Ctrl+C) e reinicie
npm run dev
```

---

## ⚠️ Importante

- ✅ O arquivo `.env.local` já está no `.gitignore` (não será commitado)
- ✅ **NUNCA** compartilhe suas chaves
- ✅ Use `VITE_` no início das variáveis (obrigatório para Vite)
- ✅ Não use aspas nas chaves (a menos que a chave tenha espaços)

---

## ✅ Verificar se Funcionou

Após reiniciar o servidor, o app deve carregar normalmente sem erros de "Missing Supabase environment variables".

