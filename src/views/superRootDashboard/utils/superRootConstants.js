// Constantes para el módulo SuperRoot
export const ESTADOS_NOTAS = {
  PENDIENTE: 'pendiente',
  APROBADO: 'aprobado',
  RECHAZADO: 'rechazado'
}

export const ROLES_USUARIOS = {
  SECRETARIA: 'Secretaria',
  PROFESOR: 'Profesor',
  ADMINISTRADOR: 'Administrador'
}

export const MODULOS_SISTEMA = [
  'perfil',
  'estudiantes',
  'inscripcion',
  'notas',
  'boletin',
  'horario',
  'aulas',
  'nutricion'
]

export const COLORES_ESTADOS = {
  pendiente: 'warning',
  aprobado: 'success',
  rechazado: 'danger'
}

export const COLORES_ROLES = {
  Secretaria: 'info',
  Profesor: 'success',
  Administrador: 'primary'
}

// Configuración inicial
export const PERIODO_INSCRIPCION_INICIAL = {
  fechaInicio: '2024-01-15',
  fechaFin: '2024-02-15',
  activo: true
}

export const NOTAS_PENDIENTES_INICIALES = [
  { id: 1, profesor: 'Ana Martínez', curso: 'Ballet I', estudiantes: 15, fecha: '2024-01-10', estado: 'pendiente' },
  { id: 2, profesor: 'Carlos Ruiz', curso: 'Jazz Avanzado', estudiantes: 12, fecha: '2024-01-11', estado: 'pendiente' },
  { id: 3, profesor: 'Lucía Gómez', curso: 'Contemporáneo', estudiantes: 18, fecha: '2024-01-09', estado: 'aprobado' },
]

export const BOLETINES_INICIALES = [
  { id: 1, periodo: 'Q1-2024', curso: 'Ballet I', disponible: true, descargas: 45 },
  { id: 2, periodo: 'Q1-2024', curso: 'Jazz Avanzado', disponible: false, descargas: 0 },
  { id: 3, periodo: 'Q1-2024', curso: 'Contemporáneo', disponible: true, descargas: 32 },
]

export const USUARIOS_INICIALES = [
  { id: 1, nombre: 'María López', rol: 'Secretaria', email: 'maria@endanza.com', activo: true, modulos: ['inscripcion', 'notas', 'horario'] },
  { id: 2, nombre: 'Pedro Sánchez', rol: 'Profesor', email: 'pedro@endanza.com', activo: true, modulos: ['notas', 'horario'] },
  { id: 3, nombre: 'Laura Díaz', rol: 'Secretaria', email: 'laura@endanza.com', activo: false, modulos: ['inscripcion', 'aulas'] },
]

// Funciones utilitarias
export const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const calcularEstadisticas = (notas) => {
  const pendientes = notas.filter(n => n.estado === 'pendiente').length
  const aprobadas = notas.filter(n => n.estado === 'aprobado').length
  const rechazadas = notas.filter(n => n.estado === 'rechazado').length
  
  return { pendientes, aprobadas, rechazadas }
}