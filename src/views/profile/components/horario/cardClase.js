import React from 'react'
import { CCard, CCardBody, CBadge, CCol } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilBook, cilUser, cilLocationPin, cilClock } from "@coreui/icons"

const CardClase = ({ clase, colorDia, indice }) => {
  return (
    <div className="timeline-item mb-4 position-relative">
      <div className="d-flex align-items-stretch">
        <div className="timeline-time-box me-4 text-center d-flex flex-column justify-content-center">
          <div className="btn-premium rounded-4 p-3 shadow-sm d-flex flex-column align-items-center justify-content-center" style={{ minWidth: '90px' }}>
            <strong className="fs-5">{clase.hora.split(' - ')[0]}</strong>
            <div className="small opacity-75 my-1 fw-bold">a</div>
            <strong className="fs-5">{clase.hora.split(' - ')[1]}</strong>
          </div>
        </div>

        <div className="timeline-content flex-grow-1 ps-4 border-start border-2 border-primary border-opacity-10 position-relative">
          <div className="position-absolute start-0 top-50 translate-middle">
            <div className="bg-primary rounded-circle border border-white border-3 shadow-sm" style={{ width: '16px', height: '16px', marginLeft: '-1px' }}></div>
          </div>

          <CCard className="premium-card border-0 h-100 mb-0 hover-lift transition-all">
            <CCardBody className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="mb-1 fw-bold class-card-title d-flex align-items-center">
                    <CIcon icon={cilBook} className="me-2 text-primary" />
                    {clase.materia}
                  </h5>
                  <div className="class-card-subtitle small d-flex align-items-center">
                    <CIcon icon={cilClock} className="me-1" size="sm" />
                    Sesión de {clase.hora.split(' - ').length > 1 ? '1.5' : '1'} hora / Danza Académica
                  </div>
                </div>
                <CBadge className="bg-orange-soft text-primary rounded-pill px-3 py-2 border border-primary border-opacity-10">
                  <CIcon icon={cilLocationPin} className="me-1" />
                  {clase.aula}
                </CBadge>
              </div>

              <div className="row g-3">
                <CCol md={6}>
                  <div className="d-flex align-items-center p-2 rounded-3 class-card-info-box">
                    <div className="p-2 class-card-inner-icon rounded-circle me-3 shadow-sm">
                      <CIcon icon={cilUser} className="text-primary" />
                    </div>
                    <div>
                      <div className="class-card-subtitle small text-uppercase fw-bold ls-1" style={{ fontSize: '0.6rem' }}>Profesor</div>
                      <div className="fw-bold class-card-title">{clase.profesor}</div>
                    </div>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="d-flex align-items-center p-2 rounded-3 class-card-info-box">
                    <div className="p-2 class-card-inner-icon rounded-circle me-3 shadow-sm">
                      <CIcon icon={cilLocationPin} className="text-primary" />
                    </div>
                    <div>
                      <div className="class-card-subtitle small text-uppercase fw-bold ls-1" style={{ fontSize: '0.6rem' }}>Ubicación</div>
                      <div className="fw-bold class-card-title">{clase.aula}</div>
                    </div>
                  </div>
                </CCol>
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>
      <style>
        {`
            .hover-lift:hover {
                transform: translateY(-5px);
                border-color: rgba(242, 140, 15, 0.3) !important;
                box-shadow: 0 15px 30px rgba(242, 140, 15, 0.1) !important;
            }
            .ls-1 { letter-spacing: 1px; }
            .timeline-item:last-child .timeline-content { border-left-color: transparent !important; }

            .class-card-title { color: var(--neutral-800); }
            .class-card-subtitle { color: var(--neutral-500); }
            .class-card-info-box { background-color: var(--neutral-50); }
            .class-card-inner-icon { background-color: white; }

            [data-coreui-theme="dark"] .class-card-title { color: white; }
            [data-coreui-theme="dark"] .class-card-subtitle { color: rgba(255,255,255,0.5); }
            [data-coreui-theme="dark"] .class-card-info-box { background-color: rgba(255,255,255,0.02); }
            [data-coreui-theme="dark"] .class-card-inner-icon { background-color: rgba(255,255,255,0.05); }
          `}
      </style>
    </div>
  )
}

export default CardClase