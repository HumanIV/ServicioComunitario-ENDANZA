// Servicio para llamadas API al backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'

export const superRootApi = {
  // Configuración de período de inscripciones
  getPeriodoInscripcion: async () => {
    const response = await fetch(`${API_BASE_URL}/superroot/periodo-inscripcion`)
    return response.json()
  },
  
  updatePeriodoInscripcion: async (periodoData) => {
    const response = await fetch(`${API_BASE_URL}/superroot/periodo-inscripcion`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(periodoData)
    })
    return response.json()
  },
  
  // Gestión de notas
  getNotasPendientes: async () => {
    const response = await fetch(`${API_BASE_URL}/superroot/notas-pendientes`)
    return response.json()
  },
  
  aprobarNotas: async (notaId) => {
    const response = await fetch(`${API_BASE_URL}/superroot/notas/${notaId}/aprobar`, {
      method: 'PUT'
    })
    return response.json()
  },
  
  rechazarNotas: async (notaId) => {
    const response = await fetch(`${API_BASE_URL}/superroot/notas/${notaId}/rechazar`, {
      method: 'PUT'
    })
    return response.json()
  },
  
  // Control de boletines
  getBoletines: async () => {
    const response = await fetch(`${API_BASE_URL}/superroot/boletines`)
    return response.json()
  },
  
  toggleBoletinDisponible: async (boletinId, disponible) => {
    const response = await fetch(`${API_BASE_URL}/superroot/boletines/${boletinId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ disponible })
    })
    return response.json()
  },
  
  // Gestión de usuarios
  getUsuarios: async () => {
    const response = await fetch(`${API_BASE_URL}/superroot/usuarios`)
    return response.json()
  },
  
  toggleUsuarioActivo: async (usuarioId, activo) => {
    const response = await fetch(`${API_BASE_URL}/superroot/usuarios/${usuarioId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ activo })
    })
    return response.json()
  },
  
  crearUsuario: async (usuarioData) => {
    const response = await fetch(`${API_BASE_URL}/superroot/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuarioData)
    })
    return response.json()
  }
}