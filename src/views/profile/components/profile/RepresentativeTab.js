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
            <div className={`fw-bold rep-value fs-6 mt-1 ${isCode ? 'font-monospace' : ''}`}>{value || 'N/A'}</div>
        </div>
    </div>
)

const RepresentativeTab = ({ student }) => {
    // Datos del representante desde el backend
    const representante = {
        nombre: student.representative || 'No asignado',
        cedula: student.representative_dni || 'N/A',
        telefono: student.representative_phone || 'N/A',
        email: student.representative_email || 'N/A',
        parentesco: student.representative_relationship || 'Representante'
    }

    return (
        <div className="mt-4 animate__animated animate__fadeIn">
            <CRow className="g-4">
                {/* REPRESENTANTE PRINCIPAL */}
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
                                    <h6 className="text-warning fw-bold text-uppercase ls-1 small mb-2">Representante Legal</h6>
                                    <h4 className="mb-1 fw-bold rep-value">{representante.nombre}</h4>

                                    <div className="d-flex gap-4 flex-wrap mt-3">
                                        <div className="small rep-label fw-bold ls-1 d-flex align-items-center">
                                            <CIcon icon={cilAddressBook} size="sm" className="me-2 text-warning" />
                                            CÉDULA: <span className="ms-1 rep-value">{representante.cedula}</span>
                                        </div>
                                        <div className="small rep-label fw-bold ls-1 d-flex align-items-center">
                                            <CIcon icon={cilPhone} size="sm" className="me-2 text-warning" />
                                            TELÉFONO: <span className="ms-1 rep-value">{representante.telefono}</span>
                                        </div>
                                        <div className="small rep-label fw-bold ls-1 d-flex align-items-center">
                                            <CIcon icon={cilEnvelopeClosed} size="sm" className="me-2 text-warning" />
                                            EMAIL: <span className="ms-1 rep-value">{representante.email}</span>
                                        </div>
                                        <div className="small rep-label fw-bold ls-1 d-flex align-items-center">
                                            <CIcon icon={cilBriefcase} size="sm" className="me-2 text-warning" />
                                            PARENTESCO: <span className="ms-1 rep-value">{representante.parentesco}</span>
                                        </div>
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
                .rep-alert { background-color: rgba(0, 0, 0, 0.01); border: 1px solid rgba(0,0,0,0.05) !important; border-left: 5px solid #F28C0F !important; }

                [data-coreui-theme="dark"] .rep-label { color: rgba(255,255,255,0.5); }
                [data-coreui-theme="dark"] .rep-value { color: white; }
                [data-coreui-theme="dark"] .rep-info-item:hover { background-color: rgba(255,255,255,0.05); }
                [data-coreui-theme="dark"] .rep-alert { background-color: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.05) !important; }
            `}</style>
        </div>
    )
}

RepresentativeTab.propTypes = {
    student: PropTypes.object.isRequired,
}

export default RepresentativeTab