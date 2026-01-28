import React from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CRow,
    CCol,
    CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilPencil, cilTrash, cilInfo } from '@coreui/icons'
import PropTypes from 'prop-types'

const StudentModals = ({
    visible,
    onClose,
    type,
    selectedItem,
    selectedCount,
    onDelete,
    onDeleteMultiple
}) => {
    const StatusBadge = ({ status }) => {
        const color = status === 'Activo' ? 'success' : 'secondary'
        return (
            <CBadge color={color} className="px-3 py-2 rounded-pill bg-opacity-10 text-success border border-success border-opacity-10">
                {status.toUpperCase()}
            </CBadge>
        )
    }

    return (
        <CModal
            size="lg"
            visible={visible}
            onClose={onClose}
            backdrop="static"
            className="premium-modal"
        >
            <CModalHeader className="border-0 bg-orange-soft py-3 px-4">
                <CModalTitle className="fw-bold text-dark">
                    {type === "view" && (
                        <div className="d-flex align-items-center">
                            <div className="p-2 bg-primary rounded-circle me-3 shadow-sm">
                                <CIcon icon={cilInfo} className="text-white" size="sm" />
                            </div>
                            Perfil Detallado del Estudiante
                        </div>
                    )}
                    {type === "edit" && (
                        <div className="d-flex align-items-center">
                            <div className="p-2 bg-primary rounded-circle me-3 shadow-sm">
                                <CIcon icon={cilPencil} className="text-white" size="sm" />
                            </div>
                            Editar Expediente Académico
                        </div>
                    )}
                    {(type === "delete" || type === "delete-multiple") && (
                        <div className="d-flex align-items-center">
                            <div className="p-2 bg-danger rounded-circle me-3 shadow-sm">
                                <CIcon icon={cilTrash} className="text-white" size="sm" />
                            </div>
                            Confirmación de Seguridad
                        </div>
                    )}
                </CModalTitle>
            </CModalHeader>

            <CModalBody className="p-4">
                {type === "view" && selectedItem && (
                    <CRow className="g-4">
                        <CCol xs={12} className="text-center mb-2">
                            <div className="avatar avatar-xl bg-orange-soft text-primary rounded-circle p-4 d-inline-flex border border-primary border-opacity-10 shadow-sm fw-bold display-6">
                                {selectedItem.NombreEstudiante.charAt(0)}
                            </div>
                            <h3 className="mt-3 fw-bold text-dark mb-1">
                                {selectedItem.NombreEstudiante} {selectedItem.ApellidoEstudiante}
                            </h3>
                            <StatusBadge status={selectedItem.Estatus} />
                        </CCol>

                        <CCol xs={12} md={6}>
                            <div className="p-4 rounded-4 bg-light h-100 border border-light">
                                <h6 className="text-primary small fw-bold text-uppercase ls-1 mb-3">Información Académica</h6>
                                <div className="mb-2"><span className="text-muted small text-uppercase fw-bold ls-1 me-2" style={{ fontSize: '0.65rem' }}>Grado:</span> <span className="fw-bold">{selectedItem.Grado}</span></div>
                                <div className="mb-2"><span className="text-muted small text-uppercase fw-bold ls-1 me-2" style={{ fontSize: '0.65rem' }}>Sección:</span> <CBadge className="bg-primary bg-opacity-10 text-primary">{selectedItem.Seccion}</CBadge></div>
                                <div className="mb-2"><span className="text-muted small text-uppercase fw-bold ls-1 me-2" style={{ fontSize: '0.65rem' }}>Correo:</span> <span className="fw-bold">{selectedItem.Email}</span></div>
                                <div className="mb-2"><span className="text-muted small text-uppercase fw-bold ls-1 me-2" style={{ fontSize: '0.65rem' }}>Teléfono:</span> <span className="fw-bold">{selectedItem.Telefono}</span></div>
                            </div>
                        </CCol>

                        <CCol xs={12} md={6}>
                            <div className="p-4 rounded-4 bg-orange-soft h-100 border border-primary border-opacity-10">
                                <h6 className="text-primary small fw-bold text-uppercase ls-1 mb-3">Información del Representante</h6>
                                <div className="mb-2"><span className="text-muted small text-uppercase fw-bold ls-1 me-2" style={{ fontSize: '0.65rem' }}>Nombre:</span> <span className="fw-bold text-dark">{selectedItem.RepresentanteNombre} {selectedItem.RepresentanteApellido}</span></div>
                                <div className="mb-2"><span className="text-muted small text-uppercase fw-bold ls-1 me-2" style={{ fontSize: '0.65rem' }}>Cédula:</span> <code className="fw-bold">{selectedItem.RepresentanteCedula}</code></div>
                                <div className="mb-2"><span className="text-muted small text-uppercase fw-bold ls-1 me-2" style={{ fontSize: '0.65rem' }}>Inscripción:</span> <span className="fw-bold">{selectedItem.FechaInscripcion}</span></div>
                            </div>
                        </CCol>
                    </CRow>
                )}

                {type === "delete" && selectedItem && (
                    <div className="text-center py-3">
                        <div className="p-4 bg-danger bg-opacity-10 rounded-circle d-inline-flex mb-4">
                            <CIcon icon={cilTrash} size="3xl" className="text-danger" />
                        </div>
                        <h4 className="fw-bold text-dark">¿Eliminar este registro?</h4>
                        <p className="text-muted px-lg-5">
                            Estás a punto de borrar permanentemente el perfil académico de este estudiante. Esta acción es irreversible.
                        </p>
                        <div className="p-4 rounded-4 bg-orange-soft border border-primary border-opacity-10 text-start mt-4 mx-lg-4">
                            <div className="d-flex align-items-center">
                                <div className="avatar bg-white text-primary rounded-circle me-3 p-2 fw-bold border border-primary border-opacity-20 shadow-sm">
                                    {selectedItem.NombreEstudiante.charAt(0)}
                                </div>
                                <div>
                                    <strong className="text-dark fs-5">{selectedItem.NombreEstudiante} {selectedItem.ApellidoEstudiante}</strong><br />
                                    <small className="text-muted text-uppercase fw-bold ls-1" style={{ fontSize: '0.65rem' }}>Matrícula: #{selectedItem.id} • {selectedItem.Grado}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {type === "delete-multiple" && (
                    <div className="text-center py-3">
                        <div className="p-4 bg-danger bg-opacity-10 rounded-circle d-inline-flex mb-4">
                            <CIcon icon={cilTrash} size="3xl" className="text-danger" />
                        </div>
                        <h4 className="fw-bold text-dark">¿Eliminar {selectedCount} estudiantes?</h4>
                        <p className="text-muted px-lg-5">
                            Has seleccionado múltiples registros para su eliminación definitiva. Los datos del sistema se actualizarán inmediatamente.
                        </p>
                        <div className="alert bg-danger bg-opacity-10 border-danger border-opacity-10 text-danger mt-4 rounded-4 p-3 d-flex align-items-center mx-lg-4">
                            <CIcon icon={cilInfo} className="me-3" size="xl" />
                            <strong>¡Atención!</strong> Esta acción borrará {selectedCount} perfiles estudiantiles sin posibilidad de recuperación.
                        </div>
                    </div>
                )}

                {type === "edit" && (
                    <div className="text-center py-5">
                        <CIcon icon={cilPencil} size="3xl" className="text-primary opacity-25 mb-3" />
                        <h5 className="text-dark fw-bold">Editor de Expediente</h5>
                        <p className="text-muted">Utiliza el botón para ir al editor avanzado del estudiante.</p>
                        <CButton className="btn-premium rounded-pill px-5">Ir al Editor</CButton>
                    </div>
                )}
            </CModalBody>

            <CModalFooter className="border-0 p-4 pt-0">
                <CButton
                    color="light"
                    className="rounded-pill px-4 py-2 border-2 fw-bold text-muted hover-orange shadow-sm me-2"
                    onClick={onClose}
                >
                    {type === "view" ? "Cerrar" : "Cancelar"}
                </CButton>
                {type === "delete" && (
                    <CButton className="btn-premium rounded-pill px-5 py-2 shadow-sm text-white border-0 bg-danger" style={{ backgroundColor: 'var(--danger) !important' }} onClick={onDelete}>Confirmar Eliminación</CButton>
                )}
                {type === "delete-multiple" && (
                    <CButton className="btn-premium rounded-pill px-5 py-2 shadow-sm text-white border-0 bg-danger" style={{ backgroundColor: 'var(--danger) !important' }} onClick={onDeleteMultiple}>Eliminar Todo ({selectedCount})</CButton>
                )}
            </CModalFooter>
            <style>{`
                .ls-1 { letter-spacing: 1px; }
                .hover-orange:hover {
                    border-color: var(--primary-400) !important;
                    color: var(--primary-600) !important;
                    background: var(--primary-50) !important;
                }
            `}</style>
        </CModal>
    )
}

StudentModals.propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    type: PropTypes.string,
    selectedItem: PropTypes.object,
    selectedCount: PropTypes.number,
    onDelete: PropTypes.func,
    onDeleteMultiple: PropTypes.func,
}

export default StudentModals