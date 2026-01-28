import React from 'react'
import { CCard, CCardHeader, CCardBody, CBadge } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar, cilClock } from "@coreui/icons"
import CardClase from './cardClase'

const ListaClasesDia = ({ dia, clases, estudiante, colorDia, horasDia }) => {
  return (
    <div className="animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4 px-2">
        <h4 className="mb-0 fw-bold text-dark d-flex align-items-center">
          <CIcon icon={cilCalendar} className="me-2 text-primary" />
          {dia.nombre}
          <span className="text-muted fw-normal ms-2 small">| {estudiante.grado} {estudiante.seccion}</span>
        </h4>
        <CBadge className="bg-orange-soft text-primary rounded-pill px-4 py-2 fs-6 border border-primary border-opacity-10">
          <CIcon icon={cilClock} className="me-2" />
          {horasDia} horas de clase programadas
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