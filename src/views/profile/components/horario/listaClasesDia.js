import React from 'react'
import { CCard, CCardHeader, CCardBody, CBadge } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar, cilClock } from "@coreui/icons"
import CardClase from './cardClase'

const ListaClasesDia = ({ dia, clases, estudiante, colorDia, horasDia }) => {
  return (
    <div className="animate__animated animate__fadeIn">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 px-2">
        <div>
          <h4 className="mb-1 fw-bold text-dark d-flex align-items-center fs-5 fs-md-4">
            <CIcon icon={cilCalendar} className="me-2 text-primary" />
            {dia.nombre}
          </h4>
          <span className="text-muted-custom fw-medium small">{estudiante.grado} • {estudiante.seccion}</span>
        </div>
        <CBadge className="bg-orange-soft text-primary rounded-pill px-3 py-2 fs-6 border border-primary border-opacity-10 w-100 w-md-auto shadow-sm d-flex align-items-center justify-content-center">
          <CIcon icon={cilClock} className="me-2" />
          <span className="small fw-bold">{horasDia} HORAS PROGRAMADAS</span>
        </CBadge>
      </div>

      <div className="pb-5">
        {clases.length > 0 ? (
          <div className="timeline-container px-2">
            {clases.map((clase, index) => (
              <CardClase
                key={index}
                clase={clase}
                colorDia={colorDia}
                indice={index}
              />
            ))}
          </div>
        ) : (
          <CCard className="premium-card border-0 text-center py-5">
            <CCardBody>
              <div className="p-4 bg-light rounded-circle d-inline-flex mb-3">
                <CIcon icon={cilCalendar} size="3xl" className="text-muted opacity-50" />
              </div>
              <h5 className="fw-bold text-dark">Día de Descanso</h5>
              <p className="text-muted">No tienes actividades programadas para este día.</p>
            </CCardBody>
          </CCard>
        )}
      </div>
    </div>
  )
}

export default ListaClasesDia