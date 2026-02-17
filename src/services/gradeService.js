// src/services/gradeService.js
import { helpFetch } from '../api/helpFetch';

const fetch = helpFetch();

// ============================================
// SERVICIO DE NOTAS - Integrado con Schedule y Año Académico
// ============================================

/**
 * Obtiene todas las secciones con su estructura para notas
 * @param {number} academicYearId - Año académico (OBLIGATORIO para filtrar)
 * @returns {Promise<Array>} - Secciones formateadas para el módulo de notas
 */

/**
 * Obtiene todas las secciones con su estructura para notas (ADMIN)
 * @param {number} academicYearId - Año académico (OBLIGATORIO para filtrar)
 * @returns {Promise<Array>} - Secciones formateadas para el módulo de notas
 */
export const getSectionsForGrades = async (academicYearId) => {
    try {
        if (!academicYearId) {
            console.warn('⚠️ No se proporcionó academicYearId - No se pueden cargar secciones');
            return [];
        }

        const endpoint = `/api/sections?academicYearId=${academicYearId}`;
        const response = await fetch.get(endpoint);

        if (response.ok && response.sections) {
            return processSectionsResponse(response.sections);
        }
        return [];
    } catch (error) {
        console.error('❌ Error en getSectionsForGrades:', error);
        return [];
    }
};

/**
 * Obtiene la carga académica del docente para notas
 * @param {number} academicYearId - Año académico
 * @returns {Promise<Array>} - Secciones formateadas
 */
export const getTeacherSections = async (academicYearId) => {
    try {
        if (!academicYearId) {
            console.warn('⚠️ No se proporcionó academicYearId');
            return [];
        }

        const endpoint = `/api/notas/docente/carga-academica?academicYearId=${academicYearId}`;
        const response = await fetch.get(endpoint);

        if (response.ok && response.data) {
            // El backend devuelve lista plana: { id, section_name, subject, subject_id, ... }
            // Necesitamos transformarlo al formato esperado por el frontend (agrupado por grado)

            // Mapeo de respuesta backend a formato frontend
            const sections = response.data.map(item => ({
                id: item.id,
                grade_level: item.section_name.split(' ')[0] + ' ' + item.section_name.split(' ')[1], // Aprox
                section_name: item.section_name,
                academic_year_id: academicYearId,
                subject_name: item.subject,
                subject_id: item.subject_id
            }));

            return processSectionsResponse(sections);
        }
        return [];

    } catch (error) {
        console.error('❌ Error en getTeacherSections:', error);
        return [];
    }
}


// Función auxiliar para procesar y agrupar secciones (reutilizada)
const processSectionsResponse = async (sectionsList) => {
    const transformed = await Promise.all(sectionsList.map(async (section) => {
        // Obtener estudiantes
        // Si es docente usamos el endpoint de docente, si es admin el de admin?
        // Por simplicidad, intentaremos detectar o usar un endpoint compatible
        // TODO: Optimizar esto para usar el endpoint correcto según rol. 
        // Por ahora getStudentsBySection usa /api/sections/:id/students
        const estudiantes = await getStudentsBySection(section.id);

        const evaluaciones = await getEvaluationStructure(section.id);

        return {
            id: section.id,
            grado: section.grade_level || section.nivel_academico || 'Sin Grado',
            nombre: section.section_name,
            academicYearId: section.academic_year_id,
            materias: [{
                // REFACTORIZACIÓN: Usando identificadores explícitos
                sectionId: section.id,     // ID único de la sección (Grupo + Materia)
                subjectId: section.subject_id, // ID de la materia (Matemáticas, Danza, etc.)
                nombre: section.subject_name || section.nombre || 'Materia',
                horario: formatHorario(section.schedules || []),
                estudiantes: estudiantes,
                evaluaciones: evaluaciones
            }]
        };
    }));

    return groupByGrade(transformed);
};


/**
 * Obtiene estudiantes de una sección
 * @param {number} sectionId - ID de la sección
 * @returns {Promise<Array>} - Lista de estudiantes
 */
export const getStudentsBySection = async (sectionId) => {
    try {
        if (!sectionId) {
            console.warn('⚠️ No se proporcionó sectionId');
            return [];
        }

        const response = await fetch.get(`/api/sections/${sectionId}/students`);

        if (response.ok && response.data) {
            return response.data.map(est => ({
                id: est.id,
                nombre: `${est.first_name} ${est.last_name}`,
                codigo: est.dni || `EST-${est.id}`,
                edad: calcularEdad(est.birth_date)
            }));
        }
        return [];
    } catch (error) {
        console.error('❌ Error obteniendo estudiantes:', error);
        return [];
    }
};

/**
 * Obtiene la estructura de evaluaciones de una sección
 * @param {number} sectionId - ID de la sección
 * @returns {Promise<Array>} - Estructura de evaluaciones
 */
