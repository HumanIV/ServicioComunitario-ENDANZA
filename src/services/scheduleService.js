// src/services/scheduleService.js - VERSIÓN CORREGIDA
import { scheduleAPI } from '../api/schedule.api';

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

export const getSectionById = async (id) => {
    try {
        const response = await scheduleAPI.getSection(id);
        return response?.ok ? (response.section || response.data) : null;
    } catch (error) {
        console.error('❌ Error en getSectionById:', error);
        return null;
    }
};

export const createSection = async (sectionData, academicYearId) => {
    try {
        if (!academicYearId) throw new Error('El año académico es obligatorio');
        
        const payload = {
            section_name: sectionData.sectionName || sectionData.section_name,
            grade_level: sectionData.gradeLevel,
            section_letter: sectionData.section,
            capacity: sectionData.capacity || 30,
            academic_year_id: academicYearId,
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

// ============================================
// VALIDACIÓN Y CATÁLOGOS
// ============================================

export const checkAvailability = async (params) => {
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

// ============================================
// CONVERSIONES DE FORMATO - ¡VERSIÓN CORREGIDA!
// ============================================

export const adaptSectionFromDB = (dbSection) => {
    if (!dbSection) return null;
    
    console.log('🔄 adaptSectionFromDB - Datos de BD:', dbSection);
    console.log('   section_name recibido:', dbSection.section_name);
    console.log('   grade_level recibido:', dbSection.grade_level);
    console.log('   schedules originales:', dbSection.schedules);
    
    // Adaptar los horarios individuales
    const schedules = (dbSection.schedules || []).map(s => {
        console.log('   → Procesando horario:', s);
        console.log('      classroom_id en BD:', s.classroom_id);
        console.log('      classroom_name en BD:', s.classroom_name);
        console.log('      type of classroom_id:', typeof s.classroom_id);
        
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
    
    console.log('   schedules mapeados:', schedules);
    console.log('   schedules con classroomId:', schedules.map(s => ({ 
        classroomId: s.classroomId, 
        classroom: s.classroom,
        type: typeof s.classroomId
    })));
    
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
    
    console.log('   sectionName final:', sectionName);
    
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