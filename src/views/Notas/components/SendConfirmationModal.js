import React from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CSpinner,
    CAlert,
    CBadge,
    CButton,
    CModalFooter,
    CRow,
    CCol
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSend, cilWarning, cilInfo, cilCheckCircle } from '@coreui/icons'
import PropTypes from 'prop-types'

const SendConfirmationModal = ({
    visible,
    onClose,
    enviando,
    subject,
    grade,
    calculatePromedio,
    determinarEstado,
    getColorEstado,
    onConfirm
}) => {
    return (
        <CModal
            visible={visible}
            onClose={() => !enviando && onClose()}
            size="lg"
            className="premium-modal"
            backdrop="static"
        >
            <CModalHeader closeButton={!enviando} className="border-0 bg-orange-soft py-3 px-4">
                <CModalTitle className="fw-bold header-title-custom d-flex align-items-center">
                    <div className="p-2 bg-primary rounded-circle me-3 shadow-sm">
                        <CIcon icon={cilSend} className="text-white" size="sm" />
                    </div>
                    Confirmación de Envío Académico
                </CModalTitle>
            </CModalHeader>
            <CModalBody className="p-4">
                {enviando ? (
                    <div className="text-center py-5">
                        <div className="p-4 bg-orange-soft rounded-circle d-inline-flex mb-4">
                            <CSpinner color="primary" variant="grow" style={{ width: '3rem', height: '3rem' }} />
                        </div>
                        <h4 className="fw-bold header-title-custom">Transmitiendo datos...</h4>
                        <p className="text-muted-custom text-uppercase ls-1 small">Sincronizando calificaciones con la secretaría central</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-primary bg-opacity-10 border-0 rounded-4 p-4 d-flex align-items-start mb-4">
                            <CIcon icon={cilInfo} className="text-primary me-3 mt-1" size="xl" />
                            <div>
                                <strong className="text-primary fs-5 d-block mb-1">Verificación Final</strong>
                                <p className="mb-0 text-muted-custom opacity-75">
                                    Está por enviar las calificaciones oficiales de <strong className="header-title-custom">{subject?.nombre}</strong> del <strong className="header-title-custom">{grade?.grado}</strong>.
                                    Este proceso generará un registro inmutable en el historial del estudiante.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-4 bg-light-custom border border-light-custom mb-4 shadow-sm">
                            <h6 className="text-muted-custom small fw-bold text-uppercase ls-1 mb-4">Resumen del Acta de Evaluación</h6>
                            <CRow className="g-3">
                                <CCol xs={12} sm={6}>
                                    <div className="mb-3">
                                        <small className="text-muted-custom text-uppercase ls-1 fw-bold" style={{ fontSize: '0.65rem' }}>Disciplina:</small>
                                        <div className="fw-bold header-title-custom">{subject?.nombre}</div>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted-custom text-uppercase ls-1 fw-bold" style={{ fontSize: '0.65rem' }}>Código Materia:</small>
                                        <div className="fw-bold text-primary font-monospace">{subject?.id}</div>
                                    </div>
                                </CCol>
                                <CCol xs={12} sm={6}>
                                    <div className="mb-3">
                                        <small className="text-muted-custom text-uppercase ls-1 fw-bold" style={{ fontSize: '0.65rem' }}>Grado/Año:</small>
                                        <div className="fw-bold header-title-custom">{grade?.grado}</div>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted-custom text-uppercase ls-1 fw-bold" style={{ fontSize: '0.65rem' }}>Bailarines:</small>
                                        <div className="fw-bold header-title-custom">{subject?.estudiantes.length} alumnos</div>
                                    </div>
                                </CCol>
                            </CRow>
                        </div>

                        <div className="p-4 rounded-4 bg-orange-soft border border-primary border-opacity-10 mb-4">
                            <h6 className="text-primary small fw-bold text-uppercase ls-1 mb-3">Auditoría de Calificaciones (Vista Previa)</h6>
                            <div className="d-flex flex-column gap-3">
                                {subject?.estudiantes.slice(0, 3).map(est => {
                                    const promedio = calculatePromedio(est.id)
                                    const estado = determinarEstado(promedio)
                                    return (
                                        <div key={est.id} className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <div className="p-1 bg-white-custom rounded-circle me-2 shadow-sm border border-primary border-opacity-10">
                                                    <CIcon icon={cilCheckCircle} size="sm" className="text-primary" />
                                                </div>
                                                <span className="small header-title-custom fw-bold">{est.nombre}</span>
                                            </div>
                                            <div className="text-end">
                                                <CBadge color={getColorEstado(estado)} className="rounded-pill px-3 py-1 shadow-sm">
                                                    {promedio ? `PROMEDIO: ${promedio}` : "SIN NOTAS"}
                                                </CBadge>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {subject?.estudiantes.length > 3 && (
                                <div className="mt-3 text-center">
                                    <small className="text-muted-custom text-uppercase ls-1 fw-bold" style={{ fontSize: '0.6rem' }}>
                                        + {subject.estudiantes.length - 3} registros adicionales verificados
                                    </small>
                                </div>
                            )}
                        </div>

                        <div className="bg-warning bg-opacity-10 border-0 header-title-custom rounded-4 p-3 d-flex align-items-center">
                            <CIcon icon={cilWarning} className="text-warning me-3" size="xl" />
                            <small className="fw-medium">
                                <strong className="header-title-custom">Advertencia:</strong> Una vez remitidas, las notas pasarán a fase de revisión y no podrán ser alteradas desde su portal de docente.
                            </small>
                        </div>
                    </>
                )}
            </CModalBody>
            {!enviando && (
                <CModalFooter className="border-0 p-4 pt-0">
                    <CButton
                        color="light"
                        className="rounded-pill px-4 py-2 border-2 fw-bold text-muted-custom hover-orange shadow-sm me-2 bg-transparent"
                        onClick={onClose}
                    >
                        CANCELAR
                    </CButton>
                    <CButton
                        className="btn-premium rounded-pill px-5 py-2 shadow-sm text-white"
                        onClick={onConfirm}
                    >
                        <CIcon icon={cilCheckCircle} className="me-2" />
                        CONFIRMAR Y TRANSMITIR
                    </CButton>
                </CModalFooter>
            )}
        </CModal>
    )
}

SendConfirmationModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    enviando: PropTypes.bool.isRequired,
    subject: PropTypes.object,
    grade: PropTypes.object,
    calculatePromedio: PropTypes.func.isRequired,
    determinarEstado: PropTypes.func.isRequired,
    getColorEstado: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
}

export default SendConfirmationModal