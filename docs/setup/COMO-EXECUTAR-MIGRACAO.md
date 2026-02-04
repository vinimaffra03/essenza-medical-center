# 🚀 Como Executar a Migração de Preço

## 📍 Onde Executar?

**No Supabase Dashboard → SQL Editor**

---

## 📝 Passo a Passo

### 1. Acessar o Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto **WorkNow**

### 2. Abrir o SQL Editor

1. No menu lateral esquerdo, clique em **"SQL Editor"** (ícone de banco de dados)
2. Ou acesse diretamente: `https://supabase.com/dashboard/project/SEU_PROJECT_ID/sql`

### 3. Abrir o Script

1. Abra o arquivo `MIGRAR-PRECO-POR-DIA.sql` no seu editor de código (VS Code, etc.)
2. **Copie TODO o conteúdo** do arquivo

### 4. Colar e Executar

1. No SQL Editor do Supabase, clique em **"New query"** (ou use o editor vazio)
2. **Cole o conteúdo** do script `MIGRAR-PRECO-POR-DIA.sql`
3. Clique no botão **"RUN"** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)

### 5. Verificar Resultado

Após executar, você verá:
- ✅ Mensagem de sucesso
- 📊 Resultado da query de verificação mostrando as salas migradas

---

## 📄 Conteúdo do Script

O script `MIGRAR-PRECO-POR-DIA.sql` faz:

1. ✅ Adiciona a coluna `price_per_day` na tabela `rooms`
2. ✅ Migra os dados existentes (multiplica `price_per_hour` por 8)
3. ✅ Torna a coluna obrigatória
4. ✅ Adiciona constraint de validação (preço > 0)
5. ✅ Mostra uma verificação dos dados migrados

---

## ⚠️ Importante

- ✅ O script é **seguro** - não remove dados existentes
- ✅ Mantém `price_per_hour` para compatibilidade
- ✅ Pode ser executado múltiplas vezes (idempotente)

---

## 🧪 Verificar se Funcionou

Após executar, você verá uma tabela com:
- `id` - ID da sala
- `preco_antigo_por_hora` - Preço antigo
- `preco_novo_por_dia` - Preço novo (deve ser ~8x o antigo)
- `fator_conversao` - Deve ser aproximadamente **8**

---

## 🎯 Próximo Passo

Após executar o script:
1. ✅ Recarregue a página do app
2. ✅ Verifique se os preços aparecem como "por dia"
3. ✅ Teste criar uma nova sala
4. ✅ Teste fazer uma reserva e ver os descontos

---

## 🆘 Problemas?

Se der erro:
- Verifique se você está logado no Supabase
- Verifique se selecionou o projeto correto
- Verifique se a tabela `rooms` existe
- Copie a mensagem de erro e me envie

