import React from 'react'
import { CRow, CCol, CCard, CCardHeader, CCardBody, CBadge, CAlert } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBadge, cilUser, cilPhone, cilEnvelopeClosed, cilInfo, cilBriefcase, cilAddressBook } from '@coreui/icons'
import PropTypes from 'prop-types'

const RepItem = ({ icon, label, value, isCode }) => (
    <div className="d-flex align-items-center p-3 rounded-4 hover-light-bg transition-all mb-1">
        <div className="icon-box-sm bg-orange-soft text-primary me-3 shadow-sm border border-primary border-opacity-10">
            <CIcon icon={icon} />
        </div>
        <div>
            <div className="text-muted text-uppercase ls-1 fw-bold" style={{ fontSize: '0.65rem' }}>{label}</div>
            <div className={`fw-bold text-dark fs-6 mt-1 ${isCode ? 'font-monospace' : ''}`}>{value}</div>
        </div>
    </div>
)

const RepresentativeTab = ({ student }) => {
    return (
        <div className="mt-4 animate__animated animate__fadeIn">
            <CRow className="g-4">
                {/* PADRE */}
                <CCol xs={12} lg={6}>
                    <CCard className="premium-card border-0 h-100 shadow-sm overflow-hidden">
                        <CCardHeader className="bg-orange-soft border-0 d-flex justify-content-between align-items-center py-4 px-4">
                            <div className="d-flex align-items-center">
                                <div className="p-2 bg-primary rounded-circle me-3 shadow-sm">
                                    <CIcon icon={cilUser} size="sm" className="text-white" />
                                </div>
                                <h5 className="mb-0 fw-bold text-dark text-uppercase ls-1">Información Paterna</h5>
                            </div>
                            <CBadge color="primary" className="rounded-pill px-3 py-2 bg-opacity-10 text-primary border border-primary border-opacity-10 fw-bold shadow-sm">
                                {(student.PadreParentesco || "Padre").toUpperCase()}
                            </CBadge>
                        </CCardHeader>
                        <CCardBody className="p-4">
                            <div className="d-flex flex-column gap-1">
                                <RepItem icon={cilUser} label="Nombre del Padre" value={`${student.PadreNombre || "No registrado"} ${student.PadreApellido || ""}`} />
                                <RepItem icon={cilAddressBook} label="Cédula de Identidad" value={student.PadreCedula || "N/A"} isCode />
                                <RepItem icon={cilBriefcase} label="Ocupación Laboral" value={student.PadreOcupacion || "N/A"} />
                                <div className="mt-3 pt-3 border-top">
                                    <h6 className="text-muted small fw-bold text-uppercase ls-1 mb-3 ms-2">Canales de Contacto</h6>
                                    <RepItem icon={cilPhone} label="Teléfono" value={student.PadreTelefono || "N/A"} />
                                    <RepItem icon={cilEnvelopeClosed} label="Correo Electrónico" value={student.PadreEmail || "N/A"} />
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* MADRE */}
                <CCol xs={12} lg={6}>
                    <CCard className="premium-card border-0 h-100 shadow-sm overflow-hidden">
                        <CCardHeader className="bg-orange-soft border-0 d-flex justify-content-between align-items-center py-4 px-4">
                            <div className="d-flex align-items-center">
                                <div className="p-2 bg-success rounded-circle me-3 shadow-sm">
                                    <CIcon icon={cilUser} size="sm" className="text-white" />
                                </div>
                                <h5 className="mb-0 fw-bold text-dark text-uppercase ls-1">Información Materna</h5>
                            </div>
                            <CBadge color="success" className="rounded-pill px-3 py-2 bg-opacity-10 text-success border border-success border-opacity-10 fw-bold shadow-sm">
                                {(student.MadreParentesco || "Madre").toUpperCase()}
                            </CBadge>
                        </CCardHeader>
                        <CCardBody className="p-4">
                            <div className="d-flex flex-column gap-1">
                                <RepItem icon={cilUser} label="Nombre de la Madre" value={`${student.MadreNombre || "No registrada"} ${student.MadreApellido || ""}`} />
                                <RepItem icon={cilAddressBook} label="Cédula de Identidad" value={student.MadreCedula || "N/A"} isCode />
                                <RepItem icon={cilBriefcase} label="Ocupación Laboral" value={student.MadreOcupacion || "N/A"} />
                                <div className="mt-3 pt-3 border-top">
                                    <h6 className="text-muted small fw-bold text-uppercase ls-1 mb-3 ms-2">Canales de Contacto</h6>
                                    <RepItem icon={cilPhone} label="Teléfono" value={student.MadreTelefono || "N/A"} />
                                    <RepItem icon={cilEnvelopeClosed} label="Correo Electrónico" value={student.MadreEmail || "N/A"} />
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* REPRESENTANTE PRINCIPAL */}
                <CCol xs={12}>
                    <CAlert className="bg-white border-0 shadow-sm rounded-4 p-4 border-start border-warning border-5">
                        <CRow className="align-items-center">
                            <CCol md={1}>
                                <div className="p-3 bg-warning bg-opacity-10 rounded-circle text-center d-none d-md-block">
                                    <CIcon icon={cilBadge} size="xl" className="text-warning" />
                                </div>
                            </CCol>
                            <CCol md={8}>
                                <div className="ms-md-3">
                                    <h6 className="text-warning fw-bold text-uppercase ls-1 small mb-2">Representante Legal Principal</h6>
                                    <h4 className="mb-1 fw-bold text-dark">{student.RepresentanteNombre || student.representative || "No asignado"} {student.RepresentanteApellido || ""}</h4>
                                    <div className="d-flex gap-4">
                                        <div className="small text-muted fw-bold ls-1"><CIcon icon={cilAddressBook} size="sm" className="me-1" /> CÉDULA: {student.RepresentanteCedula || "N/A"}</div>
                                        <div className="small text-muted fw-bold ls-1"><CIcon icon={cilInfo} size="sm" className="me-1" /> ESTADO: <span className="text-success">VINCULADO</span></div>
                                    </div>
                                </div>
                            </CCol>
                            <CCol md={3} className="text-md-end mt-3 mt-md-0">
                                <div className="p-3 rounded-4 bg-orange-soft border border-warning border-opacity-10 text-center">
                                    <small className="text-warning fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.6rem' }}>Primario para Emergencias</small>
                                    <CIcon icon={cilPhone} className="text-warning me-2" />
                                    <strong className="text-dark">ACTIVO</strong>
                                </div>
                            </CCol>
                        </CRow>
                    </CAlert>
                </CCol>
            </CRow>
            <style>{`
                .ls-1 { letter-spacing: 1px; }
                .icon-box-sm {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .hover-light-bg:hover {
                    background-color: rgba(242, 140, 15, 0.05);
                }
                .transition-all { transition: all 0.2s ease; }
            `}</style>
        </div>
    )
}

RepresentativeTab.propTypes = {
    student: PropTypes.object.isRequired,
}

export default RepresentativeTab