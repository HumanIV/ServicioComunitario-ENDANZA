// src/services/teacherService.js
import { teacherAPI } from '../api/teacher.api';
import { userAPI } from '../api/user.api';

// ============================================
// GESTIÓN DE DOCENTES
// ============================================

/**
 * Obtiene todos los docentes
 * @param {number} academicYearId - ID del año académico (opcional)
 */
export const getAll = async (academicYearId = null) => {
    try {
        let response;
        
        if (academicYearId) {
            response = await teacherAPI.listTeachersByYear(academicYearId);
        } else {
            response = await teacherAPI.listTeachers();
        }
        
        if (response?.ok) {
            return response.teachers || [];
        }
        console.warn('⚠️ No se pudieron obtener docentes:', response?.msg);
        return [];
    } catch (error) {
        console.error('❌ Error en getAll:', error);
        return [];
    }
};

/**
 * Obtiene un docente por ID
 * @param {number} id - ID del docente
 * @param {number} academicYearId - ID del año académico (opcional)
 */
export const getById = async (id, academicYearId = null) => {
    try {
        let response;
        
        if (academicYearId) {
            response = await teacherAPI.getTeacherByIdWithYear(id, academicYearId);
        } else {
            response = await teacherAPI.getTeacherById(id);
        }
        
        if (response?.ok) {
            return response.teacher || null;
        }
        return null;
    } catch (error) {
        console.error('❌ Error en getById:', error);
        return null;
    }
};

/**
 * Crea un nuevo docente (usuario con rol docente)
 */
export const create = async (teacherData) => {
    try {
        const response = await userAPI.createUser({
            ...teacherData,
            role: 'docente'
        });
        
        if (response?.ok) {
            return response.user;
        }
        throw new Error(response?.msg || 'Error al crear docente');
    } catch (error) {
        console.error('❌ Error en create:', error);
        throw error;
    }
};

/**
 * Actualiza un docente
 */
export const update = async (id, teacherData) => {
    try {
        const response = await teacherAPI.updateTeacher(id, teacherData);
        if (response?.ok) {
            return response.teacher;
        }
        throw new Error(response?.msg || 'Error al actualizar docente');
    } catch (error) {
        console.error('❌ Error en update:', error);
        throw error;
    }
};

/**
 * Elimina/Desactiva un docente
 */
export const remove = async (id) => {
    try {
        const response = await teacherAPI.deleteTeacher(id);
        if (response?.ok) {
            return response;
        }
        throw new Error(response?.msg || 'Error al eliminar docente');
    } catch (error) {
        console.error('❌ Error en remove:', error);
        throw error;
    }
};

// ============================================
// ASIGNACIONES DE ESPECIALIDAD Y GRADOS
// ============================================

/**
 * Asigna especialidad a un docente (versión legacy - sin año)
 * @deprecated Usar assignSpecialtyByYear en su lugar
 */
export const assignSpecialty = async (userId, specialty) => {
    console.warn('⚠️ assignSpecialty está obsoleta. Usa assignSpecialtyByYear con academicYearId');
    try {
        const response = await teacherAPI.assignSpecialty(userId, specialty);
        if (response?.ok) {
            return response.data;
        }
        throw new Error(response?.msg || 'Error al asignar especialidad');
    } catch (error) {
        console.error('❌ Error en assignSpecialty:', error);
        throw error;
    }
};

/**
 * Asigna especialidad a un docente para un año específico (NUEVO)
 * @param {number} userId - ID del usuario/docente
 * @param {number} specialtyId - ID de la especialidad
 * @param {number} academicYearId - ID del año académico
 */
export const assignSpecialtyByYear = async (userId, specialtyId, academicYearId) => {
    try {
        const response = await teacherAPI.assignSpecialtyByYear(userId, specialtyId, academicYearId);
        if (response?.ok) {
            return response.data;
        }
        throw new Error(response?.msg || 'Error al asignar especialidad');
    } catch (error) {
        console.error('❌ Error en assignSpecialtyByYear:', error);
        throw error;
    }
};

/**
 * Asigna grados a un docente para un año específico
 * @param {number} userId - ID del usuario/docente
 * @param {Array} gradeIds - Array de IDs de grados
 * @param {number} academicYearId - ID del año académico
 */
export const assignGrades = async (userId, gradeIds, academicYearId) => {
    try {
        const response = await teacherAPI.assignGrades(userId, gradeIds, academicYearId);
        if (response?.ok) {
            return {
                ...response.data,
                grades: response.data.grades || []
            };
        }
        throw new Error(response?.msg || 'Error al asignar grados');
    } catch (error) {
        console.error('❌ Error en assignGrades:', error);
        throw error;
    }
};

