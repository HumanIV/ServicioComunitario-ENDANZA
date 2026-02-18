// Archivo: src/dashboard/components/widgets/statsWidgets.js

import React from 'react'
import {
  CRow,
  CCol,
  CCard,
  CBadge,
  CCardBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilArrowRight,
  cilUser,
  cilSchool,
  cilCalendar,
  cilPencil,
  cilCheckCircle,
  cilCloudDownload,
  cilSpeedometer,
  cilGroup,
  cilChart,
  cilNotes,
  cilColorBorder
} from '@coreui/icons'

const StatsWidgets = ({
  // Datos
  students = [],
  repsCount = 0,
  periodoInscripcion,
  periodoSubidaNotas,
  notasPendientes = [],
  boletines = [],

  // Acciones
  onOpenPeriodoInscripcion,
  onOpenSubidaNotas,
  onOpenValidacionNotas,
  onOpenControlBoletines
}) => {

  const notasPendientesCount = notasPendientes.length;
  const boletinesDisponibles = boletines.filter(b => b.disponible).length;
  const puedeHabilitarBoletines = notasPendientesCount === 0;

  // Acciones rápidas - 4 acciones esenciales
  const quickActions = [
    {
      title: 'Validar Notas',
      icon: cilCheckCircle,
      color: '#F59E0B',
      action: onOpenValidacionNotas,
      badge: notasPendientesCount > 0 ? notasPendientesCount : null,
      description: notasPendientesCount > 0
        ? `${notasPendientesCount} pendiente${notasPendientesCount !== 1 ? 's' : ''}`
        : 'Sin pendientes',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
    },
    {
      title: 'Publicar Boletines',
      icon: cilCloudDownload,
      color: puedeHabilitarBoletines ? '#F28C0F' : '#64748B',
      action: onOpenControlBoletines,
      disabled: !puedeHabilitarBoletines && boletines.length > 0,
      description: boletinesDisponibles > 0
        ? `${boletinesDisponibles} disponible${boletinesDisponibles !== 1 ? 's' : ''}`
        : 'Ninguno disponible',
      gradient: 'linear-gradient(135deg, #F28C0F 0%, #F5A623 100%)'
    },
    {
      title: 'Configurar Períodos',
      icon: cilCalendar,
      color: '#3B82F6',
      action: onOpenPeriodoInscripcion,
      description: periodoInscripcion.activo ? 'Activo' : 'Configurar',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)'
    },
    {
      title: 'Gestión de Notas',
      icon: cilPencil,
      color: periodoSubidaNotas.activo ? '#10B981' : '#64748B',
      action: onOpenSubidaNotas,
      description: periodoSubidaNotas.activo ? 'Habilitado' : 'Configurar',
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
    }
  ];

  return (
    <>
      <CRow className="g-4 mb-4">
        {/* Columna izquierda - Acciones rápidas (más ancha) */}
        <CCol lg={8}>
          <CCard className="border-0 premium-card shadow-lg overflow-hidden bg-glass-premium h-100" style={{ borderRadius: '24px' }}>
            <CCardBody className="p-4">
              {/* Header */}
              <div className="d-flex align-items-center mb-4">
                <div className="bg-orange-soft rounded-3 p-2 me-3 d-flex align-items-center justify-content-center">
                  <CIcon icon={cilSpeedometer} size="lg" className="text-primary" />
                </div>
                <div>
                  <h5 className="fw-bold mb-0 header-title-custom">
                    Panel de Control Rápido
                  </h5>
                  <small className="text-muted-custom opacity-75 fw-medium">Acciones administrativas frecuentes</small>
                </div>
              </div>

              {/* Grid de acciones 2x2 */}
              <CRow className="g-3">
                {quickActions.map((action, index) => (
                  <CCol xs={12} md={6} key={`action-${index}`}>
                    <div
                      className={`action-card-premium p-3 rounded-4 transition-all h-100 border border-light-custom ${action.disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                      onClick={!action.disabled ? action.action : undefined}
                    >
                      <div className="d-flex h-100">
                        {/* Icono con gradiente */}
                        <div
                          className="rounded-3 p-2 me-3 d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                          style={{
                            width: '46px',
                            height: '46px',
                            background: action.gradient,
                            color: 'white'
                          }}
                        >
                          <CIcon icon={action.icon} size="lg" />
                        </div>

                        {/* Contenido */}
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <h6 className="fw-bold mb-0 text-dark-custom text-nowrap" style={{ fontSize: '0.9rem' }}>
                              {action.title}
                            </h6>
                            {action.badge && (
                              <CBadge color="danger" shape="pill" style={{ fontSize: '0.65rem' }}>
                                {action.badge}
                              </CBadge>
                            )}
                          </div>

                          <p className="small mb-2 text-muted-custom" style={{ fontSize: '0.75rem' }}>
                            {action.description}
                          </p>

                          <div className="d-flex align-items-center justify-content-end mt-auto">
                            <div className="d-flex align-items-center execute-link" style={{ fontSize: '0.7rem', color: action.color }}>
                              <span className="fw-bold text-uppercase ls-1">Ejecutar</span>
                              <CIcon icon={cilArrowRight} size="sm" className="ms-1 animate-arrow" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CCol>
                ))}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Columna derecha - Estadísticas (más estrecha) */}
        <CCol lg={4}>
          <CCard className="border-0 premium-card shadow-lg bg-glass-premium h-100 overflow-hidden" style={{ borderRadius: '24px' }}>
            <CCardBody className="p-4 d-flex flex-column h-100">
              {/* Header */}
              <div className="d-flex align-items-center mb-4">
                <div className="bg-orange-soft rounded-3 p-2 me-3 d-flex align-items-center justify-content-center">
                  <CIcon icon={cilGroup} size="lg" className="text-primary" />
                </div>
                <div>
                  <h5 className="fw-bold mb-0 header-title-custom">
                    Comunidad ENDANZA
                  </h5>
                  <small className="text-muted-custom opacity-75 fw-medium">Estadísticas generales</small>
                </div>
              </div>

              {/* Contenedor de Widgets */}
              <div className="flex-grow-1 d-flex flex-column gap-3">
                {/* Widget de Estudiantes */}
                <div className="stat-widget-premium p-3 rounded-4 border border-light-custom transition-all bg-white shadow-xs">
                  <div className="d-flex align-items-center">
                    <div className="bg-orange-soft rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                      style={{ width: '52px', height: '52px' }}>
                      <CIcon icon={cilUser} size="xl" className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted-custom text-uppercase fw-bold ls-1 d-block mb-1" style={{ fontSize: '0.65rem' }}>
                        ESTUDIANTES
                      </small>
                      <h2 className="fw-black mb-0 text-dark-custom" style={{ fontSize: '2.2rem' }}>
                        {students.length || 0}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Widget de Representantes */}
                <div className="stat-widget-premium p-3 rounded-4 border border-light-custom transition-all bg-white shadow-xs">
                  <div className="d-flex align-items-center">
                    <div className="bg-orange-soft rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                      style={{ width: '52px', height: '52px' }}>
                      <CIcon icon={cilSchool} size="xl" className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted-custom text-uppercase fw-bold ls-1 d-block mb-1" style={{ fontSize: '0.65rem' }}>
                        REPRESENTANTES
                      </small>
                      <h2 className="fw-black mb-0 text-dark-custom" style={{ fontSize: '2.2rem' }}>
                        {repsCount}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge de total */}
              <div className="text-center mt-4">
                <CBadge color="warning" className="premium-role-badge px-4 py-2 rounded-pill shadow-sm w-100 d-flex align-items-center justify-content-center">
                  <CIcon icon={cilChart} className="me-2" />
                  TOTAL COMUNIDAD: {students.length + repsCount} PERSONAS
                </CBadge>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <style>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 1px; }
        
        .action-card-premium {
          background: rgba(var(--cui-body-bg-rgb), 0.5);
          cursor: pointer;
        }

        .action-card-premium:hover {
          transform: translateY(-4px);
          background: white;
          border-color: #F28C0F !important;
          box-shadow: 0 15px 35px -5px rgba(242, 140, 15, 0.2);
        }

        .stat-widget-premium:hover {
          transform: scale(1.02);
          box-shadow: var(--shadow-md);
          border-color: rgba(242, 140, 15, 0.2) !important;
        }

        .premium-role-badge {
          background: linear-gradient(135deg, #F28C0F 0%, #DD6F1E 100%) !important;
          color: white !important;
          border: none !important;
          font-weight: 700 !important;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .execute-link {
          transition: all 0.2s ease;
          filter: brightness(1.2); /* Make the orange text slightly brighter for better contrast */
        }

        .action-card-premium:hover .execute-link {
          transform: translateX(-4px);
        }

        .animate-arrow {
          transition: transform 0.3s ease;
        }

        .action-card-premium:hover .animate-arrow {
          transform: translateX(4px);
        }

        [data-coreui-theme="dark"] .stat-widget-premium {
          background: rgba(255, 255, 255, 0.02) !important;
          border-color: rgba(255, 255, 255, 0.05) !important;
        }

        [data-coreui-theme="dark"] .action-card-premium {
          background: rgba(255, 255, 255, 0.02);
        }

        [data-coreui-theme="dark"] .action-card-premium:hover {
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </>
  )
}

export default StatsWidgets