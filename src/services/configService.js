import { helpFetch } from '../api/helpFetch';

const fetch = helpFetch();

// ============================================
// AÑOS ACADÉMICOS
// ============================================

/**
 * Obtiene todos los años académicos disponibles
 * @returns {Promise<Array>} Array de objetos { id, name, status, active }
 */
export const getAvailableYears = async () => {
  try {
    const response = await fetch.get('/api/config/academic-years');
    // La respuesta del backend: { ok: true, data: [...] }
    if (response.ok && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error en getAvailableYears:", error);
    return [];
  }
};

/**
 * Obtiene el año académico activo actual
 * @returns {Promise<Object|null>} Objeto { id, name } o null
 */
export const getActiveYear = async () => {
  try {
    const response = await fetch.get('/api/config/academic-years/active');
    if (response.ok && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error en getActiveYear:", error);
    return null;
  }
};

/**
 * Crea un nuevo año académico
 * @param {string} yearName - Nombre del año en formato "YYYY-YYYY"
 * @returns {Promise<Object>} Objeto con el resultado
 */
export const addAcademicYear = async (yearName) => {
  try {
    const response = await fetch.post('/api/config/academic-years', { name: yearName });
    return response;
  } catch (error) {
    console.error("Error en addAcademicYear:", error);
    throw error;
  }
};

// ============================================
// LAPSOS
// ============================================

/**
 * Obtiene los lapsos para un año académico
 * @param {number|string} yearId - ID del año académico
 * @returns {Promise<Array>} Lista de lapsos { id, name, start_date, end_date }
 */
export const getLapsosByYear = async (yearId) => {
  try {
    const response = await fetch.get(`/api/config/academic-years/${yearId}/lapsos`);
    if (response.ok && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error en getLapsosByYear:", error);
    return [];
  }
};

// ============================================
// PERÍODO DE INSCRIPCIÓN
// ============================================

/**
 * Obtiene la configuración del período de inscripción para un año
 * @param {number|string} yearId - ID del año académico
 * @returns {Promise<Object>} Objeto { fechaInicio, fechaFin, activo }
 */
export const getEnrollmentPeriod = async (yearId) => {
  try {
    const response = await fetch.get(`/api/config/enrollment-period/${yearId}`);
    if (response.ok && response.data) {
      return response.data;
    }
    // Valores por defecto si no existe
    return { fechaInicio: '', fechaFin: '', activo: false };
  } catch (error) {
    console.error("Error en getEnrollmentPeriod:", error);
    return { fechaInicio: '', fechaFin: '', activo: false };
  }
};

/**
 * Actualiza la configuración del período de inscripción
 * @param {number|string} yearId - ID del año académico
 * @param {Object} periodData - { fechaInicio, fechaFin, activo }
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const updateEnrollmentPeriod = async (yearId, periodData) => {
  try {
    const response = await fetch.put(`/api/config/enrollment-period/${yearId}`, periodData);
    return response;
  } catch (error) {
    console.error("Error en updateEnrollmentPeriod:", error);
    throw error;
  }
};

// ============================================
// PERÍODO DE SUBIDA DE NOTAS
// ============================================

/**
 * Obtiene la configuración del período de subida de notas para un año
 * @param {number|string} yearId - ID del año académico
 * @returns {Promise<Object>} Objeto { fechaInicio, fechaFin, activo }
 */
export const getGradesPeriod = async (yearId) => {
  try {
    const response = await fetch.get(`/api/config/grades-period/${yearId}`);
    if (response.ok && response.data) {
      return response.data;
    }
    // Valores por defecto si no existe
    return { fechaInicio: '', fechaFin: '', activo: false };
  } catch (error) {
    console.error("Error en getGradesPeriod:", error);
    return { fechaInicio: '', fechaFin: '', activo: false };
  }
};

/**
 * Actualiza la configuración del período de subida de notas
 * @param {number|string} yearId - ID del año académico
 * @param {Object} periodData - { fechaInicio, fechaFin, activo }
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const updateGradesPeriod = async (yearId, periodData) => {
  try {
    const response = await fetch.put(`/api/config/grades-period/${yearId}`, periodData);
    return response;
  } catch (error) {
    console.error("Error en updateGradesPeriod:", error);
    throw error;
  }
};





/**
 * Obtiene el año académico activo actual (para representantes)
 * @returns {Promise<Object|null>} Objeto { id, name } o null
 */
export const getActiveYearPublic = async () => {
  try {
    const response = await fetch.get('/api/config/academic-years/active/public');
    if (response.ok && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error en getActiveYearPublic:", error);
    return null;
  }
};





/**
 * Obtiene la configuración del período de inscripción para un año (versión pública para representantes)
 * @param {number|string} yearId - ID del año académico
 * @returns {Promise<Object>} Objeto { fechaInicio, fechaFin, activo }
 */
export const getEnrollmentPeriodPublic = async (yearId) => {
  try {
    const response = await fetch.get(`/api/config/enrollment-period/${yearId}/public`);
    if (response.ok && response.data) {
      return response.data;
    }
    return { fechaInicio: '', fechaFin: '', activo: false };
  } catch (error) {
    console.error("Error en getEnrollmentPeriodPublic:", error);
    return { fechaInicio: '', fechaFin: '', activo: false };
  }
};