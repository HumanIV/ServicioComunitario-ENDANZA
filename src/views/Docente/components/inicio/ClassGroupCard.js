import React from 'react'
import { CCol, CCard, CCardBody, CBadge, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSchool, cilSearch } from '@coreui/icons'

const ClassGroupCard = ({ section, selectedTeacher, onSeeStudents }) => {
    return (
        <CCol lg={4} md={6}>
            <CCard className="h-100 shadow-lg border-0 border-top border-4 border-warning hover-lift transition-all premium-card" style={{ borderRadius: '16px' }}>
                <CCardBody className="p-4 d-flex flex-column bg-light-custom">
                    <div className="d-flex justify-content-between mb-3">
                        <div className="bg-orange-soft p-2 rounded-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                            <CIcon icon={cilSchool} size="lg" />
                        </div>
                        <CBadge className="bg-light-custom bg-opacity-25 text-primary border border-primary border-opacity-10 p-2 px-3 rounded-pill h-fit shadow-sm fw-bold">
                            ID: {section.id}
                        </CBadge>
                    </div>

                    <h5 className="fw-bold text-primary mb-1 text-uppercase ls-1" style={{ fontSize: '1.25rem' }}>
                        {[...new Set(section.schedules.filter(s => s.teacherName === selectedTeacher).map(s => s.subject))].join(' / ')}
                    </h5>
                    <div className="mb-3">
                        <small className="text-muted-custom fw-bold text-uppercase ls-1">{section.sectionName}</small>
                    </div>

                    <div className="bg-light-custom bg-opacity-25 p-3 rounded-4 mb-4 border border-dashed border-light-custom shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="small text-muted-custom fw-bold text-uppercase">Carga Horaria</span>
                            <CBadge color="primary" className="rounded-pill p-2 px-3 fw-bold">
                                {section.schedules.filter(s => s.teacherName === selectedTeacher).length} Clases
                            </CBadge>
                        </div>
                        <div className="d-flex align-items-center pt-2 border-top border-light-custom border-opacity-10">
                            <CIcon icon={cilSchool} size="sm" className="me-2 text-primary opacity-75" />
                            <span className="small header-title-custom fw-bold">Nivel: {section.gradeLevel}</span>
                        </div>
                    </div>

                    <CButton
                        onClick={() => onSeeStudents(section)}
                        className="mt-auto btn-premium py-2 fw-bold d-flex align-items-center justify-content-center shadow-sm"
                    >
                        <CIcon icon={cilSearch} className="me-2" />
                        LISTA DE ESTUDIANTES
                    </CButton>
                </CCardBody>
            </CCard>
        </CCol>
    )
}

export default ClassGroupCard
