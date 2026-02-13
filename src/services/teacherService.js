import { teacherAPI } from '../api/teacher.api';
import { userAPI } from '../api/user.api';

// ============================================
// GESTIÓN DE DOCENTES
// ============================================

/**
 * Obtiene todos los docentes
 */
export const getAll = async () => {
    try {
        const response = await teacherAPI.listTeachers();
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
 */
export const getById = async (id) => {
    try {
        const response = await teacherAPI.getTeacherById(id);
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
 * Asigna especialidad a un docente
 */
export const assignSpecialty = async (userId, specialty) => {
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
 * Asigna grados a un docente
 */
// ============================================
// ASIGNACIÓN DE GRADOS - ¡CORREGIDO!
// ============================================
export const assignGrades = async (userId, gradeIds) => {
    try {
        const response = await teacherAPI.assignGrades(userId, gradeIds);
        if (response?.ok) {
            // ✅ Devolver los datos completos
            return {
                ...response.data,
                grades: response.data.grades || []  // Asegurar que siempre hay array
            };
        }
        throw new Error(response?.msg || 'Error al asignar grados');
    } catch (error) {
        console.error('❌ Error en assignGrades:', error);
        throw error;
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
// ASIGNACIÓN DE MATERIAS
// ============================================

/**
 * Asigna una materia a un docente
 */
export const assignSubject = async (teacherId, subjectId) => {
    try {
        const response = await teacherAPI.assignSubject(teacherId, subjectId);
        if (response?.ok) {
            return response.data;
        }
        throw new Error(response?.msg || 'Error al asignar materia');
    } catch (error) {
        console.error('❌ Error en assignSubject:', error);
        throw error;
    }
};

/**
 * Elimina una materia de un docente
 */
export const removeSubject = async (teacherId, subjectId) => {
    try {
        const response = await teacherAPI.removeSubject(teacherId, subjectId);
        if (response?.ok) {
            return response;
        }
        throw new Error(response?.msg || 'Error al eliminar materia');
    } catch (error) {
        console.error('❌ Error en removeSubject:', error);
        throw error;
    }
};

/**
 * Obtiene las materias de un docente
 */
export const getTeacherSubjects = async (teacherId) => {
    try {
        const response = await teacherAPI.getTeacherSubjects(teacherId);
        if (response?.ok) {
            return response.subjects || [];
        }
        return [];
    } catch (error) {
        console.error('❌ Error en getTeacherSubjects:', error);
        return [];
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