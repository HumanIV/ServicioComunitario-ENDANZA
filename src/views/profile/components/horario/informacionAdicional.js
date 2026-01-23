// components/InformacionAdicional.js
import React from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CAlert,
  CButton,
  CRow,
  CCol
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilUser, cilInfo, cilCheckCircle, cilArrowRight } from "@coreui/icons"

const InformacionAdicional = ({ profesores }) => {
  return (
    <CRow className="mt-4">
      <CCol md={6}>
        <CCard className="shadow-sm">
          <CCardHeader>
            <h6 className="mb-0">
              <CIcon icon={cilUser} className="me-2" />
              Profesores Asignados
            </h6>
          </CCardHeader>
          <CCardBody>
            <div className="list-group">
              {profesores.map((prof, idx) => (
                <div key={idx} className="list-group-item border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{prof.nombre}</strong>
                      <div className="small text-muted">{prof.materia}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      
      <CCol md={6}>
        <CCard className="shadow-sm">
          <CCardHeader>
            <h6 className="mb-0">
              <CIcon icon={cilInfo} className="me-2" />
              Información Importante
            </h6>
          </CCardHeader>
          <CCardBody>
            <CAlert color="info" className="d-flex align-items-start">
              <CIcon icon={cilCheckCircle} className="me-3 mt-1 flex-shrink-0" />
              <div>
                <strong>Recordatorios:</strong>
                <ul className="mb-0 mt-2">
                  <li>Llegar 10 minutos antes de cada clase</li>
                  <li>Usar el uniforme completo de danza</li>
                  <li>Traer botella de agua personal</li>
                  <li>Notificar ausencias con anticipación</li>
                </ul>
              </div>
            </CAlert>
            {/*
            <div className="d-grid gap-2 mt-3">
              <CButton color="secondary" variant="outline">
                <CIcon icon={cilArrowRight} className="me-2" />
                Ver Calendario de Eventos
              </CButton>
              <CButton color="secondary" variant="outline">
                <CIcon icon={cilArrowRight} className="me-2" />
                Solicitar Cambio de Horario
              </CButton>
            </div>*/}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default InformacionAdicional