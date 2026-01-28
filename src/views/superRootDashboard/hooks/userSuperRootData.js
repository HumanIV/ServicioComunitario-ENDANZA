import { useState, useEffect } from 'react'
import { listUsers } from '../../users/Users.service'

export const useSuperRootData = () => {
  // Estados para los modales
  const [visiblePeriodoInscripcion, setVisiblePeriodoInscripcion] = useState(false)
  const [visibleValidacionNotas, setVisibleValidacionNotas] = useState(false)
  const [visibleControlBoletines, setVisibleControlBoletines] = useState(false)

  // Estados para configuración
  const [periodoInscripcion, setPeriodoInscripcion] = useState({
    fechaInicio: '2026-01-15',
    fechaFin: '2026-02-15',
    activo: true
  })

  const [notasPendientes, setNotasPendientes] = useState([
    { id: 1, profesor: 'Ana Martínez', curso: 'Ballet I', estudiantes: 15, fecha: '2024-01-10', estado: 'pendiente' },
    { id: 2, profesor: 'Carlos Ruiz', curso: 'Jazz Avanzado', estudiantes: 12, fecha: '2024-01-11', estado: 'pendiente' },
    { id: 3, profesor: 'Lucía Gómez', curso: 'Contemporáneo', estudiantes: 18, fecha: '2024-01-09', estado: 'aprobado' },
  ])

  const [boletines, setBoletines] = useState([
    { id: 1, periodo: 'Q1-2024', curso: 'Ballet I', disponible: true, descargas: 45 },
    { id: 2, periodo: 'Q1-2024', curso: 'Jazz Avanzado', disponible: false, descargas: 0 },
    { id: 3, periodo: 'Q1-2024', curso: 'Contemporáneo', disponible: true, descargas: 32 },
  ])

  const [usuarios, setUsuarios] = useState([])

  // Cargar usuarios reales desde el servicio
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await listUsers()
        // Mapeamos el formato del servicio al formato que espera el dashboard
        const mappedUsers = data.map(u => ({
          id: u.id,
          nombre: `${u.first_name} ${u.last_name}`,
          rol: u.role,
          email: u.email,
          activo: u.status === 'active'
        }))
        setUsuarios(mappedUsers)
      } catch (error) {
        console.error("Error fetching users for dashboard:", error)
      }
    }
    fetchUsers()
  }, [])

  // Funciones de manejo
  const aprobarNotas = (id) => {
    setNotasPendientes(notasPendientes.map(nota =>
      nota.id === id ? { ...nota, estado: 'aprobado' } : nota
    ))
  }

  const rechazarNotas = (id) => {
    setNotasPendientes(notasPendientes.map(nota =>
      nota.id === id ? { ...nota, estado: 'rechazado' } : nota
    ))
  }

  const toggleBoletinDisponible = (id) => {
    setBoletines(boletines.map(boletin =>
      boletin.id === id ? { ...boletin, disponible: !boletin.disponible } : boletin
    ))
  }

  const guardarPeriodoInscripcion = () => {
    // Aquí iría la lógica para guardar en el backend
    console.log('Periodo guardado:', periodoInscripcion)
    setVisiblePeriodoInscripcion(false)
  }

  return {
    // Estados
    periodoInscripcion,
    setPeriodoInscripcion,
    notasPendientes,
    setNotasPendientes,
    boletines,
    setBoletines,
    usuarios,
    setUsuarios,

    // Estados modales
    visiblePeriodoInscripcion,
    setVisiblePeriodoInscripcion,
    visibleValidacionNotas,
    setVisibleValidacionNotas,
    visibleControlBoletines,
    setVisibleControlBoletines,

    // Funciones
    aprobarNotas,
    rechazarNotas,
    toggleBoletinDisponible,
    guardarPeriodoInscripcion
  }
}

export default useSuperRootData