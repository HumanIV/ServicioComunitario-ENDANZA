import React from 'react'
import { CCol, CCard, CCardBody, CBadge, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSchool, cilSearch } from '@coreui/icons'

const ClassGroupCard = ({ section, selectedTeacher, onSeeStudents }) => {
    return (
        <CCol lg={4} md={6}>
            <CCard className="h-100 shadow-lg border-0 border-top border-4 border-warning hover-lift transition-all premium-card" style={{ borderRadius: '16px' }}>
                <CCardBody className="p-3 p-xl-4 d-flex flex-column bg-light-custom">
                    <div className="d-flex justify-content-between align-items-start mb-2 mb-md-3">
                        <div className="bg-orange-soft p-2 rounded-3 text-primary d-flex align-items-center justify-content-center responsive-group-icon">
                            <CIcon icon={cilSchool} size="lg" />
                        </div>
                        <div className="bg-warning shadow-sm rounded-circle d-flex align-items-center justify-content-center fw-bold text-white responsive-id-badge">
                            ID: {section.id}
                        </div>
                    </div>

                    <h5 className="fw-bold text-primary mb-1 text-uppercase ls-1 fs-6 fs-md-5 fs-xl-4 text-truncate-2">
                        {[...new Set(section.schedules.filter(s => s.teacherName === selectedTeacher).map(s => s.subject))].join(' / ')}
                    </h5>
                    <div className="mb-2 mb-md-3 overflow-hidden">
                        <small className="text-muted-custom fw-bold text-uppercase ls-1 text-truncate d-block" style={{ fontSize: '0.7rem' }}>{section.sectionName}</small>
                    </div>

                    <div className="bg-light-custom bg-opacity-25 p-2 p-md-3 rounded-4 mb-3 mb-md-4 border border-dashed border-light-custom shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-1 mb-md-2">
                            <span className="small text-muted-custom fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Carga Horaria</span>
                            <CBadge color="primary" className="rounded-pill p-1 px-3 fw-bold small">
                                {section.schedules.filter(s => s.teacherName === selectedTeacher).length} Clases
                            </CBadge>
                        </div>
                        <div className="d-flex align-items-center pt-2 border-top border-light-custom border-opacity-10">
                            <CIcon icon={cilSchool} size="sm" className="me-2 text-primary opacity-75" />
                            <span className="small header-title-custom fw-bold" style={{ fontSize: '0.7rem' }}>Nivel: {section.gradeLevel}</span>
                        </div>
                    </div>

                    <CButton
                        onClick={() => onSeeStudents(section)}
                        className="mt-auto btn-premium py-2 fw-bold d-flex align-items-center justify-content-center shadow-sm w-100"
                        style={{ fontSize: '0.8rem' }}
                    >
                        <CIcon icon={cilSearch} className="me-2" />
                        VER ESTUDIANTES
                    </CButton>
                </CCardBody>

                <style>{`
                    .responsive-group-icon {
                        width: 45px;
                        height: 45px;
                    }
                    .responsive-id-badge {
                        width: 45px;
                        height: 45px;
                        font-size: 0.85rem;
                        margin-top: -10px;
                    }
                    .text-truncate-2 {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                    @media (min-width: 992px) and (max-width: 1400px) {
                        .responsive-group-icon { width: 38px; height: 38px; }
                        .responsive-id-badge { width: 38px; height: 38px; font-size: 0.75rem; margin-top: -8px; }
                        .premium-card h5 { min-height: 2.8rem; }
                    }
                `}</style>
            </CCard>
        </CCol>
    )
}

export default ClassGroupCard
