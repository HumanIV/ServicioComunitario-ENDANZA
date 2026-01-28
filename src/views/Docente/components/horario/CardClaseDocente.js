import React from 'react'
import { CCard, CCardBody, CBadge, CCol, CRow } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilBook, cilLocationPin, cilClock, cilPeople, cilRoom } from "@coreui/icons"

const CardClaseDocente = ({ clase, index }) => {
    return (
        <div className="timeline-item mb-4 position-relative">
            <div className="d-flex align-items-stretch">
                <div className="timeline-time-box me-4 text-center d-flex flex-column justify-content-center">
                    <div className="btn-premium rounded-4 p-3 shadow-sm d-flex flex-column align-items-center justify-content-center" style={{ minWidth: '100px' }}>
                        <strong className="fs-5">{clase.startTime}</strong>
                        <div className="small opacity-75 my-1 fw-bold">a</div>
                        <strong className="fs-5">{clase.endTime}</strong>
                    </div>
                </div>

                <div className="timeline-content flex-grow-1 ps-4 border-start border-2 border-primary border-opacity-10 position-relative">
                    <div className="position-absolute start-0 top-50 translate-middle">
                        <div className="bg-primary rounded-circle border border-white border-3 shadow-sm" style={{ width: '16px', height: '16px', marginLeft: '-1px' }}></div>
                    </div>

                    <CCard className="premium-card border-0 h-100 mb-0 hover-lift transition-all" style={{ borderRadius: '16px' }}>
                        <CCardBody className="p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h5 className="mb-1 fw-bold text-dark d-flex align-items-center">
                                        <CIcon icon={cilBook} className="me-2 text-primary" />
                                        {clase.subject}
                                    </h5>
                                    <div className="text-muted small d-flex align-items-center fw-bold text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>
                                        <CIcon icon={cilClock} className="me-1" size="sm" />
                                        Cátedra Académica / {clase.dayOfWeek}
                                    </div>
                                </div>
                                <CBadge className="bg-orange-soft text-primary rounded-pill px-3 py-2 border border-primary border-opacity-10">
                                    <CIcon icon={cilRoom} className="me-1" />
                                    {clase.classroom}
                                </CBadge>
                            </div>

                            <CRow className="g-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center p-2 rounded-3 bg-light">
                                        <div className="p-2 bg-white rounded-circle me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                                            <CIcon icon={cilPeople} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-muted small text-uppercase fw-bold ls-1" style={{ fontSize: '0.6rem' }}>Sessión / Grado</div>
                                            <div className="fw-bold text-dark">{clase.sectionName} <small className="text-muted fw-normal">({clase.gradeLevel})</small></div>
                                        </div>
                                    </div>
                                </CCol>
                                <CCol md={6}>
                                    <div className="d-flex align-items-center p-2 rounded-3 bg-light">
                                        <div className="p-2 bg-white rounded-circle me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                                            <CIcon icon={cilLocationPin} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-muted small text-uppercase fw-bold ls-1" style={{ fontSize: '0.6rem' }}>Ubicación</div>
                                            <div className="fw-bold text-dark">{clase.classroom}</div>
                                        </div>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </div>
            </div>
            <style>
                {`
            .hover-lift {
                transition: all 0.3s ease;
            }
            .hover-lift:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 30px rgba(242, 140, 15, 0.1) !important;
            }
            .ls-1 { letter-spacing: 1px; }
            .timeline-item:last-child .timeline-content { border-left-color: transparent !important; }
            .bg-orange-soft { background-color: rgba(242, 140, 15, 0.12); }
            .btn-premium {
                background: linear-gradient(135deg, #F28C0F 0%, #E07B00 100%);
                border: none;
                color: white;
            }
          `}
            </style>
        </div>
    )
}

export default CardClaseDocente
