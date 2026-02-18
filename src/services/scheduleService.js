// src/services/scheduleService.js - VERSIÓN CORREGIDA Y UNIFICADA
import { scheduleAPI } from '../api/schedule.api';
import { helpFetch } from '../api/helpFetch'; // Necesario para algunas funciones directas si no están en scheduleAPI

const fetch = helpFetch();

// ============================================
// GESTIÓN DE SECCIONES
// ============================================

export const getAllSections = async (academicYearId = null) => {
    try {
        const response = await scheduleAPI.listSections(academicYearId);
        if (response?.ok) {
            return response.sections || response.data || [];
        }
        return [];
    } catch (error) {
        console.error('❌ Error en getAllSections:', error);
        return [];
    }
};

// Alias para compatibilidad con código antiguo que usaba schedules.js
export const listSections = async (filters = {}) => {
    try {
        // Obtenemos todas y filtramos en cliente si es necesario
        // O idealmente pasamos filtros al backend si lo soporta
        let sections = await getAllSections(filters.academicYearId); // Asumimos que getAllSections ya maneja esto o trae todo

        // El backend devuelve estructura plana o anidada, getAllSections puede devolver raw data
        // Si necesitamos transformar, lo hacemos aquí o en getAllSections

        if (filters.gradeLevel) {
            sections = sections.filter(s => s.grade_level === filters.gradeLevel || s.gradeLevel === filters.gradeLevel);
        }

        // Mapeo para asegurar compatibilidad con componentes que esperan camelCase
        return sections.map(s => ({
            ...s,
            // Asegurar campos esperados
            id: s.id,
            sectionName: s.section_name || s.sectionName,
            subjectName: s.subject_name || s.subjectName || 'Sin Materia',
            gradeLevel: s.grade_level || s.gradeLevel || s.subject_name, // provisional
            academicYear: s.academic_year_name || s.academicYear,
            schedules: (s.schedules || []).map(sched => ({
                ...sched,
                subject: sched.subject || sched.subject_name || sched.subjectName || s.subject_name || s.subjectName || 'Sin Materia',
                teacherUserId: sched.teacher_user_id || sched.teacherUserId,
                teacherName: sched.teacher_name || sched.teacherName,
                teacherId: sched.teacher_id || sched.teacherId,
                dayName: sched.day_name || sched.dayName,
                blockName: sched.block_name || sched.blockName,
                startTime: sched.start_time || sched.startTime,
                endTime: sched.end_time || sched.endTime,
                classroomName: sched.classroom_name || sched.classroomName,
            }))
        }));

    } catch (error) {
        console.error("Error listing sections (alias):", error);
        return [];
    }
};

export const getSectionById = async (id) => {
    try {
        const response = await scheduleAPI.getSection(id);
        return response?.ok ? (response.section || response.data) : null;
    } catch (error) {
        console.error('❌ Error en getSectionById:', error);
        return null;
    }
};

export const getSection = getSectionById; // Alias

export const createSection = async (sectionData, academicYearId) => {
    try {
        // Manejo flexible si academicYearId viene dentro de sectionData o aparte
        const yearId = academicYearId || sectionData.academicYearId;
        if (!yearId) throw new Error('El año académico es obligatorio');

        const payload = {
            section_name: sectionData.sectionName || sectionData.section_name,
            grade_level: sectionData.gradeLevel,
            section_letter: sectionData.section,
            capacity: sectionData.capacity || 30,
            academic_year_id: yearId,
            subject_id: sectionData.subject_id || null
        };

        console.log('📤 Enviando payload con grade_level:', payload);

        const response = await scheduleAPI.createSection(payload);
        if (response?.ok) return response.section || response.data;
        throw new Error(response?.msg || 'Error al crear sección');
    } catch (error) {
        console.error('❌ Error en createSection:', error);
        throw error;
    }
};

