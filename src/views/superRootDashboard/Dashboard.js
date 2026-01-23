import React, { useRef, useEffect } from 'react'
import { CRow, CCol } from '@coreui/react'
import { getStyle } from '@coreui/utils'

// Componentes
import StatsWidgets from './components/widgets/statsWidgets'
import QuickActions from './components/widgets/quickActions'
import ValidacionChart from './components/charts/validacionChart'
import BoletinesChart from './components/charts/boletinesChart'
import PeriodoInscripcionModal from './components/modals/periodoInscripcionModal'
import ValidacionNotasModal from './components/modals/validacionNotasModal'
import ControlBoletinesModal from './components/modals/controlBoletinesModal'
import GestionAccesosModal from './components/modals/gestionAccesoModal'

// Hook de datos
import useSuperRootData from './hooks/userSuperRootData'

export const SuperRootDashboard = () => {
  const chartRef = useRef(null)
  
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
    <>
      <h1 className="mb-4 fw-bold">SuperRoot - Endanza</h1>
      <p className="text-muted mb-4">Panel de control administrativo para gestión completa de la escuela de danza</p>

      {/* Widgets Superiores */}
      <StatsWidgets 
        notasPendientes={notasPendientes}
        boletines={boletines}
        periodoInscripcion={periodoInscripcion}
        usuarios={usuarios}
        onOpenValidacionNotas={() => setVisibleValidacionNotas(true)}
        onOpenControlBoletines={() => setVisibleControlBoletines(true)}
        onOpenPeriodoInscripcion={() => setVisiblePeriodoInscripcion(true)}
        onOpenGestionAccesos={() => setVisibleGestionAccesos(true)}
      />

      {/* Acciones Rápidas */}
      <QuickActions 
        periodoInscripcion={periodoInscripcion}
        onOpenValidacionNotas={() => setVisibleValidacionNotas(true)}
        onOpenControlBoletines={() => setVisibleControlBoletines(true)}
        onOpenPeriodoInscripcion={() => setVisiblePeriodoInscripcion(true)}
        onOpenGestionAccesos={() => setVisibleGestionAccesos(true)}
      />

      {/* Gráficos */}
      <CRow className="gy-4">
        <CCol xs={12} md={6}>
          <ValidacionChart chartRef={chartRef} />
        </CCol>
        <CCol xs={12} md={6}>
          <BoletinesChart boletines={boletines} />
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
        onHabilitarTodos={() => setBoletines(boletines.map(b => ({...b, disponible: true})))}
      />

      <GestionAccesosModal 
        visible={visibleGestionAccesos}
        onClose={() => setVisibleGestionAccesos(false)}
        usuarios={usuarios}
        onToggleActivo={toggleUsuarioActivo}
      />
    </>
  )
}

export default SuperRootDashboard