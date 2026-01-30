import React from 'react'
import {
    CCard,
    CCardHeader,
    CCardBody,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CBadge,
    CFormInput,
    CButton,
    CCardFooter,
    CRow,
    CCol,
    CProgress
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilSend, cilWarning, cilArrowLeft, cilUser, cilCheckCircle, cilClock, cilBook } from '@coreui/icons'
import PropTypes from 'prop-types'

const EvaluationTable = ({
    grade,
    subject,
    onBack,
    onClear,
    onPrepareSend,
    notas,
    onNotaChange,
    calculatePromedio,
    determinarEstado,
    getColorNota,
    getColorEstado
}) => {
    return (
        <div className="animate__animated animate__fadeIn">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 no-print px-2 gap-3">
                <div className="d-flex align-items-center">
                    <CButton
                        color="light"
                        className="me-3 rounded-pill border-2 hover-orange shadow-sm d-flex align-items-center header-title-custom bg-transparent"
                        onClick={onBack}
                    >
                        <CIcon icon={cilArrowLeft} className="me-2" />
                        Retroceder
                    </CButton>
                    <div>
                        <h3 className="mb-0 fw-bold header-title-custom">{subject.nombre}</h3>
                        <p className="text-muted-custom small mb-0 text-uppercase ls-1">Carga de calificaciones trimestrales</p>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <CButton
                        color="light"
                        variant="outline"
                        className="rounded-pill px-4 py-2 border-2 fw-bold text-muted-custom hover-orange shadow-sm"
                        onClick={onClear}
                    >
                        <CIcon icon={cilTrash} className="me-2 text-danger" /> Limpiar Todo
                    </CButton>
                    <CButton
                        className="btn-premium rounded-pill px-4 py-2 shadow-sm d-flex align-items-center"
                        onClick={onPrepareSend}
                    >
                        <CIcon icon={cilSend} className="me-2" />
                        ENVIAR A SECRETARÍA
                    </CButton>
                </div>
            </div>

            <CCard className="premium-card border-0 overflow-hidden shadow-lg mb-5">
                <CCardHeader className="bg-orange-soft border-0 py-4 px-4 overflow-hidden position-relative">
                    <div className="position-absolute" style={{ top: '-20px', right: '-20px', opacity: 0.05 }}>
                        <CIcon icon={cilBook} style={{ width: '140px', height: '140px' }} className="text-primary" />
                    </div>
                    <CRow className="align-items-center position-relative" style={{ zIndex: 1 }}>
                        <CCol md={8}>
                            <div className="d-flex align-items-center">
                                <div className="p-3 grade-card-icon-wrapper rounded-circle me-3 shadow-sm">
                                    <CIcon icon={cilUser} size="xl" className="text-primary" />
                                </div>
                                <div>
                                    <h5 className="mb-0 fw-bold header-title-custom text-uppercase ls-1">{grade.grado} • {subject.nombre}</h5>
                                    <div className="d-flex gap-3 mt-1">
                                        <small className="text-muted-custom d-flex align-items-center">
                                            <CIcon icon={cilClock} className="me-1" /> {subject.horario}
                                        </small>
                                        <small className="text-muted-custom d-flex align-items-center">
                                            <CIcon icon={cilCheckCircle} className="me-1" /> Código: {subject.id}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </CCol>
                        <CCol md={4} className="text-md-end mt-3 mt-md-0">
                            <CBadge className="bg-light-custom text-primary border border-primary border-opacity-10 px-4 py-2 rounded-pill fs-6 shadow-sm fw-bold">
                                {subject.estudiantes.length} BAILARINES
                            </CBadge>
                        </CCol>
                    </CRow>
                </CCardHeader>
                <CCardBody className="p-0">
                    <div className="table-responsive">
                        <CTable align="middle" className="mb-0 custom-premium-table">
                            <CTableHead className="bg-light-custom bg-opacity-50">
                                <CTableRow>
                                    <CTableHeaderCell className="ps-4 py-3 text-muted-custom small fw-bold text-uppercase ls-1" width="25%">Estudiante</CTableHeaderCell>
                                    <CTableHeaderCell className="py-3 text-center text-muted-custom small fw-bold text-uppercase ls-1" width="10%">Reg.</CTableHeaderCell>
                                    {[1, 2, 3, 4].map(num => (
                                        <CTableHeaderCell key={num} className="py-3 text-center text-muted-custom small fw-bold text-uppercase ls-1" width="10%">CORTE {num}</CTableHeaderCell>
                                    ))}
                                    <CTableHeaderCell className="py-3 text-center text-muted-custom small fw-bold text-uppercase ls-1 pe-4" width="15%">PROMEDIO FINAL</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {subject.estudiantes.map((estudiante) => {
                                    const notasEst = notas[estudiante.id] || { n1: "", n2: "", n3: "", n4: "" }
                                    const promedio = calculatePromedio(estudiante.id)
                                    const estado = determinarEstado(promedio)

                                    return (
                                        <CTableRow key={estudiante.id} className="hover-row transition-all">
                                            <CTableDataCell className="ps-4 py-3 border-bottom-light">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-circle me-3 bg-orange-soft text-primary fw-bold shadow-sm">
                                                        {estudiante.nombre.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold header-title-custom">{estudiante.nombre}</div>
                                                        <div className="text-muted-custom" style={{ fontSize: '0.7rem' }}>Expediente: {estudiante.codigo}</div>
                                                    </div>
                                                </div>
                                            </CTableDataCell>

                                            <CTableDataCell className="text-center border-bottom-light">
                                                <CBadge className="bg-light-custom text-muted-custom border border-light-custom rounded-pill px-2">
                                                    {estudiante.codigo}
                                                </CBadge>
                                            </CTableDataCell>

                                            {[1, 2, 3, 4].map(num => (
                                                <CTableDataCell key={num} className="text-center border-bottom-light">
                                                    <CFormInput
                                                        type="number"
                                                        min="0"
                                                        max="20"
                                                        step="0.1"
                                                        value={notasEst[`n${num}`] || ""}
                                                        onChange={(e) => onNotaChange(estudiante.id, num, e.target.value)}
                                                        className={`text-center fw-bold evaluation-input rounded-3 shadow-sm ${notasEst[`n${num}`] ? 'bg-white' : 'bg-light-custom bg-opacity-50 border-dashed'}`}
                                                    />
                                                    <div className="text-muted-custom mt-1" style={{ fontSize: '0.6rem' }}>C{num}</div>
                                                </CTableDataCell>
                                            ))}

                                            <CTableDataCell className="text-center pe-4 border-bottom-light">
                                                {promedio ? (
                                                    <div className="d-flex flex-column align-items-center">
                                                        <div className={`average-circle mb-1 bg-${getColorEstado(estado)} shadow-sm`}>
                                                            {promedio}
                                                        </div>
                                                        <CBadge
                                                            color={getColorEstado(estado)}
                                                            className="rounded-pill px-2 py-1 bg-opacity-10"
                                                            style={{
                                                                color: `var(--cui-${getColorEstado(estado)}) !important`,
                                                                border: `1px solid var(--cui-${getColorEstado(estado)})33`
                                                            }}
                                                        >
                                                            {estado.toUpperCase()}
                                                        </CBadge>
                                                    </div>
                                                ) : (
                                                    <div className="text-muted-custom opacity-50 small fw-bold ls-1">--</div>
                                                )}
                                            </CTableDataCell>
                                        </CTableRow>
                                    )
                                })}
                            </CTableBody>
                        </CTable>
                    </div>
                </CCardBody>
                <CCardFooter className="bg-light-custom bg-opacity-50 border-0 p-4 no-print rounded-bottom-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center text-muted-custom">
                            <div className="p-2 bg-light-custom rounded-circle me-3 shadow-sm border border-light">
                                <CIcon icon={cilWarning} className="text-warning" />
                            </div>
                            <small className="fw-medium">
                                <strong className="header-title-custom">IMPORTANTE:</strong> Ingrese valores entre <strong>0 y 20</strong> siguiendo la escala institucional.
                            </small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <CProgress
                                value={(subject.estudiantes.filter(est => calculatePromedio(est.id)).length / subject.estudiantes.length) * 100}
                                color="success"
                                className="progress-bg-custom progress-thin me-3 d-none d-lg-flex"
                                style={{ width: '100px', height: '6px' }}
                            />
                            <CButton
                                className="btn-premium rounded-pill px-5 py-2 shadow-sm"
                                onClick={onPrepareSend}
                            >
                                <CIcon icon={cilSend} className="me-2" /> ENVIAR NOTAS
                            </CButton>
                        </div>
                    </div>
                </CCardFooter>
            </CCard>
            <style>{`
                .avatar-circle {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                }
                .average-circle {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 800;
                    font-size: 1rem;
                }
                .border-dashed { border-style: dashed !important; }
            `}</style>
        </div>
    )
}

EvaluationTable.propTypes = {
    grade: PropTypes.object.isRequired,
    subject: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onPrepareSend: PropTypes.func.isRequired,
    notas: PropTypes.object.isRequired,
    onNotaChange: PropTypes.func.isRequired,
    calculatePromedio: PropTypes.func.isRequired,
    determinarEstado: PropTypes.func.isRequired,
    getColorNota: PropTypes.func.isRequired,
    getColorEstado: PropTypes.func.isRequired,
}

export default EvaluationTable