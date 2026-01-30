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
      <CCardHeader className="schedule-header border-0 py-3 px-4 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold header-title-custom text-uppercase ls-1">
          <CIcon icon={cilCalendar} className="me-2 text-primary" />
          Calendario Semanal
        </h5>
        <div className="badge bg-light-custom text-primary rounded-pill px-3 py-2 border border-primary border-opacity-10 shadow-sm">
          Planificación Institucional
        </div>
      </CCardHeader>
      <CCardBody className="p-0 schedule-body-main">
        <div className="table-responsive schedule-responsive-container">
          <table className="table table-bordered mb-0 schedule-table-fixed">
            <thead className="schedule-thead">
              <tr>
                <th className="py-3 px-4 text-center border-0 small fw-bold text-muted-custom text-uppercase" style={{ width: '10%' }}>
                  <CIcon icon={cilClock} className="me-1" /> Hora
                </th>
                {diasSemana.map(dia => (
                  <th key={dia.id} className="py-3 px-3 text-center border-0 small fw-bold text-muted-custom text-uppercase">
                    {dia.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 11 }, (_, i) => i + 8).map(hora => {
                const horaStr = hora.toString().padStart(2, '0') + ':00'

                return (
                  <tr key={hora} className="schedule-row">
                    <td className="py-4 text-center fw-bold text-primary font-monospace schedule-time-col">
                      {horaStr}
                    </td>
                    {diasSemana.map(dia => {
                      const claseEnEstaHora = horarioCompleto[dia.id]?.find(clase => {
                        const horaInicio = clase.hora.split(' - ')[0]
                        return horaInicio.startsWith(horaStr.substring(0, 2))
                      })

                      return (
                        <td key={dia.id} className="p-1 schedule-cell">
                          {claseEnEstaHora ? (
                            <div className="p-3 rounded-4 schedule-class-card border border-primary border-opacity-20 h-100 transition-all hover-lift-sm">
                              <div className="fw-bold header-title-custom lh-sm mb-2" style={{ fontSize: '0.9rem' }}>{claseEnEstaHora.materia}</div>
                              <div className="d-flex flex-column gap-1">
                                <div className="small text-muted-custom d-flex align-items-center">
                                  <CIcon icon={cilUser} size="sm" className="me-1 text-primary" />
                                  {claseEnEstaHora.profesor.split(' ').pop()}
                                </div>
                                <div className="small text-muted-custom d-flex align-items-center">
                                  <CIcon icon={cilLocationPin} size="sm" className="me-1 text-primary" />
                                  {claseEnEstaHora.aula}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-100 d-flex align-items-center justify-content-center py-4">
                              <div className="schedule-empty-dot"></div>
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
            /* --- Common Styles --- */
            .ls-1 { letter-spacing: 1px; }
            table th, table td { vertical-align: middle !important; }
            
            .schedule-header { background-color: rgba(242, 140, 15, 0.1); }
            .schedule-thead { background-color: #f8fafc; }
            .schedule-time-col { background-color: rgba(242, 140, 15, 0.05); color: var(--primary-600) !important; font-size: 0.9rem; }
            .schedule-class-card { background-color: rgba(242, 140, 15, 0.1); }
            .schedule-empty-dot { width: 6px; height: 6px; background-color: var(--neutral-200); border-radius: 50%; opacity: 0.3; }

            /* --- DARK MODE AGGRESSIVE FIXES --- */
            [data-coreui-theme="dark"] .schedule-body-main { background-color: #0c0d1e !important; }
            [data-coreui-theme="dark"] .schedule-responsive-container { background-color: #0c0d1e !important; }
            
            [data-coreui-theme="dark"] .schedule-table-fixed { 
                background-color: transparent !important; 
                --cui-table-bg: transparent !important;
                border-color: rgba(255, 255, 255, 0.05) !important;
            }
            
            [data-coreui-theme="dark"] .schedule-thead { background-color: #1a1b2e !important; }
            [data-coreui-theme="dark"] .schedule-thead th { color: #ffffff !important; border-color: rgba(255, 255, 255, 0.05) !important; }
            
            [data-coreui-theme="dark"] .schedule-row { background-color: transparent !important; }
            
            [data-coreui-theme="dark"] .schedule-time-col { 
                background-color: #1a1b2e !important; 
                color: var(--primary-400) !important; 
                border-color: rgba(255, 255, 255, 0.05) !important;
            }
            
            [data-coreui-theme="dark"] .schedule-cell { 
                background-color: transparent !important;
                border-color: rgba(255, 255, 255, 0.05) !important; 
            }
            
            [data-coreui-theme="dark"] .schedule-class-card { 
                background-color: #1e293b !important; 
                border: 1px solid rgba(245, 185, 55, 0.2) !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            
            [data-coreui-theme="dark"] .schedule-empty-dot { background-color: rgba(255, 255, 255, 0.2); }

            .hover-lift-sm:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.15);
            }
            
            [data-coreui-theme="dark"] .hover-lift-sm:hover {
                background-color: #2d3748 !important;
                border-color: var(--primary-500) !important;
            }
          `}
      </style>
    </CCard>
  )
}

export default VistaSemanal