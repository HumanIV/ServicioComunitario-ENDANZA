import { useState, useEffect } from 'react'
import { listUsers } from '../../../services/userService'

export const useDashboardData = () => {
  const [usuarios, setUsuarios] = useState([])
  const [repsCount, setRepsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  
  const [students] = useState([])
  const [sections] = useState([])
  
  const [visiblePeriodoInscripcion, setVisiblePeriodoInscripcion] = useState(false)
  const [visibleSubidaNotas, setVisibleSubidaNotas] = useState(false)

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const usersData = await listUsers()
        console.log('📊 Usuarios recibidos en dashboard:', usersData)
        
        const users = Array.isArray(usersData) ? usersData : []
        
        // ✅ TRANSFORMAR los datos al formato que espera el dashboard
        const usuariosTransformados = users
          .filter(u => u?.role !== 'representante')
          .map(u => ({
            id: u.id,
            nombre: `${u.first_name || ''} ${u.last_name || ''}`.trim(), // ✅ Combina first_name + last_name
            rol: u.role || 'sin rol',
            activo: u.status === 'active'
          }))
        
        setUsuarios(usuariosTransformados)
        setRepsCount(users.filter(u => u?.role === 'representante').length)
      } catch (error) {
        console.error("Error fetching data for dashboard:", error)
        setUsuarios([])
        setRepsCount(0)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const guardarPeriodoInscripcion = (data) => {
    setPeriodoInscripcion(data)
    setVisiblePeriodoInscripcion(false)
  }

  const guardarPeriodoSubidaNotas = (data) => {
    setPeriodoSubidaNotas(data)
    setVisibleSubidaNotas(false)
  }

  return {
    periodoInscripcion,
    periodoSubidaNotas,
    usuarios,        // ✅ AHORA SÍ tiene { id, nombre, rol, activo }
    repsCount,
    students,
    sections,
    loading,
    visiblePeriodoInscripcion,
    setVisiblePeriodoInscripcion,
    visibleSubidaNotas,
    setVisibleSubidaNotas,
    guardarPeriodoInscripcion,
    guardarPeriodoSubidaNotas
  }
}

export default useDashboardData