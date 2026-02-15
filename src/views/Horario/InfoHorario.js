// src/views/horarios/InfoHorario.jsx - VERSIÓN FINAL CORREGIDA
import React, { useEffect } from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CBadge,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilCalendar,
    cilClock,
    cilUser,
    cilLocationPin,
    cilBook,
    cilGroup,
    cilSchool
} from '@coreui/icons'

const InfoHorario = ({ visible, onClose, section }) => {
    useEffect(() => {
        if (visible && section) {
            console.log('📊 InfoHorario - Datos recibidos:', {
                sectionName: section.sectionName,
                gradeLevel: section.gradeLevel,
                schedules: section.schedules,
                uniqueSubjects: section.uniqueSubjects,
                uniqueTeachers: section.uniqueTeachers,
                uniqueClassrooms: section.uniqueClassrooms
            });
        }
    }, [visible, section]);

    if (!section) return null;

    // ============================================
    // VALORES POR DEFECTO PARA EVITAR ERRORES
    // ============================================
    const safeSection = {
        id: section.id || 'N/A',
        sectionName: section.sectionName || section.section_name || 'Sin nombre',
        gradeLevel: section.gradeLevel || section.subject_name || 'Sin nivel',
        academicYear: section.academicYear || section.academic_year_name || 'Año no especificado',
        totalHoursPerWeek: section.totalHoursPerWeek || section.total_hours || 0,
        schedules: Array.isArray(section.schedules) ? section.schedules : [],
        uniqueSubjects: Array.isArray(section.uniqueSubjects) ? section.uniqueSubjects : [],
        uniqueTeachers: Array.isArray(section.uniqueTeachers) ? section.uniqueTeachers : [],
        uniqueClassrooms: Array.isArray(section.uniqueClassrooms) ? section.uniqueClassrooms : []
    };

    const formatTime = (time) => time ? time.substring(0, 5) : '00:00';

    const calculateDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return 0;
        const start = new Date(`2000-01-01T${startTime}:00`);
        const end = new Date(`2000-01-01T${endTime}:00`);
        return Math.round((end - start) / (1000 * 60));
    };

    const orderedDays = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];

    const sortedSchedules = [...safeSection.schedules].sort((a, b) => {
        const dayA = orderedDays.indexOf(a.dayOfWeek);
        const dayB = orderedDays.indexOf(b.dayOfWeek);
        if (dayA !== dayB) return dayA - dayB;
        return a.startTime.localeCompare(b.startTime);
    });

    const schedulesByDay = sortedSchedules.reduce((acc, schedule) => {
        const day = schedule.dayOfWeek;
        if (!acc[day]) acc[day] = [];
        acc[day].push(schedule);
        return acc;
    }, {});

    return (
        <CModal size="xl" visible={visible} onClose={onClose} backdrop="static" className="premium-modal">
            <CModalHeader className="bg-primary text-white border-0 py-3">
                <CModalTitle className="fw-bold d-flex align-items-center ls-1 small">
                    <CIcon icon={cilCalendar} className="me-2" />
                    DETALLE DE HORARIO
                </CModalTitle>
            </CModalHeader>
            
            <CModalBody className="p-4 bg-light-custom bg-opacity-10" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                <CRow className="g-4">
                    {/* INFO SECCIÓN */}
                    <CCol md={12}>
                        <CCard className="border-0 shadow-lg mb-2 overflow-hidden premium-card">
                            <div className="bg-orange-soft px-4 py-3 border-bottom border-warning border-opacity-10">
                                <h6 className="mb-0 text-primary fw-bold text-uppercase small ls-1 d-flex align-items-center">
                                    <CIcon icon={cilSchool} className="me-2" />
                                    {safeSection.sectionName} - {safeSection.academicYear}
                                </h6>
                            </div>
                            <CCardBody className="p-4">
                                <CRow className="g-3">
                                    {/* NIVEL - Primer card */}
                                    <CCol md={3} xs={6}>
                                        <div className="d-flex flex-column p-3 bg-light-custom bg-opacity-10 rounded-4 border border-light-custom shadow-sm">
                                            <span className="text-muted-custom small text-uppercase fw-bold ls-1">Nivel</span>
                                            <strong className="fs-5 header-title-custom">{safeSection.gradeLevel}</strong>
                                        </div>
                                    </CCol>
                                    
                                    {/* ID - Segundo card */}
                                    <CCol md={3} xs={6}>
                                        <div className="d-flex flex-column p-3 bg-light-custom bg-opacity-10 rounded-4 border border-light-custom shadow-sm">
                                            <span className="text-muted-custom small text-uppercase fw-bold ls-1">ID</span>
                                            <strong className="fs-5 header-title-custom">#{safeSection.id}</strong>
                                        </div>
                                    </CCol>
                                    
                                    {/* Clases - Tercer card */}
                                    <CCol md={3} xs={6}>
                                        <div className="d-flex flex-column p-3 bg-light-custom bg-opacity-10 rounded-4 border border-light-custom shadow-sm">
                                            <span className="text-muted-custom small text-uppercase fw-bold ls-1">Clases</span>
                                            <strong className="fs-5 text-primary">{safeSection.schedules.length}</strong>
                                        </div>
                                    </CCol>
                                    
                                    {/* Horas/sem - Cuarto card */}
                                    <CCol md={3} xs={6}>
                                        <div className="d-flex flex-column p-3 bg-light-custom bg-opacity-10 rounded-4 border border-light-custom shadow-sm">
                                            <span className="text-muted-custom small text-uppercase fw-bold ls-1">Horas/sem</span>
                                            <strong className="fs-5 text-primary">{safeSection.totalHoursPerWeek}</strong>
                                        </div>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>

                    {/* TARJETAS DE RESUMEN */}
                    <CCol md={12}>
                        <CRow className="g-3">
                            <CCol md={4}>
                                <div className="p-4 bg-light-custom bg-opacity-10 border border-light-custom rounded-4 shadow-sm h-100">
                                    <h6 className="text-primary fw-bold small text-uppercase border-bottom border-light-custom border-opacity-10 pb-3 mb-3 d-flex justify-content-between align-items-center">
                                        <span><CIcon icon={cilGroup} className="me-2" />Profesores</span>
                                        <CBadge color="primary" shape="rounded-pill" className="bg-opacity-10 text-primary border border-primary border-opacity-10">
                                            {safeSection.uniqueTeachers.length}
                                        </CBadge>
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {safeSection.uniqueTeachers.length > 0 ? (
                                            safeSection.uniqueTeachers.map((teacher, i) => (
                                                <span key={i} className="badge bg-light-custom bg-opacity-25 text-muted-custom border border-light-custom fw-medium py-2 px-3 rounded-pill">
                                                    {teacher}
                                                </span>
                                            ))
                                        ) : <small className="text-muted-custom fst-italic">Sin asignar</small>}
                                    </div>
                                </div>
                            </CCol>
                            
                            <CCol md={4}>
                                <div className="p-4 bg-light-custom bg-opacity-10 border border-light-custom rounded-4 shadow-sm h-100">
                                    <h6 className="text-success fw-bold small text-uppercase border-bottom border-light-custom border-opacity-10 pb-3 mb-3 d-flex justify-content-between align-items-center">
                                        <span><CIcon icon={cilBook} className="me-2" />Asignaturas</span>
                                        <CBadge color="success" shape="rounded-pill" className="bg-opacity-10 text-success border border-success border-opacity-10">
                                            {safeSection.uniqueSubjects.length}
                                        </CBadge>
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {safeSection.uniqueSubjects.length > 0 ? (
                                            safeSection.uniqueSubjects.map((subject, i) => (
                                                <span key={i} className="badge bg-light-custom bg-opacity-25 text-success border border-success border-opacity-10 fw-medium py-2 px-3 rounded-pill">
                                                    {subject}
                                                </span>
                                            ))
                                        ) : <small className="text-muted-custom fst-italic">Sin asignar</small>}
                                    </div>
                                </div>
                            </CCol>
                            
                            <CCol md={4}>
                                <div className="p-4 bg-light-custom bg-opacity-10 border border-light-custom rounded-4 shadow-sm h-100">
                                    <h6 className="text-info fw-bold small text-uppercase border-bottom border-light-custom border-opacity-10 pb-3 mb-3 d-flex justify-content-between align-items-center">
                                        <span><CIcon icon={cilLocationPin} className="me-2" />Aulas</span>
                                        <CBadge color="info" shape="rounded-pill" className="bg-opacity-10 text-info border border-info border-opacity-10">
                                            {safeSection.uniqueClassrooms.length}
                                        </CBadge>
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {safeSection.uniqueClassrooms.length > 0 ? (
                                            safeSection.uniqueClassrooms.map((room, i) => (
                                                <span key={i} className="badge bg-light-custom bg-opacity-25 text-info border border-info border-opacity-10 fw-medium py-2 px-3 rounded-pill">
                                                    {room}
                                                </span>
                                            ))
                                        ) : <small className="text-muted-custom fst-italic">Sin asignar</small>}
                                    </div>
                                </div>
                            </CCol>
                        </CRow>
                    </CCol>

                    {/* HORARIO DETALLADO */}
                    <CCol md={12}>
                        <CCard className="border-0 shadow-lg premium-card overflow-hidden">
                            <div className="p-3 border-bottom border-light-custom border-opacity-10 bg-light-custom bg-opacity-25">
                                <h6 className="mb-0 header-title-custom fw-bold text-uppercase small ls-1 d-flex align-items-center">
                                    <CIcon icon={cilCalendar} className="me-2 text-primary" />
                                    Cronograma Semanal
                                </h6>
                            </div>
                            <CCardBody className="p-0">
                                {safeSection.schedules.length === 0 ? (
                                    <div className="text-center py-5 text-muted-custom bg-light-custom bg-opacity-10">
                                        <CIcon icon={cilCalendar} size="3xl" className="mb-3 opacity-25" />
                                        <p className="fw-medium">No hay horarios configurados</p>
                                    </div>
                                ) : (
                                    orderedDays.map(day => (
                                        schedulesByDay[day]?.length > 0 && (
                                            <div key={day} className="border-bottom border-light-custom border-opacity-10 last-border-0">
                                                <div className="px-4 py-2 bg-light-custom bg-opacity-10 border-bottom border-light-custom border-opacity-10">
                                                    <span className="text-primary fw-bold small text-uppercase ls-1">{day}</span>
                                                </div>
                                                <CTable hover responsive className="mb-0 align-middle bg-transparent">
                                                    <CTableBody>
                                                        {schedulesByDay[day].map(schedule => (
                                                            <CTableRow key={schedule.id} className="border-0">
                                                                <CTableDataCell className="ps-4 border-0" style={{ width: '20%' }}>
                                                                    <div className="d-flex align-items-center bg-light-custom bg-opacity-25 rounded-3 px-3 py-2 fit-content border border-light-custom shadow-sm">
                                                                        <CIcon icon={cilClock} size="sm" className="me-2 text-primary" />
                                                                        <span className="font-monospace fw-bold header-title-custom small">
                                                                            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                                                        </span>
                                                                    </div>
                                                                </CTableDataCell>
                                                                <CTableDataCell className="border-0" style={{ width: '25%' }}>
                                                                    <span className="fw-bold header-title-custom">{schedule.subject}</span>
                                                                </CTableDataCell>
                                                                <CTableDataCell className="border-0" style={{ width: '25%' }}>
                                                                    <div className="d-flex align-items-center text-muted-custom small fw-medium">
                                                                        <CIcon icon={cilUser} size="sm" className="me-1 text-primary opacity-75" />
                                                                        {schedule.teacherName}
                                                                    </div>
                                                                </CTableDataCell>
                                                                <CTableDataCell className="border-0" style={{ width: '20%' }}>
                                                                    <CBadge color="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-10 fw-bold px-3 py-2 text-uppercase">
                                                                        <CIcon icon={cilLocationPin} size="sm" className="me-1" />
                                                                        {schedule.classroom}
                                                                    </CBadge>
                                                                </CTableDataCell>
                                                                <CTableDataCell className="text-end pe-4 border-0" style={{ width: '10%' }}>
                                                                    <small className="text-muted-custom fw-bold">{calculateDuration(schedule.startTime, schedule.endTime)} min</small>
                                                                </CTableDataCell>
                                                            </CTableRow>
                                                        ))}
                                                    </CTableBody>
                                                </CTable>
                                            </div>
                                        )
                                    ))
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CModalBody>

            <CModalFooter className="bg-light-custom bg-opacity-10 border-top border-light-custom border-opacity-10">
                <CButton onClick={onClose} className="fw-bold px-4 py-2 btn-premium shadow-sm">
                    CERRAR VENTANA
                </CButton>
            </CModalFooter>

            <style>{`
                .fit-content { width: fit-content; }
                .ls-1 { letter-spacing: 1px; }
                .bg-orange-soft { background-color: rgba(242, 140, 15, 0.12); }
                .last-border-0:last-child { border-bottom: 0 !important; }
                .btn-premium { background: #E07A00; border: none; color: white; }
                .btn-premium:hover { background: #C66900; }
            `}</style>
        </CModal>
    );
};

export default InfoHorario;