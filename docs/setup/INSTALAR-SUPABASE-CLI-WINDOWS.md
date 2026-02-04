# 🔧 Como Instalar Supabase CLI no Windows

## ❌ Problema

O comando `npm install -g supabase` **não funciona** no Windows. O Supabase CLI não suporta instalação global via npm.

## ✅ Soluções

### Opção 1: Via Scoop (Recomendado - Mais Fácil)

1. **Instalar Scoop** (se ainda não tiver):
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm get.scoop.sh | iex
   ```

2. **Instalar Supabase CLI via Scoop**:
   ```powershell
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   ```

3. **Verificar instalação**:
   ```powershell
   supabase --version
   ```

### Opção 2: Via Chocolatey

1. **Instalar Chocolatey** (se ainda não tiver):
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Instalar Supabase CLI**:
   ```powershell
   choco install supabase
   ```

### Opção 3: Download Manual (Sem Gerenciador de Pacotes)

1. **Baixar o executável**:
   - Acesse: https://github.com/supabase/cli/releases
   - Baixe o arquivo `supabase_windows_amd64.zip` (ou `supabase_windows_arm64.zip` se for ARM)

2. **Extrair e adicionar ao PATH**:
   - Extraia o arquivo
   - Adicione a pasta ao PATH do Windows
   - Ou coloque o executável em uma pasta que já está no PATH

### Opção 4: Usar npx (Sem Instalar)

Você pode usar o Supabase CLI sem instalar globalmente:

```powershell
# No diretório do projeto
npx supabase login
npx supabase link --project-ref SEU_PROJECT_ID
npx supabase functions deploy checkout
npx supabase functions deploy stripe-webhook
```

**Vantagem:** Não precisa instalar nada  
**Desvantagem:** Mais lento (baixa a cada vez)

---

## 🎯 Recomendação

**Use a Opção 1 (Scoop)** - É a mais simples e mantém o CLI atualizado automaticamente.

---

## 📝 Depois de Instalar

1. **Fazer login**:
   ```powershell
   supabase login
   ```

2. **Linkar ao projeto**:
   ```powershell
   cd C:\Dev\WorkNow
   supabase link --project-ref tyhqjxaguwuamyftdqth
   ```

3. **Deploy das funções**:
   ```powershell
   supabase functions deploy checkout
   supabase functions deploy stripe-webhook
   ```

---

## 🆘 Problemas?

Se der erro ao instalar:
- Verifique se tem permissões de administrador
- Tente executar o PowerShell como Administrador
- Use a Opção 4 (npx) como alternativa rápida