/**
 * Obtiene los grados asignados a un docente para un año específico
 */
export const getTeacherGrades = async (userId, academicYearId) => {
    try {
        const response = await teacherAPI.getTeacherGrades(userId, academicYearId);
        if (response?.ok) {
            return response.grades || [];
        }
        return [];
    } catch (error) {
        console.error('❌ Error en getTeacherGrades:', error);
        return [];
    }
};

/**
 * Obtiene la especialidad de un docente para un año específico
 */
export const getTeacherSpecialty = async (userId, academicYearId) => {
    try {
        // Usamos getTeacherByIdWithYear que ahora incluye specialties
        const response = await teacherAPI.getTeacherByIdWithYear(userId, academicYearId);
        if (response?.ok && response.teacher) {
            return response.teacher.specialty || null;
        }
        return null;
    } catch (error) {
        console.error('❌ Error en getTeacherSpecialty:', error);
        return null;
    }
};

// ============================================
// CATÁLOGOS - ESPECIALIDADES Y GRADOS
// ============================================

/**
 * Obtiene todas las especialidades
 */
export const getSpecialties = async () => {
    try {
        const response = await teacherAPI.getSpecialties();
        if (response?.ok) {
            return response.specialties || [];
        }
        console.warn('⚠️ No se pudieron obtener especialidades');
        return [];
    } catch (error) {
        console.error('❌ Error en getSpecialties:', error);
        return [];
    }
};

/**
 * Obtiene todos los grados
 */
export const getGrades = async () => {
    try {
        const response = await teacherAPI.getGrades();
        if (response?.ok) {
            return response.grades || [];
        }
        console.warn('⚠️ No se pudieron obtener grados');
        return [];
    } catch (error) {
        console.error('❌ Error en getGrades:', error);
        return [];
    }
};

// ============================================
// COPIAR ASIGNACIONES ENTRE AÑOS
// ============================================

/**
 * Copia todas las asignaciones de un año a otro
 */
export const copyTeacherAssignments = async (fromYearId, toYearId) => {
    try {
        const response = await teacherAPI.copyAssignments(fromYearId, toYearId);
        if (response?.ok) {
            return response;
        }
        throw new Error(response?.msg || 'Error al copiar asignaciones');
    } catch (error) {
        console.error('❌ Error en copyTeacherAssignments:', error);
        throw error;
    }
};

// ============================================
// GESTIÓN DE HORARIOS
// ============================================

/**
 * Obtiene el horario de un docente
 */
export const getTeacherSchedule = async (teacherId) => {
    try {
        const response = await teacherAPI.getTeacherSchedule(teacherId);
        if (response?.ok) {
            return response.schedule || [];
        }
        return [];
    } catch (error) {
        console.error('❌ Error en getTeacherSchedule:', error);
        return [];
    }
};

/**
 * Asigna un horario a un docente
 */
export const assignSchedule = async (teacherId, scheduleData) => {
    try {
        const response = await teacherAPI.assignSchedule(teacherId, scheduleData);
        if (response?.ok) {
            return response.data;
        }
        throw new Error(response?.msg || 'Error al asignar horario');
    } catch (error) {
        console.error('❌ Error en assignSchedule:', error);
        throw error;
    }
};

/**
 * Elimina un horario de un docente
 */
export const removeSchedule = async (teacherId, scheduleId) => {
    try {
        const response = await teacherAPI.removeSchedule(teacherId, scheduleId);
        if (response?.ok) {
            return response;
        }
        throw new Error(response?.msg || 'Error al eliminar horario');
    } catch (error) {
        console.error('❌ Error en removeSchedule:', error);
        throw error;
    }
};

// ============================================
// RUTAS ESPECÍFICAS DEL DOCENTE (PERFIL)
// ============================================

/**
 * Obtiene el horario personal del docente (desde su perfil)
 */
export const getMySchedule = async (userId) => {
    try {
        const response = await teacherAPI.getMySchedule(userId);
        if (response?.ok) {
            return response.schedule || [];
        }
        return [];
    } catch (error) {
        console.error('❌ Error en getMySchedule:', error);
        return [];
    }
};

/**
 * Obtiene los estudiantes del docente
 */
export const getMyStudents = async (userId) => {
    try {
        const response = await teacherAPI.getMyStudents(userId);
        if (response?.ok) {
            return response.students || [];
        }
        return [];
    } catch (error) {
        console.error('❌ Error en getMyStudents:', error);
        return [];
    }
};