import React from 'react'
import { CRow, CCol, CCard, CCardHeader, CCardBody, CProgress, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMedicalCross, cilInfo, cilHealing, cilNotes, cilClock } from '@coreui/icons'
import PropTypes from 'prop-types'

const HealthItem = ({ icon, label, value, badgeColor, badgeText }) => (
    <div className="d-flex align-items-center p-3 rounded-4 hover-light-bg transition-all border border-light mb-2">
        <div className={`icon-box-sm bg-${badgeColor || 'primary'} bg-opacity-10 text-${badgeColor || 'primary'} me-3 shadow-sm`}>
            <CIcon icon={icon} />
        </div>
        <div className="flex-grow-1">
            <div className="text-muted text-uppercase ls-1 fw-bold" style={{ fontSize: '0.65rem' }}>{label}</div>
            <div className="fw-bold text-dark fs-6 mt-1">{value}</div>
        </div>
        {badgeText && (
            <CBadge color={badgeColor} className="rounded-pill px-3 py-2 bg-opacity-10" style={{ color: `var(--cui-${badgeColor}) !important`, border: `1px solid var(--cui-${badgeColor})33` }}>
                {badgeText.toUpperCase()}
            </CBadge>
        )}
    </div>
)

const HealthTab = ({ student }) => {
    return (
        <div className="mt-4 animate__animated animate__fadeIn">
            <CRow className="g-4">
                <CCol xs={12} lg={6}>
                    <CCard className="premium-card border-0 h-100 shadow-sm">
                        <CCardHeader className="bg-orange-soft border-0 d-flex align-items-center py-4 px-4">
                            <div className="p-2 bg-primary rounded-circle me-3 shadow-sm">
                                <CIcon icon={cilMedicalCross} size="sm" className="text-white" />
                            </div>
                            <h5 className="mb-0 fw-bold text-dark text-uppercase ls-1">Perfil Antropométrico</h5>
                        </CCardHeader>
                        <CCardBody className="p-4">
                            <CRow className="g-3 mb-4">
                                <CCol xs={6}>
                                    <div className="text-center p-4 rounded-4 bg-light border border-light">
                                        <CIcon icon={cilMedicalCross} className="text-primary mb-2 opacity-50" size="xl" />
                                        <div className="text-muted small text-uppercase fw-bold ls-1 mb-1" style={{ fontSize: '0.6rem' }}>Peso Actual</div>
                                        <h2 className="mb-0 fw-bold text-dark">{student.NutricionPeso || "N/A"}</h2>
                                    </div>
                                </CCol>
                                <CCol xs={6}>
                                    <div className="text-center p-4 rounded-4 bg-light border border-light">
                                        <CIcon icon={cilInfo} className="text-primary mb-2 opacity-50" size="xl" />
                                        <div className="text-muted small text-uppercase fw-bold ls-1 mb-1" style={{ fontSize: '0.6rem' }}>Estatura</div>
                                        <h2 className="mb-0 fw-bold text-dark">{student.NutricionAltura || "N/A"}</h2>
                                    </div>
                                </CCol>
                            </CRow>

                            <div className="p-4 rounded-4 bg-orange-soft border border-primary border-opacity-10 mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="text-primary small fw-bold text-uppercase ls-1 mb-0">Índice de Masa Corporal (IMC)</h6>
                                    <CBadge color="primary" className="rounded-pill px-3 py-1 fs-5 shadow-sm fw-bold">
                                        {student.NutricionIMC || "N/A"}
                                    </CBadge>
                                </div>
                                <CProgress
                                    value={(student.NutricionIMC ? parseFloat(student.NutricionIMC.split(" ")[0]) : 0) * 3.5 || 0}
                                    color="primary"
                                    className="rounded-pill shadow-sm"
                                    style={{ height: '10px' }}
                                />
                                <div className="d-flex justify-content-between mt-2 px-1">
                                    <small className="text-muted opacity-50 fw-bold" style={{ fontSize: '0.6rem' }}>BAJO</small>
                                    <small className="text-muted opacity-50 fw-bold" style={{ fontSize: '0.6rem' }}>NORMAL</small>
                                    <small className="text-muted opacity-50 fw-bold" style={{ fontSize: '0.6rem' }}>SOBREPESO</small>
                                </div>
                            </div>

                            <div className="alert bg-primary bg-opacity-10 border-0 rounded-4 p-3 d-flex align-items-center">
                                <CIcon icon={cilInfo} className="text-primary me-3" size="xl" />
                                <small className="fw-medium text-dark">
                                    <strong>Evaluación:</strong> {student.NutricionObs || "Sin observaciones registradas."}
                                </small>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>

                <CCol xs={12} lg={6}>
                    <CCard className="premium-card border-0 h-100 shadow-sm">
                        <CCardHeader className="bg-orange-soft border-0 d-flex align-items-center py-4 px-4">
                            <div className="p-2 bg-primary rounded-circle me-3 shadow-sm">
                                <CIcon icon={cilHealing} size="sm" className="text-white" />
                            </div>
                            <h5 className="mb-0 fw-bold text-dark text-uppercase ls-1">Histórico Clínico</h5>
                        </CCardHeader>
                        <CCardBody className="p-4">
                            <div className="d-flex flex-column gap-1">
                                <HealthItem
                                    icon={cilMedicalCross}
                                    label="Alergias Conocidas"
                                    value={student.Alergias || "N/A"}
                                    badgeColor={student.Alergias === "Ninguna" ? "success" : (student.Alergias ? "danger" : "secondary")}
                                    badgeText={student.Alergias === "Ninguna" ? "LIMPIO" : (student.Alergias ? "ALERTA" : "PENDIENTE")}
                                />
                                <HealthItem
                                    icon={cilMedicalCross}
                                    label="Medicamentos de Uso Diario"
                                    value={student.Medicamentos || "N/A"}
                                    badgeColor={student.Medicamentos === "Ninguno" ? "success" : (student.Medicamentos ? "warning" : "secondary")}
                                    badgeText={student.Medicamentos === "Ninguno" ? "SIN RESTRICCIÓN" : (student.Medicamentos ? "CONTROLADO" : "PENDIENTE")}
                                />
                                <HealthItem
                                    icon={cilMedicalCross}
                                    label="Condiciones Médicas / Enfermedades"
                                    value={student.Enfermedades || "N/A"}
                                    badgeColor={student.Enfermedades === "Ninguna" ? "success" : (student.Enfermedades ? "info" : "secondary")}
                                    badgeText={student.Enfermedades === "Ninguna" ? "SANO" : (student.Enfermedades ? "REPORTE" : "PENDIENTE")}
                                />
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <style>{`
                .ls-1 { letter-spacing: 1px; }
                .icon-box-sm {
                    width: 44px;
                    height: 44px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .hover-light-bg:hover { background-color: rgba(242, 140, 15, 0.03); }
                .transition-all { transition: all 0.2s ease; }
            `}</style>
        </div>
    )
}

HealthTab.propTypes = {
    student: PropTypes.object.isRequired,
}

export default HealthTab