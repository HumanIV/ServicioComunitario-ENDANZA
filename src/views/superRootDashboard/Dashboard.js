// Archivo: src/dashboard/SuperRootDashboard.jsx

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
import { cilSpeedometer, cilPlus, cilSchool, cilUser, cilExternalLink, cilChevronBottom, cilCalendar } from '@coreui/icons'

// Componentes
import StatsWidgets from './components/widgets/statsWidgets'
import TeacherSectionsList from './components/TeacherSectionsList'
import PeriodoInscripcionModal from './components/modals/periodoInscripcionModal'
import SubidaNotasModal from './components/modals/subidaNotasModal'
import ValidacionNotasModal from './components/modals/validacionNotasModal'
import ControlBoletinesModal from './components/modals/controlBoletinesModal'
import CrearAnioModal from './components/modals/CrearAnioModal'
import SystemMessageModal from '../../components/SystemMessageModal'

// Hooks y servicios
import useDashboardData from './hooks/useDashboardData'
import { getAvailableYears, addAcademicYear } from '../../services/configService'

export const SuperRootDashboard = () => {
  const navigate = useNavigate()
  const [currentYear, setCurrentYear] = useState(null)
  const [availableYears, setAvailableYears] = useState([])
  const [visibleCrearAnio, setVisibleCrearAnio] = useState(false)

  // ✅ Hook con todos los datos necesarios - INCLUYE TEACHERS
  const {
    // Datos básicos
    periodoInscripcion,
    periodoSubidaNotas,
    usuarios,
    repsCount,
    students,
    sections,
    loading,

    // Nuevos datos
    notasPendientes,
    boletines,
    teachers, // ✅ AGREGADO - AHORA ESTÁ DEFINIDO

    // Estados de modales
    visiblePeriodoInscripcion,
    setVisiblePeriodoInscripcion,
    visibleSubidaNotas,
    setVisibleSubidaNotas,
    visibleValidacionNotas,
    setVisibleValidacionNotas,
    visibleControlBoletines,
    setVisibleControlBoletines,

    // Acciones
    guardarPeriodoInscripcion,
    guardarPeriodoSubidaNotas,
    aprobarNotaPendiente,
    rechazarNotaPendiente,
    aprobarTodasNotasPendientes,
    toggleBoletin,
    habilitarTodosBoletinesDelAnio,
    refreshData
  } = useDashboardData(currentYear?.id)

  const [messageModal, setMessageModal] = useState({
    visible: false,
    title: '',
    message: '',
    variant: 'alert',
    type: 'info',
    onConfirm: null
  })

  // Cargar años disponibles al montar el componente
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
      setAvailableYears([])
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
      throw e
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

  const puedeHabilitarBoletines = notasPendientes.length === 0

  return (
    <CContainer fluid className="px-0 pb-5 overflow-hidden">
      {/* HEADER */}
      <div className="mb-4 mb-md-5 mt-4 px-3 px-md-4">
        <CRow className="align-items-center g-3">
          <CCol xs={12} lg={7}>
            <div className="d-flex align-items-center">
              <div className="bg-orange rounded-4 me-3 d-flex align-items-center justify-content-center shadow-orange flex-shrink-0" style={{ width: '64px', height: '64px' }}>
                <CIcon icon={cilSpeedometer} className="text-white" size="xl" />
              </div>
              <div className="overflow-hidden">
                <h2 className="fw-black mb-0 header-title-custom ls-tight display-6 fs-3 fs-md-2 text-uppercase">Consola SuperRoot</h2>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="text-muted-custom fw-medium small text-uppercase ls-1">Gestión Administrativa de</span>
                  <span className="fw-bold px-2 py-0 rounded bg-orange-soft small ls-1" style={{ color: '#C35604' }}>ENDANZA</span>
                </div>
              </div>
            </div>
          </CCol>
          <CCol xs={12} lg={5} className="d-flex justify-content-lg-end align-items-center gap-2 flex-wrap flex-md-nowrap">
            <CDropdown className="cycle-dropdown">
              <CDropdownToggle
                className="bg-glass-premium border border-light-custom border-opacity-10 fw-bold text-primary small d-flex align-items-center px-4 py-2 rounded-pill hover-lift shadow-sm btn-cycle-toggle"
              >
                <CIcon icon={cilSchool} className="me-2 text-primary" />
                <span className="ls-1">CICLO {currentYear?.name || 'CARGANDO...'}</span>
                <CIcon icon={cilChevronBottom} className="ms-3 opacity-50" size="sm" />
              </CDropdownToggle>
              <CDropdownMenu className="cycle-dropdown-menu premium-dropdown-menu border-0 shadow-lg animate__animated animate__fadeIn p-2" style={{ borderRadius: '16px' }}>
                {availableYears.map(year => (
                  <CDropdownItem
                    key={year.id}
                    onClick={() => setCurrentYear(year)}
                    className={`cycle-dropdown-item dropdown-item-premium rounded-3 py-2 px-3 mb-1 ${currentYear?.id === year.id ? 'active' : ''}`}
                  >
                    <CIcon icon={cilCalendar} className="me-2 opacity-50" />
                    Período {year.name}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>

            <CButton
              className="rounded-pill px-4 py-2 fw-bold text-white shadow-sm d-flex align-items-center btn-premium-action border-0"
              onClick={handleCreateNextYear}
              style={{ height: '42px' }}
            >
              <CIcon icon={cilPlus} className="me-2" size="sm" />
              <span className="text-nowrap ls-1">NUEVA GESTIÓN</span>
            </CButton>
          </CCol>
        </CRow>
      </div>

      <div className="px-3 px-md-4">

        {/* WIDGETS DE ESTADÍSTICAS - Actualizado con notas y boletines */}
        <StatsWidgets
          students={students || []}
          repsCount={repsCount || 0}
          periodoInscripcion={periodoInscripcion}
          periodoSubidaNotas={periodoSubidaNotas}
          notasPendientes={notasPendientes}
          boletines={boletines}
          onOpenPeriodoInscripcion={() => setVisiblePeriodoInscripcion(true)}
          onOpenSubidaNotas={() => setVisibleSubidaNotas(true)}
          onOpenValidacionNotas={() => setVisibleValidacionNotas(true)}
          onOpenControlBoletines={() => setVisibleControlBoletines(true)}
        />

        <CRow className="gy-4">
          <CCol xs={12} lg={8}>
            <TeacherSectionsList
              sections={sections || []}
              teachers={teachers || []}  // ✅ AHORA teachers ESTÁ DEFINIDO
              currentYear={currentYear}
              loading={loading}
            />
          </CCol>

          <CCol xs={12} lg={4}>
            {/* PANEL DE USUARIOS */}
            <CCard className="premium-card border-0 shadow-lg overflow-hidden h-100 bg-glass-premium" style={{ borderRadius: '24px' }}>
              <div className="premium-card-header p-4 pb-0 bg-transparent border-0">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h5 className="fw-bold header-title-custom d-flex align-items-center mb-0 text-uppercase ls-1">
                    <div className="header-icon-container me-3">
                      <CIcon icon={cilUser} />
                    </div>
                    Accesos
                  </h5>
                  <CBadge color="warning" className="premium-role-badge px-3 py-2 rounded-pill shadow-sm">
                    {usuarios?.length || 0} TOTAL
                  </CBadge>
                </div>
              </div>
              <CCardBody className="px-4 py-3">
                <div className="d-flex flex-column gap-3 mb-4 mt-2">
                  {usuarios && usuarios.length > 0 ? (
                    usuarios.slice(0, 5).map(u => (
                      <div key={u?.id || Math.random()} className="premium-info-box p-3 rounded-4 d-flex align-items-center transition-all bg-white shadow-xs border border-light-custom">
                        <div className="avatar-square-premium me-3 d-flex align-items-center justify-content-center fw-bold shadow-sm"
                          style={{ background: 'linear-gradient(135deg, #F28C0F, #F8A13E)', width: '42px', height: '42px', borderRadius: '12px', color: 'white' }}>
                          {u?.nombre ? u.nombre[0].toUpperCase() : '?'}
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="fw-bold text-dark-custom text-truncate mb-0" style={{ fontSize: '0.9rem' }}>
                            {u?.nombre} {u?.apellido}
                          </div>
                          <div className="text-muted-custom text-uppercase fw-bold ls-1" style={{ fontSize: '0.65rem' }}>
                            {u?.rol?.toUpperCase() || 'USUARIO'}
                          </div>
                        </div>
                        <div className={`pulse-dot ${u?.activo ? 'bg-success' : 'bg-danger'}`}
                          style={{ width: '10px', height: '10px' }}></div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-custom fw-medium opacity-50 italic">
                      No hay usuarios para mostrar
                    </div>
                  )}
                </div>

                <CButton
                  className="w-100 rounded-pill fw-heavy py-3 premium-outline-btn d-flex align-items-center justify-content-center text-uppercase ls-1"
                  onClick={() => navigate('/users')}
                  style={{ fontSize: '0.75rem' }}
                >
                  GESTIONAR TODOS LOS USUARIOS
                  <CIcon icon={cilExternalLink} className="ms-2" size="sm" />
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>

      {/* MODALES */}
      <PeriodoInscripcionModal
        visible={visiblePeriodoInscripcion}
        onClose={() => setVisiblePeriodoInscripcion(false)}
        periodoInscripcion={periodoInscripcion}
        onSave={guardarPeriodoInscripcion}
      />

      <SubidaNotasModal
        visible={visibleSubidaNotas}
        onClose={() => setVisibleSubidaNotas(false)}
        periodoSubida={periodoSubidaNotas}
        onSave={guardarPeriodoSubidaNotas}
      />

      <ValidacionNotasModal
        visible={visibleValidacionNotas}
        onClose={() => setVisibleValidacionNotas(false)}
        notasPendientes={notasPendientes}
        onAprobar={handleAprobarNota}
        onRechazar={handleRechazarNota}
      />

      <ControlBoletinesModal
        visible={visibleControlBoletines}
        onClose={() => setVisibleControlBoletines(false)}
        boletines={boletines}
        onToggleDisponible={handleToggleBoletin}
        onHabilitarTodos={handleHabilitarTodosBoletines}
      />

      <CrearAnioModal
        visible={visibleCrearAnio}
        onClose={() => setVisibleCrearAnio(false)}
        onConfirm={confirmCreateYear}
        currentYear={currentYear}
        existingYears={availableYears}
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
    </CContainer>
  )
}

export default SuperRootDashboard