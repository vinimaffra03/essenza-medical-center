// @ts-nocheck
/**
 * Utilities para verificação de disponibilidade e cálculos de tempo
 */

/**
 * Verifica se dois intervalos de tempo se sobrepõem
 * @param {string|Date} aStart - Início do primeiro intervalo
 * @param {string|Date} aEnd - Fim do primeiro intervalo
 * @param {string|Date} bStart - Início do segundo intervalo
 * @param {string|Date} bEnd - Fim do segundo intervalo
 * @returns {boolean} True se os intervalos se sobrepõem
 */
export function intervalsOverlap(aStart, aEnd, bStart, bEnd) {
  const aS = new Date(aStart).getTime()
  const aE = new Date(aEnd).getTime()
  const bS = new Date(bStart).getTime()
  const bE = new Date(bEnd).getTime()
  if (Number.isNaN(aS) || Number.isNaN(aE) || Number.isNaN(bS) || Number.isNaN(bE)) return false
  return aS < bE && aE > bS
}

/**
 * Calcula a diferença em horas entre duas datas
 * @param {string|Date} start - Data/hora de início
 * @param {string|Date} end - Data/hora de fim
 * @returns {number} Diferença em horas (pode ser decimal)
 */
export function diffHours(start, end) {
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  if (Number.isNaN(s) || Number.isNaN(e) || e <= s) return 0
  return (e - s) / (1000 * 60 * 60)
}

