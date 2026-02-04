# 🎨 Como Adicionar a Logo do WorkNow

## 📍 Onde Salvar

Salve a logo na pasta: **`public/assets/images/`**

### Nomes de arquivo recomendados:
- `logo.svg` (recomendado - melhor qualidade)
- `logo.png` (alternativa)
- `logo-dark.svg` (versão escura - opcional)
- `logo-light.svg` (versão clara - opcional)

## 📋 Passos

### 1. Salvar a Logo
1. Copie o arquivo da logo
2. Cole na pasta `public/assets/images/`
3. Renomeie para `logo.svg` ou `logo.png`

### 2. Verificar se Funcionou
Após salvar, a logo será usada automaticamente em:
- ✅ Navbar do aplicativo
- ✅ Favicon do navegador
- ✅ README do projeto (se configurado)

## 🎯 Formatos Suportados

- **SVG** ⭐ (recomendado)
  - Melhor qualidade
  - Escalável sem perda
  - Menor tamanho de arquivo
  
- **PNG**
  - Use com fundo transparente
  - Tamanho mínimo: 200x60px para navbar
  - Tamanho para favicon: 32x32px ou 64x64px

## 🔧 Uso no Portfólio

Para usar no seu portfólio:

1. **Copie a logo** de `public/assets/images/logo.svg` (ou `.png`)
2. **Use diretamente** no seu projeto de portfólio
3. **Ou exporte** para uma pasta de assets do portfólio

### Exemplo de uso em HTML/React:
```jsx
// No seu portfólio
<img src="/assets/worknow-logo.svg" alt="WorkNow Logo" />
```

### Exemplo de uso com caminho absoluto:
```jsx
// Se salvar no portfólio
import worknowLogo from './assets/worknow-logo.svg'

<img src={worknowLogo} alt="WorkNow Logo" />
```

## 📝 Nota

O código já está preparado para usar a logo automaticamente quando você salvar o arquivo. Não precisa fazer mais nada além de salvar o arquivo na pasta correta!