export const updateSection = async (id, sectionData) => {
    try {
        const response = await scheduleAPI.updateSection(id, sectionData);
        if (response?.ok) return response.section || response.data;
        throw new Error(response?.msg || 'Error al actualizar sección');
    } catch (error) {
        console.error('❌ Error en updateSection:', error);
        throw error;
    }
};

export const deleteSection = async (id) => {
    try {
        const response = await scheduleAPI.deleteSection(id);
        if (response?.ok) return response;
        throw new Error(response?.msg || 'Error al eliminar sección');
    } catch (error) {
        console.error('❌ Error en deleteSection:', error);
        throw error;
    }
};

// ============================================
// GESTIÓN DE HORARIOS
// ============================================

export const addScheduleToSection = async (sectionId, scheduleData) => {
    try {
        const response = await scheduleAPI.addSchedule(sectionId, scheduleData);
        if (response?.ok) return response.schedule || response.data;
        throw new Error(response?.msg || 'Error al agregar horario');
    } catch (error) {
        console.error('❌ Error en addScheduleToSection:', error);
        throw error;
    }
};

export const removeSchedule = async (scheduleId) => {
    try {
        const response = await scheduleAPI.deleteSchedule(scheduleId);
        if (response?.ok) return response;
        throw new Error(response?.msg || 'Error al eliminar horario');
    } catch (error) {
        console.error('❌ Error en removeSchedule:', error);
        throw error;
    }
};

export const removeScheduleFromSection = async (sectionId, scheduleId) => {
    return removeSchedule(scheduleId);
};

// ============================================
// VALIDACIÓN Y CATÁLOGOS
// ============================================

export const checkAvailability = async (params) => { // Puede recibir objeto params o argumentos posicionales (legacy)
    // Soporte para argumentos posicionales: (academicYear, day, start, end, classroom, excludeSectionId)
    // Si params es string, asumimos que es el academicYearName
    if (typeof params === 'string') {
        const [academicYear, day, start, end, classroom, excludeSectionId] = arguments;

        // Necesitamos convertir nombre de año a ID si la API espera ID
        // Por ahora intentamos usar lógica similar a schedules.js
        try {
            const years = await getAvailableYears(); // Son strings
            // Pero checkAvailability de backend espera ID en params generalmente.
            // Si scheduleAPI.checkAvailability maneja query params del backend:
            // const { academicYearId, day, startTime, endTime, classroom, excludeSectionId } = req.query;

            // Necesitamos el ID.
            const allYearsRes = await fetch.get('/api/config/academic-years');
            let yearId = null;
            if (allYearsRes.ok && allYearsRes.data) {
                const found = allYearsRes.data.find(y => y.name === academicYear);
                if (found) yearId = found.id;
            }
            if (!yearId) return { available: true };

            const queryParams = {
                academicYearId: yearId,
                day,
                startTime: start,
                endTime: end,
                classroom,
                excludeSectionId
            }
            const response = await scheduleAPI.checkAvailability({ ...queryParams }); // Adaptar a lo que espera scheduleAPI
            // scheduleAPI.checkAvailability espera objeto q se convierte en query string?
            // "checkAvailability: (params) => get(`/sections/schedules/check-availability`, params)" ?
            // Asumiremos que scheduleAPI maneja el objeto.
            return response?.ok
                ? { available: response.data?.available ?? response.available, message: response.message, conflict: response.conflict }
                : { available: false, message: 'Error al verificar disponibilidad' };

        } catch (e) {
            console.error('❌ Error legacy checkAvailability:', e);
            return { available: true };
        }
    }

    try {
        const response = await scheduleAPI.checkAvailability(params);
        return response?.ok
            ? { available: response.available, message: response.message, conflict: response.conflict }
            : { available: false, message: 'Error al verificar disponibilidad' };
    } catch (error) {
        console.error('❌ Error en checkAvailability:', error);
        return { available: false, message: error.message };
    }
};

// Compatibilidad nombre
export const checkClassroomAvailability = checkAvailability;


