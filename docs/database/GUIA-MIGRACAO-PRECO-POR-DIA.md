# 📋 Guia de Migração: Preço por Hora → Preço por Dia

## 🎯 O que mudou?

O WorkNow agora usa **preço por dia** ao invés de preço por hora, com um sistema de **descontos progressivos** baseado na duração da reserva.

---

## 💰 Sistema de Descontos

### Tabela de Descontos

| Duração | Desconto | Exemplo (R$ 800/dia) |
|---------|----------|----------------------|
| **1 dia** | 0% | R$ 800,00 |
| **2 dias** | 5% | R$ 1.520,00 (economia de R$ 80) |
| **3 dias** | 10% | R$ 2.160,00 (economia de R$ 240) |
| **4 dias** | 15% | R$ 2.720,00 (economia de R$ 480) |
| **5 dias** | 20% | R$ 3.200,00 (economia de R$ 800) |
| **6 dias** | 25% | R$ 3.600,00 (economia de R$ 1.200) |
| **7-13 dias (1 semana)** | 15% | R$ 4.760,00 (7 dias) |
| **14-30 dias (2 semanas)** | 25% | R$ 16.800,00 (14 dias) |
| **31+ dias (1 mês)** | 35% | R$ 16.120,00 (31 dias) |

### Regras de Desconto

- **2-6 dias:** Desconto de 5% por dia adicional (máximo 25% em 6 dias)
- **7-13 dias:** Desconto fixo de 15%
- **14-30 dias:** Desconto fixo de 25%
- **31+ dias:** Desconto fixo de 35%

---

## 🔧 Como Migrar

### Passo 1: Executar Script SQL

Execute o arquivo `MIGRAR-PRECO-POR-DIA.sql` no Supabase SQL Editor:

```sql
-- Este script:
-- 1. Adiciona a coluna price_per_day
-- 2. Migra dados existentes (assumindo 8 horas = 1 dia)
-- 3. Torna a coluna obrigatória
-- 4. Adiciona constraint de validação
```

**Importante:** O script converte automaticamente os preços existentes multiplicando por 8 (assumindo 8 horas = 1 dia útil).

### Passo 2: Verificar Migração

Após executar o script, verifique se os dados foram migrados corretamente:

```sql
SELECT 
  id,
  title,
  price_per_hour as preco_antigo_por_hora,
  price_per_day as preco_novo_por_dia,
  ROUND(price_per_day / NULLIF(price_per_hour, 0), 2) as fator_conversao
FROM rooms
LIMIT 10;
```

O `fator_conversao` deve ser aproximadamente **8** para todas as salas.

### Passo 3: Atualizar Preços Manualmente (Opcional)

Se você quiser ajustar os preços manualmente:

1. Acesse o Supabase Dashboard → Table Editor → `rooms`
2. Edite o campo `price_per_day` conforme necessário
3. Salve as alterações

### Passo 4: Remover Coluna Antiga (Opcional)

**⚠️ ATENÇÃO:** Só faça isso após testar tudo e ter certeza de que está funcionando!

```sql
ALTER TABLE rooms DROP COLUMN IF EXISTS price_per_hour;
```

---

## 📝 O que foi atualizado no código?

### Frontend

- ✅ `src/lib/price.js` - Nova função `calculatePriceWithDiscounts()` com descontos
- ✅ `src/features/rooms/RoomForm.jsx` - Campo mudado para `price_per_day`
- ✅ `src/features/rooms/RoomCard.jsx` - Exibe "por dia"
- ✅ `src/features/rooms/RoomDetails.jsx` - Mostra descontos aplicados

### Backend

- ✅ `supabase/functions/checkout/index.ts` - Cálculo de preço com descontos

---

## 🧪 Como Testar

### 1. Teste de Migração

1. Execute o script SQL
2. Verifique se as salas existentes têm `price_per_day` preenchido
3. Acesse uma sala e verifique se o preço aparece como "por dia"

### 2. Teste de Descontos

1. Acesse uma sala (ex: R$ 800/dia)
2. Selecione **2 dias** → Deve mostrar desconto de 5%
3. Selecione **7 dias** → Deve mostrar desconto de 15%
4. Selecione **14 dias** → Deve mostrar desconto de 25%
5. Selecione **31 dias** → Deve mostrar desconto de 35%

### 3. Teste de Checkout

1. Faça uma reserva de 7 dias
2. Verifique se o preço no Stripe está correto (com desconto aplicado)
3. Complete o pagamento
4. Verifique se a reserva foi criada com o preço correto

---

## 📊 Exemplos de Cálculo

### Exemplo 1: Sala R$ 800/dia

**Reserva de 2 dias:**
- Preço base: R$ 800 × 2 = R$ 1.600,00
- Desconto (5%): R$ 80,00
- **Total: R$ 1.520,00**

**Reserva de 7 dias:**
- Preço base: R$ 800 × 7 = R$ 5.600,00
- Desconto (15%): R$ 840,00
- **Total: R$ 4.760,00**

**Reserva de 31 dias:**
- Preço base: R$ 800 × 31 = R$ 24.800,00
- Desconto (35%): R$ 8.680,00
- **Total: R$ 16.120,00**

---

## ⚠️ Notas Importantes

1. **Compatibilidade:** O código ainda suporta `price_per_hour` para salas antigas, mas prioriza `price_per_day`
2. **Arredondamento:** Os dias são sempre arredondados para cima (ex: 1.1 dias = 2 dias)
3. **Conversão:** A conversão padrão é 8 horas = 1 dia, mas você pode ajustar manualmente
4. **Descontos:** Os descontos são aplicados automaticamente no cálculo, não precisam ser configurados

---

## 🆘 Troubleshooting

### Problema: Preços não aparecem corretamente

**Solução:**
1. Verifique se o script SQL foi executado
2. Verifique se `price_per_day` está preenchido na tabela `rooms`
3. Limpe o cache do navegador

### Problema: Descontos não estão sendo aplicados

**Solução:**
1. Verifique se a função `calculatePriceWithDiscounts()` está sendo chamada
2. Verifique se os dias estão sendo calculados corretamente
3. Verifique os logs do console do navegador

### Problema: Erro no checkout

**Solução:**
1. Verifique se a Edge Function `checkout` foi atualizada
2. Verifique se o cálculo de preço está correto nos logs
3. Verifique se o Stripe está recebendo o valor correto

---

## ✅ Checklist de Migração

- [ ] Script SQL executado
- [ ] Dados migrados verificados
- [ ] Preços atualizados manualmente (se necessário)
- [ ] Testes de descontos realizados
- [ ] Teste de checkout realizado
- [ ] Coluna antiga removida (opcional, após testes)

---

## 🎉 Pronto!

Após completar a migração, o WorkNow estará usando preços por dia com descontos progressivos, incentivando reservas de maior duração!

