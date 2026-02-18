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
 * Aprueba todas las notas pendientes de una sección
 * @param {number} sectionId - ID de la sección
 * @returns {Promise<Object>}
 */
export const aprobarNota = async (sectionId) => {
  try {
    const response = await fetch.put(`/api/notas/${sectionId}/aprobar`);
    return response;
  } catch (error) {
    console.error("Error en aprobarNota:", error);
    throw error;
  }
};

/**
 * Rechaza todas las notas pendientes de una sección
 * @param {number} sectionId - ID de la sección
 * @returns {Promise<Object>}
 */
export const rechazarNota = async (sectionId) => {
  try {
    const response = await fetch.put(`/api/notas/${sectionId}/rechazar`);
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