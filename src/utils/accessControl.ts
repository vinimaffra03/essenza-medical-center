// @ts-nocheck
// Sistema de Controle de Acesso (Whitelist)
// Por enquanto, apenas emails listados aqui podem acessar o app funcional (/app/*)

export const ALLOWED_EMAILS = [
  'joaopepe@gmail.com',  // Developer
  'admin@worknow.com',   // Admin Test
  'owner1@worknow.com',  // Owner Test
  'tenant1@worknow.com', // Tenant Test
  // Mock Test Users
  'owner@test.com',      // Mock Owner
  'tenant@test.com',     // Mock Tenant
  'maria@test.com',      // Mock Tenant 2
  // Adicione novos emails aqui
];

/**
 * Verifica se um email tem permissão de acesso ao app
 * @param {string} email 
 * @returns {boolean}
 */
export const checkAccess = (email) => {
  if (!email) return false;

  // Normalizar para lowercase para evitar problemas de case sensitive
  const normalizedEmail = email.toLowerCase().trim();

  return ALLOWED_EMAILS.some(allowed => allowed.toLowerCase().trim() === normalizedEmail);
};
