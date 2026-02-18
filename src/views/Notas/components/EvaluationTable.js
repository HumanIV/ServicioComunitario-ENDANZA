// EvaluationTable.jsx - Versión actualizada con modo lectura
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
import { cilTrash, cilSend, cilWarning, cilArrowLeft, cilUser, cilCheckCircle, cilClock, cilBook, cilCircle } from '@coreui/icons'
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
    getColorEstado,
    modoLectura = false,      // ← NUEVA PROP: true para admin (solo lectura)
    hayCambios = false        // ← NUEVA PROP: indica si hay cambios sin guardar
}) => {
    return (
        <div className="animate__animated animate__fadeIn">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 no-print px-2 gap-3">
                <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                    <CButton
                        className="me-3 btn-back-premium px-3 py-2"
                        onClick={onBack}
                    >
                        <CIcon icon={cilArrowLeft} className="me-md-2" />
                        <span className="d-none d-md-inline">Retroceder</span>
                    </CButton>
                    <div>
                        <h3 className="mb-0 fw-bold header-title-custom fs-4 fs-md-3">{subject.nombre}</h3>
                        <p className="text-muted-custom small mb-0 text-uppercase ls-1 d-none d-sm-block">
                            {modoLectura ? 'Visualización de calificaciones' : 'Carga de calificaciones trimestrales'}
                        </p>
                        {modoLectura && (
                            <CBadge color="info" className="mt-1 rounded-pill px-3 py-1">
                                <CIcon icon={cilCircle} className="me-1" size="sm" />
                                MODO CONSULTA
                            </CBadge>
                        )}
                    </div>
                </div>

                {/* SOLO MOSTRAR BOTONES DE ACCIÓN SI NO ESTÁ EN MODO LECTURA */}
                {!modoLectura && (
                    <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto mt-2 mt-md-0">
                        <CButton
                            color="light"
                            variant="outline"
                            className="rounded-pill px-4 py-2 border-2 fw-bold text-muted-custom hover-orange shadow-sm w-100 w-sm-auto"
                            onClick={onClear}
                        >
                            <CIcon icon={cilTrash} className="me-2 text-danger" />
                            <span className="d-sm-none d-md-inline">Limpiar Todo</span>
                            <span className="d-none d-sm-inline d-md-none">Limpiar</span>
                        </CButton>
                        <CButton
                            className="btn-premium rounded-pill px-4 py-2 shadow-sm d-flex align-items-center justify-content-center w-100 w-sm-auto"
                            onClick={onPrepareSend}
                        >
                            <CIcon icon={cilSend} className="me-2" />
                            <span className="d-md-inline">ENVIAR</span>
                        </CButton>
                    </div>
                )}
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
                                            <CIcon icon={cilCheckCircle} className="me-1" /> Sección: {subject.sectionId}
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
                                    <CTableHeaderCell className="ps-4 py-3 text-muted-custom small fw-bold text-uppercase ls-1" style={{ minWidth: '160px' }}>Estudiante</CTableHeaderCell>
                                    <CTableHeaderCell className="py-3 text-center text-muted-custom small fw-bold text-uppercase ls-1 d-mobile-none">Reg.</CTableHeaderCell>
                                    {[1, 2, 3, 4].map(num => (
                                        <CTableHeaderCell key={num} className="py-3 text-center text-muted-custom small fw-bold text-uppercase ls-1" style={{ minWidth: '70px' }}>C{num}</CTableHeaderCell>
                                    ))}
                                    <CTableHeaderCell className="py-3 text-center text-muted-custom small fw-bold text-uppercase ls-1 pe-4" style={{ minWidth: '100px' }}>PROMEDIO</CTableHeaderCell>
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
                                                    <div className="avatar-circle me-2 me-md-3 bg-orange-soft text-primary fw-bold shadow-sm flex-shrink-0" style={{ width: '35px', height: '35px', minWidth: '35px' }}>
                                                        {estudiante.nombre.charAt(0)}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <div className="fw-bold header-title-custom text-truncate" style={{ maxWidth: '150px' }}>{estudiante.nombre}</div>
                                                        <div className="text-muted-custom d-mobile-none" style={{ fontSize: '0.7rem' }}>Expediente: {estudiante.codigo}</div>
                                                    </div>
                                                </div>
                                            </CTableDataCell>

                                            <CTableDataCell className="text-center border-bottom-light d-mobile-none">
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
                                                        placeholder={`C${num}`}
                                                        value={notasEst[`n${num}`] || ""}
                                                        onChange={(e) => onNotaChange && onNotaChange(estudiante.id, num, e.target.value)}
                                                        className={`text-center fw-bold evaluation-input rounded-3 shadow-sm ${notasEst[`n${num}`] ? 'bg-white' : 'bg-light-custom bg-opacity-50 border-dashed'}`}
                                                        disabled={modoLectura}
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

                        {/* SOLO MOSTRAR PROGRESO Y BOTÓN SI NO ESTÁ EN MODO LECTURA */}
                        {!modoLectura && (
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
                        )}
                    </div>
                </CCardFooter>
            </CCard>

        </div>
    )
}

EvaluationTable.propTypes = {
    grade: PropTypes.object.isRequired,
    subject: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onClear: PropTypes.func,
    onPrepareSend: PropTypes.func,
    notas: PropTypes.object.isRequired,
    onNotaChange: PropTypes.func,
    calculatePromedio: PropTypes.func.isRequired,
    determinarEstado: PropTypes.func.isRequired,
    getColorNota: PropTypes.func.isRequired,
    getColorEstado: PropTypes.func.isRequired,
    modoLectura: PropTypes.bool,      // ← NUEVO PROP
    hayCambios: PropTypes.bool        // ← NUEVO PROP
}

// Valores por defecto
EvaluationTable.defaultProps = {
    onClear: null,
    onPrepareSend: null,
    onNotaChange: null,
    modoLectura: false,
    hayCambios: false
}

export default EvaluationTable