export const getEvaluationStructure = async (sectionId) => {
    try {
        if (!sectionId) {
            console.warn('⚠️ No se proporcionó sectionId para evaluaciones');
            return getDefaultEvaluationStructure();
        }

        const response = await fetch.get(`/api/sections/${sectionId}/evaluations`);

        if (response.ok && response.data) {
            return response.data;
        }

        // ✅ Si no hay estructura configurada, usar valores por defecto
        console.log(`📝 Usando estructura por defecto para sección ${sectionId}`);
        return getDefaultEvaluationStructure();

    } catch (error) {
        console.error('❌ Error obteniendo estructura:', error);
        return getDefaultEvaluationStructure();
    }
};

/**
 * Guarda las notas en el backend
 * @param {Object} data - { sectionId, grades, academicYearId }
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const saveGrades = async (data) => {
    try {
        // ✅ Validar datos requeridos
        if (!data.sectionId) {
            throw new Error('sectionId es requerido');
        }
        if (!data.grades) {
            throw new Error('grades es requerido');
        }

        console.log(`💾 Guardando notas para sección ${data.sectionId}...`);
        const response = await fetch.post('/api/grades', data);

        if (response.ok) {
            console.log('✅ Notas guardadas exitosamente');
        }

        return response;
    } catch (error) {
        console.error('❌ Error guardando notas:', error);
        throw error;
    }
};

/**
 * Obtiene las notas guardadas de una sección
 * @param {number} sectionId - ID de la sección
 * @returns {Promise<Object>} - Objeto con notas por estudiante
 */
/**
 * Obtiene las notas de un estudiante específico (para vista de perfil/representante)
 * @param {number} studentId - ID del estudiante
 * @returns {Promise<Array>} - Lista de notas detalladas
 */
export const getStudentGrades = async (studentId) => {
    try {
        if (!studentId) {
            console.warn('⚠️ No se proporcionó studentId');
            return [];
        }

        const response = await fetch.get(`/api/grades/student/${studentId}`);

        if (response.ok && response.data) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('❌ Error obteniendo notas del estudiante:', error);
        return [];
    }
};

export const getGradesForSection = async (sectionId) => {
    try {
        if (!sectionId) {
            console.warn('⚠️ No se proporcionó sectionId para notas');
            return {};
        }

        const response = await fetch.get(`/api/grades/section/${sectionId}`);

        if (response.ok && response.data) {
            // ✅ Transformar al formato del frontend { studentId: { n1, n2, n3, n4 } }
            const notas = {};

            response.data.forEach(nota => {
                if (!notas[nota.student_id]) {
                    notas[nota.student_id] = { n1: '', n2: '', n3: '', n4: '' };
                }
                // Asegurar que evaluation_number esté en rango 1-4
                const evalNum = nota.evaluation_number;
                if (evalNum >= 1 && evalNum <= 4) {
                    notas[nota.student_id][`n${evalNum}`] = nota.score.toString();
                }
            });

            console.log(`📥 Notas cargadas para ${Object.keys(notas).length} estudiantes`);
            return notas;
        }

        return {};
    } catch (error) {
        console.error('❌ Error obteniendo notas:', error);
        return {};
    }
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Retorna estructura de evaluaciones por defecto (4 evaluaciones de 25% cada una)
 * @returns {Array} - Estructura por defecto
 */
const getDefaultEvaluationStructure = () => {
    return [
        { numero: 1, peso: 25 },
        { numero: 2, peso: 25 },
        { numero: 3, peso: 25 },
        { numero: 4, peso: 25 }
    ];
};

/**
 * Formatea los horarios de una sección
 * @param {Array} schedules - Lista de horarios
 * @returns {string} - String formateado
 */
const formatHorario = (schedules) => {
    if (!schedules || schedules.length === 0) return 'Horario no asignado';

    const diasMap = {
        'LUNES': 'Lunes',
        'MARTES': 'Martes',
        'MIÉRCOLES': 'Miércoles',
        'JUEVES': 'Jueves',
        'VIERNES': 'Viernes',
        'SÁBADO': 'Sábado'
    };

    return schedules.map(s =>
        `${diasMap[s.day_name] || s.day_name} ${s.start_time?.substring(0, 5) || '00:00'}-${s.end_time?.substring(0, 5) || '00:00'}`
    ).join(', ');
};

/**
 * Calcula edad a partir de fecha de nacimiento
 * @param {string} fechaNacimiento - Fecha en formato YYYY-MM-DD
 * @returns {number} - Edad en años
 */
const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 0;

    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    return edad;
};

/**
 * Agrupa secciones por grado
 * @param {Array} sections - Lista de secciones transformadas
 * @returns {Array} - Secciones agrupadas por grado
 */
const groupByGrade = (sections) => {
    const grupos = {};

    sections.forEach(section => {
        if (!grupos[section.grado]) {
            grupos[section.grado] = {
                grado: section.grado,
                materias: []
            };
        }
        grupos[section.grado].materias.push(...section.materias);
    });

    return Object.values(grupos);
};

// ============================================
// EXPORTAR TODAS LAS FUNCIONES
// ============================================
export default {
    getSectionsForGrades,
    getStudentsBySection,
    getEvaluationStructure,
    saveGrades,
    getGradesForSection,
    getTeacherSections
};