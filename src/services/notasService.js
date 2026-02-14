import { helpFetch } from '../api/helpFetch';

const fetch = helpFetch();

// ============================================
// NOTAS PENDIENTES DE VALIDACIÓN
// ============================================

/**
 * Obtiene todas las notas pendientes de validación
 * @param {number} academicYearId - ID del año académico
 * @returns {Promise<Array>}
 */
export const getNotasPendientes = async (academicYearId) => {
  try {
    let endpoint = '/api/notas/pendientes';
    if (academicYearId) {
      endpoint += `?academicYearId=${academicYearId}`;
    }
    const response = await fetch.get(endpoint);
    if (response.ok && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error en getNotasPendientes:", error);
    return [];
  }
};

/**
 * Aprueba una nota pendiente
 * @param {number} notaId - ID de la nota
 * @returns {Promise<Object>}
 */
export const aprobarNota = async (notaId) => {
  try {
    const response = await fetch.put(`/api/notas/${notaId}/aprobar`);
    return response;
  } catch (error) {
    console.error("Error en aprobarNota:", error);
    throw error;
  }
};

/**
 * Rechaza una nota pendiente
 * @param {number} notaId - ID de la nota
 * @returns {Promise<Object>}
 */
export const rechazarNota = async (notaId) => {
  try {
    const response = await fetch.put(`/api/notas/${notaId}/rechazar`);
    return response;
  } catch (error) {
    console.error("Error en rechazarNota:", error);
    throw error;
  }
};

/**
 * Aprueba todas las notas pendientes de una vez
 * @returns {Promise<Object>}
 */
export const aprobarTodasNotas = async () => {
  try {
    const response = await fetch.post('/api/notas/aprobar-todas');
    return response;
  } catch (error) {
    console.error("Error en aprobarTodasNotas:", error);
    throw error;
  }
};