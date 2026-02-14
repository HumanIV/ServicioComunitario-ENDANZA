import { helpFetch } from './helpFetch.js';

const fetch = helpFetch();

export const scheduleAPI = {
    // ============ HORARIOS ============
    listSchedules: () => 
        fetch.get('/api/schedules'),
    
    getScheduleById: (id) => 
        fetch.get(`/api/schedules/${id}`),
    
    createSchedule: (scheduleData) => 
        fetch.post('/api/schedules', scheduleData),
    
    updateSchedule: (id, scheduleData) => 
        fetch.put(`/api/schedules/${id}`, scheduleData),
    
    deleteSchedule: (id) => 
        fetch.delet(`/api/schedules/${id}`),
    
    // ============ POR DOCENTE ============
    getByTeacher: (teacherId) => 
        fetch.get(`/api/teachers/${teacherId}/schedules`),
    
    // ============ POR SECCIÓN ============
    getBySection: (sectionId) => 
        fetch.get(`/api/sections/${sectionId}/schedules`),
    
    // ============ DISPONIBILIDAD ============
    checkAvailability: (teacherId, day, block) => 
        fetch.get(`/api/schedules/check?teacher=${teacherId}&day=${day}&block=${block}`)
};