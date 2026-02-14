import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CContainer,
  CSpinner,
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilPlus, cilSchool, cilUser, cilAddressBook, cilExternalLink, cilChevronBottom } from '@coreui/icons'

// Componentes
import StatsWidgets from './components/widgets/statsWidgets'
import TeacherSectionsList from './components/TeacherSectionsList'
import PeriodoInscripcionModal from './components/modals/periodoInscripcionModal'
import SubidaNotasModal from './components/modals/subidaNotasModal'
<<<<<<< Updated upstream
=======
import ValidacionNotasModal from './components/modals/validacionNotasModal'
import ControlBoletinesModal from './components/modals/controlBoletinesModal'
import CrearAnioModal from './components/modals/CrearAnioModal'
>>>>>>> Stashed changes
import SystemMessageModal from '../../components/SystemMessageModal'

// Hook y servicios
import useSuperRootData from './hooks/userSuperRootData'
import { addAcademicYear, getAvailableYears } from '../../services/schedules'

export const SuperRootDashboard = () => {
  const navigate = useNavigate()
  const [currentYear, setCurrentYear] = useState('')
  const [availableYears, setAvailableYears] = useState([])

  const {
    periodoInscripcion,
    periodoSubidaNotas,
    usuarios,
    repsCount,
    students,
    sections,
    loading,
<<<<<<< Updated upstream
=======

    // Nuevos datos
    notasPendientes,
    boletines,
    teachers, // ✅ AGREGADO - AHORA ESTÁ DEFINIDO

    // Estados de modales
>>>>>>> Stashed changes
    visiblePeriodoInscripcion,
    setVisiblePeriodoInscripcion,
    visibleSubidaNotas,
    setVisibleSubidaNotas,
<<<<<<< Updated upstream
=======
    visibleValidacionNotas,
    setVisibleValidacionNotas,
    visibleControlBoletines,
    setVisibleControlBoletines,

    // Acciones
>>>>>>> Stashed changes
    guardarPeriodoInscripcion,
    guardarPeriodoSubidaNotas
  } = useSuperRootData()

  const [messageModal, setMessageModal] = useState({
    visible: false,
    title: '',
    message: '',
    variant: 'alert',
    type: 'info',
    onConfirm: null
  })

  useEffect(() => {
    fetchYears()
  }, [])

  const fetchYears = async () => {
    try {
      const years = await getAvailableYears()
      console.log("Años recibidos:", years)
      setAvailableYears(Array.isArray(years) ? years : [])

      // Seleccionar el primer año por defecto, o el activo si existe
      if (years.length > 0 && !currentYear) {
        // Buscar el año 2024-2025 primero si existe
        const year2025 = years.find(y => y.name === '2024-2025')
        const activeYear = years.find(y => y.active === true)
        setCurrentYear(year2025 || activeYear || years[0])
      }
    } catch (error) {
      console.error("Error fetching years:", error)
    }
  }

  const confirmCreateYear = async (nuevoAnio) => {
    try {
      const response = await addAcademicYear(nuevoAnio)

      if (response.ok) {
        await fetchYears() // Recargar la lista

        // Mostrar mensaje de éxito
        showSystemMessage('¡Éxito!', `Ciclo ${nuevoAnio} creado y aperturado correctamente.`, 'success')

        return true
      } else {
        throw new Error(response.msg || 'No se pudo crear el ciclo')
      }
    } catch (e) {
      showSystemMessage('Error', 'No se pudo crear el ciclo: ' + e.message, 'error')
      return false
    }
  }

  const handleCreateNextYear = () => {
    setVisibleCrearAnio(true)
  }

  const handleAprobarNota = async (notaId) => {
    const success = await aprobarNotaPendiente(notaId)
    if (success) {
      showSystemMessage('Éxito', 'Nota aprobada correctamente', 'success')
    } else {
      showSystemMessage('Error', 'No se pudo aprobar la nota', 'error')
    }
  }

  const handleRechazarNota = async (notaId) => {
    const success = await rechazarNotaPendiente(notaId)
    if (success) {
      showSystemMessage('Éxito', 'Nota rechazada correctamente', 'success')
    } else {
      showSystemMessage('Error', 'No se pudo rechazar la nota', 'error')
    }
  }

  const handleAprobarTodasNotas = async () => {
    const success = await aprobarTodasNotasPendientes()
    if (success) {
      showSystemMessage('Éxito', 'Todas las notas fueron aprobadas', 'success')
      setVisibleValidacionNotas(false)
    } else {
      showSystemMessage('Error', 'No se pudieron aprobar todas las notas', 'error')
    }
  }

  const handleToggleBoletin = async (id) => {
    const boletin = boletines.find(b => b.id === id)
    const success = await toggleBoletin(id, !boletin.disponible)
    if (success) {
      showSystemMessage('Éxito', `Boletín ${!boletin.disponible ? 'habilitado' : 'deshabilitado'}`, 'success')
    } else {
      showSystemMessage('Error', 'No se pudo cambiar el estado del boletín', 'error')
    }
  }

  const handleHabilitarTodosBoletines = async () => {
    if (notasPendientes.length > 0) {
      showSystemMessage(
        'Validación requerida',
        'No se pueden habilitar los boletines porque hay notas pendientes de validación.',
        'warning'
      )
      return
    }

    const success = await habilitarTodosBoletinesDelAnio()
    if (success) {
      showSystemMessage('Éxito', 'Todos los boletines fueron habilitados', 'success')
      setVisibleControlBoletines(false)
    } else {
      showSystemMessage('Error', 'No se pudieron habilitar todos los boletines', 'error')
    }
  }

  const closeMessageModal = () => {
    setMessageModal(prev => ({ ...prev, visible: false }))
  }

  const showSystemMessage = (title, message, type = 'info', variant = 'alert', onConfirm = null) => {
    setMessageModal({
      visible: true,
      title,
      message,
      type,
      variant,
      onConfirm
    })
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light-custom">
        <CSpinner color="primary" variant="grow" />
      </div>
    )
  }

  return (
    <CContainer fluid className="px-0 pb-5 overflow-hidden">
      {/* HEADER REFINADO */}
      <div className="mb-4 mb-md-5 mt-4 px-3 px-md-4">
        <CRow className="align-items-center g-3">
          <CCol xs={12} lg={7}>
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded-4 me-3 d-flex align-items-center justify-content-center shadow-orange flex-shrink-0" style={{ width: '56px', height: '56px' }}>
                <CIcon icon={cilSpeedometer} className="text-white" size="xl" />
              </div>
              <div className="overflow-hidden">
                <h2 className="fw-black mb-0 header-title-custom ls-tight display-6 fs-3 fs-md-2">Consola SuperRoot</h2>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="text-muted-custom fw-medium small">Gestión Administrativa de</span>
                  <span className="text-primary fw-bold px-2 py-0 rounded bg-orange-soft small">ENDANZA</span>
                </div>
              </div>
            </div>
          </CCol>
          <CCol xs={12} lg={5} className="d-flex justify-content-lg-end align-items-center gap-2 flex-wrap flex-md-nowrap">
            <CDropdown className="cycle-dropdown">
              <CDropdownToggle
                className="bg-glass-premium border border-light-custom border-opacity-10 fw-bold text-primary-header small d-flex align-items-center px-3 py-2 rounded-pill hover-lift shadow-none"
              >
                <CIcon icon={cilSchool} className="me-2 text-primary" />
                <span>CICLO {currentYear}</span>
                <CIcon icon={cilChevronBottom} className="ms-2 opacity-50" size="sm" />
              </CDropdownToggle>
              <CDropdownMenu className="cycle-dropdown-menu">
                {availableYears.map(year => (
                  <CDropdownItem
                    key={year}
                    onClick={() => setCurrentYear(year)}
                    className={`cycle-dropdown-item ${currentYear === year ? 'active' : ''}`}
                  >
                    Período {year}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>

            <CButton
              color="primary"
              className="rounded-pill px-4 py-2 fw-bold text-white shadow-sm d-flex align-items-center btn-premium"
              onClick={handleCreateNextYear}
              style={{ height: '42px' }}
            >
              <CIcon icon={cilPlus} className="me-2" size="sm" />
              <span className="text-nowrap">NUEVA GESTIÓN</span>
            </CButton>
          </CCol>
        </CRow>
      </div>

      <div className="px-3 px-md-4">
        {/* WIDGETS DE ESTADÍSTICAS */}
        <StatsWidgets
          students={students}
          repsCount={repsCount}
          periodoInscripcion={periodoInscripcion}
          periodoSubidaNotas={periodoSubidaNotas}
          onOpenPeriodoInscripcion={() => setVisiblePeriodoInscripcion(true)}
          onOpenSubidaNotas={() => setVisibleSubidaNotas(true)}
        />

        <CRow className="gy-4">
          <CCol xs={12} lg={8}>
<<<<<<< Updated upstream
  <TeacherSectionsList sections={sections} />
=======
            <TeacherSectionsList
              sections={sections || []}
              teachers={teachers || []}  // ✅ AHORA teachers ESTÁ DEFINIDO
              currentYear={currentYear}
              loading={loading}
            />
>>>>>>> Stashed changes
          </CCol >

  <CCol xs={12} lg={4}>
    {/* PANEL DE USUARIOS REFINADO */}
    <CCard className="premium-card border-0 shadow-sm overflow-hidden h-100 bg-glass-premium" style={{ borderRadius: '24px' }}>
      <CCardHeader className="bg-transparent border-0 pt-4 px-4 pb-0">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="fw-bold header-title-custom d-flex align-items-center mb-0">
            <CIcon icon={cilUser} className="me-2 text-primary" />
            Accesos
          </h5>
          <CBadge color="primary" className="bg-opacity-10 text-primary rounded-pill px-2 py-1">
            {usuarios.length} TOTAL
          </CBadge>
        </div>
      </CCardHeader>
      <CCardBody className="px-4 py-4">
        <div className="d-flex flex-column gap-2 mb-4">
<<<<<<< Updated upstream
{
  usuarios.slice(0, 5).map(u => (
                    <div key={u.id} className="d-flex align-items-center p-3 rounded-4 bg-light-custom bg-opacity-25 border border-light-custom border-opacity-10 hover-lift-subtle shadow-xs">
                      <div className="bg-orange-soft rounded-circle me-3 d-flex align-items-center justify-content-center text-primary fw-bold flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                        {u.nombre[0]}
=======
                  {usuarios && usuarios.length > 0 ? (
          usuarios.slice(0, 5).map(u => (
                      <div key={u?.id || Math.random()} className="d-flex align-items-center p-3 rounded-4 bg-light-custom bg-opacity-25 border border-light-custom border-opacity-10 hover-lift-subtle shadow-xs">
                        <div className="bg-orange-soft rounded-circle me-3 d-flex align-items-center justify-content-center text-primary fw-bold flex-shrink-0"
                          style={{ width: '40px', height: '40px' }}>
                          {u?.nombre ? u.nombre[0] : '?'}
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="fw-bold header-title-custom text-truncate small">
                            {u?.nombre || 'Sin nombre'}
                          </div>
                          <div className="text-muted-custom text-truncate" style={{ fontSize: '0.7rem' }}>
                            {u?.rol?.toUpperCase() || 'SIN ROL'}
                          </div>
                        </div>
                        {u?.activo ? (
                          <span className="badge-dot bg-success"></span>
                        ) : (
                          <span className="badge-dot bg-danger"></span>
                        )}
>>>>>>> Stashed changes
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="fw-bold header-title-custom text-truncate small">{u.nombre}</div>
                        <div className="text-muted-custom text-truncate" style={{ fontSize: '0.7rem' }}>{u.rol.toUpperCase()}</div>
                      </div>
                      {
              u.activo ? (
                <span className="badge-dot bg-success"></span>
              ) : (
                <span className="badge-dot bg-danger"></span>
              )
            }
                    </div>
                  ))}
    </div>

    <CButton
      className="w-100 rounded-pill fw-bold py-3 btn-orange-outline d-flex align-items-center justify-content-center"
      onClick={() => navigate('/users')}
    >
      GESTIONAR TODOS LOS USUARIOS
      <CIcon icon={cilExternalLink} className="ms-2" size="sm" />
    </CButton>
              </CCardBody >
            </CCard >
          </CCol >
        </CRow >
      </div >

    {/* MODALES */ }
    < PeriodoInscripcionModal
        visible = { visiblePeriodoInscripcion }
        onClose = {() => setVisiblePeriodoInscripcion(false)}
periodoInscripcion = { periodoInscripcion }
onSave = { guardarPeriodoInscripcion }
  />

      <SubidaNotasModal
        visible={visibleSubidaNotas}
        onClose={() => setVisibleSubidaNotas(false)}
        periodoSubida={periodoSubidaNotas}
        onSave={guardarPeriodoSubidaNotas}
      />

      <SystemMessageModal
        visible={messageModal.visible}
        onClose={closeMessageModal}
        onConfirm={messageModal.onConfirm}
        variant={messageModal.variant}
        type={messageModal.type}
        title={messageModal.title}
        message={messageModal.message}
      />
    </CContainer >
  )
}

export default SuperRootDashboard