import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CBadge
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import {
  cilCheckCircle,
  cilCloudDownload,
  cilChartLine,
  cilXCircle
} from "@coreui/icons"

const PeriodoTab = ({
  notas,
  periodoNombre,
  estadoSecretaria = 'aprobado',
  fechaAprobacion = null,
  aprobadoPor = null,
  onDescargar,
  periodoNumero
}) => {
  const notasValidas = notas.filter(n => n.nota !== null)
  const promedio = notasValidas.length > 0
    ? notasValidas.reduce((acc, item) => acc + item.nota, 0) / notasValidas.length
    : 0

  const estadoAcademico = promedio >= 10 ? 'APROBADO' : 'REPROBADO'

  return (
    <div className="animate__animated animate__fadeIn">
      <CRow className="g-4">
        <CCol lg={7}>
          <CCard className="premium-card border-0 h-100 shadow-sm overflow-hidden periodo-tab-card">
            <CCardHeader className="periodo-tab-header border-bottom border-0 py-3 px-4 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 fw-bold periodo-tab-title text-uppercase ls-1" style={{ fontSize: '0.9rem' }}>Informe de Calificaciones</h5>
                <small className="periodo-tab-subtitle">Detalle por asignatura</small>
              </div>
              <CBadge className="bg-orange-soft text-warning rounded-pill px-3 py-2 border border-warning border-opacity-10">
                {periodoNombre}
              </CBadge>
            </CCardHeader>
            <CCardBody className="p-0 periodo-tab-card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle border-0 mb-0 periodo-table-custom">
                  <thead className="periodo-tab-thead">
                    <tr>
                      <th className="border-0 small fw-bold periodo-tab-subtitle text-uppercase ls-1 py-3 px-3 px-md-4">Asignatura</th>
                      <th className="border-0 small fw-bold periodo-tab-subtitle text-uppercase ls-1 py-3 text-center d-mobile-none">U.C.</th>
                      <th className="border-0 small fw-bold periodo-tab-subtitle text-uppercase ls-1 py-3 text-center px-1">Calificación</th>
                      <th className="border-0 small fw-bold periodo-tab-subtitle text-uppercase ls-1 py-3 text-center d-mobile-none">Estatus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notas.map((nota, idx) => (
                      <tr key={idx} className="periodo-tab-border">
                        <td className="py-2 py-md-3 px-3 px-md-4">
                          <div className="fw-bold periodo-tab-title mb-0 mb-md-1 fs-6 fs-md-6" style={{ fontSize: '0.9rem' }}>{nota.materia}</div>
                          <small className="periodo-tab-subtitle d-block" style={{ fontSize: '0.65rem' }}>DOCENTE: {nota.docente.toUpperCase()}</small>
                        </td>
                        <td className="text-center py-2 py-md-3 text-muted fw-bold d-mobile-none">{nota.creditos}</td>
                        <td className="text-center py-2 py-md-3 px-1">
                          <span className={`fw-bold fs-5 fs-md-4 font-monospace ${nota.nota >= 10 ? 'text-success' : 'text-danger'}`}>
                            {nota.nota !== null ? (nota.nota < 10 ? `0${nota.nota}` : nota.nota) : '--'}
                          </span>
                        </td>
                        <td className="text-center py-2 py-md-3 d-mobile-none">
                          {nota.nota !== null ? (
                            <div className="d-flex justify-content-center">
                              {nota.nota >= 10 ? (
                                <CIcon icon={cilCheckCircle} className="text-success" size="lg" />
                              ) : (
                                <CIcon icon={cilXCircle} className="text-danger" size="lg" />
                              )}
                            </div>
                          ) : (
                            <CBadge color="light" className="text-muted border">PENDIENTE</CBadge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={5}>
          <CCard className="premium-card border-0 h-100 shadow-sm overflow-hidden periodo-tab-card">
            <CCardBody className="p-3 p-md-4 d-flex flex-column text-center">
              <div className="mb-3 mb-md-4">
                <div className="p-3 p-md-4 bg-orange-soft rounded-circle d-inline-flex mb-3 shadow-sm border-4 periodo-tab-icon-border">
                  <CIcon icon={cilChartLine} style={{ color: '#F28C0F' }} size="2xl" />
                </div>
                <h6 className="periodo-tab-subtitle label-micro mb-2">Índice Académico</h6>
                <div className="display-4 fw-bold periodo-tab-title mb-2 lh-1">
                  {promedio.toFixed(1)}
                  <span className="fs-6 fs-md-4 periodo-tab-subtitle ms-2 fw-normal">/ 20</span>
                </div>

                <div className={`alert ${promedio >= 10 ? 'alert-success' : 'alert-danger'} border-0 rounded-4 py-1 py-md-2 px-3 d-inline-block shadow-sm mb-0`}>
                  <strong className="text-uppercase ls-1 label-micro">
                    {estadoAcademico}
                  </strong>
                </div>
              </div>

              <div className="mt-auto p-4 rounded-4 periodo-tab-validation-bg border-0 text-start">
                <h6 className="fw-bold mb-3 small text-uppercase ls-1 text-warning d-flex align-items-center">
                  <CIcon icon={cilCheckCircle} className="me-2" />
                  Validación Administrativa
                </h6>

                <div className="d-flex align-items-center mb-4">
                  <div className="vr bg-warning opacity-25 me-3" style={{ width: '2px', height: '40px' }}></div>
                  <div>
                    <div className="small fw-bold periodo-tab-title text-uppercase ls-1">Aprobado por Secretaría</div>
                    <div className="periodo-tab-subtitle small">
                      {fechaAprobacion || 'Fecha pendiente'} • {aprobadoPor || 'Autoridad competente'}
                    </div>
                  </div>
                </div>

                <CButton
                  className="btn-premium w-100 py-3 rounded-pill shadow-sm d-flex justify-content-center align-items-center hover-lift"
                  onClick={() => onDescargar && onDescargar(periodoNumero)}
                >
                  <CIcon icon={cilCloudDownload} className="me-2" size="lg" />
                  DESCARGAR BOLETÍN OFICIAL
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <style>{`
        .periodo-tab-title { color: var(--neutral-800); }
        .periodo-tab-subtitle { color: var(--neutral-500); }
        .periodo-tab-header { background-color: rgba(0, 0, 0, 0.02); }
        .periodo-tab-thead { background-color: rgba(0, 0, 0, 0.01); }
        .periodo-tab-border { border-bottom: 1px solid rgba(0, 0, 0, 0.05); }
        .periodo-tab-validation-bg { background-color: rgba(0, 0, 0, 0.02); }

        [data-coreui-theme="dark"] .periodo-tab-card { background-color: rgba(255, 255, 255, 0.03); }
        [data-coreui-theme="dark"] .periodo-tab-title { color: rgba(255, 255, 255, 0.9); }
        [data-coreui-theme="dark"] .periodo-tab-subtitle { color: rgba(255, 255, 255, 0.5); }
        [data-coreui-theme="dark"] .periodo-tab-header { background-color: rgba(255, 255, 255, 0.02); }
        [data-coreui-theme="dark"] .periodo-tab-thead { background-color: rgba(255, 255, 255, 0.03); }
        [data-coreui-theme="dark"] .periodo-tab-border { border-bottom-color: rgba(255, 255, 255, 0.1); }
        [data-coreui-theme="dark"] .periodo-tab-validation-bg { background-color: rgba(255, 255, 255, 0.05); }
        [data-coreui-theme="dark"] .table-hover tbody tr:hover { background-color: rgba(255, 255, 255, 0.02); }
      `}</style>
    </div>
  )
}

export default PeriodoTab