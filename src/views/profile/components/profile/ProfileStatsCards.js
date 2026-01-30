import React from 'react'
import { CRow, CCol, CCard, CCardBody, CProgress, CProgressBar, CBadge, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChartLine, cilStar, cilPencil, cilUser, cilBadge, cilArrowRight } from '@coreui/icons'
import PropTypes from 'prop-types'

const ProfileStatsCards = ({ student, progreso, showToast, setActiveKey, setEditModalVisible }) => {
    return (
        <CRow className="g-4 mb-4 animate__animated animate__fadeIn">
            <CCol xs={12} md={6}>
                <CCard className="h-100 premium-card border-0 shadow-sm overflow-hidden">
                    <CCardBody className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h6 className="stat-label mb-2 small fw-bold text-uppercase ls-1" style={{ fontSize: '0.65rem' }}>Índice Académico</h6>
                                <h2 className="mb-0 fw-bold display-6 stat-value">{student.PromedioGeneral || "0.0"}</h2>
                            </div>
                            <div className="p-3 bg-orange-soft rounded-4 text-primary shadow-sm">
                                <CIcon icon={cilChartLine} size="xl" />
                            </div>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <small className="stat-label small fw-bold text-uppercase ls-1 me-2" style={{ fontSize: '0.6rem' }}>PROGRESO DEL PERIODO</small>
                            <div className="flex-grow-1"></div>
                            <small className="stat-value fw-bold">{progreso.valor}%</small>
                        </div>
                        <CProgress className="mb-3 rounded-pill bg-orange-soft" height={6}>
                            <CProgressBar
                                value={progreso.valor}
                                className="rounded-pill"
                                style={{ backgroundColor: '#F25C05' }} // Naranja oscuro (primary-700) para contraste óptimo
                            />
                        </CProgress>
                    </CCardBody>
                </CCard>
            </CCol>

            <CCol xs={12} md={6}>
                <CCard className="h-100 premium-card border-0 shadow-sm overflow-hidden">
                    <CCardBody className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h6 className="stat-label mb-2 small fw-bold text-uppercase ls-1" style={{ fontSize: '0.65rem' }}>Evaluación Conductual</h6>
                                <h2 className="mb-0 fw-bold display-6 stat-value">{student.Conducta || "N/A"}</h2>
                            </div>
                            <div className="p-3 bg-info bg-opacity-10 rounded-4 text-info shadow-sm">
                                <CIcon icon={cilStar} size="xl" />
                            </div>
                        </div>
                        <CBadge color="info" className="rounded-pill px-3 py-2 bg-opacity-10 text-info border border-info border-opacity-25 shadow-sm mb-2">
                            ESTATUS: {student.Conducta?.toUpperCase() || "PENDIENTE"}
                        </CBadge>
                        <small className="stat-label d-block mt-2 opacity-75">Resumen disciplinario del ciclo actual.</small>
                    </CCardBody>
                </CCard>
            </CCol>

            <CCol xs={12}>
                <CCard className="premium-card border-0 shadow-sm overflow-hidden bg-primary-soft border border-primary border-opacity-10">
                    <CCardBody className="p-4 position-relative">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h6 className="text-primary mb-1 small fw-bold text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>Gestión de Expediente</h6>
                                <h4 className="mb-0 fw-bold stat-value">Acciones Rápidas</h4>
                            </div>
                            <div className="p-2 btn-icon-round rounded-circle shadow-sm text-primary">
                                <CIcon icon={cilPencil} size="lg" />
                            </div>
                        </div>

                        <CRow className="g-3">
                            <CCol md={6}>
                                <CButton
                                    className="w-100 btn-premium py-3 d-flex align-items-center justify-content-between px-4 group-hover hover-lift"
                                    onClick={() => {
                                        showToast("info", "Modo Edición", "Abriendo editor de perfil...")
                                        setActiveKey(1)
                                        setEditModalVisible(true)
                                    }}
                                >
                                    <div className="d-flex align-items-center">
                                        <div className="p-2 stat-card-inner-icon rounded-circle me-3">
                                            <CIcon icon={cilUser} size="lg" />
                                        </div>
                                        <div className="text-start">
                                            <div className="fw-bold small text-uppercase ls-1">Datos Personales</div>
                                            <small className="opacity-75" style={{ fontSize: '0.7rem' }}>Editar biografía básica</small>
                                        </div>
                                    </div>
                                    <CIcon icon={cilArrowRight} />
                                </CButton>
                            </CCol>

                            <CCol md={6}>
                                <CButton
                                    className="w-100 py-3 d-flex align-items-center justify-content-between px-4 sub-btn-premium border-0 shadow-sm hover-orange hover-lift transition-all"
                                    onClick={() => {
                                        showToast("info", "Modo Edición", "Abriendo contactos de emergencia...")
                                        setActiveKey(2)
                                        setEditModalVisible(true)
                                    }}
                                >
                                    <div className="d-flex align-items-center">
                                        <div className="p-2 bg-orange-soft rounded-circle me-3 text-primary">
                                            <CIcon icon={cilBadge} size="lg" />
                                        </div>
                                        <div className="text-start">
                                            <div className="fw-bold sub-btn-text small text-uppercase ls-1">Representantes</div>
                                            <small className="sub-btn-subtext" style={{ fontSize: '0.7rem' }}>Editar contactos</small>
                                        </div>
                                    </div>
                                    <CIcon icon={cilArrowRight} className="sub-btn-icon" />
                                </CButton>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            </CCol>
            <style>{`
                .ls-1 { letter-spacing: 1px; }
                .hover-lift:hover { transform: translateY(-3px); }
                .hover-orange:hover .sub-btn-icon { color: var(--primary-600) !important; }
                .transition-all { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
                
                .stat-label { color: var(--neutral-500); }
                .stat-value { color: var(--neutral-800); }
                .bg-primary-soft { background-color: rgba(0, 123, 255, 0.05); }
                .btn-icon-round { background-color: var(--neutral-100); }
                .stat-card-inner-icon { background-color: rgba(255, 255, 255, 0.25); }
                .sub-btn-premium { background-color: var(--neutral-100); }
                .sub-btn-text { color: var(--neutral-800); }
                .sub-btn-subtext { color: var(--neutral-500); }
                .sub-btn-icon { color: var(--neutral-400); }

                [data-coreui-theme="dark"] .stat-label { color: rgba(255,255,255,0.5); }
                [data-coreui-theme="dark"] .stat-value { color: white; }
                [data-coreui-theme="dark"] .bg-primary-soft { background-color: rgba(255,255,255,0.02); }
                [data-coreui-theme="dark"] .btn-icon-round { background-color: rgba(255,255,255,0.1); }
                [data-coreui-theme="dark"] .stat-card-inner-icon { background-color: rgba(0, 0, 0, 0.2); }
                [data-coreui-theme="dark"] .sub-btn-premium { background-color: rgba(255,255,255,0.05); }
                [data-coreui-theme="dark"] .sub-btn-text { color: white; }
                [data-coreui-theme="dark"] .sub-btn-subtext { color: rgba(255,255,255,0.4); }
                [data-coreui-theme="dark"] .sub-btn-icon { color: rgba(255,255,255,0.3); }
            `}</style>
        </CRow>
    )
}

ProfileStatsCards.propTypes = {
    student: PropTypes.object.isRequired,
    progreso: PropTypes.object.isRequired,
    showToast: PropTypes.func.isRequired,
    setActiveKey: PropTypes.func.isRequired,
    setEditModalVisible: PropTypes.func.isRequired,
}

export default ProfileStatsCards
