import { helpFetch } from '../api/helpFetch';

const fetch = helpFetch();

// ============================================
// BOLETINES
// ============================================

/**
 * Obtiene todos los boletines del año académico
 * @param {number} academicYearId - ID del año académico
 * @returns {Promise<Array>}
 */
export const getBoletines = async (academicYearId) => {
  try {
    let endpoint = '/api/boletines';
    if (academicYearId) {
      endpoint += `?academicYearId=${academicYearId}`;
    }
    const response = await fetch.get(endpoint);
    if (response.ok && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error en getBoletines:", error);
    return [];
  }
};

/**
 * Activa/desactiva la disponibilidad de un boletín
 * @param {number} boletinId - ID del boletín
 * @param {boolean} disponible - Estado de disponibilidad
 * @returns {Promise<Object>}
 */
export const toggleBoletinDisponible = async (boletinId, disponible) => {
  try {
    const response = await fetch.put(`/api/boletines/${boletinId}`, { disponible });
    return response;
  } catch (error) {
    console.error("Error en toggleBoletinDisponible:", error);
    throw error;
  }
};

/**
 * Activa todos los boletines del año
 * @param {number} academicYearId - ID del año académico
 * @returns {Promise<Object>}
 */
export const habilitarTodosBoletines = async (academicYearId) => {
  try {
    const response = await fetch.post('/api/boletines/habilitar-todos', { academicYearId });
    return response;
  } catch (error) {
    console.error("Error en habilitarTodosBoletines:", error);
    throw error;
  }
};

/**
 * Verifica si hay notas pendientes de validación
 * @param {number} academicYearId - ID del año académico
 * @returns {Promise<boolean>}
 */
export const verificarNotasPendientes = async (academicYearId) => {
  try {
    const response = await fetch.get(`/api/notas/verificar-pendientes?academicYearId=${academicYearId}`);
    return response.ok ? response.data.hayPendientes : true;
  } catch (error) {
    console.error("Error en verificarNotasPendientes:", error);
    return true; // Por seguridad, si hay error asumimos que hay pendientes
  }
};