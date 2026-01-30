import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CRow, CCol, CCard, CCardHeader, CCardBody, CContainer } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilPlus, cilSchool } from '@coreui/icons'
import { getStyle } from '@coreui/utils'
import { CButton } from '@coreui/react'

// Componentes
import StatsWidgets from './components/widgets/statsWidgets'
import ValidacionChart from './components/charts/validacionChart'
import BoletinesChart from './components/charts/boletinesChart'
import PeriodoInscripcionModal from './components/modals/periodoInscripcionModal'
import ValidacionNotasModal from './components/modals/validacionNotasModal'
import ControlBoletinesModal from './components/modals/controlBoletinesModal'
import SystemMessageModal from '../../components/SystemMessageModal' // Import nuevo
import { addAcademicYear, getAvailableYears } from '../../services/schedules'

// Hook de datos
import useSuperRootData from './hooks/userSuperRootData'

export const SuperRootDashboard = () => {
  const chartRef = useRef(null)
  const navigate = useNavigate()

  const {
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
    visibleGestionAccesos,
    setVisibleGestionAccesos,

    // Funciones
    aprobarNotas,
    rechazarNotas,
    toggleBoletinDisponible,
    toggleUsuarioActivo,
    guardarPeriodoInscripcion
  } = useSuperRootData()

  const [currentYear, setCurrentYear] = useState('')

  // Estado para el modal de sistema
  const [messageModal, setMessageModal] = useState({
    visible: false,
    title: '',
    message: '',
    variant: 'alert', // 'alert' | 'confirm'
    type: 'info', // 'success' | 'warning' | 'error' | 'info'
    onConfirm: null
  })

  useEffect(() => {
    getAvailableYears().then(years => {
      if (years.length > 0) setCurrentYear(years[0])
    })
  }, [])

  const checkCanCreateYear = () => {
    const now = new Date()
    const currentMonth = now.getMonth() // 0-11
    const currentCalendarYear = now.getFullYear()

    if (currentMonth !== 8) { // 8 es Septiembre
      return {
        allowed: false,
        reason: 'La apertura de nuevos ciclos académicos solo está permitida durante el mes de Septiembre.'
      }
    }

    const lastCreated = localStorage.getItem('last_academic_year_creation_calendar_year')
    if (lastCreated === currentCalendarYear.toString()) {
      return {
        allowed: false,
        reason: 'El ciclo académico para este periodo ya ha sido aperturado previamente.'
      }
    }
    return { allowed: true }
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

  const confirmCreateYear = async () => {
    // Cerrar modal de confirmación antes de procesar
    closeMessageModal()

    if (!currentYear) return

    const [start, end] = currentYear.split('-').map(Number);
    const nextYear = `${start + 1}-${end + 1}`;

    try {
      await addAcademicYear(nextYear)
      localStorage.setItem('last_academic_year_creation_calendar_year', new Date().getFullYear().toString())

      // Actualizar lista
      const years = await getAvailableYears()
      if (years.length > 0) setCurrentYear(years[0])

      // Mostrar éxito
      setTimeout(() => {
        showSystemMessage('¡Éxito!', 'Nuevo ciclo escolar creado exitosamente.', 'success')
      }, 300)

    } catch (e) {
      setTimeout(() => {
        showSystemMessage('Error', 'No se pudo crear el ciclo: ' + e.message, 'error')
      }, 300)
    }
  }

  const handleCreateNextYear = () => {
    const validation = checkCanCreateYear()
    if (!validation.allowed) {
      showSystemMessage('Acción No Permitida', validation.reason, 'warning')
      return
    }

    if (!currentYear) return

    const [start, end] = currentYear.split('-').map(Number);
    const nextYear = `${start + 1}-${end + 1}`;

    showSystemMessage(
      'Confirmar Nuevo Ciclo',
      `¿Desea aperturar oficialmente el nuevo Ciclo Académico ${nextYear}? Esta acción preparará el sistema para el nuevo periodo.`,
      'info',
      'confirm',
      confirmCreateYear
    )
  }

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return
    chart.options.plugins.legend.labels.color = getStyle('--cui-body-color')
    chart.update()
  }, [])

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          {/* HEADER PREMIUM CON DISEÑO CONSISTENTE */}
          <CCard className="premium-card border-0 mb-4 overflow-hidden" style={{ borderRadius: '20px' }}>
            <div className="bg-primary" style={{ height: '6px' }}></div>
            <CCardHeader className="border-bottom-0 pt-4 pb-3 px-4 bg-transparent">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <h4 className="mb-1 fw-bold dashboard-header-title d-flex align-items-center">
                    <CIcon icon={cilSpeedometer} className="me-2 text-primary" />
                    Panel de Control SuperRoot
                  </h4>
                  <p className="dashboard-header-subtitle mb-0 small fw-medium">
                    Administración total del sistema ENDANZA
                  </p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center bg-light-custom px-3 py-2 rounded-pill border border-light-custom text-muted-custom small fw-bold">
                    <CIcon icon={cilSchool} className="me-2 text-primary" />
                    Ciclo Actual: {currentYear || '...'}
                  </div>
                  <CButton
                    onClick={handleCreateNextYear}
                    className="btn-premium px-3 py-2 d-flex align-items-center text-white"
                    title="Aperturar Nuevo Ciclo"
                  >
                    <CIcon icon={cilPlus} className="me-2" />
                    Nuevo Ciclo
                  </CButton>
                </div>
              </div>
            </CCardHeader>

            <style>{`
              .dashboard-header-title { color: var(--neutral-800); }
              .dashboard-header-subtitle { color: var(--neutral-500); }
              
              [data-coreui-theme="dark"] .dashboard-header-title { color: white; }
              [data-coreui-theme="dark"] .dashboard-header-subtitle { color: rgba(255,255,255,0.5); }
            `}</style>

            <CCardBody className="px-4 pb-4">
              {/* Widgets Superiores */}
              <StatsWidgets
                notasPendientes={notasPendientes}
                boletines={boletines}
                periodoInscripcion={periodoInscripcion}
                usuarios={usuarios}
                onOpenValidacionNotas={() => setVisibleValidacionNotas(true)}
                onOpenControlBoletines={() => setVisibleControlBoletines(true)}
                onOpenPeriodoInscripcion={() => setVisiblePeriodoInscripcion(true)}
                onOpenGestionAccesos={() => navigate('/users')}
              />

              {/* Gráficos */}
              <CRow className="gy-4 mt-2">
                <CCol xs={12} md={6}>
                  <ValidacionChart chartRef={chartRef} />
                </CCol>
                <CCol xs={12} md={6}>
                  <BoletinesChart boletines={boletines} />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modales */}
      <PeriodoInscripcionModal
        visible={visiblePeriodoInscripcion}
        onClose={() => setVisiblePeriodoInscripcion(false)}
        periodoInscripcion={periodoInscripcion}
        setPeriodoInscripcion={setPeriodoInscripcion}
        onSave={guardarPeriodoInscripcion}
      />

      <ValidacionNotasModal
        visible={visibleValidacionNotas}
        onClose={() => setVisibleValidacionNotas(false)}
        notasPendientes={notasPendientes}
        onAprobar={aprobarNotas}
        onRechazar={rechazarNotas}
      />

      <ControlBoletinesModal
        visible={visibleControlBoletines}
        onClose={() => setVisibleControlBoletines(false)}
        boletines={boletines}
        onToggleDisponible={toggleBoletinDisponible}
        onHabilitarTodos={() => setBoletines(boletines.map(b => ({ ...b, disponible: true })))}
      />

      {/* Nuevo Modal de Mensajes del Sistema */}
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