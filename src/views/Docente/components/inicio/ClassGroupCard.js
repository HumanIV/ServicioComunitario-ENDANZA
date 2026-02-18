import React from 'react'
import { CCol, CCard, CCardHeader, CCardBody, CCardFooter, CBadge, CButton, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSchool, cilSearch, cilCalendar, cilClock } from '@coreui/icons'

const ClassGroupCard = ({ section, selectedTeacher, onSeeStudents, currentUserId }) => {
    // Función para verificar si un horario pertenece al profesor actual
    const isTeacherSchedule = (sched) => {
        const schedUserId = sched.teacherUserId ? Number(sched.teacherUserId) : null;
        const schedTeacherName = (sched.teacherName || '').trim().toLowerCase();
        const normalizedSelected = (selectedTeacher || '').trim().toLowerCase();

        if (currentUserId && schedUserId) {
            return Number(currentUserId) === schedUserId;
        }
        return schedTeacherName === normalizedSelected || schedTeacherName.includes(normalizedSelected);
    };

    const teacherSchedules = section.schedules?.filter(isTeacherSchedule) || [];

    const subjectName = section.subjectName || [...new Set(teacherSchedules.map(s => s.subject))].join(' / ') || 'Sin Materia Asignada';
    const horario = teacherSchedules.map(s => {
        const dia = s.dayName || s.day_name || '';
        const inicio = s.startTime?.substring(0, 5) || s.start_time?.substring(0, 5) || '';
        const fin = s.endTime?.substring(0, 5) || s.end_time?.substring(0, 5) || '';
        return `${dia} ${inicio}-${fin}`;
    }).join(', ') || 'Sin Horario';

    return (
        <CCol lg={4} md={6}>
            <CCard className="premium-card border-0 h-100 overflow-hidden shadow-sm hover-lift-sm">
                <CCardHeader className="bg-orange-soft border-0 py-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center overflow-hidden">
                        <div className="p-2 bg-primary rounded-circle me-3 shadow-sm flex-shrink-0">
                            <CIcon icon={cilSchool} size="sm" className="text-white" />
                        </div>
                        <strong className="header-title-custom fw-bold text-uppercase ls-1 text-truncate" style={{ fontSize: '0.85rem' }}>
                            {subjectName}
                        </strong>
                    </div>
                </CCardHeader>

                <CCardBody className="p-4 d-flex flex-column">
                    <CRow className="mb-3 g-3">
                        <CCol xs={6}>
                            <div className="p-3 rounded-4 bg-light-custom h-100 border border-light-custom">
                                <div className="text-muted-custom small text-uppercase fw-bold ls-1 mb-2" style={{ fontSize: '0.6rem' }}>
                                    <CIcon icon={cilSchool} className="me-1 text-primary" /> Sección
                                </div>
                                <div className="fw-bold header-title-custom small text-truncate">{section.sectionName}</div>
                            </div>
                        </CCol>
                        <CCol xs={6}>
                            <div className="p-3 rounded-4 bg-light-custom h-100 border border-light-custom">
                                <div className="text-muted-custom small text-uppercase fw-bold ls-1 mb-2" style={{ fontSize: '0.6rem' }}>
                                    <CIcon icon={cilCalendar} className="me-1 text-primary" /> ID
                                </div>
                                <div className="fw-bold text-primary font-monospace small">{section.id}</div>
                            </div>
                        </CCol>
                    </CRow>

                    <div className="p-3 rounded-4 bg-light-custom border border-light-custom mb-3">
                        <div className="text-muted-custom small text-uppercase fw-bold ls-1 mb-2" style={{ fontSize: '0.6rem' }}>
                            <CIcon icon={cilClock} className="me-1 text-primary" /> Horario
                        </div>
                        <div className="fw-bold header-title-custom small">{horario}</div>
                    </div>

                    <div className="mt-auto d-flex align-items-center pt-2">
                        <CBadge color="primary" className="rounded-pill px-3 py-2 bg-opacity-10 text-primary border border-primary border-opacity-10 shadow-sm">
                            Nivel: {section.gradeLevel}
                        </CBadge>
                        <span className="ms-auto small text-muted fw-bold" style={{ fontSize: '0.7rem' }}>
                            {teacherSchedules.length} Clases
                        </span>
                    </div>

                </CCardBody>

                <CCardFooter className="bg-transparent border-0 p-4 pt-0">
                    <CButton
                        onClick={() => onSeeStudents(section)}
                        className="btn-premium w-100 py-2 d-flex align-items-center justify-content-center shadow-sm"
                    >
                        <CIcon icon={cilSearch} className="me-2" />
                        VER ESTUDIANTES
                    </CButton>
                </CCardFooter>
            </CCard>
        </CCol>
    )
}

export default ClassGroupCard
