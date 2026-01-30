import React from 'react'
import { CRow, CCol, CCard, CCardHeader, CCardBody, CCardFooter, CButton, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilEducation, cilPeople, cilBook } from '@coreui/icons'
import PropTypes from 'prop-types'

const GradeCards = ({ data, onSelectGrade }) => {
    return (
        <div className="animate__animated animate__fadeIn">
            <div className="d-flex align-items-center mb-4 px-2">
                <h4 className="mb-0 fw-bold header-title-custom d-flex align-items-center">
                    <CIcon icon={cilEducation} className="me-2 text-primary" />
                    Seleccionar Grado de Danza
                </h4>
            </div>

            <CRow className="g-4">
                {data.map((grado, i) => (
                    <CCol md={6} lg={4} key={i}>
                        <CCard className="premium-card border-0 h-100 overflow-hidden shadow-sm hover-lift-sm">
                            <CCardHeader className="bg-orange-soft border-0 py-3 text-center">
                                <strong className="fs-5 header-title-custom fw-bold text-uppercase ls-1">{grado.grado}</strong>
                            </CCardHeader>
                            <CCardBody className="p-4">
                                <div className="text-center mb-4">
                                    <CBadge color="primary" className="rounded-pill px-4 py-2 fs-6 bg-opacity-10 text-primary border border-primary border-opacity-10 shadow-sm">
                                        <CIcon icon={cilBook} className="me-2" />
                                        {grado.materias.length} Disciplinas
                                    </CBadge>
                                </div>

                                <div className="p-3 rounded-4 bg-light-custom border border-light-custom">
                                    <small className="text-muted-custom text-uppercase fw-bold ls-1 d-block mb-3" style={{ fontSize: '0.65rem' }}>Especialidades:</small>
                                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                                        {grado.materias.map((materia, j) => (
                                            <li key={j} className="d-flex align-items-center fw-medium header-title-custom">
                                                <div className="bg-primary rounded-circle me-2" style={{ width: '6px', height: '6px' }}></div>
                                                {materia.nombre}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-4 text-center">
                                    <div className="text-muted-custom d-flex align-items-center justify-content-center gap-2 small fw-bold text-uppercase ls-1">
                                        <CIcon icon={cilPeople} size="sm" className="text-primary" />
                                        <span>Total Estudiantes: {grado.materias.reduce((total, materia) => total + materia.estudiantes.length, 0)}</span>
                                    </div>
                                </div>
                            </CCardBody>
                            <CCardFooter className="bg-transparent border-0 p-4 pt-0">
                                <CButton
                                    className="btn-premium w-100 py-2 shadow-sm"
                                    onClick={() => onSelectGrade(grado)}
                                >
                                    GESTIONAR NOTAS
                                </CButton>
                            </CCardFooter>
                        </CCard>
                    </CCol>
                ))}
            </CRow>
        </div>
    )
}

GradeCards.propTypes = {
    data: PropTypes.array.isRequired,
    onSelectGrade: PropTypes.func.isRequired,
}

export default GradeCards