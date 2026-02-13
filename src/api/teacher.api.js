import { helpFetch } from './helpFetch.js';

const fetch = helpFetch();

export const teacherAPI = {
    // ============ GESTIÓN DE DOCENTES ============
    listTeachers: () => 
        fetch.get('/api/teachers/list'),
    
    getTeacherById: (id) => 
        fetch.get(`/api/teachers/${id}`),
    
    updateTeacher: (id, teacherData) => 
        fetch.put(`/api/teachers/${id}`, teacherData),
    
    deleteTeacher: (id) => 
        fetch.del(`/api/teachers/${id}`), // ✅ CORREGIDO: era 'delet' ahora es 'del'
    
    // ============ ASIGNACIONES ============
    assignSpecialty: (id, specialty) => 
        fetch.put(`/api/teachers/${id}/specialty`, { specialty }),
    
    assignGrades: (id, gradeIds) => 
        fetch.put(`/api/teachers/${id}/grades`, { gradeIds }),
    
    // ============ CATÁLOGOS ============
    getSpecialties: () => 
        fetch.get('/api/teachers/catalog/specialties'),
    
    getGrades: () => 
        fetch.get('/api/teachers/catalog/grades'),
    
    // ============ RUTAS DEL DOCENTE ============
    getMySchedule: (id) => 
        fetch.get(`/api/teachers/${id}/my-schedule`),
    
    getMyStudents: (id) => 
        fetch.get(`/api/teachers/${id}/my-students`),
    
    // ============ NUEVOS MÉTODOS PARA MATERIAS ============
    assignSubject: (id, subjectId) => 
        fetch.post(`/api/teachers/${id}/subjects`, { subjectId }),
    
    removeSubject: (id, subjectId) => 
        fetch.del(`/api/teachers/${id}/subjects/${subjectId}`),
    
    getTeacherSubjects: (id) => 
        fetch.get(`/api/teachers/${id}/subjects`),
    
    // ============ NUEVOS MÉTODOS PARA HORARIOS ============
    getTeacherSchedule: (id) => 
        fetch.get(`/api/teachers/${id}/schedules`),
    
    assignSchedule: (id, scheduleData) => 
        fetch.post(`/api/teachers/${id}/schedules`, scheduleData),
    
    removeSchedule: (id, scheduleId) => 
        fetch.del(`/api/teachers/${id}/schedules/${scheduleId}`)
};