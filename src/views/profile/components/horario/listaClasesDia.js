// components/ListaClasesDia.js
import React from 'react'
import { CCard, CCardHeader, CCardBody, CBadge } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar } from "@coreui/icons"
import CardClase from './cardClase'

const ListaClasesDia = ({ dia, clases, estudiante, colorDia, horasDia }) => {
  return (
    <CCard className="shadow-sm">
      <CCardHeader className={`bg-${colorDia}-subtle`}>
        <h5 className="mb-0">
          <CIcon icon={cilCalendar} className="me-2" />
          {dia.nombre} - {estudiante.grado} {estudiante.seccion}
          <CBadge color={colorDia} className="ms-2">
            {horasDia} horas de clase
          </CBadge>
        </h5>
      </CCardHeader>
      <CCardBody>
        {clases.length > 0 ? (
          <div className="timeline">
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
          <div className="text-center py-5">
            <CIcon icon={cilCalendar} size="xxl" className="text-secondary opacity-50 mb-3" />
            <h5 className="text-secondary">No hay clases programadas</h5>
            <p className="text-muted">Este día no tiene clases asignadas</p>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default ListaClasesDia