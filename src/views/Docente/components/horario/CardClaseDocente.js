import React from 'react'
import { CCard, CCardBody, CBadge, CCol, CRow } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilBook, cilLocationPin, cilClock, cilPeople, cilRoom } from "@coreui/icons"

const CardClaseDocente = ({ clase, index }) => {
    return (
        <div className="timeline-item timeline-item-responsive mb-4 position-relative">
            <div className="timeline-time-box timeline-time-box-responsive me-md-4 text-center d-flex flex-column justify-content-center">
                <div className="btn-premium rounded-4 p-3 shadow-sm d-flex flex-column align-items-center justify-content-center" style={{ minWidth: '90px' }}>
                    <strong className="fs-5">{clase.startTime}</strong>
                    <div className="small opacity-75 my-1 fw-bold">a</div>
                    <strong className="fs-5">{clase.endTime}</strong>
                </div>
            </div>

            <div className="timeline-content timeline-content-responsive flex-grow-1 ps-md-4 border-start-md border-2 border-primary border-opacity-10 position-relative">
                <div className="position-absolute start-0 top-50 translate-middle d-none d-md-block">
                    <div className="bg-primary rounded-circle border border-white border-3 shadow-sm timeline-dot-responsive" style={{ width: '16px', height: '16px', marginLeft: '-1px' }}></div>
                </div>

                <CCard className="premium-card border-0 h-100 mb-0 hover-lift transition-all">
                    <CCardBody className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h5 className="mb-1 fw-bold class-card-title d-flex align-items-center header-title-custom">
                                    <CIcon icon={cilBook} className="me-2 text-primary" />
                                    {clase.subject}
                                </h5>
                                <div className="class-card-subtitle small d-flex align-items-center text-muted-custom">
                                    <CIcon icon={cilClock} className="me-1" size="sm" />
                                    Cátedra de 1.5 horas / Especialidad Danza
                                </div>
                            </div>
                            <CBadge className="bg-orange-soft text-primary rounded-pill px-3 py-2 border border-primary border-opacity-10 shadow-sm d-flex align-items-center">
                                <CIcon icon={cilLocationPin} className="me-1" />
                                {clase.classroom}
                            </CBadge>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="d-flex align-items-center p-2 rounded-3 class-card-info-box bg-light-custom bg-opacity-25 border border-light-custom shadow-sm">
                                    <div className="p-2 bg-white rounded-circle me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                                        <CIcon icon={cilPeople} className="text-primary" />
                                    </div>
                                    <div>
                                        <div className="class-card-subtitle small text-uppercase fw-bold ls-1 text-muted-custom" style={{ fontSize: '0.6rem' }}>Sección / Grado</div>
                                        <div className="fw-bold class-card-title header-title-custom">{clase.sectionName} <small className="text-muted-custom fw-normal">({clase.gradeLevel})</small></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center p-2 rounded-3 class-card-info-box bg-light-custom bg-opacity-25 border border-light-custom shadow-sm">
                                    <div className="p-2 bg-white rounded-circle me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                                        <CIcon icon={cilRoom} className="text-primary" />
                                    </div>
                                    <div>
                                        <div className="class-card-subtitle small text-uppercase fw-bold ls-1 text-muted-custom" style={{ fontSize: '0.6rem' }}>Aula Asignada</div>
                                        <div className="fw-bold class-card-title header-title-custom">{clase.classroom}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CCardBody>
                </CCard>
            </div>

        </div >
    )
}

export default CardClaseDocente
