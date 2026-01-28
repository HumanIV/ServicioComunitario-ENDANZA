import React from 'react'
import { CCol, CCard, CCardBody, CCardTitle, CBadge, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilGroup, cilCalendar, cilClock, cilInfo, cilPencil, cilTrash, cilSchool, cilBook } from '@coreui/icons'
import PropTypes from 'prop-types'

const ScheduleCard = ({ section, onShowInfo, onEdit, onDelete }) => {
    const teachers = [...new Set(section.schedules?.map(s => s.teacherName) || [])]
    const subjects = [...new Set(section.schedules?.map(s => s.subject) || [])]

    return (
        <CCol lg={4} md={6}>
            <CCard className="shadow-sm h-100 hover-lift overflow-hidden border-0" style={{ borderRadius: '20px', transition: 'all 0.3s ease' }}>
                <div className="position-absolute top-0 start-0 w-100" style={{ height: '6px', background: '#E07B00' }}></div>

                <CCardBody className="d-flex flex-column p-4 pt-5">
                    {/* Header Section */}
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="d-flex align-items-center flex-grow-1">
                            <div className="position-relative">
                                <div
                                    className="rounded-4 d-flex align-items-center justify-content-center shadow-sm"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        background: 'linear-gradient(135deg, rgba(242, 140, 15, 0.15) 0%, rgba(224, 123, 0, 0.15) 100%)',
                                        border: '2px solid rgba(242, 140, 15, 0.2)'
                                    }}
                                >
                                    <span className="fw-bold text-primary" style={{ fontSize: '1.5rem' }}>{section.sectionName.charAt(0)}</span>
                                </div>
                                <div
                                    className="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                    style={{ width: '24px', height: '24px', transform: 'translate(25%, 25%)' }}
                                >
                                    <CIcon icon={cilSchool} size="sm" className="text-white" />
                                </div>
                            </div>
                            <div className="ms-3">
                                <CCardTitle className="mb-1 fw-bold text-dark" style={{ fontSize: '1.25rem' }}>{section.sectionName}</CCardTitle>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="badge bg-light text-muted border fw-normal" style={{ fontSize: '0.7rem' }}>ID #{section.id}</span>
                                    <span className="badge bg-primary-soft text-primary fw-semibold" style={{ fontSize: '0.7rem' }}>{section.gradeLevel}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Year Badge */}
                    <div className="mb-4">
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-2 bg-light rounded-pill border">
                            <CIcon icon={cilCalendar} className="text-primary" size="sm" />
                            <span className="fw-bold text-dark small">Ciclo {section.academicYear}</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="row g-3 mb-4">
                        <div className="col-6">
                            <div className="p-3 rounded-4 text-center h-100" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                                <CIcon icon={cilBook} className="text-primary mb-2" size="lg" />
                                <div className="fw-bold text-dark h4 mb-0">{section.schedules?.length || 0}</div>
                                <div className="text-muted small fw-medium">Clases</div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="p-3 rounded-4 text-center h-100" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                                <CIcon icon={cilClock} className="text-primary mb-2" size="lg" />
                                <div className="fw-bold text-dark h4 mb-0">{section.totalHoursPerWeek || 0}</div>
                                <div className="text-muted small fw-medium">Horas/Sem</div>
                            </div>
                        </div>
                    </div>

                    {/* Teachers Section */}
                    <div className="mb-4 flex-grow-1">
                        <div className="d-flex align-items-center mb-2">
                            <CIcon icon={cilGroup} className="text-primary me-2" size="sm" />
                            <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                                Profesores ({teachers.length})
                            </span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            {teachers.slice(0, 2).map((teacher, idx) => (
                                <span key={idx} className="badge bg-white text-dark border shadow-sm fw-normal px-3 py-2">
                                    {teacher.split(' ').slice(0, 2).join(' ')}
                                </span>
                            ))}
                            {teachers.length > 2 && (
                                <span className="badge bg-primary text-white shadow-sm fw-semibold px-3 py-2">
                                    +{teachers.length - 2} más
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2 mt-auto pt-3 border-top">
                        <CButton
                            size="sm"
                            className="flex-grow-1 btn-premium-outline d-flex align-items-center justify-content-center gap-2 fw-bold"
                            onClick={() => onShowInfo(section)}
                        >
                            <CIcon icon={cilInfo} size="sm" />
                            Ver Detalles
                        </CButton>
                        <CButton
                            size="sm"
                            color="light"
                            className="text-secondary hover-bg-light border px-3"
                            onClick={() => onEdit(section)}
                            title="Editar"
                        >
                            <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                            size="sm"
                            color="light"
                            className="text-danger hover-bg-danger-light border px-3"
                            onClick={() => onDelete(section.id, section.sectionName)}
                            title="Eliminar"
                        >
                            <CIcon icon={cilTrash} />
                        </CButton>
                    </div>
                </CCardBody>
            </CCard>

            <style>{`
                .hover-lift {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .hover-lift:hover { 
                    transform: translateY(-6px); 
                    box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important; 
                }
                
                .bg-primary-soft { 
                    background-color: rgba(242, 140, 15, 0.1); 
                }
                
                .btn-premium-outline {
                    background: white;
                    border: 2px solid #E07B00;
                    color: #E07B00;
                    border-radius: 12px;
                    padding: 0.5rem 1rem;
                    transition: all 0.3s ease;
                }
                
                .btn-premium-outline:hover {
                    background: #E07B00;
                    color: white;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(224, 123, 0, 0.3);
                }
                
                .hover-bg-light:hover { 
                    background-color: #f8f9fa !important; 
                }
                
                .hover-bg-danger-light:hover { 
                    background-color: #fee2e2 !important; 
                    color: #dc2626 !important; 
                }
            `}</style>
        </CCol>
    )
}

ScheduleCard.propTypes = {
    section: PropTypes.object.isRequired,
    onShowInfo: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
}

export default ScheduleCard
