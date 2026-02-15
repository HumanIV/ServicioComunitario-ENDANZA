import React from 'react'
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilHome, cilPhone, cilEnvelopeClosed, cilCalendar, cilHeart, cilBraille } from '@coreui/icons'
import PropTypes from 'prop-types'

const InfoItem = ({ icon, label, value, subValue }) => (
    <div className="d-flex align-items-center p-3 rounded-4 personal-info-item transition-all">
        <div className="icon-box-sm bg-orange-soft text-warning me-3 shadow-sm">
            <CIcon icon={icon} />
        </div>
        <div>
            <div className="personal-info-label text-uppercase ls-1 fw-bold" style={{ fontSize: '0.65rem' }}>{label}</div>
            <div className="fw-bold personal-info-value fs-6 mt-1">{value || 'N/A'}</div>
            {subValue && <div className="personal-info-label small">{subValue}</div>}
        </div>
    </div>
)

const PersonalInfoTab = ({ student }) => {
    // Calcular edad desde fecha de nacimiento
    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return 'N/A'
        const hoy = new Date()
        const nacimiento = new Date(fechaNacimiento)
        let edad = hoy.getFullYear() - nacimiento.getFullYear()
        const mes = hoy.getMonth() - nacimiento.getMonth()
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--
        }
        return `${edad} años`
    }

    return (
        <div className="mt-4 animate__animated animate__fadeIn">
            <CRow className="g-4">
                <CCol xs={12} lg={6}>
                    <CCard className="premium-card border-0 h-100 shadow-sm">
                        <CCardHeader className="bg-orange-soft border-0 d-flex align-items-center py-4 px-4">
                            <div className="p-2 bg-warning rounded-circle me-3 shadow-sm">
                                <CIcon icon={cilUser} size="sm" className="text-white" />
                            </div>
                            <h5 className="mb-0 fw-bold personal-info-value text-uppercase ls-1">Ficha de Identidad</h5>
                        </CCardHeader>
                        <CCardBody className="p-4">
                            <div className="d-flex flex-column gap-2">
                                <InfoItem
                                    icon={cilUser}
                                    label="Nombre Completo"
                                    value={`${student.first_name || ''} ${student.last_name || ''}`.trim() || 'N/A'}
                                />
                                <InfoItem
                                    icon={cilCalendar}
                                    label="Fecha de Nacimiento"
                                    value={student.birth_date || 'N/A'}
                                />
                                <InfoItem
                                    icon={cilBraille}
                                    label="Edad Registrada"
                                    value={calcularEdad(student.birth_date)}
                                />
                                <InfoItem
                                    icon={cilUser}
                                    label="Género"
                                    value={student.gender || 'N/A'}
                                />
                                <InfoItem
                                    icon={cilHeart}
                                    label="Factor Sanguíneo"
                                    value={student.blood_type || 'N/A'}
                                />
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>

                <CCol xs={12} lg={6}>
                    <CCard className="premium-card border-0 h-100 shadow-sm">
                        <CCardHeader className="bg-orange-soft border-0 d-flex align-items-center py-4 px-4">
                            <div className="p-2 bg-warning rounded-circle me-3 shadow-sm">
                                <CIcon icon={cilHome} size="sm" className="text-white" />
                            </div>
                            <h5 className="mb-0 fw-bold personal-info-value text-uppercase ls-1">Información de Geolocalización</h5>
                        </CCardHeader>
                        <CCardBody className="p-4">
                            <div className="d-flex flex-column gap-2">
                                <InfoItem
                                    icon={cilHome}
                                    label="Dirección de Habitación"
                                    value={student.address || 'N/A'}
                                    subValue={student.city ? `${student.city} ${student.state || ''}`.trim() : ''}
                                />
                                <InfoItem
                                    icon={cilPhone}
                                    label="Teléfono de Contacto"
                                    value={student.phone || student.representative_phone || 'N/A'}
                                />
                                <InfoItem
                                    icon={cilEnvelopeClosed}
                                    label="Correo Electrónico"
                                    value={student.email || student.representative_email || 'N/A'}
                                />
                            </div>
                        </CCardBody>
                    </CCard>
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
                .personal-info-item:hover {
                    background-color: rgba(242, 140, 15, 0.05);
                }
                .personal-info-label { color: var(--neutral-500); }
                .personal-info-value { color: var(--neutral-800); }
                .transition-all { transition: all 0.2s ease; }

                [data-coreui-theme="dark"] .personal-info-label { color: rgba(255,255,255,0.5); }
                [data-coreui-theme="dark"] .personal-info-value { color: white; }
                [data-coreui-theme="dark"] .personal-info-item:hover { background-color: rgba(255,255,255,0.05); }
            `}</style>
        </div>
    )
}

PersonalInfoTab.propTypes = {
    student: PropTypes.object.isRequired,
}

export default PersonalInfoTab