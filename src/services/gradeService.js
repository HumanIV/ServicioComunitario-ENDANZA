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
export const getSectionsForGrades = async (academicYearId) => {
    try {
        // ✅ VALIDACIÓN: Año académico es obligatorio
        if (!academicYearId) {
            console.warn('⚠️ No se proporcionó academicYearId - No se pueden cargar secciones');
            return [];
        }
        
        // ✅ Construir endpoint con filtro de año
        const endpoint = `/api/sections?academicYearId=${academicYearId}`;
        console.log(`📡 Solicitando secciones para año: ${academicYearId}`);
        
        const response = await fetch.get(endpoint);
        
        if (response.ok && response.sections) {
            console.log(`📥 Secciones recibidas para año ${academicYearId}:`, response.sections.length);
            
            // ✅ Transformar al formato que espera el módulo de notas
            const transformed = await Promise.all(response.sections.map(async (section) => {
                // Obtener estudiantes de esta sección (filtrados por el mismo año)
                const estudiantes = await getStudentsBySection(section.id);
                
                // Obtener estructura de evaluaciones
                const evaluaciones = await getEvaluationStructure(section.id);
                
                return {
                    id: section.id,
                    grado: section.grade_level || section.nivel_academico || 'Sin grado',
                    nombre: section.section_name,
                    academicYearId: section.academic_year_id, // ← Mantener año para referencia
                    materias: [{
                        id: section.id,
                        nombre: section.subject_name || 'Materia',
                        horario: formatHorario(section.schedules || []),
                        estudiantes: estudiantes,
                        evaluaciones: evaluaciones
                    }]
                };
            }));
            
            // ✅ Agrupar por grado para mantener la estructura original
            const grouped = groupByGrade(transformed);
            console.log(`📊 Secciones agrupadas: ${grouped.length} grados encontrados`);
            return grouped;
        }
        
        console.warn(`⚠️ No se encontraron secciones para el año ${academicYearId}`);
        return [];
        
    } catch (error) {
        console.error('❌ Error en getSectionsForGrades:', error);
        return [];
    }
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
        `${diasMap[s.day_name] || s.day_name} ${s.start_time?.substring(0,5) || '00:00'}-${s.end_time?.substring(0,5) || '00:00'}`
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
    getGradesForSection
};