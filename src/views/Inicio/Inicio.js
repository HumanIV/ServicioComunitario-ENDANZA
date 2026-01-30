import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CButton,
    CCol,
    CContainer,
    CRow,
    CAvatar,
    CBadge,
    CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilSchool, cilArrowRight, cilPeople, cilCalendarCheck } from '@coreui/icons'

import { listStudents } from 'src/services/students'

const InicioParent = () => {
    const navigate = useNavigate();
    const [children, setChildren] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        fetchChildren()
    }, [])

    const fetchChildren = async () => {
        setLoading(true)
        try {
            // En un sistema real, filtraríamos por representativeId. 
            // Aquí traemos los que tenemos en el mock.
            const data = await listStudents()
            setChildren(data)
        } catch (error) {
            console.error("Error loading children:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleViewProfile = (studentId) => {
        navigate(`/perfil-students/${studentId}`);
    }

    return (
        <CContainer fluid className="mt-4 pb-5">
            <CRow>
                <CCol>
                    <CCard className="premium-card border-0 mb-5 overflow-hidden" style={{ borderRadius: '20px' }}>
                        <div className="bg-primary" style={{ height: '8px' }}></div>
                        <CCardBody className="p-5 bg-transparent position-relative">
                            <div className="d-flex align-items-center justify-content-between position-relative" style={{ zIndex: 2 }}>
                                <div>
                                    <h2 className="fw-bold welcome-title mb-1 display-5">¡Bienvenido!</h2>
                                    <p className="welcome-subtitle fs-5 mb-0 fw-medium">
                                        Gestione la actividad académica de sus hijos desde este panel central.
                                    </p>
                                </div>
                                <div className="d-none d-md-block bg-orange-soft p-4 rounded-circle">
                                    <CIcon icon={cilPeople} size="3xl" className="text-primary" style={{ height: '60px' }} />
                                </div>
                            </div>
                            <div className="position-absolute bottom-0 end-0 opacity-10 mb-n5 me-n5" style={{ transform: 'rotate(-15deg)' }}>
                                <CIcon icon={cilSchool} className="welcome-icon-bg" style={{ height: '200px' }} />
                            </div>
                        </CCardBody>
                    </CCard>

                    <h4 className="mb-4 fw-bold section-title text-uppercase ls-1 d-flex align-items-center">
                        <CIcon icon={cilSchool} className="me-2 text-primary" />
                        Estudiantes a su cargo
                    </h4>

                    <CRow className="g-4">
                        {loading ? (
                            <CCol className="text-center py-5"><CSpinner color="primary" /></CCol>
                        ) : children.map((child) => (
                            <CCol key={child.id} lg={6}>
                                <CCard className="premium-card student-card h-100 border-0 border-start border-4 border-warning transition-all" style={{ borderRadius: '16px' }}>
                                    <CCardBody className="p-4">
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="position-relative me-4">
                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold shadow-sm border border-white border-4 bg-orange-soft"
                                                    style={{ width: '90px', height: '90px', fontSize: '1.8rem', letterSpacing: '1px' }}
                                                >
                                                    {child.name[0]}{child.lastName[0]}
                                                </div>
                                                <div className="position-absolute bottom-0 end-0 bg-success border border-white border-2 rounded-circle shadow-sm" style={{ width: '22px', height: '22px' }}></div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <h4 className="fw-bold child-name mb-1">{child.fullName}</h4>
                                                        <div className="d-flex align-items-center child-id small fw-bold text-uppercase ls-1">
                                                            <CIcon icon={cilCalendarCheck} className="me-1" size="sm" />
                                                            ID: {child.code}
                                                        </div>
                                                    </div>
                                                    <CBadge color="success" className="px-3 py-2 rounded-pill bg-opacity-10 text-success border border-success border-opacity-25 fw-bold">
                                                        {child.status}
                                                    </CBadge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 child-info-box rounded-3 mb-4 border border-light-subtle">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="child-info-label small fw-bold text-uppercase">Grado y Programa</span>
                                                <span className="fw-bold text-primary text-end">{child.gradeLevel}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="child-info-label small fw-bold text-uppercase">Periodo Actual</span>
                                                <span className="fw-medium child-info-value">{child.academicYear}</span>
                                            </div>
                                        </div>

                                        <CButton
                                            onClick={() => handleViewProfile(child.id)}
                                            className="w-100 btn-premium py-3 fw-bold d-flex align-items-center justify-content-center"
                                        >
                                            VER PERFIL ACADÉMICO
                                            <CIcon icon={cilArrowRight} className="ms-2" />
                                        </CButton>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        ))}
                    </CRow>
                </CCol>
            </CRow>

            <style>{`
                .welcome-title { color: var(--neutral-800); }
                .welcome-subtitle { color: var(--neutral-600); }
                .section-title { color: var(--neutral-800); }
                .child-name { color: var(--neutral-800); }
                .child-id { color: var(--neutral-500); }
                .child-info-box { background-color: var(--neutral-50); }
                .child-info-label { color: var(--neutral-500); }
                .child-info-value { color: var(--neutral-800); }
                .welcome-icon-bg { color: var(--neutral-800); }

                [data-coreui-theme="dark"] .welcome-title { color: white; }
                [data-coreui-theme="dark"] .welcome-subtitle { color: rgba(255,255,255,0.6); }
                [data-coreui-theme="dark"] .section-title { color: white; }
                [data-coreui-theme="dark"] .child-name { color: white; }
                [data-coreui-theme="dark"] .child-id { color: rgba(255,255,255,0.5); }
                [data-coreui-theme="dark"] .child-info-box { background-color: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.05) !important; }
                [data-coreui-theme="dark"] .child-info-label { color: rgba(255,255,255,0.5); }
                [data-coreui-theme="dark"] .child-info-value { color: white; }
                [data-coreui-theme="dark"] .welcome-icon-bg { color: white; }

                .student-card {
                    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                .student-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 35px rgba(242, 140, 15, 0.15) !important;
                }
                .btn-premium {
                    background: #E07B00;
                    border: none;
                    color: white;
                    border-radius: 14px;
                    transition: all 0.3s ease;
                }
                .btn-premium:hover {
                    background: #F28C0F !important;
                    color: white !important;
                    transform: scale(1.02);
                }
                .bg-orange-soft { background-color: rgba(242, 140, 15, 0.12); }
                .ls-1 { letter-spacing: 0.5px; }
            `}</style>
        </CContainer>
    )
}

export default InicioParent
