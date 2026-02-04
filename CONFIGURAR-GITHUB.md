# 🔧 Configurar Repositório GitHub para Deploy

## Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `worknow` (ou outro nome)
   - **Description:** "Plataforma moderna para locação de salas comerciais"
   - **Visibility:** Private (recomendado) ou Public
   - **NÃO marque** "Add a README file" (já temos)
   - **NÃO marque** "Add .gitignore" (já temos)
   - **NÃO marque** "Choose a license" (já temos)
3. Clique em **"Create repository"**

## Passo 2: Configurar Remote Local

Após criar o repositório, o GitHub mostrará instruções. Use estas linhas:

**Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub:**

```powershell
cd C:\Dev\WorkNow
git remote add origin https://github.com/SEU_USUARIO/worknow.git
git branch -M main
git push -u origin main
```

**Exemplo:**
Se seu usuário for `joaosilva`, use:
```powershell
git remote add origin https://github.com/joaosilva/worknow.git
```

## Passo 3: Fazer Push

```powershell
git push -u origin main
```

Se pedir autenticação:
- Use **Personal Access Token** (não senha)
- Criar token: https://github.com/settings/tokens → Generate new token (classic)
- Permissões: `repo` (acesso completo a repositórios)

## Passo 4: Verificar

```powershell
git remote -v
```

Deve mostrar:
```
origin  https://github.com/SEU_USUARIO/worknow.git (fetch)
origin  https://github.com/SEU_USUARIO/worknow.git (push)
```

---

## ✅ Depois disso, você pode:

1. Ir para o Vercel
2. Conectar o repositório GitHub
3. Fazer deploy!

