
import { helpFetch } from '../api/helpFetch';

const fetch = helpFetch();

// Guardar asistencia
export const saveAttendance = async (attendanceData) => {
    /*
        attendanceData: {
            sectionId: number,
            date: string (YYYY-MM-DD),
            attendance: [ { studentId: number, status: 'presente'|'ausente'|'tarde', ... } ]
        }
    */
    try {
        const response = await fetch.post('/api/attendance', attendanceData);
        return response;
    } catch (error) {
        console.error("Error en saveAttendance:", error);
        throw error;
    }
};

// Obtener historial de un estudiante
export const getStudentAttendance = async (studentId) => {
    try {
        const response = await fetch.get(`/api/attendance/student/${studentId}`);
        if (response.ok && response.data) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error("Error en getStudentAttendance:", error);
        return [];
    }
};

// Obtener asistencia de una sección (opcionalmente en una fecha)
export const getSectionAttendance = async (sectionId, date = null) => {
    try {
        let endpoint = `/api/attendance/section/${sectionId}`;
        if (date) {
            endpoint += `?date=${date}`;
        }
        const response = await fetch.get(endpoint);
        if (response.ok && response.data) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error("Error en getSectionAttendance:", error);
        return [];
    }
};
