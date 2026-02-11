import React from 'react'
import { CRow, CCol, CCard, CCardHeader, CCardBody, CBadge, CAlert } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBadge, cilUser, cilPhone, cilEnvelopeClosed, cilInfo, cilBriefcase, cilAddressBook } from '@coreui/icons'
import PropTypes from 'prop-types'

const RepItem = ({ icon, label, value, isCode }) => (
    <div className="d-flex align-items-center p-3 rounded-4 rep-info-item transition-all mb-1">
        <div className="icon-box-sm bg-orange-soft text-warning me-3 shadow-sm border border-warning border-opacity-10">
            <CIcon icon={icon} />
        </div>
        <div>
            <div className="rep-label text-uppercase ls-1 fw-bold" style={{ fontSize: '0.65rem' }}>{label}</div>
            <div className={`fw-bold rep-value fs-6 mt-1 ${isCode ? 'font-monospace' : ''}`}>{value}</div>
        </div>
    </div>
)

const RepresentativeTab = ({ student }) => {
    // Detectamos si el representante es el padre o la madre
    const isMadreRep = student.RepresentanteParentesco?.toLowerCase() === 'madre' ||
        (student.RepresentanteCedula && student.RepresentanteCedula === student.MadreCedula);
    const isPadreRep = student.RepresentanteParentesco?.toLowerCase() === 'padre' ||
        (student.RepresentanteCedula && student.RepresentanteCedula === student.PadreCedula);
    const isOtroRep = !isMadreRep && !isPadreRep && student.RepresentanteNombre;

    return (
        <div className="mt-4 animate__animated animate__fadeIn">
            <CRow className="g-4">
                {/* PADRE */}
                <CCol xs={12} lg={6}>
                    <CCard className={`premium-card border-0 h-100 shadow-sm overflow-hidden ${isPadreRep ? 'border-start-warning-5' : ''}`}>
                        <CCardHeader className="bg-orange-soft border-0 d-flex justify-content-between align-items-center py-4 px-4 position-relative">
                            <div className="d-flex align-items-center">
                                <div className="p-2 bg-warning rounded-circle me-3 shadow-sm">
                                    <CIcon icon={cilUser} size="sm" className="text-white" />
                                </div>
                                <h5 className="mb-0 fw-bold rep-value text-uppercase ls-1">Información Paterna</h5>
                            </div>
                            <div className="d-flex gap-2">
                                {isPadreRep && (
                                    <CBadge color="warning" className="rounded-pill px-3 py-2 text-uppercase fw-bold shadow-sm">
                                        REPRESENTANTE
                                    </CBadge>
                                )}
                                <CBadge className="rounded-pill px-3 py-2 bg-orange-soft text-warning border border-warning border-opacity-10 fw-bold shadow-sm">
                                    {(student.PadreParentesco || "Padre").toUpperCase()}
                                </CBadge>
                            </div>
                        </CCardHeader>
                        <CCardBody className="p-4">
                            <div className="d-flex flex-column gap-1">
                                <RepItem icon={cilUser} label="Nombre del Padre" value={`${student.PadreNombre || "No registrado"} ${student.PadreApellido || ""}`} />
                                <RepItem icon={cilAddressBook} label="Cédula de Identidad" value={student.PadreCedula || "N/A"} isCode />
                                <RepItem icon={cilBriefcase} label="Ocupación Laboral" value={student.PadreOcupacion || "N/A"} />
                                <div className="mt-3 pt-3 border-top rep-border">
                                    <h6 className="rep-label small fw-bold text-uppercase ls-1 mb-3 ms-2">Canales de Contacto</h6>
                                    <RepItem icon={cilPhone} label="Teléfono" value={student.PadreTelefono || "N/A"} />
                                    <RepItem icon={cilEnvelopeClosed} label="Correo Electrónico" value={student.PadreEmail || "N/A"} />
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* MADRE */}
                <CCol xs={12} lg={6}>
                    <CCard className={`premium-card border-0 h-100 shadow-sm overflow-hidden ${isMadreRep ? 'border-start-warning-5' : ''}`}>
                        <CCardHeader className="bg-orange-soft border-0 d-flex justify-content-between align-items-center py-4 px-4">
                            <div className="d-flex align-items-center">
                                <div className="p-2 bg-warning rounded-circle me-3 shadow-sm">
                                    <CIcon icon={cilUser} size="sm" className="text-white" />
                                </div>
                                <h5 className="mb-0 fw-bold rep-value text-uppercase ls-1">Información Materna</h5>
                            </div>
                            <div className="d-flex gap-2">
                                {isMadreRep && (
                                    <CBadge color="warning" className="rounded-pill px-3 py-2 text-uppercase fw-bold shadow-sm">
                                        REPRESENTANTE
                                    </CBadge>
                                )}
                                <CBadge className="rounded-pill px-3 py-2 bg-orange-soft text-warning border border-warning border-opacity-10 fw-bold shadow-sm">
                                    {(student.MadreParentesco || "Madre").toUpperCase()}
                                </CBadge>
                            </div>
                        </CCardHeader>
                        <CCardBody className="p-4">
                            <div className="d-flex flex-column gap-1">
                                <RepItem icon={cilUser} label="Nombre de la Madre" value={`${student.MadreNombre || "No registrada"} ${student.MadreApellido || ""}`} />
                                <RepItem icon={cilAddressBook} label="Cédula de Identidad" value={student.MadreCedula || "N/A"} isCode />
                                <RepItem icon={cilBriefcase} label="Ocupación Laboral" value={student.MadreOcupacion || "N/A"} />
                                <div className="mt-3 pt-3 border-top rep-border">
                                    <h6 className="rep-label small fw-bold text-uppercase ls-1 mb-3 ms-2">Canales de Contacto</h6>
                                    <RepItem icon={cilPhone} label="Teléfono" value={student.MadreTelefono || "N/A"} />
                                    <RepItem icon={cilEnvelopeClosed} label="Correo Electrónico" value={student.MadreEmail || "N/A"} />
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* REPRESENTANTE PRINCIPAL (MENSAJE DINÁMICO) */}
                <CCol xs={12}>
                    <CAlert className="rep-alert border-0 shadow-sm rounded-4 p-4 border-start border-warning border-5 position-relative overflow-hidden">
                        <CRow className="align-items-center g-4">
                            <CCol md={1} className="d-flex justify-content-center">
                                <div className="p-3 bg-warning bg-opacity-10 rounded-circle text-center">
                                    <CIcon icon={cilBadge} size="xl" className="text-warning" />
                                </div>
                            </CCol>
                            <CCol md={8}>
                                <div className="ms-md-3">
                                    <h6 className="text-warning fw-bold text-uppercase ls-1 small mb-2">Representante Legal Principal</h6>
                                    <h4 className="mb-1 fw-bold rep-value">
                                        {student.RepresentanteNombre || "No asignado"} {student.RepresentanteApellido || ""}
                                    </h4>

                                    {/* Mensaje Solicitado: "Nombre Apellido es la Madre/Padre" */}
                                    <div className="mb-3">
                                        {(isMadreRep || isPadreRep) ? (
                                            <div className="fw-bold text-warning-custom p-2 bg-warning bg-opacity-10 rounded-3 d-inline-block small">
                                                <CIcon icon={cilInfo} className="me-2" />
                                                {student.RepresentanteNombre} {student.RepresentanteApellido} es la <strong>{isMadreRep ? 'Madre' : 'Padre'}</strong> del alumno.
                                            </div>
                                        ) : (
                                            <div className="fw-bold text-info p-2 bg-info bg-opacity-10 rounded-3 d-inline-block small">
                                                <CIcon icon={cilInfo} className="me-2" />
                                                Representante asignado por parentesco: <strong>{student.RepresentanteParentesco || 'OTRO'}</strong>
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex gap-4 flex-wrap mt-2">
                                        <div className="small rep-label fw-bold ls-1 d-flex align-items-center">
                                            <CIcon icon={cilAddressBook} size="sm" className="me-2 text-warning" />
                                            CÉDULA: <span className="ms-1 rep-value">{student.RepresentanteCedula || "N/A"}</span>
                                        </div>
                                        <div className="small rep-label fw-bold ls-1 d-flex align-items-center">
                                            <CIcon icon={cilPhone} size="sm" className="me-2 text-warning" />
                                            TELÉFONO: <span className="ms-1 rep-value">{student.RepresentanteTelefono || student.telefono_Rep || "N/A"}</span>
                                        </div>
                                        {isOtroRep && (
                                            <div className="small rep-label fw-bold ls-1 d-flex align-items-center">
                                                <CIcon icon={cilBriefcase} size="sm" className="me-2 text-warning" />
                                                OCUPACIÓN: <span className="ms-1 rep-value">{student.RepresentanteOcupacion || student.RepresentanteTrabajo || "N/A"}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CCol>
                            <CCol md={3} className="text-md-end">
                                <div className="p-3 rounded-4 bg-orange-soft border border-warning border-opacity-10 text-center shadow-sm">
                                    <small className="text-warning fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.6rem' }}>Estado de Contacto</small>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <div className="badge-dot bg-success me-2"></div>
                                        <strong className="rep-value text-warning">PRIMARIO</strong>
                                    </div>
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
                .rep-info-item:hover {
                    background-color: rgba(242, 140, 15, 0.05);
                }
                .rep-label { color: var(--neutral-500); }
                .rep-value { color: var(--neutral-800); }
                .rep-border { border-top: 1px solid var(--neutral-100) !important; }
                .rep-alert { background-color: rgba(0, 0, 0, 0.01); border: 1px solid rgba(0,0,0,0.05) !important; border-left: 5px solid #F28C0F !important; }
                .border-start-warning-5 { border-left: 5px solid #F28C0F !important; }
                .border-start-info-5 { border-left: 5px solid #3399ff !important; }
                .text-warning-custom { color: #d67a0d; }
                .transition-all { transition: all 0.2s ease; }

                [data-coreui-theme="dark"] .rep-label { color: rgba(255,255,255,0.5); }
                [data-coreui-theme="dark"] .rep-value { color: white; }
                [data-coreui-theme="dark"] .rep-info-item:hover { background-color: rgba(255,255,255,0.05); }
                [data-coreui-theme="dark"] .rep-border { border-top: 1px solid rgba(255,255,255,0.05) !important; }
                [data-coreui-theme="dark"] .rep-alert { background-color: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.05) !important; }
                [data-coreui-theme="dark"] .text-warning-custom { color: #ffad4d; }
            `}</style>
        </div>
    )
}

RepresentativeTab.propTypes = {
    student: PropTypes.object.isRequired,
}

export default RepresentativeTab