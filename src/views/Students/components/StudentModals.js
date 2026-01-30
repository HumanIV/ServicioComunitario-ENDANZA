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
import { cilUser, cilPencil, cilTrash, cilInfo, cilCalendar, cilCheckCircle } from '@coreui/icons'
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
        const isActivo = status === 'Activo'
        return (
            <CBadge className={`px-3 py-2 rounded-pill border shadow-sm ${isActivo
                ? 'bg-success bg-opacity-10 text-success border-success border-opacity-10'
                : 'bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-10'
                }`}>
                {status?.toUpperCase()}
            </CBadge>
        )
    }

    return (
        <CModal
            size="lg"
            visible={visible}
            onClose={onClose}
            backdrop="static"
            className="premium-modal-custom"
        >
            <CModalHeader className="border-0 modal-header-custom py-3 px-4">
                <CModalTitle className="fw-bold header-title-custom">
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
                            Editor de Expediente
                        </div>
                    )}
                    {(type === "delete" || type === "delete-multiple") && (
                        <div className="d-flex align-items-center text-danger">
                            <div className="p-2 bg-danger rounded-circle me-3 shadow-sm">
                                <CIcon icon={cilTrash} className="text-white" size="sm" />
                            </div>
                            Confirmación de Seguridad
                        </div>
                    )}
                </CModalTitle>
            </CModalHeader>

            <CModalBody className="p-4 modal-body-custom">
                {type === "view" && selectedItem && (
                    <CRow className="g-4">
                        <CCol xs={12} className="text-center mb-2">
                            <div className="avatar-xl-container mb-3">
                                <div className="avatar avatar-xl bg-orange-soft text-primary rounded-circle p-4 d-inline-flex border border-primary border-opacity-10 shadow-sm fw-bold display-6">
                                    {selectedItem.NombreEstudiante.charAt(0)}
                                </div>
                            </div>
                            <h3 className="fw-bold header-title-custom mb-1">
                                {selectedItem.NombreEstudiante} {selectedItem.ApellidoEstudiante}
                            </h3>
                            <StatusBadge status={selectedItem.Estatus} />
                        </CCol>

                        <CCol xs={12} md={6}>
                            <div className="p-4 rounded-4 info-card-academic h-100 border">
                                <h6 className="text-primary small fw-bold text-uppercase ls-1 mb-3 d-flex align-items-center">
                                    <CIcon icon={cilCheckCircle} className="me-2" /> Información Académica
                                </h6>
                                <div className="detail-item mb-2">
                                    <span className="text-muted-custom label-micro me-2">GRADO:</span>
                                    <span className="fw-bold header-title-custom">{selectedItem.Grado}</span>
                                </div>
                                <div className="detail-item mb-2">
                                    <span className="text-muted-custom label-micro me-2">SECCIÓN:</span>
                                    <CBadge className="bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 rounded-pill px-2">
                                        {selectedItem.Seccion}
                                    </CBadge>
                                </div>
                                <div className="detail-item mb-2">
                                    <span className="text-muted-custom label-micro me-2">ID MATRÍCULA:</span>
                                    <span className="fw-bold header-title-custom">#{selectedItem.id}</span>
                                </div>
                                <div className="detail-item mb-2">
                                    <span className="text-muted-custom label-micro me-2">FECHA INGRESO:</span>
                                    <span className="fw-bold header-title-custom">{selectedItem.FechaInscripcion}</span>
                                </div>
                            </div>
                        </CCol>

                        <CCol xs={12} md={6}>
                            <div className="p-4 rounded-4 info-card-representative h-100 border">
                                <h6 className="text-primary small fw-bold text-uppercase ls-1 mb-3 d-flex align-items-center">
                                    <CIcon icon={cilUser} className="me-2" /> Datos del Representante
                                </h6>
                                <div className="detail-item mb-2">
                                    <span className="text-muted-custom label-micro me-2">NOMBRE:</span>
                                    <span className="fw-bold header-title-custom">{selectedItem.RepresentanteNombre} {selectedItem.RepresentanteApellido}</span>
                                </div>
                                <div className="detail-item mb-2">
                                    <span className="text-muted-custom label-micro me-2">CÉDULA:</span>
                                    <code className="fw-bold text-primary bg-orange-soft px-2 py-1 rounded">{selectedItem.RepresentanteCedula}</code>
                                </div>
                                <div className="detail-item mb-2">
                                    <span className="text-muted-custom label-micro me-2">TELÉFONO:</span>
                                    <span className="fw-bold header-title-custom">{selectedItem.Telefono}</span>
                                </div>
                                <div className="detail-item mb-2">
                                    <span className="text-muted-custom label-micro me-2">CORREO:</span>
                                    <span className="fw-bold header-title-custom small text-break">{selectedItem.Email}</span>
                                </div>
                            </div>
                        </CCol>
                    </CRow>
                )}

                {type === "edit" && selectedItem && (
                    <div className="py-4 px-2">
                        <div className="text-center mb-4">
                            <h5 className="header-title-custom fw-bold">Actualizar Información</h5>
                            <p className="text-muted-custom small">Modifique los datos necesarios del estudiante #{selectedItem.id}</p>
                        </div>
                        <CRow className="g-3">
                            <CCol md={6}>
                                <label className="form-label label-micro text-muted-custom ms-2">NOMBRE DEL ESTUDIANTE</label>
                                <input type="text" className="form-control input-premium py-2 px-3" defaultValue={selectedItem.NombreEstudiante} />
                            </CCol>
                            <CCol md={6}>
                                <label className="form-label label-micro text-muted-custom ms-2">APELLIDO DEL ESTUDIANTE</label>
                                <input type="text" className="form-control input-premium py-2 px-3" defaultValue={selectedItem.ApellidoEstudiante} />
                            </CCol>
                            <CCol md={6}>
                                <label className="form-label label-micro text-muted-custom ms-2">CORREO ELECTRÓNICO</label>
                                <input type="email" className="form-control input-premium py-2 px-3" defaultValue={selectedItem.Email} />
                            </CCol>
                            <CCol md={6}>
                                <label className="form-label label-micro text-muted-custom ms-2">TELÉFONO DE CONTACTO</label>
                                <input type="text" className="form-control input-premium py-2 px-3" defaultValue={selectedItem.Telefono} />
                            </CCol>
                            <CCol xs={12} className="mt-4 pt-2 border-top border-light-custom text-center">
                                <p className="text-muted-custom small mb-3">
                                    <CIcon icon={cilInfo} className="me-1 text-primary" />
                                    Para cambios de Grado o Sección, utilice la sección de Transferencias Académicas.
                                </p>
                                <CButton className="btn-premium px-5 py-2 rounded-pill shadow-sm">
                                    GUARDAR CAMBIOS
                                </CButton>
                            </CCol>
                        </CRow>
                    </div>
                )}

                {type === "delete" && selectedItem && (
                    <div className="text-center py-3">
                        <div className="p-4 bg-danger bg-opacity-10 rounded-circle d-inline-flex mb-4">
                            <CIcon icon={cilTrash} size="3xl" className="text-danger" />
                        </div>
                        <h4 className="fw-bold header-title-custom">¿Eliminar este registro?</h4>
                        <p className="text-muted-custom px-lg-5">
                            Estás a punto de borrar permanentemente el perfil académico de este estudiante. Esta acción es irreversible.
                        </p>
                        <div className="p-4 rounded-4 delete-preview-box border mt-4 mx-lg-4 text-start">
                            <div className="d-flex align-items-center">
                                <div className="avatar bg-white text-primary rounded-circle me-3 p-2 fw-bold border border-primary border-opacity-20 shadow-sm">
                                    {selectedItem.NombreEstudiante.charAt(0)}
                                </div>
                                <div>
                                    <strong className="header-title-custom fs-5">{selectedItem.NombreEstudiante} {selectedItem.ApellidoEstudiante}</strong><br />
                                    <small className="text-muted-custom text-uppercase fw-bold ls-1" style={{ fontSize: '0.65rem' }}>MATRÍCULA: #{selectedItem.id} • {selectedItem.Grado}</small>
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
                        <h4 className="fw-bold header-title-custom">¿Eliminar {selectedCount} estudiantes?</h4>
                        <p className="text-muted-custom px-lg-5">
                            Has seleccionado múltiples registros para su eliminación definitiva. Los datos del sistema se actualizarán inmediatamente.
                        </p>
                        <div className="alert bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger-custom mt-4 rounded-4 p-3 d-flex align-items-center mx-lg-4">
                            <CIcon icon={cilInfo} className="me-3" size="xl" />
                            <strong>¡Atención!</strong> Esta acción borrará {selectedCount} perfiles estudiantiles sin posibilidad de recuperación.
                        </div>
                    </div>
                )}
            </CModalBody>

            <CModalFooter className="border-0 p-4 pt-0 modal-footer-custom">
                <CButton
                    color="light"
                    className="rounded-pill px-4 py-2 border-2 fw-bold text-muted-custom hover-orange shadow-sm me-2 modal-cancel-btn"
                    onClick={onClose}
                >
                    {type === "view" ? "Cerrar" : "Cancelar"}
                </CButton>
                {type === "delete" && (
                    <CButton className="btn-danger-premium rounded-pill px-5 py-2 shadow-sm text-white border-0" onClick={onDelete}>Confirmar Eliminación</CButton>
                )}
                {type === "delete-multiple" && (
                    <CButton className="btn-danger-premium rounded-pill px-5 py-2 shadow-sm text-white border-0" onClick={onDeleteMultiple}>Eliminar Todo ({selectedCount})</CButton>
                )}
            </CModalFooter>

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