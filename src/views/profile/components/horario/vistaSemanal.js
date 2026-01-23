// components/VistaSemanal.js
import React from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar, cilUser, cilLocationPin } from "@coreui/icons"

const VistaSemanal = ({ diasSemana, horarioCompleto }) => {
  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-body-tertiary">
        <h5 className="mb-0">
          <CIcon icon={cilCalendar} className="me-2" />
          Vista Semanal Completa
        </h5>
      </CCardHeader>
      <CCardBody>
        <CTable responsive bordered hover>
          <CTableHead className="table-dark">
            <CTableRow>
              <CTableHeaderCell style={{ width: '12%' }}>Hora</CTableHeaderCell>
              {diasSemana.map(dia => (
                <CTableHeaderCell key={dia.id} className={`text-${dia.color}`}>
                  {dia.nombre}
                </CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {Array.from({ length: 17 }, (_, i) => i + 8).map(hora => {
              const horaStr = hora.toString().padStart(2, '0') + ':00'
              
              return (
                <CTableRow key={hora}>
                  <CTableDataCell className="fw-bold">
                    {horaStr}
                  </CTableDataCell>
                  {diasSemana.map(dia => {
                    const claseEnEstaHora = horarioCompleto[dia.id]?.find(clase => {
                      const horaInicio = clase.hora.split(' - ')[0]
                      return horaInicio.startsWith(horaStr.substring(0, 2))
                    })
                    
                    return (
                      <CTableDataCell key={dia.id} className="position-relative">
                        {claseEnEstaHora ? (
                          <div className={`p-2 rounded border-start border-${dia.color} border-3 bg-${dia.color}-subtle`}>
                            <div className="fw-bold">{claseEnEstaHora.materia}</div>
                            <div className="small">
                              <CIcon icon={cilUser} size="sm" /> {claseEnEstaHora.profesor}
                            </div>
                            <div className="small">
                              <CIcon icon={cilLocationPin} size="sm" /> {claseEnEstaHora.aula}
                            </div>
                            <div className="small text-muted">{claseEnEstaHora.hora}</div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="text-muted opacity-25">—</div>
                          </div>
                        )}
                      </CTableDataCell>
                    )
                  })}
                </CTableRow>
              )
            })}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default VistaSemanal