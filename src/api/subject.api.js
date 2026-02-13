import { helpFetch } from './helpFetch.js';

const fetch = helpFetch();

export const subjectAPI = {
    // ============ MATERIAS ============
    listSubjects: () => 
        fetch.get('/api/subjects'),
    
    getSubjectById: (id) => 
        fetch.get(`/api/subjects/${id}`),
    
    createSubject: (subjectData) => 
        fetch.post('/api/subjects', subjectData),
    
    updateSubject: (id, subjectData) => 
        fetch.put(`/api/subjects/${id}`, subjectData),
    
    deleteSubject: (id) => 
        fetch.delet(`/api/subjects/${id}`),
    
    // ============ ASIGNACIÓN ============
    assignToTeacher: (teacherId, subjectId) => 
        fetch.post(`/api/teachers/${teacherId}/subjects`, { subjectId }),
    
    removeFromTeacher: (teacherId, subjectId) => 
        fetch.delet(`/api/teachers/${teacherId}/subjects/${subjectId}`),
    
    getTeacherSubjects: (teacherId) => 
        fetch.get(`/api/teachers/${teacherId}/subjects`),
    
    // ============ POR GRADO ============
    getByGrade: (gradeId) => 
        fetch.get(`/api/subjects/grade/${gradeId}`)
};