import React from 'react'
import { CRow, CCol, CCard, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilClipboard, cilChartLine, cilCalendar, cilUserFollow } from '@coreui/icons'

const PremiumStatCard = ({ title, value, subtitle, icon, onClick }) => (
  <CCard
    className="premium-card h-100 cursor-pointer hover-lift border-0 overflow-hidden"
    onClick={onClick}
    style={{ borderRadius: '20px' }}
  >
    <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', background: '#E07B00' }}></div>
    <CCardBody className="d-flex flex-column justify-content-between p-4" style={{ zIndex: 1 }}>
      <div>
        <div className="d-flex align-items-center mb-3">
          <div className="bg-orange-soft p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
            <span className="text-primary">{icon}</span>
          </div>
          <h6 className="stat-card-title mb-0 small fw-bold text-uppercase ls-1">{title}</h6>
        </div>
        <h2 className="fw-bold mb-1 stat-card-value display-6">{value}</h2>
        <p className="stat-card-subtitle small mb-0">{subtitle}</p>
      </div>
      <div className="mt-4 pt-3 border-top border-light-custom d-flex justify-content-end">
        <span className="small text-primary fw-bold">Ver detalles →</span>
      </div>
    </CCardBody>

    <style>{`
      .hover-lift:hover { 
        transform: translateY(-6px); 
        cursor: pointer;
      }
      .bg-orange-soft { background-color: rgba(242, 140, 15, 0.1); }
      .ls-1 { letter-spacing: 1px; }
      
      .stat-card-title { color: var(--neutral-500); }
      .stat-card-value { color: var(--neutral-800); }
      .stat-card-subtitle { color: var(--neutral-400); }
      .border-top.border-light-custom { border-top: 1px solid rgba(0,0,0,0.05) !important; }

      [data-coreui-theme="dark"] .stat-card-title { color: rgba(255,255,255,0.5); }
      [data-coreui-theme="dark"] .stat-card-value { color: white; }
      [data-coreui-theme="dark"] .stat-card-subtitle { color: rgba(255,255,255,0.4); }
      [data-coreui-theme="dark"] .border-top.border-light-custom { border-top: 1px solid rgba(255,255,255,0.05) !important; }
    `}</style>
  </CCard>
)

const StatsWidgets = ({
  notasPendientes,
  boletines,
  periodoInscripcion,
  usuarios,
  onOpenValidacionNotas,
  onOpenControlBoletines,
  onOpenPeriodoInscripcion,
  onOpenGestionAccesos
}) => {
  return (
    <CRow className="mb-4 gy-4">
      {/* Notas Pendientes */}
      <CCol xs={12} sm={6} lg={3}>
        <PremiumStatCard
          title="Notas por Validar"
          value={notasPendientes.filter(n => n.estado === 'pendiente').length}
          subtitle="Registros pendientes de revisión"
          icon={<CIcon icon={cilClipboard} size="lg" />}
          onClick={onOpenValidacionNotas}
        />
      </CCol>

      {/* Boletines */}
      <CCol xs={12} sm={6} lg={3}>
        <PremiumStatCard
          title="Boletines Activos"
          value={boletines.filter(b => b.disponible).length}
          subtitle={`de ${boletines.length} totales disponibles`}
          icon={<CIcon icon={cilChartLine} size="lg" />}
          onClick={onOpenControlBoletines}
        />
      </CCol>

      {/* Inscripciones */}
      <CCol xs={12} sm={6} lg={3}>
        <PremiumStatCard
          title="Inscripciones"
          value={periodoInscripcion.activo ? "Activo" : "Inactivo"}
          subtitle="Estado del periodo actual"
          icon={<CIcon icon={cilCalendar} size="lg" />}
          onClick={onOpenPeriodoInscripcion}
        />
      </CCol>

      {/* Usuarios Activos */}
      <CCol xs={12} sm={6} lg={3}>
        <PremiumStatCard
          title="Accesos"
          value={usuarios.filter(u => u.activo).length}
          subtitle="Cuentas con acceso activo"
          icon={<CIcon icon={cilUserFollow} size="lg" />}
          onClick={onOpenGestionAccesos}
        />
      </CCol>
    </CRow>
  )
}

export default StatsWidgets