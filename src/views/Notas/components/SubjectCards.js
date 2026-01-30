import React from 'react'
import { CRow, CCol, CCard, CCardHeader, CCardBody, CCardFooter, CButton, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilClock, cilBadge, cilPeople, cilBook, cilPencil } from '@coreui/icons'
import PropTypes from 'prop-types'

const SubjectCards = ({ grade, onBack, onSelectSubject, calculatePromedio, getColorEstado, determinarEstado }) => {
    return (
        <div className="animate__animated animate__fadeIn">
            <div className="d-flex align-items-center mb-5 px-2">
                <CButton
                    color="light"
                    className="me-3 rounded-pill border-2 hover-orange shadow-sm d-flex align-items-center header-title-custom bg-transparent"
                    onClick={onBack}
                >
                    <CIcon icon={cilArrowLeft} className="me-2" />
                    Volver
                </CButton>
                <div>
                    <h3 className="mb-0 fw-bold header-title-custom">{grade.grado}</h3>
                    <p className="text-muted-custom small mb-0 text-uppercase ls-1">Selecciona una materia para gestionar calificaciones</p>
                </div>
            </div>

            <CRow className="g-4">
                {grade.materias.map((materia, i) => (
                    <CCol md={6} key={i}>
                        <CCard className="premium-card border-0 h-100 overflow-hidden shadow-sm hover-lift-sm">
                            <CCardHeader className="bg-orange-soft border-0 py-3 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <div className="p-2 bg-primary rounded-circle me-3 shadow-sm">
                                        <CIcon icon={cilBook} size="sm" className="text-white" />
                                    </div>
                                    <strong className="header-title-custom fw-bold text-uppercase ls-1" style={{ fontSize: '0.9rem' }}>{materia.nombre}</strong>
                                </div>
                                <CBadge color="primary" className="rounded-pill px-3 py-2 bg-opacity-10 text-primary border border-primary border-opacity-10 shadow-sm">
                                    {materia.estudiantes.length} Estudiantes
                                </CBadge>
                            </CCardHeader>
                            <CCardBody className="p-4">
                                <CRow className="mb-4 g-3">
                                    <CCol xs={12} sm={6}>
                                        <div className="p-3 rounded-4 bg-light-custom h-100 border border-light-custom">
                                            <div className="text-muted-custom small text-uppercase fw-bold ls-1 mb-2" style={{ fontSize: '0.6rem' }}>
                                                <CIcon icon={cilClock} className="me-1 text-primary" /> Horario
                                            </div>
                                            <div className="fw-bold header-title-custom small">{materia.horario}</div>
                                        </div>
                                    </CCol>
                                    <CCol xs={12} sm={6}>
                                        <div className="p-3 rounded-4 bg-light-custom h-100 border border-light-custom">
                                            <div className="text-muted-custom small text-uppercase fw-bold ls-1 mb-2" style={{ fontSize: '0.6rem' }}>
                                                <CIcon icon={cilBadge} className="me-1 text-primary" /> Código
                                            </div>
                                            <div className="fw-bold text-primary font-monospace small">{materia.id}</div>
                                        </div>
                                    </CCol>
                                </CRow>

                                <div className="p-4 rounded-4 subject-resumen-box">
                                    <h6 className="text-primary small fw-bold text-uppercase ls-1 mb-3">Resumen de Calificaciones</h6>
                                    <div className="d-flex flex-column gap-3">
                                        {materia.estudiantes.slice(0, 3).map(est => {
                                            const promedio = calculatePromedio(est.id)
                                            const estado = determinarEstado(promedio)
                                            return (
                                                <div key={est.id} className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar-small me-2 bg-white text-primary fw-bold shadow-sm">
                                                            {est.nombre.charAt(0)}
                                                        </div>
                                                        <span className="small header-title-custom fw-medium">{est.nombre}</span>
                                                    </div>
                                                    <CBadge color={getColorEstado(estado)} className={`rounded-pill px-3 py-1 ${promedio ? 'shadow-sm' : 'opacity-50'}`}>
                                                        {promedio ? `${promedio}/20` : "PENDIENTE"}
                                                    </CBadge>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {materia.estudiantes.length > 3 && (
                                        <div className="mt-3 text-center">
                                            <small className="text-muted-custom text-uppercase ls-1 fw-bold" style={{ fontSize: '0.6rem' }}>
                                                + {materia.estudiantes.length - 3} estudiantes por calificar
                                            </small>
                                        </div>
                                    )}
                                </div>
                            </CCardBody>
                            <CCardFooter className="bg-transparent border-0 p-4 pt-0">
                                <CButton
                                    className="btn-premium w-100 py-2 d-flex align-items-center justify-content-center shadow-sm"
                                    onClick={() => onSelectSubject(materia)}
                                >
                                    <CIcon icon={cilPencil} className="me-2" />
                                    CARGAR CALIFICACIONES
                                </CButton>
                            </CCardFooter>
                        </CCard>
                    </CCol>
                ))}
            </CRow>
        </div>
    )
}

SubjectCards.propTypes = {
    grade: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onSelectSubject: PropTypes.func.isRequired,
    calculatePromedio: PropTypes.func.isRequired,
    getColorEstado: PropTypes.func.isRequired,
    determinarEstado: PropTypes.func.isRequired,
}

export default SubjectCards