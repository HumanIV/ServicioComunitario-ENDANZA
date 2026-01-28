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
          <CCard className="premium-card border-0 h-100 shadow-sm overflow-hidden">
            <CCardHeader className="bg-white border-bottom border-light py-3 px-4 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 fw-bold text-dark text-uppercase ls-1" style={{ fontSize: '0.9rem' }}>Informe de Calificaciones</h5>
                <small className="text-muted">Detalle por asignatura</small>
              </div>
              <CBadge className="bg-orange-soft text-primary rounded-pill px-3 py-2 border border-primary border-opacity-10">
                {periodoNombre}
              </CBadge>
            </CCardHeader>
            <CCardBody className="p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle border-0 mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 small fw-bold text-secondary text-uppercase ls-1 py-3 px-4">Asignatura</th>
                      <th className="border-0 small fw-bold text-secondary text-uppercase ls-1 py-3 text-center">U.C.</th>
                      <th className="border-0 small fw-bold text-secondary text-uppercase ls-1 py-3 text-center">Calificación</th>
                      <th className="border-0 small fw-bold text-secondary text-uppercase ls-1 py-3 text-center">Estatus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notas.map((nota, idx) => (
                      <tr key={idx} className="border-bottom border-light">
                        <td className="py-3 px-4">
                          <div className="fw-bold text-dark mb-1">{nota.materia}</div>
                          <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>DOCENTE: {nota.docente.toUpperCase()}</small>
                        </td>
                        <td className="text-center py-3 text-muted fw-bold">{nota.creditos}</td>
                        <td className="text-center py-3">
                          <span className={`fw-bold fs-5 font-monospace ${nota.nota >= 10 ? 'text-success' : 'text-danger'}`}>
                            {nota.nota !== null ? (nota.nota < 10 ? `0${nota.nota}` : nota.nota) : '--'}
                          </span>
                        </td>
                        <td className="text-center py-3">
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
          <CCard className="premium-card border-0 h-100 shadow-sm overflow-hidden">
            <CCardBody className="p-4 d-flex flex-column text-center">
              <div className="mb-4">
                <div className="p-4 bg-orange-soft rounded-circle d-inline-flex mb-3 shadow-sm border border-white border-4">
                  <CIcon icon={cilChartLine} style={{ color: 'var(--primary-600)' }} size="3xl" />
                </div>
                <h6 className="text-muted fw-bold text-uppercase ls-1 mb-2">Índice Académico del Período</h6>
                <div className="display-3 fw-bold text-dark mb-3 lh-1">
                  {promedio.toFixed(1)}
                  <span className="fs-4 text-muted ms-2 fw-normal">/ 20</span>
                </div>

                <div className={`alert ${promedio >= 10 ? 'alert-success' : 'alert-danger'} border-0 rounded-4 py-2 px-3 d-inline-block shadow-sm`}>
                  <strong className="text-uppercase ls-1 small">
                    ESTADO FINAL: {estadoAcademico}
                  </strong>
                </div>
              </div>

              <div className="mt-auto p-4 rounded-4 bg-light border border-light text-start">
                <h6 className="fw-bold mb-3 small text-uppercase ls-1 text-primary d-flex align-items-center">
                  <CIcon icon={cilCheckCircle} className="me-2" />
                  Validación Administrativa
                </h6>

                <div className="d-flex align-items-center mb-4">
                  <div className="vr bg-primary opacity-25 me-3" style={{ width: '2px', height: '40px' }}></div>
                  <div>
                    <div className="small fw-bold text-dark text-uppercase ls-1">Aprobado por Secretaría</div>
                    <div className="text-muted small">
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
        .ls-1 { letter-spacing: 1px; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(242, 140, 15, 0.2) !important; transition: all 0.3s ease; }
      `}</style>
    </div>
  )
}

export default PeriodoTab