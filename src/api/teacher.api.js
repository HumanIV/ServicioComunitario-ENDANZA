// src/api/teacher.api.js
import { helpFetch } from './helpFetch';

const fetch = helpFetch();

export const teacherAPI = {
    // Listar todos los docentes
    listTeachers: () => fetch.get('/api/teachers/list'),
    
    // Listar docentes por año académico
    listTeachersByYear: (academicYearId) => 
        fetch.get(`/api/teachers/list/year/${academicYearId}`),
    
    // Obtener docente por ID
    getTeacherById: (id) => fetch.get(`/api/teachers/${id}`),
    
    // Obtener docente por ID con año específico
    getTeacherByIdWithYear: (userId, academicYearId) => 
        fetch.get(`/api/teachers/${userId}/year/${academicYearId}`),
    
    // Obtener grados de un docente para un año
    getTeacherGrades: (userId, academicYearId) => 
        fetch.get(`/api/teachers/${userId}/grades/year/${academicYearId}`),
    
    // Asignar especialidad (versión legacy - sin año)
    assignSpecialty: (userId, specialty) => 
        fetch.put(`/api/teachers/${userId}/specialty`, { specialty }),
    
    // NUEVO: Asignar especialidad con año académico
    assignSpecialtyByYear: (userId, specialtyId, academicYearId) => 
        fetch.put(`/api/teachers/${userId}/specialty/year`, { specialtyId, academicYearId }),
    
    // Asignar grados (con año en body)
    assignGrades: (userId, gradeIds, academicYearId) => 
        fetch.put(`/api/teachers/${userId}/grades`, { gradeIds, academicYearId }),
    
    // Asignar grados con año en URL
    assignGradesWithYear: (userId, gradeIds, academicYearId) => 
        fetch.post(`/api/teachers/${userId}/grades/year/${academicYearId}`, { gradeIds }),
    
    // Copiar asignaciones entre años
    copyAssignments: (fromYearId, toYearId) => 
        fetch.post(`/api/teachers/copy-assignments/${fromYearId}/${toYearId}`),
    
    // Actualizar docente
    updateTeacher: (id, teacherData) => 
        fetch.put(`/api/teachers/${id}`, teacherData),
    
    // Eliminar docente
    deleteTeacher: (id) => fetch.delete(`/api/teachers/${id}`),
    
    // Obtener especialidades
    getSpecialties: () => fetch.get('/api/teachers/catalog/specialties'),
    
    // Obtener grados
    getGrades: () => fetch.get('/api/teachers/catalog/grades'),
    
    // Obtener horario del docente
    getTeacherSchedule: (teacherId) => 
        fetch.get(`/api/teachers/${teacherId}/schedule`),
    
    // Asignar horario
    assignSchedule: (teacherId, scheduleData) => 
        fetch.post(`/api/teachers/${teacherId}/schedule`, scheduleData),
    
    // Eliminar horario
    removeSchedule: (teacherId, scheduleId) => 
        fetch.delete(`/api/teachers/${teacherId}/schedule/${scheduleId}`),
    
    // Obtener mi horario (como docente)
    getMySchedule: (userId) => 
        fetch.get(`/api/teachers/${userId}/my-schedule`),
    
    // Obtener mis estudiantes (como docente)
    getMyStudents: (userId) => 
        fetch.get(`/api/teachers/${userId}/my-students`)
};