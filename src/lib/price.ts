// @ts-nocheck
/**
 * Calcula o preço total de uma reserva baseado no preço por dia e intervalo de tempo
 * Aplica descontos progressivos baseados na duração:
 * - 1 dia: preço normal
 * - 2-6 dias: desconto de 5% por dia adicional (máx 25%)
 * - 7-13 dias (1 semana): desconto de 15%
 * - 14-30 dias (2 semanas): desconto de 25%
 * - 31+ dias (1 mês): desconto de 35%
 * 
 * @param {number} pricePerDay - Preço por dia da sala
 * @param {string|Date} start - Data/hora de início da reserva
 * @param {string|Date} end - Data/hora de fim da reserva
 * @returns {object} Objeto com preço total, desconto aplicado e detalhes
 */
export function calculatePriceWithDiscounts(pricePerDay, start, end) {
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  
  if (Number.isNaN(s) || Number.isNaN(e)) {
    return {
      total: 0,
      discount: 0,
      discountPercent: 0,
      days: 0,
      basePrice: 0,
      finalPrice: 0
    }
  }

  // Validar que end > start
  if (e <= s) {
    return {
      total: 0,
      discount: 0,
      discountPercent: 0,
      days: 0,
      basePrice: 0,
      finalPrice: 0
    }
  }

  // Calcular diferença em dias (arredondado para cima)
  const diffMs = e - s
  const diffHours = diffMs / (1000 * 60 * 60)
  const diffDays = diffHours / 24
  
  // Garantir mínimo de 1 dia (mesmo que seja menos de 24 horas)
  const days = Math.max(1, Math.ceil(diffDays))

  if (days <= 0) {
    return {
      total: 0,
      discount: 0,
      discountPercent: 0,
      days: 0,
      basePrice: 0,
      finalPrice: 0
    }
  }

  const basePrice = Number(pricePerDay || 0) * days
  let discountPercent = 0
  let discount = 0

  // Aplicar descontos progressivos
  if (days >= 31) {
    // 1 mês ou mais: 35% de desconto
    discountPercent = 35
  } else if (days >= 14) {
    // 2 semanas ou mais: 25% de desconto
    discountPercent = 25
  } else if (days >= 7) {
    // 1 semana ou mais: 15% de desconto
    discountPercent = 15
  } else if (days >= 2) {
    // 2-6 dias: 5% por dia adicional (máx 25% em 6 dias)
    // Dias 2-6: 5%, 10%, 15%, 20%, 25%
    discountPercent = Math.min((days - 1) * 5, 25)
  }
  // 1 dia: sem desconto (0%)

  discount = (basePrice * discountPercent) / 100
  const finalPrice = basePrice - discount

  return {
    total: Math.max(0, Math.round(finalPrice * 100)) / 100,
    discount: Math.max(0, Math.round(discount * 100)) / 100,
    discountPercent,
    days,
    basePrice: Math.round(basePrice * 100) / 100,
    finalPrice: Math.max(0, Math.round(finalPrice * 100)) / 100
  }
}

/**
 * Função de compatibilidade (mantida para não quebrar código existente)
 * Retorna apenas o preço total
 */
export function estimateTotalPriceBRL(pricePerDay, start, end) {
  const result = calculatePriceWithDiscounts(pricePerDay, start, end)
  return result.total
}

/**
 * Formata o desconto para exibição
 */
export function formatDiscount(discountPercent) {
  if (!discountPercent || discountPercent === 0) return null
  return `${discountPercent}%`
}

/**
 * Retorna uma descrição do desconto aplicado
 */
export function getDiscountDescription(days) {
  if (days >= 31) {
    return 'Desconto de 1 mês ou mais (35%)'
  } else if (days >= 14) {
    return 'Desconto de 2 semanas ou mais (25%)'
  } else if (days >= 7) {
    return 'Desconto de 1 semana ou mais (15%)'
  } else if (days >= 2) {
    return `Desconto de ${Math.min((days - 1) * 5, 25)}% (${days} dias)`
  }
  return null
}
