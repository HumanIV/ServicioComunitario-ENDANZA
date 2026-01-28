import React from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CAlert,
  CRow,
  CCol
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilUser, cilInfo, cilCheckCircle } from "@coreui/icons"

const InformacionAdicional = ({ profesores }) => {
  return (
    <CRow className="mt-5 g-4">
      <CCol md={6}>
        <CCard className="premium-card border-0 h-100">
          <CCardHeader className="bg-transparent border-0 pt-4 px-4 d-flex align-items-center">
            <div className="p-2 bg-orange-soft rounded-circle me-3">
              <CIcon icon={cilUser} className="text-primary" />
            </div>
            <h6 className="mb-0 fw-bold text-dark text-uppercase ls-1 small">Staff de Profesores</h6>
          </CCardHeader>
          <CCardBody className="px-4 pb-4">
            <div className="d-flex flex-column gap-2 mt-2">
              {profesores.map((prof, idx) => (
                <div key={idx} className="p-3 bg-light rounded-4 border border-primary border-opacity-5 transition-all hover-lift-xs">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold text-dark">{prof.nombre}</div>
                      <div className="small text-primary text-uppercase fw-bold ls-1" style={{ fontSize: '0.65rem' }}>{prof.materia}</div>
                    </div>
                    <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-pill small fw-bold" style={{ fontSize: '0.6rem' }}>TITULAR</div>
                  </div>
                </div>
              ))}
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol md={6}>
        <CCard className="premium-card border-0 h-100 overflow-hidden">
          <CCardHeader className="bg-transparent border-0 pt-4 px-4 d-flex align-items-center">
            <div className="p-2 bg-primary bg-opacity-10 rounded-circle me-3">
              <CIcon icon={cilInfo} className="text-primary" />
            </div>
            <h6 className="mb-0 fw-bold text-dark text-uppercase ls-1 small">Normativa Disciplinar</h6>
          </CCardHeader>
          <CCardBody className="px-4 pb-4">
            <CAlert color="info" className="bg-orange-soft border-0 d-flex align-items-start rounded-4 p-4 mt-2">
              <CIcon icon={cilCheckCircle} className="me-3 mt-1 flex-shrink-0 text-primary" size="xl" />
              <div>
                <strong className="text-primary fs-5 d-block mb-3">Protocolos Obligatorios:</strong>
                <ul className="mb-0 mt-2 d-flex flex-column gap-2 text-dark fw-medium" style={{ fontSize: '0.9rem' }}>
                  <li>Puntualidad: Llegar 10 minutos antes de cada sesión.</li>
                  <li>Uniforme institucional completo de danza.</li>
                  <li>Uso obligatorio de hidratación personal.</li>
                  <li>Notificar inasistencias vía portal de padres.</li>
                  <li>Cumplir con los estándares de higiene personal.</li>
                </ul>
              </div>
            </CAlert>
          </CCardBody>
        </CCard>
      </CCol>
      <style>
        {`
            .hover-lift-xs:hover { transform: translateX(5px); background: white !important; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .ls-1 { letter-spacing: 1.2px; }
          `}
      </style>
    </CRow>
  )
}

export default InformacionAdicional