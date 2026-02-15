// src/api/schedule.api.js
import { helpFetch } from './helpFetch';

const fetch = helpFetch();

export const scheduleAPI = {
    // ========== SECCIONES ==========
    listSections: (academicYearId) => {
        const url = academicYearId 
            ? `/api/sections?academicYearId=${academicYearId}`
            : '/api/sections';
        return fetch.get(url);
    },
    
    getSection: (id) => fetch.get(`/api/sections/${id}`),
    
    createSection: (sectionData) => fetch.post('/api/sections', sectionData),
    
    updateSection: (id, sectionData) => fetch.put(`/api/sections/${id}`, sectionData),
    
    deleteSection: (id) => fetch.delete(`/api/sections/${id}`), // ← AHORA SÍ FUNCIONA

    // ========== HORARIOS ==========
    listSchedules: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const queryString = params.toString();
        return fetch.get(`/api/schedules${queryString ? `?${queryString}` : ''}`);
    },
    
    addSchedule: (sectionId, scheduleData) => 
        fetch.post(`/api/sections/${sectionId}/schedules`, scheduleData),
    
    updateSchedule: (scheduleId, scheduleData) => 
        fetch.put(`/api/schedules/${scheduleId}`, scheduleData),
    
    deleteSchedule: (scheduleId) => fetch.delete(`/api/schedules/${scheduleId}`),

    // ========== VALIDACIÓN ==========
    checkAvailability: (params) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });
        return fetch.get(`/api/schedules/check-availability?${queryParams.toString()}`);
    },

    // ========== CATÁLOGOS ==========
    getClassrooms: () => fetch.get('/api/classrooms'),
    
    getDays: () => fetch.get('/api/days'),
    
    getBlocks: () => fetch.get('/api/blocks'),
};