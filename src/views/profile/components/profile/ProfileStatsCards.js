import React from 'react'
import { CRow, CCol, CCard, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChartLine } from '@coreui/icons'
import PropTypes from 'prop-types'

const ProfileStatsCards = ({ student }) => {
    return (
        <CRow className="g-4 mb-4 animate__animated animate__fadeIn">
            <CCol xs={12}>
                <CCard className="premium-card border-0 shadow-sm overflow-hidden mb-0">
                    <CCardBody className="p-0">
                        <CRow className="g-0 align-items-stretch">
                            <CCol md={4} className="bg-orange-soft d-flex flex-column align-items-center justify-content-center py-5 border-end border-warning border-opacity-10">
                                <div className="p-3 bg-white rounded-circle text-warning shadow-sm mb-3 stat-icon-bg">
                                    <CIcon icon={cilChartLine} size="xl" />
                                </div>
                                <h6 className="stat-label mb-1 small fw-bold text-uppercase ls-1">Promedio General</h6>
                                <h2 className="mb-0 fw-black display-3 stat-value text-warning" style={{ letterSpacing: '-2px' }}>
                                    {student.PromedioGeneral || "0.0"}
                                </h2>
                            </CCol>
                            <CCol md={8} className="p-4 d-flex flex-column justify-content-center">
                                <div className="mb-3">
                                    <h4 className="fw-black mb-2 stat-value">Índice Académico Vigente</h4>
                                    <p className="text-muted-custom mb-0 small lh-base">
                                        Representa el rendimiento ponderado del estudiante en el ciclo actual.
                                        Este valor se actualiza automáticamente conforme se registran nuevas evaluaciones.
                                    </p>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="flex-grow-1 p-3 rounded-4 bg-light-custom bg-opacity-10 border border-light-custom">
                                        <div className="small fw-bold text-muted-custom text-uppercase ls-1 mb-1" style={{ fontSize: '0.6rem' }}>Estado Académico</div>
                                        <div className="fw-bold text-success d-flex align-items-center">
                                            <div className="badge-dot bg-success me-2"></div>
                                            Regular
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 p-3 rounded-4 bg-light-custom bg-opacity-10 border border-light-custom">
                                        <div className="small fw-bold text-muted-custom text-uppercase ls-1 mb-1" style={{ fontSize: '0.6rem' }}>Ciclo Lectivo</div>
                                        <div className="fw-bold stat-value">2024 - 2025</div>
                                    </div>
                                </div>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            </CCol>

            <style>{`
                .ls-1 { letter-spacing: 1px; }
                .fw-black { font-weight: 900; }
                .stat-label { color: var(--neutral-500); }
                .stat-value { color: var(--neutral-800); }
                .bg-light-custom { background-color: var(--neutral-100); }
                .stat-icon-bg { background-color: #ffffff !important; }

                [data-coreui-theme="dark"] .stat-label { color: rgba(255,255,255,0.5); }
                [data-coreui-theme="dark"] .stat-value { color: white; }
                [data-coreui-theme="dark"] .bg-light-custom { background-color: rgba(255,255,255,0.05); }
                [data-coreui-theme="dark"] .stat-icon-bg { background-color: rgba(255, 255, 255, 0.05) !important; }
            `}</style>
        </CRow>
    )
}

ProfileStatsCards.propTypes = {
    student: PropTypes.object.isRequired,
}

export default ProfileStatsCards
