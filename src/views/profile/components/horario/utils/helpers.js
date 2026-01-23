// utils/helpers.js

/**
 * Calcula las horas totales de clases para un día específico
 * @param {Object} horarioCompleto - Objeto con el horario completo
 * @param {string} dia - Día a calcular (ej: 'LUNES')
 * @returns {string} Horas totales formateadas con 1 decimal
 */
export const calcularHorasDia = (horarioCompleto, dia) => {
  try {
    const clases = horarioCompleto[dia] || []
    let totalMinutos = 0
    
    clases.forEach(clase => {
      const [horaInicio, horaFin] = clase.hora.split(' - ')
      
      // Crear fechas con hora base
      const inicio = new Date(`2000-01-01T${horaInicio}:00`)
      const fin = new Date(`2000-01-01T${horaFin}:00`)
      
      // Calcular diferencia en minutos
      totalMinutos += (fin - inicio) / (1000 * 60)
    })
    
    // Convertir a horas con 1 decimal
    return (totalMinutos / 60).toFixed(1)
  } catch (error) {
    console.error('Error en calcularHorasDia:', error)
    return '0.0'
  }
}

/**
 * Formatea una fecha a texto legible
 * @param {Date|string} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatearFecha = (fecha) => {
  try {
    const dateObj = new Date(fecha)
    return dateObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error en formatearFecha:', error)
    return 'Fecha no disponible'
  }
}

/**
 * Crea un objeto toast para notificaciones
 * @param {string} type - Tipo de toast (success, warning, danger, info)
 * @param {string} message - Mensaje a mostrar
 * @returns {Object} Objeto toast con id, type y message
 */
export const crearToast = (type, message) => {
  return {
    id: Date.now(),
    type: type || 'info',
    message: message || ''
  }
}

/**
 * Obtiene el texto del ícono según el tipo de toast
 * @param {string} type - Tipo de toast
 * @returns {string} Texto del ícono
 */
export const getIconoToast = (type) => {
  const iconos = {
    success: '✅',
    warning: '⚠',
    danger: '❌',
    info: 'ℹ'
  }
  return iconos[type] || iconos.info
}

/**
 * Obtiene el título según el tipo de toast
 * @param {string} type - Tipo de toast
 * @returns {string} Título del toast
 */
export const getTituloToast = (type) => {
  const titulos = {
    success: 'Listo',
    warning: 'Atención',
    danger: 'Error',
    info: 'Información'
  }
  return titulos[type] || titulos.info
}

/**
 * Valida si un objeto de clase tiene todos los campos requeridos
 * @param {Object} clase - Objeto de clase
 * @returns {boolean} True si es válido
 */
export const validarClase = (clase) => {
  return clase && 
         clase.hora && 
         clase.materia && 
         clase.profesor && 
         clase.aula
}

/**
 * Filtra clases de un día por rango horario
 * @param {Array} clases - Array de clases
 * @param {string} horaInicio - Hora de inicio (HH:MM)
 * @param {string} horaFin - Hora de fin (HH:MM)
 * @returns {Array} Clases filtradas
 */
export const filtrarClasesPorHorario = (clases, horaInicio, horaFin) => {
  return clases.filter(clase => {
    const horaClase = clase.hora.split(' - ')[0]
    return horaClase >= horaInicio && horaClase <= horaFin
  })
}

/**
 * Genera un ID único para elementos
 * @returns {string} ID único
 */
export const generarIdUnico = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}