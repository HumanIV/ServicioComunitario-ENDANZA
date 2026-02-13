import { helpFetch } from '../api/helpFetch';

const fetch = helpFetch();

// ============================================
// SECCIONES (CURSOS)
// ============================================

/**
 * Obtiene todas las secciones, opcionalmente filtradas por año académico
 * @param {number} academicYearId - ID del año académico
 * @returns {Promise<Array>}
 */
export const listSections = async (academicYearId) => {
  try {
    let endpoint = '/api/sections';
    if (academicYearId) {
      endpoint += `?academicYearId=${academicYearId}`;
    }
    
    const response = await fetch.get(endpoint);
    if (response.ok && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error en listSections:", error);
    return [];
  }
};

/**
 * Obtiene una sección por ID
 * @param {number} id 
 * @returns {Promise<Object|null>}
 */
export const getSection = async (id) => {
  try {
    const response = await fetch.get(`/api/sections/${id}`);
    if (response.ok && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error en getSection:", error);
    return null;
  }
};

/**
 * Crea una nueva sección
 * @param {Object} sectionData 
 * @returns {Promise<Object>}
 */
export const createSection = async (sectionData) => {
  try {
    const response = await fetch.post('/api/sections', sectionData);
    return response;
  } catch (error) {
    console.error("Error en createSection:", error);
    throw error;
  }
};

/**
 * Actualiza una sección existente
 * @param {number} id 
 * @param {Object} sectionData 
 * @returns {Promise<Object>}
 */
export const updateSection = async (id, sectionData) => {
  try {
    const response = await fetch.put(`/api/sections/${id}`, sectionData);
    return response;
  } catch (error) {
    console.error("Error en updateSection:", error);
    throw error;
  }
};

/**
 * Elimina una sección
 * @param {number} id 
 * @returns {Promise<Object>}
 */
export const deleteSection = async (id) => {
  try {
    const response = await fetch.delet(`/api/sections`, id);
    return response;
  } catch (error) {
    console.error("Error en deleteSection:", error);
    throw error;
  }
};

// ============================================
// HORARIOS (SCHEDULES)
// ============================================

/**
 * Agrega un horario a una sección
 * @param {number} sectionId 
 * @param {Object} scheduleData 
 * @returns {Promise<Object>}
 */
export const addSchedule = async (sectionId, scheduleData) => {
  try {
    const response = await fetch.post(`/api/sections/${sectionId}/schedules`, scheduleData);
    return response;
  } catch (error) {
    console.error("Error en addSchedule:", error);
    throw error;
  }
};

/**
 * Elimina un horario de una sección
 * @param {number} sectionId 
 * @param {number} scheduleId 
 * @returns {Promise<Object>}
 */
export const removeSchedule = async (sectionId, scheduleId) => {
  try {
    const response = await fetch.delet(`/api/sections/${sectionId}/schedules`, scheduleId);
    return response;
  } catch (error) {
    console.error("Error en removeSchedule:", error);
    throw error;
  }
};

/**
 * Verifica disponibilidad de un aula
 * @param {Object} params 
 * @returns {Promise<Object>}
 */
export const checkClassroomAvailability = async ({ 
  academicYearId, 
  day, 
  startTime, 
  endTime, 
  classroom,
  excludeSectionId 
}) => {
  try {
    const queryParams = new URLSearchParams({
      academicYearId,
      day,
      startTime,
      endTime,
      classroom,
      ...(excludeSectionId && { excludeSectionId })
    });
    
    const response = await fetch.get(`/api/sections/check-availability?${queryParams}`);
    return response.ok ? response.data : { available: true };
  } catch (error) {
    console.error("Error en checkClassroomAvailability:", error);
    return { available: true }; // Por defecto, asumimos disponible si hay error
  }
};

// ============================================
// CONSTANTES (estas pueden venir del backend también)
// ============================================
export const DAYS_OF_WEEK = [
  { value: 'LUNES', label: 'Lunes' },
  { value: 'MARTES', label: 'Martes' },
  { value: 'MIÉRCOLES', label: 'Miércoles' },
  { value: 'JUEVES', label: 'Jueves' },
  { value: 'VIERNES', label: 'Viernes' }
];

export const GRADE_LEVELS = [
  { value: 'Preparatorio', label: 'Preparatorio' },
  { value: '1er Grado', label: '1er Grado' },
  { value: '2do Grado', label: '2do Grado' },
  { value: '3er Grado', label: '3er Grado' },
  { value: '4to Grado', label: '4to Grado' },
  { value: '5to Grado', label: '5to Grado' },
  { value: '6to Grado', label: '6to Grado' },
  { value: '7mo Grado', label: '7mo Grado' },
  { value: '8vo Grado', label: '8vo Grado' }
];

export const SUBJECTS = [
  { value: 'Danza Clásica', label: 'Danza Clásica' },
  { value: 'Danza Contemporánea', label: 'Danza Contemporánea' },
  { value: 'Danza Tradicional', label: 'Danza Tradicional' },
  { value: 'Danza Creativa', label: 'Danza Creativa' },
  { value: 'Preparación Física', label: 'Preparación Física' },
  { value: 'Música', label: 'Música' },
  { value: 'Historia de la Danza', label: 'Historia de la Danza' },
  { value: 'Nutrición', label: 'Nutrición' },
  { value: 'Kinesiología', label: 'Kinesiología' },
  { value: 'Francés', label: 'Francés' },
  { value: 'Composición Coreográfica', label: 'Composición Coreográfica' },
  { value: 'Danza de Carácter', label: 'Danza de Carácter' }
];

export const CLASSROOMS = [
  { value: 'Salón Rosado', label: 'Salón Rosado' },
  { value: 'Salón Azul', label: 'Salón Azul' },
  { value: 'Salón Violeta', label: 'Salón Violeta' },
  { value: 'Salón Amarillo', label: 'Salón Amarillo' },
  { value: 'Salón Blanco', label: 'Salón Blanco' },
  { value: 'Salón Gris', label: 'Salón Gris' },
  { value: 'Salón de Colores 1', label: 'Salón de Colores 1' },
  { value: 'Salón de Colores 2', label: 'Salón de Colores 2' },
  { value: 'Salón Verde', label: 'Salón Verde' },
  { value: 'Patio', label: 'Patio' },
  { value: 'Tarima', label: 'Tarima' },
  { value: 'Placa I', label: 'Placa I' },
  { value: 'Placa II', label: 'Placa II' },
  { value: 'Placa III', label: 'Placa III' },
  { value: 'Salón Nutrición', label: 'Salón Nutrición' }
];

