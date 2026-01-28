import React, { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CRow, CCol, CCard, CCardHeader, CCardBody, CContainer } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer } from '@coreui/icons'
import { getStyle } from '@coreui/utils'

// Componentes
import StatsWidgets from './components/widgets/statsWidgets'
import ValidacionChart from './components/charts/validacionChart'
import BoletinesChart from './components/charts/boletinesChart'
import PeriodoInscripcionModal from './components/modals/periodoInscripcionModal'
import ValidacionNotasModal from './components/modals/validacionNotasModal'
import ControlBoletinesModal from './components/modals/controlBoletinesModal'

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
          <CCard className="shadow-sm border-0 mb-4 overflow-hidden" style={{ borderRadius: '16px' }}>
            <div className="bg-primary" style={{ height: '6px' }}></div>
            <CCardHeader className="border-bottom-0 pt-4 pb-3 px-4 bg-white">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <h4 className="mb-1 fw-bold text-dark d-flex align-items-center">
                    <CIcon icon={cilSpeedometer} className="me-2 text-primary" />
                    Panel de Control SuperRoot
                  </h4>
                  <p className="text-muted mb-0 small fw-medium">
                    Administración total del sistema ENDANZA
                  </p>
                </div>
              </div>
            </CCardHeader>

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
    </CContainer>
  )
}

export default SuperRootDashboard