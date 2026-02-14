// Archivo: src/dashboard/components/widgets/statsWidgets.js

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
      colorClass: 'warning',
      action: onOpenValidacionNotas,
      badge: notasPendientesCount > 0 ? notasPendientesCount : null,
      description: notasPendientesCount > 0
        ? `${notasPendientesCount} pendiente${notasPendientesCount !== 1 ? 's' : ''}`
        : 'Sin pendientes',
      gradientClass: 'gradient-warning'
    },
    {
      title: 'Publicar Boletines',
      icon: cilCloudDownload,
      colorClass: puedeHabilitarBoletines ? 'primary' : 'secondary',
      action: onOpenControlBoletines,
      disabled: !puedeHabilitarBoletines && boletines.length > 0,
      description: boletinesDisponibles > 0
        ? `${boletinesDisponibles} disponible${boletinesDisponibles !== 1 ? 's' : ''}`
        : 'Ninguno disponible',
      gradientClass: 'gradient-primary'
    },
    {
      title: 'Configurar Períodos',
      icon: cilCalendar,
      colorClass: 'primary',
      action: onOpenPeriodoInscripcion,
      description: periodoInscripcion.activo ? 'Activo' : 'Configurar',
      gradientClass: 'gradient-blue'
    },
    {
      title: 'Gestión de Notas',
      icon: cilPencil,
      colorClass: periodoSubidaNotas.activo ? 'success' : 'secondary',
      action: onOpenSubidaNotas,
      description: periodoSubidaNotas.activo ? 'Habilitado' : 'Configurar',
      gradientClass: 'gradient-success'
    }
  ];

  return (
    <>
      {/* Layout de dos columnas */}
      <CRow className="g-4 mb-4">
        {/* Columna izquierda - Acciones rápidas (más ancha) */}
        <CCol lg={8}>
          <CCard className="premium-card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '24px' }}>
            <CCardBody className="p-4">
              {/* Header */}
              <div className="d-flex align-items-center mb-4">
                <div className="rounded-2 p-2 me-2 d-flex align-items-center justify-content-center bg-orange-soft">
                  <CIcon icon={cilSpeedometer} size="lg" className="text-primary" />
                </div>
                <div>
                  <h5 className="fw-bold mb-0 header-title-custom">
                    Panel de Control Rápido
                  </h5>
                  <small className="text-muted-custom">Acciones administrativas frecuentes</small>
                </div>
              </div>

              {/* Grid de acciones 2x2 */}
              <CRow className="g-3">
                {quickActions.map((action, index) => (
                  <CCol xs={12} md={6} key={`action-${index}`}>
                    <CCard
                      className={`border-0 h-100 transition-all action-card-${action.colorClass} ${action.action ? 'cursor-pointer' : ''} ${action.disabled ? 'opacity-50' : ''}`}
                      style={{ borderRadius: '16px', overflow: 'hidden' }}
                      onClick={!action.disabled ? action.action : undefined}
                    >
                      <CCardBody className="p-3">
                        <div className="d-flex">
                          {/* Icono con gradiente */}
                          <div
                            className={`rounded-3 p-2 me-3 d-flex align-items-center justify-content-center icon-${action.gradientClass}`}
                            style={{
                              width: '44px',
                              height: '44px'
                            }}
                          >
                            <CIcon icon={action.icon} size="lg" />
                          </div>

                          {/* Contenido */}
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <h6 className="fw-bold mb-0 header-title-custom" style={{ fontSize: '0.9rem' }}>
                                {action.title}
                              </h6>
                              {action.badge && (
                                <span className="badge rounded-pill bg-danger text-white"
                                  style={{
                                    fontSize: '0.6rem',
                                    padding: '3px 6px'
                                  }}>
                                  {action.badge}
                                </span>
                              )}
                            </div>

                            <p className="small mb-2 text-muted-custom" style={{ fontSize: '0.7rem' }}>
                              {action.description}
                            </p>

                            <div className="d-flex align-items-center justify-content-end">
                              <div className={`d-flex align-items-center text-${action.colorClass}`} style={{ fontSize: '0.65rem' }}>
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
          <CCard className="premium-card border-0 shadow-sm h-100 overflow-hidden stats-card" style={{ borderRadius: '24px' }}>
            <CCardBody className="p-4">
              {/* Header */}
              <div className="d-flex align-items-center mb-4">
                <div className="rounded-2 p-2 me-2 d-flex align-items-center justify-content-center bg-orange-soft">
                  <CIcon icon={cilGroup} size="lg" className="text-primary" />
                </div>
                <div>
                  <h5 className="fw-bold mb-0 header-title-custom">
                    Comunidad ENDANZA
                  </h5>
                  <small className="text-muted-custom">Estadísticas generales</small>
                </div>
              </div>

              {/* Widget de Estudiantes */}
              <CCard className="border-0 mb-3 stat-widget-card" style={{ borderRadius: '16px' }}>
                <CCardBody className="p-3">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center bg-orange-soft"
                      style={{
                        width: '48px',
                        height: '48px'
                      }}
                    >
                      <CIcon icon={cilUser} size="xl" className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted-custom text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                        ESTUDIANTES
                      </small>
                      <h2 className="fw-bold mb-0 header-title-custom" style={{ fontSize: '2rem' }}>
                        {students.length || 0}
                      </h2>
                    </div>
                  </div>
                </CCardBody>
              </CCard>

              {/* Widget de Representantes */}
              <CCard className="border-0 stat-widget-card" style={{ borderRadius: '16px' }}>
                <CCardBody className="p-3">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center bg-orange-soft"
                      style={{
                        width: '48px',
                        height: '48px'
                      }}
                    >
                      <CIcon icon={cilSchool} size="xl" className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted-custom text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                        REPRESENTANTES
                      </small>
                      <h2 className="fw-bold mb-0 header-title-custom" style={{ fontSize: '2rem' }}>
                        {repsCount}
                      </h2>
                    </div>
                  </div>
                </CCardBody>
              </CCard>

              {/* Badge de total */}
              <div className="text-center mt-3">
                <span className="badge rounded-pill px-3 py-2 bg-orange-soft text-primary" style={{ fontSize: '0.75rem' }}>
                  Total: {students.length + repsCount} personas
                </span>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default StatsWidgets