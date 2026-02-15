// src/services/classroomsService.js - VERSIÓN FINAL CORREGIDA
import { scheduleAPI } from '../api/schedule.api';

// ============================================
// AULAS - SOLO DESDE BD (SIN MOCK)
// ============================================

export const CLASSROOM_TYPES = [
    'Con Espejos',
    'Área Abierta',
    'Con Tarima',
    'Salón de Teoría',
    'Cancha/Abierto',
    'Área Infantil'
];

/**
 * Mapea el ID del tipo de aula al texto
 */
const mapClassroomType = (typeId) => {
    const typeMap = {
        1: 'Con Espejos',      // Aula con Espejos
        2: 'Con Espejos',      // Aula con Barras
        3: 'Con Espejos',      // Aula con Tubos
        4: 'Salón de Teoría',  // Aula de Música
        5: 'Área Abierta',     // Aula Multifuncional
    };
    return typeMap[typeId] || 'Salón de Teoría';
};

/**
 * Obtiene todas las aulas desde la base de datos
 */
export const listClassrooms = async () => {
    try {
        const response = await scheduleAPI.getClassrooms();
        console.log('📥 Aulas desde BD:', response);
        
        if (response?.ok && response.classrooms) {
            // ✅ CORREGIDO: Usar nombre_aula (lo que viene de BD)
            return response.classrooms.map(room => ({
                id: room.id,
                name: room.nombre_aula || room.name, // ← nombre_aula es lo correcto
                type: mapClassroomType(room.type_id)
                // capacity: ELIMINADO - no es necesario
            }));
        }
        
        // ❌ ELIMINADO: No más fallback a mock
        console.warn('⚠️ No se encontraron aulas en la BD');
        return [];
        
    } catch (error) {
        console.error('❌ Error al cargar aulas desde BD:', error);
        return [];
    }
};

/**
 * Actualiza el tipo de aula (pendiente de implementar en backend)
 */
export const updateClassroom = async (id, payload) => {
    try {
        // Aquí iría la llamada a la API cuando esté lista
        console.log('📤 Actualizando aula (pendiente API):', id, payload);
        return { id, ...payload };
    } catch (error) {
        console.error('❌ Error al actualizar aula:', error);
        throw error;
    }
};