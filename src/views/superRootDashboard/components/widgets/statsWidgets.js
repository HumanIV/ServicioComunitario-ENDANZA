import React from 'react'
import {
  CRow,
  CCol,
  CCard,
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
  cilGroup
} from '@coreui/icons'

const StatsWidgets = ({
  // Datos
  students = [],
  repsCount = 0,
  periodoInscripcion = { activo: false },
  periodoSubidaNotas = { activo: false },
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

  // Colores de ENDANZA
  const colors = {
    primary: '#F28C0F',
    primaryLight: '#FEF3E2',
    secondary: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    text: '#1F2937',
    textLight: '#6B7280',
    background: '#FFFFFF'
  };

  // Acciones rápidas - 4 acciones esenciales
  const quickActions = [
    {
      title: 'Validar Notas',
      icon: cilCheckCircle,
      color: colors.warning,
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
      color: puedeHabilitarBoletines ? colors.primary : colors.secondary,
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
      color: colors.primary,
      action: onOpenPeriodoInscripcion,
      description: periodoInscripcion.activo ? 'Activo' : 'Configurar',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)'
    },
    {
      title: 'Gestión de Notas',
      icon: cilPencil,
      color: periodoSubidaNotas.activo ? colors.success : colors.secondary,
      action: onOpenSubidaNotas,
      description: periodoSubidaNotas.activo ? 'Habilitado' : 'Configurar',
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
    }
  ];

  return (
    <>
      {/* Layout de dos columnas */}
      <CRow className="g-4 mb-4">
        {/* Columna izquierda - Acciones rápidas (más ancha) */}
        <CCol lg={8}>
          <CCard className="border-0 shadow-sm overflow-hidden" style={{
            borderRadius: '24px',
            background: colors.background,
            border: '1px solid rgba(242, 140, 15, 0.1)'
          }}>
            <CCardBody className="p-4">
              {/* Header */}
              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-2 p-2 me-2 d-flex align-items-center justify-content-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}05)`,
                    color: colors.primary
                  }}
                >
                  <CIcon icon={cilSpeedometer} size="lg" />
                </div>
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: colors.text }}>
                    Panel de Control Rápido
                  </h5>
                  <small className="text-muted">Acciones administrativas frecuentes</small>
                </div>
              </div>

              {/* Grid de acciones 2x2 */}
              <CRow className="g-3">
                {quickActions.map((action, index) => (
                  <CCol xs={12} md={6} key={`action-${index}`}>
                    <CCard
                      className={`border-0 h-100 transition-all ${action.action ? 'cursor-pointer' : ''} ${action.disabled ? 'opacity-50' : ''}`}
                      style={{
                        borderRadius: '16px',
                        background: `linear-gradient(135deg, ${action.color}08, ${action.color}02)`,
                        border: `1px solid ${action.color}20`,
                        overflow: 'hidden'
                      }}
                      onClick={!action.disabled ? action.action : undefined}
                    >
                      <CCardBody className="p-3">
                        <div className="d-flex">
                          {/* Icono con gradiente */}
                          <div
                            className="rounded-3 p-2 me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: '44px',
                              height: '44px',
                              background: action.gradient,
                              color: 'white',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            <CIcon icon={action.icon} size="lg" />
                          </div>

                          {/* Contenido */}
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem', color: colors.text }}>
                                {action.title}
                              </h6>
                              {action.badge && (
                                <span className="badge rounded-pill"
                                  style={{
                                    backgroundColor: colors.danger,
                                    color: 'white',
                                    fontSize: '0.6rem',
                                    padding: '3px 6px'
                                  }}>
                                  {action.badge}
                                </span>
                              )}
                            </div>

                            <p className="small mb-2" style={{ fontSize: '0.7rem', color: colors.textLight }}>
                              {action.description}
                            </p>

                            <div className="d-flex align-items-center justify-content-between">
                              <span className="small text-muted" style={{ fontSize: '0.6rem' }}>
                                {action.shortcut}
                              </span>
                              <div className="d-flex align-items-center" style={{ fontSize: '0.65rem', color: action.color }}>
                                <span className="fw-semibold">Ejecutar</span>
                                <CIcon icon={cilArrowRight} size="sm" className="ms-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Columna derecha - Estadísticas (más estrecha) */}
        <CCol lg={4}>
          <CCard className="border-0 shadow-sm h-100 overflow-hidden" style={{
            borderRadius: '24px',
            background: `linear-gradient(135deg, ${colors.primary}08, ${colors.primary}02)`,
            border: '1px solid rgba(242, 140, 15, 0.2)'
          }}>
            <CCardBody className="p-4">
              {/* Header */}
              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-2 p-2 me-2 d-flex align-items-center justify-content-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}05)`,
                    color: colors.primary
                  }}
                >
                  <CIcon icon={cilGroup} size="lg" />
                </div>
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: colors.text }}>
                    Comunidad ENDANZA
                  </h5>
                  <small className="text-muted">Estadísticas generales</small>
                </div>
              </div>

              {/* Widget de Estudiantes */}
              <CCard className="border-0 mb-3" style={{
                borderRadius: '16px',
                background: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <CCardBody className="p-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: '48px',
                        height: '48px',
                        background: '#FEF3E2',
                        color: colors.primary
                      }}
                    >
                      <CIcon icon={cilUser} size="xl" />
                    </div>
                    <div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                        ESTUDIANTES
                      </small>
                      <h2 className="fw-bold mb-0" style={{ fontSize: '2rem', color: colors.text }}>
                        {students.length || 0}
                      </h2>
                    </div>
                  </div>
                </CCardBody>
              </CCard>

              {/* Widget de Representantes */}
              <CCard className="border-0" style={{
                borderRadius: '16px',
                background: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <CCardBody className="p-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: '48px',
                        height: '48px',
                        background: '#FEF3E2',
                        color: colors.primary
                      }}
                    >
                      <CIcon icon={cilSchool} size="xl" />
                    </div>
                    <div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                        REPRESENTANTES
                      </small>
                      <h2 className="fw-bold mb-0" style={{ fontSize: '2rem', color: colors.text }}>
                        {repsCount}
                      </h2>
                    </div>
                  </div>
                </CCardBody>
              </CCard>

              {/* Badge de total */}
              <div className="text-center mt-3">
                <span className="badge rounded-pill px-3 py-2" style={{
                  background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}05)`,
                  color: colors.primary,
                  fontSize: '0.75rem'
                }}>
                  Total: {students.length + repsCount} personas
                </span>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <style>{`
        .transition-all {
          transition: all 0.3s ease;
        }
        [class*="cursor-pointer"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(242, 140, 15, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
      `}</style>
    </>
  )
}

export default StatsWidgets