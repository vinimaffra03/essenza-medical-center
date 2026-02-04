# 📅 Calendário de Gerenciamento de Sala

## ✅ O que foi implementado

### 1. **Calendário Interativo**
- Visualização mensal com navegação entre meses
- Diferentes cores para diferentes tipos de eventos:
  - 🟢 **Verde**: Reservas pagas
  - 🟡 **Amarelo**: Reservas pendentes
  - 🔵 **Azul**: Períodos de faxina
  - 🟠 **Laranja**: Períodos de manutenção
  - 🔴 **Vermelho**: Períodos indisponíveis

### 2. **Gerenciamento de Reservas**
- Visualizar todas as reservas da sala
- Ver detalhes completos de cada reserva (cliente, período, valor, status)
- Cancelar reservas diretamente do calendário
- Clique em qualquer reserva para ver detalhes

### 3. **Períodos de Faxina/Manutenção**
- Adicionar períodos de faxina, manutenção ou indisponibilidade
- Visualizar no calendário com cores diferentes
- Deletar períodos clicando diretamente no evento
- Formulário simples para criar novos períodos

### 4. **Interface Interativa**
- Tabs para alternar entre "Detalhes da Sala" e "Calendário e Reservas"
- Modal para detalhes de reservas
- Modal para adicionar períodos de faxina
- Legenda de cores para fácil identificação

---

## 🚀 Como Usar

### 1. Executar o Script SQL

Primeiro, execute o script para criar a tabela de períodos de faxina:

```sql
-- Execute no Supabase SQL Editor
-- Arquivo: CRIAR-TABELA-FAXINA.sql
```

### 2. Acessar o Calendário

1. Faça login como **proprietário** (owner)
2. Vá em **Salas** → Clique em uma das suas salas
3. Clique na aba **"Calendário e Reservas"**

### 3. Adicionar Período de Faxina

1. No calendário, clique em **"+ Adicionar Período de Faxina"**
2. Preencha:
   - **Tipo**: Faxina, Manutenção ou Indisponível
   - **Data/Hora de Início**
   - **Data/Hora de Término**
   - **Observações** (opcional)
3. Clique em **"Adicionar Período"**

### 4. Visualizar Reservas

- **Clique em qualquer dia** com reserva para ver detalhes
- No modal, você pode:
  - Ver informações do cliente
  - Ver período e valor
  - Ver status da reserva
  - **Cancelar reserva** (se necessário)

### 5. Deletar Período de Faxina

- **Clique diretamente** no período de faxina no calendário
- Confirme a exclusão

---

## 🎨 Funcionalidades

### Calendário
- ✅ Navegação entre meses (setas)
- ✅ Destaque do dia atual
- ✅ Visualização de múltiplos eventos por dia
- ✅ Cores diferentes para cada tipo de evento

### Reservas
- ✅ Lista todas as reservas da sala
- ✅ Mostra nome do cliente e horário
- ✅ Diferencia por status (pago, pendente, cancelado)
- ✅ Modal com detalhes completos
- ✅ Opção de cancelar reserva

### Períodos de Faxina
- ✅ Criar períodos de faxina/manutenção/indisponibilidade
- ✅ Visualizar no calendário
- ✅ Deletar períodos
- ✅ Não conflita com reservas existentes

---

## 📝 Notas Técnicas

### Tabela `maintenance_periods`
- Armazena períodos de faxina, manutenção e indisponibilidade
- Tem RLS (Row Level Security) configurado
- Apenas proprietários da sala podem gerenciar

### Integração
- O calendário busca reservas e períodos de faxina automaticamente
- Atualiza em tempo real após criar/deletar eventos
- Usa `date-fns` para manipulação de datas

---

## 🔧 Próximas Melhorias (Opcional)

1. **Editar reservas**: Permitir alterar datas de reservas existentes
2. **Notificações**: Alertar sobre conflitos de horário
3. **Exportar calendário**: Exportar para Google Calendar/ICS
4. **Estatísticas**: Mostrar ocupação mensal, receita, etc.
5. **Filtros**: Filtrar por tipo de evento no calendário

---

## ✅ Pronto!

O calendário está totalmente funcional e integrado na página de detalhes da sala para proprietários!

