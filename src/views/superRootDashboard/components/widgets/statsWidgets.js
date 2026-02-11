import React from 'react'
import { CRow, CCol, CCard, CCardBody, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilUserFollow, cilCalendar, cilCloudUpload } from '@coreui/icons'

const ModernStatCard = ({ title, value, subtitle, icon, onClick, type = 'default' }) => {
  const isActionable = !!onClick;

  return (
    <CCard
      className={`border-0 overflow-hidden shadow-sm h-100 bg-glass-premium ${isActionable ? 'cursor-pointer hover-lift-subtle shadow-hover' : ''}`}
      onClick={onClick}
      style={{
        borderRadius: '24px',
        transition: 'all 0.3s ease'
      }}
    >
      <CCardBody className="p-3 p-xl-4 d-flex align-items-center bg-transparent">
        <div className={`stat-icon-square rounded-4 me-3 me-xl-4 d-flex align-items-center justify-content-center bg-stat-light-${type} responsive-icon-square`}>
          {icon}
        </div>

        <div className="flex-grow-1 overflow-hidden">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h6 className="text-muted-custom mb-0 small fw-bold text-uppercase ls-1 text-truncate">{title}</h6>
            {isActionable && (
              <CBadge color="primary" className="bg-opacity-10 text-primary rounded-pill px-2 py-1 fw-bold d-none d-xxl-inline-block" style={{ fontSize: '0.65rem' }}>
                GESTIONAR
              </CBadge>
            )}
          </div>
          <h3 className="fw-bold mb-0 stat-value-text ls-tight">{value}</h3>
          <p className="text-muted-custom small mb-0 text-truncate opacity-75">{subtitle}</p>
        </div>
      </CCardBody>

      <style>{`
        .bg-stat-light-default { background-color: rgba(224, 123, 0, 0.1); color: #E07B00; }
        .bg-stat-light-students { background-color: rgba(13, 110, 253, 0.1); color: #0d6efd; }
        .bg-stat-light-new { background-color: rgba(25, 135, 84, 0.1); color: #198754; }
        .bg-stat-light-period { background-color: rgba(102, 16, 242, 0.1); color: #6610f2; }
        
        .responsive-icon-square {
            width: 80px;
            height: 80px;
            min-width: 80px;
        }

        .stat-value-text { 
            font-size: 2.25rem; 
            color: var(--neutral-800);
            white-space: nowrap;
        }
        [data-coreui-theme="dark"] .stat-value-text { color: white !important; }
        
        .hover-lift-subtle:hover {
            transform: translateY(-4px);
        }
        
        .shadow-hover:hover {
            box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        [data-coreui-theme="dark"] .shadow-hover:hover {
            box-shadow: 0 15px 30px rgba(0,0,0,0.4) !important;
        }

        @media (max-width: 1400px) {
            .stat-value-text { font-size: 2rem; }
            .responsive-icon-square {
                width: 70px;
                height: 70px;
                min-width: 70px;
            }
        }
        
        @media (max-width: 576px) {
            .stat-value-text { font-size: 1.5rem; }
            .responsive-icon-square {
                width: 56px;
                height: 56px;
                min-width: 56px;
            }
        }
      `}</style>
    </CCard>
  );
}

const StatsWidgets = ({
  students = [],
  repsCount = 0,
  periodoInscripcion = {},
  periodoSubidaNotas = {},
  onOpenPeriodoInscripcion,
  onOpenSubidaNotas
}) => {
  const currentYear = new Date().getFullYear();
  const newEnrollments = students.filter(s => {
    if (!s.entryDate) return false;
    return s.entryDate.includes(currentYear.toString()) || s.entryDate.includes('2024');
  }).length;

  return (
    <CRow className="mb-5 gy-4 justify-content-center">
      <CCol xs={12} md={6} lg={6}>
        <ModernStatCard
          title="Estudiantes"
          value={students.length}
          subtitle="Total alumnos activos"
          icon={<CIcon icon={cilPeople} size="xl" />}
          type="students"
        />
      </CCol>

      <CCol xs={12} md={6} lg={6}>
        <ModernStatCard
          title="Nuevos Ingresos"
          value={newEnrollments}
          subtitle="Ciclo actual"
          icon={<CIcon icon={cilUserFollow} size="xl" />}
          type="new"
        />
      </CCol>

      <CCol xs={12} md={6} lg={6}>
        <ModernStatCard
          title="Inscripciones"
          value={periodoInscripcion.activo ? "Abierto" : "Cerrado"}
          subtitle={periodoInscripcion.activo ? "Portal habilitado" : "Fuera de fecha"}
          icon={<CIcon icon={cilCalendar} size="xl" />}
          onClick={onOpenPeriodoInscripcion}
          type="period"
        />
      </CCol>

      <CCol xs={12} md={6} lg={6}>
        <ModernStatCard
          title="Subida de Notas"
          value={periodoSubidaNotas.activo ? "Activo" : "Inactivo"}
          subtitle={periodoSubidaNotas.activo ? "Carga permitida" : "Periodo cerrado"}
          icon={<CIcon icon={cilCloudUpload} size="xl" />}
          onClick={onOpenSubidaNotas}
          type="default"
        />
      </CCol>
    </CRow>
  )
}

export default StatsWidgets