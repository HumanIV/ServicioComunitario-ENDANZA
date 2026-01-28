import React from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar, cilUser, cilLocationPin, cilClock } from "@coreui/icons"

const VistaSemanal = ({ diasSemana, horarioCompleto }) => {
  return (
    <CCard className="premium-card border-0 overflow-hidden shadow-lg animate__animated animate__fadeIn">
      <CCardHeader className="bg-orange-soft border-0 py-3 px-4 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold text-dark text-uppercase ls-1">
          <CIcon icon={cilCalendar} className="me-2 text-primary" />
          Calendario Semanal
        </h5>
        <div className="badge bg-white text-primary rounded-pill px-3 py-2 border border-primary border-opacity-10 shadow-sm">
          Planificación Institucional
        </div>
      </CCardHeader>
      <CCardBody className="p-0">
        <div className="table-responsive">
          <table className="table table-bordered mb-0">
            <thead className="bg-light">
              <tr>
                <th className="py-3 px-4 text-center border-0 small fw-bold text-muted text-uppercase" style={{ width: '10%' }}>
                  <CIcon icon={cilClock} className="me-1" /> Hora
                </th>
                {diasSemana.map(dia => (
                  <th key={dia.id} className="py-3 px-3 text-center border-0 small fw-bold text-muted text-uppercase">
                    {dia.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 11 }, (_, i) => i + 8).map(hora => {
                const horaStr = hora.toString().padStart(2, '0') + ':00'

                return (
                  <tr key={hora}>
                    <td className="py-4 text-center fw-bold text-primary font-monospace bg-light bg-opacity-50 border-bottom">
                      {horaStr}
                    </td>
                    {diasSemana.map(dia => {
                      const claseEnEstaHora = horarioCompleto[dia.id]?.find(clase => {
                        const horaInicio = clase.hora.split(' - ')[0]
                        return horaInicio.startsWith(horaStr.substring(0, 2))
                      })

                      return (
                        <td key={dia.id} className="p-1 border-bottom border-light">
                          {claseEnEstaHora ? (
                            <div className="p-3 rounded-4 bg-orange-soft border border-primary border-opacity-20 h-100 transition-all hover-lift-sm">
                              <div className="fw-bold text-dark lh-sm mb-2" style={{ fontSize: '0.9rem' }}>{claseEnEstaHora.materia}</div>
                              <div className="d-flex flex-column gap-1">
                                <div className="small text-muted d-flex align-items-center">
                                  <CIcon icon={cilUser} size="sm" className="me-1 text-primary" />
                                  {claseEnEstaHora.profesor.split(' ').pop()}
                                </div>
                                <div className="small text-muted d-flex align-items-center">
                                  <CIcon icon={cilLocationPin} size="sm" className="me-1 text-primary" />
                                  {claseEnEstaHora.aula}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-100 d-flex align-items-center justify-content-center py-4">
                              <div className="text-muted opacity-10">...</div>
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CCardBody>
      <style>
        {`
            .hover-lift-sm:hover {
                background: white !important;
                box-shadow: 0 5px 15px rgba(242, 140, 15, 0.15) !important;
                transform: scale(1.02);
            }
            .ls-1 { letter-spacing: 1px; }
            table th, table td { vertical-align: middle !important; }
          `}
      </style>
    </CCard>
  )
}

export default VistaSemanal