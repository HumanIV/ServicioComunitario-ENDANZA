import { useState, useEffect } from 'react'
import { listUsers } from '../../../services/userService'  // ✅ Usa tu servicio REAL
import { listStudents } from '../../../services/students'
import { listSections } from '../../../services/schedules'

export const useSuperRootData = () => {
  // Estados para los modales
  const [visiblePeriodoInscripcion, setVisiblePeriodoInscripcion] = useState(false)
  const [visibleSubidaNotas, setVisibleSubidaNotas] = useState(false)

  // Estados para configuración
  const [periodoInscripcion, setPeriodoInscripcion] = useState({
    fechaInicio: '2026-01-15',
    fechaFin: '2026-02-15',
    activo: true
  })

  const [periodoSubidaNotas, setPeriodoSubidaNotas] = useState({
    fechaInicio: '2026-05-01',
    fechaFin: '2026-05-30',
    activo: false
  })

  const [usuarios, setUsuarios] = useState([])
  const [repsCount, setRepsCount] = useState(0)
  const [students, setStudents] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // ✅ Usamos las mismas funciones pero con el backend real
        const [usersData, studentsData, sectionsData] = await Promise.all([
          listUsers(),        // ✅ Ahora usa userService.listUsers() del backend real
          listStudents(),
          listSections()
        ])

        // Mapeamos usuarios (Excluyendo representantes)
        const mappedUsers = usersData
          .filter(u => u.role !== 'representante')
          .map(u => ({
            id: u.id,
            nombre: `${u.first_name} ${u.last_name}`,
            rol: u.role,
            email: u.email,
            activo: u.status === 'active'
          }))

        setUsuarios(mappedUsers)
        setRepsCount(usersData.filter(u => u.role === 'representante').length)
        setStudents(studentsData)
        setSections(sectionsData)
      } catch (error) {
        console.error("Error fetching data for dashboard:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Funciones de manejo
  const guardarPeriodoInscripcion = (data) => {
    setPeriodoInscripcion(data)
    setVisiblePeriodoInscripcion(false)
  }

  const guardarPeriodoSubidaNotas = (data) => {
    setPeriodoSubidaNotas(data)
    setVisibleSubidaNotas(false)
  }

  return {
    // Estados
    periodoInscripcion,
    periodoSubidaNotas,
    usuarios,
    repsCount,
    students,
    sections,
    loading,

    // Estados modales
    visiblePeriodoInscripcion,
    setVisiblePeriodoInscripcion,
    visibleSubidaNotas,
    setVisibleSubidaNotas,

    // Funciones
    guardarPeriodoInscripcion,
    guardarPeriodoSubidaNotas
  }
}

export default useSuperRootData