// src/services/students.js
import { helpFetch } from '../api/helpFetch';

const fetch = helpFetch();

// ============================================
// ESTUDIANTES - Versión final con estructura del backend
// ============================================

/**
 * Obtiene todos los estudiantes
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
      return response.data; // Devolvemos exactamente lo que viene del backend
    }
    return [];
  } catch (error) {
    console.error("Error en listStudents:", error);
    return [];
  }
};

/**
 * Obtiene un estudiante por ID
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
 */
export const deleteStudent = async (id) => {
  try {
    const response = await fetch.delet(`/api/students/${id}`);
    return response;
  } catch (error) {
    console.error("Error en deleteStudent:", error);
    throw error;
  }
};

/**
 * Inscribe un estudiante en una sección
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

/**
 * Busca estudiantes
 */
export const searchStudents = async (query) => {
  try {
    const response = await fetch.get(`/api/students/search?q=${encodeURIComponent(query)}`);
    if (response.ok && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error en searchStudents:", error);
    return [];
  }
};