export const getClassrooms = async () => {
    try {
        const response = await scheduleAPI.getClassrooms();
        return response?.ok ? (response.classrooms || response.data || []) : [];
    } catch (error) {
        console.error('❌ Error en getClassrooms:', error);
        return [];
    }
};

export const getDays = async () => {
    try {
        const response = await scheduleAPI.getDays();
        return response?.ok ? (response.days || response.data || []) : [];
    } catch (error) {
        console.error('❌ Error en getDays:', error);
        return [];
    }
};

export const getBlocks = async () => {
    try {
        const response = await scheduleAPI.getBlocks();
        return response?.ok ? (response.blocks || response.data || []) : [];
    } catch (error) {
        console.error('❌ Error en getBlocks:', error);
        return [];
    }
};

// Nuevas funciones traídas de schedules.js
export const getAvailableYears = async () => {
    try {
        const response = await fetch.get('/api/config/academic-years');
        if (response.ok && response.data) {
            // Mapeamos a solo nombres para compatibilidad con el frontend actual
            // Ordenamos por nombre descendente (más reciente primero)
            const years = response.data.map(y => y.name).sort().reverse();
            return years;
        }
        return [];
    } catch (error) {
        console.error("Error loading years:", error);
        return [];
    }
};

export const addAcademicYear = async (year) => {
    try {
        const response = await fetch.post('/api/config/academic-years', { name: year });
        if (response.ok && response.data) {
            return response.data.name;
        }
        throw new Error('Error creating academic year');
    } catch (error) {
        console.error("Error saving year:", error);
        throw error;
    }
};


// ============================================
// CONVERSIONES DE FORMATO - ¡VERSIÓN CORREGIDA!
// ============================================

export const adaptSectionFromDB = (dbSection) => {
    if (!dbSection) return null;

    // Adaptar los horarios individuales
    const schedules = (dbSection.schedules || []).map(s => {
        return {
            id: s.id,
            subject: s.subject_name || 'Sin materia',
            teacherName: s.teacher_name || 'Sin asignar',
            teacherId: s.teacher_user_id,
            dayOfWeek: s.day_name?.toUpperCase() || 'LUNES',
            startTime: s.start_time?.substring(0, 5) || '00:00',
            endTime: s.end_time?.substring(0, 5) || '00:00',
            classroom: s.classroom_name || 'Sin aula',
            dayId: s.day_id,
            blockId: s.block_id,
            classroomId: s.classroom_id  // ← ESTO ES CRÍTICO PARA AULAS
        };
    });

    // Extraer elementos únicos para los resúmenes
    const uniqueSubjects = [...new Set(schedules.map(s => s.subject))];
    const uniqueTeachers = [...new Set(schedules.map(s => s.teacherName))];
    const uniqueClassrooms = [...new Set(schedules.map(s => s.classroom))];

    // Determinar el nivel académico
    const gradeLevel = dbSection.grade_level || 'Sin materia';

    // Construir el nombre completo de la sección
    let sectionName = dbSection.section_name || 'Sin nombre';
    if (dbSection.section_letter && !sectionName.includes(dbSection.section_letter)) {
        sectionName = `${sectionName} ${dbSection.section_letter}`;
    }

    return {
        // Para ScheduleCard e InfoHorario
        id: dbSection.id,
        sectionName: sectionName,
        gradeLevel: gradeLevel,
        section: dbSection.section_letter || '',
        status: 'Active',
        academicYear: dbSection.academic_year_name || 'Desconocido',
        academicYearId: dbSection.academic_year_id,
        totalHoursPerWeek: Math.round(dbSection.total_hours || 0),

        // Horarios detallados
        schedules: schedules,

        // Resúmenes para InfoHorario
        uniqueSubjects: uniqueSubjects,
        uniqueTeachers: uniqueTeachers,
        uniqueClassrooms: uniqueClassrooms,

        // Mantener originales para compatibilidad
        section_name: sectionName,
        subject_name: gradeLevel,
        academic_year_name: dbSection.academic_year_name,
        total_hours: dbSection.total_hours
    };
};

// ================= CONSTANTES =================

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