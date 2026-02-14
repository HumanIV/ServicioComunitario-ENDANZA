import { helpFetch } from '../api/helpFetch';

const fetch = helpFetch();

// ============================================
// ESTUDIANTES
// ============================================

/**
 * Obtiene todos los estudiantes
 * @param {Object} filters - { academicYearId, sectionId, etc }
 * @returns {Promise<Array>}
 */
export const listStudents = async (filters = {}) => {
  try {
    let endpoint = '/api/students';
    const params = new URLSearchParams();
    
    if (filters.academicYearId) params.append('academicYearId', filters.academicYearId);
    if (filters.sectionId) params.append('sectionId', filters.sectionId);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    const response = await fetch.get(endpoint);
    if (response.ok && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error en listStudents:", error);
    return [];
  }
};

/**
 * Obtiene un estudiante por ID
 * @param {number} id 
 * @returns {Promise<Object|null>}
 */
export const getStudent = async (id) => {
  try {
    const response = await fetch.get(`/api/students/${id}`);
    if (response.ok && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error en getStudent:", error);
    return null;
  }
};

/**
 * Crea un nuevo estudiante
 * @param {Object} studentData 
 * @returns {Promise<Object>}
 */
export const createStudent = async (studentData) => {
  try {
    const response = await fetch.post('/api/students', studentData);
    return response;
  } catch (error) {
    console.error("Error en createStudent:", error);
    throw error;
  }
};

/**
 * Actualiza un estudiante
 * @param {number} id 
 * @param {Object} studentData 
 * @returns {Promise<Object>}
 */
export const updateStudent = async (id, studentData) => {
  try {
    const response = await fetch.put(`/api/students/${id}`, studentData);
    return response;
  } catch (error) {
    console.error("Error en updateStudent:", error);
    throw error;
  }
};

/**
 * Elimina un estudiante
 * @param {number} id 
 * @returns {Promise<Object>}
 */
export const deleteStudent = async (id) => {
  try {
    const response = await fetch.delet(`/api/students`, id);
    return response;
  } catch (error) {
    console.error("Error en deleteStudent:", error);
    throw error;
  }
};

/**
 * Inscribe un estudiante en una sección
 * @param {number} studentId 
 * @param {number} sectionId 
 * @param {number} academicYearId 
 * @returns {Promise<Object>}
 */
export const enrollStudent = async (studentId, sectionId, academicYearId) => {
  try {
    const response = await fetch.post('/api/students/enroll', {
      studentId,
      sectionId,
      academicYearId
    });
    return response;
  } catch (error) {
    console.error("Error en enrollStudent:", error);
    throw error;
  }
};