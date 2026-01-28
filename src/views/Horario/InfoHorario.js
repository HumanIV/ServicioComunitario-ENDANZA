import React from 'react'
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
    CCardHeader,
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
    cilInfo,
    cilGroup,
    cilSchool
} from '@coreui/icons'

const InfoHorario = ({ visible, onClose, section }) => {
    if (!section) return null

    const formatTime = (time) => {
        if (!time) return ''
        const [hours, minutes] = time.split(':')
        return `${hours}:${minutes}`
    }

    const calculateDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return 0
        const start = new Date(`2000-01-01T${startTime}:00`)
        const end = new Date(`2000-01-01T${endTime}:00`)
        return (end - start) / (1000 * 60)
    }

    const orderedDays = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES']

    const sortedSchedules = [...section.schedules].sort((a, b) => {
        const dayA = orderedDays.indexOf(a.dayOfWeek)
        const dayB = orderedDays.indexOf(b.dayOfWeek)
        if (dayA !== dayB) return dayA - dayB
        return a.startTime.localeCompare(b.startTime)
    })

    const schedulesByDay = sortedSchedules.reduce((acc, schedule) => {
        if (!acc[schedule.dayOfWeek]) {
            acc[schedule.dayOfWeek] = []
        }
        acc[schedule.dayOfWeek].push(schedule)
        return acc
    }, {})

    const uniqueTeachers = [...new Set(section.schedules.map(s => s.teacherName))]
    const uniqueSubjects = [...new Set(section.schedules.map(s => s.subject))]
    const uniqueClassrooms = [...new Set(section.schedules.map(s => s.classroom))]

    return (
        <CModal size="xl" visible={visible} onClose={onClose} backdrop="static">
            <CModalHeader className="bg-primary text-white border-0">
                <CModalTitle className="fw-bold d-flex align-items-center">
                    <CIcon icon={cilCalendar} className="me-2" />
                    DETALLE DE HORARIO
                </CModalTitle>
            </CModalHeader>
            <CModalBody className="p-4 bg-light bg-opacity-10" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                <CRow className="g-4">
                    {/* INFO SECCION */}
                    <CCol md={12}>
                        <CCard className="border-0 shadow-sm mb-2 overflow-hidden">
                            <div className="bg-orange-soft px-4 py-3 border-bottom border-warning border-opacity-10">
                                <h6 className="mb-0 text-primary fw-bold text-uppercase small ls-1 d-flex align-items-center">
                                    <CIcon icon={cilSchool} className="me-2" />
                                    {section.sectionName} - {section.academicYear}
                                </h6>
                            </div>
                            <CCardBody className="p-4">
                                <CRow className="g-3">
                                    <CCol md={3}>
                                        <div className="d-flex flex-column">
                                            <span className="text-muted small text-uppercase fw-bold">Nivel Académico</span>
                                            <strong className="fs-5 text-dark">{section.gradeLevel}</strong>
                                        </div>
                                    </CCol>
                                    <CCol md={3}>
                                        <div className="d-flex flex-column">
                                            <span className="text-muted small text-uppercase fw-bold">ID Sección</span>
                                            <strong className="fs-5 text-dark">#{section.id}</strong>
                                        </div>
                                    </CCol>
                                    <CCol md={3}>
                                        <div className="d-flex flex-column">
                                            <span className="text-muted small text-uppercase fw-bold">Total Clases</span>
                                            <strong className="fs-5 text-primary">{section.schedules?.length || 0}</strong>
                                        </div>
                                    </CCol>
                                    <CCol md={3}>
                                        <div className="d-flex flex-column">
                                            <span className="text-muted small text-uppercase fw-bold">Carga Horaria</span>
                                            <strong className="fs-5 text-primary">{section.totalHoursPerWeek} hrs/sem</strong>
                                        </div>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>

                    {/* RESUMEN TARJETAS */}
                    <CCol md={12}>
                        <CRow className="g-3">
                            <CCol md={4}>
                                <div className="p-3 bg-white border border-light-subtle rounded-3 shadow-sm h-100">
                                    <h6 className="text-primary fw-bold small text-uppercase border-bottom pb-2 mb-2 d-flex justify-content-between">
                                        Profesores <CBadge color="primary" shape="rounded-pill">{uniqueTeachers.length}</CBadge>
                                    </h6>
                                    <div className="d-flex flex-wrap gap-1">
                                        {uniqueTeachers.length > 0 ? (
                                            uniqueTeachers.map((teacher, index) => (
                                                <span key={index} className="badge bg-light text-secondary border fw-normal py-1 px-2">{teacher}</span>
                                            ))
                                        ) : <small className="text-muted fst-italic">Sin asignar</small>}
                                    </div>
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="p-3 bg-white border border-light-subtle rounded-3 shadow-sm h-100">
                                    <h6 className="text-primary fw-bold small text-uppercase border-bottom pb-2 mb-2 d-flex justify-content-between">
                                        Asignaturas <CBadge color="success" shape="rounded-pill" className="text-white">{uniqueSubjects.length}</CBadge>
                                    </h6>
                                    <div className="d-flex flex-wrap gap-1">
                                        {uniqueSubjects.length > 0 ? (
                                            uniqueSubjects.map((subject, index) => (
                                                <span key={index} className="badge bg-light text-success border fw-normal py-1 px-2">{subject}</span>
                                            ))
                                        ) : <small className="text-muted fst-italic">Sin asignar</small>}
                                    </div>
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="p-3 bg-white border border-light-subtle rounded-3 shadow-sm h-100">
                                    <h6 className="text-primary fw-bold small text-uppercase border-bottom pb-2 mb-2 d-flex justify-content-between">
                                        Aulas <CBadge color="info" shape="rounded-pill" className="text-white">{uniqueClassrooms.length}</CBadge>
                                    </h6>
                                    <div className="d-flex flex-wrap gap-1">
                                        {uniqueClassrooms.length > 0 ? (
                                            uniqueClassrooms.map((room, index) => (
                                                <span key={index} className="badge bg-light text-info border fw-normal py-1 px-2">{room}</span>
                                            ))
                                        ) : <small className="text-muted fst-italic">Sin asignar</small>}
                                    </div>
                                </div>
                            </CCol>
                        </CRow>
                    </CCol>

                    {/* HORARIO DETALLADO */}
                    <CCol md={12}>
                        <CCard className="border-0 shadow-sm">
                            <div className="p-3 border-bottom bg-light">
                                <h6 className="mb-0 text-dark fw-bold text-uppercase small ls-1 d-flex align-items-center">
                                    <CIcon icon={cilCalendar} className="me-2" />
                                    Cronograma Semanal
                                </h6>
                            </div>
                            <CCardBody className="p-0">
                                {orderedDays.map(day => (
                                    schedulesByDay[day] && schedulesByDay[day].length > 0 && (
                                        <div key={day} className="border-bottom last-border-0">
                                            <div className="px-4 py-2 bg-light bg-opacity-25 border-bottom border-light">
                                                <span className="text-primary fw-bold small text-uppercase">{day}</span>
                                            </div>
                                            <CTable hover responsive className="mb-0 align-middle">
                                                <CTableBody>
                                                    {schedulesByDay[day].map(schedule => (
                                                        <CTableRow key={schedule.id}>
                                                            <CTableDataCell style={{ width: '20%' }} className="ps-4">
                                                                <div className="d-flex align-items-center bg-light rounded px-2 py-1 fit-content border d-inline-flex">
                                                                    <CIcon icon={cilClock} size="sm" className="me-2 text-muted" />
                                                                    <span className="font-monospace fw-bold text-dark small">
                                                                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                                                    </span>
                                                                </div>
                                                            </CTableDataCell>
                                                            <CTableDataCell style={{ width: '25%' }}>
                                                                <span className="fw-bold text-dark">{schedule.subject}</span>
                                                            </CTableDataCell>
                                                            <CTableDataCell style={{ width: '25%' }}>
                                                                <div className="d-flex align-items-center text-muted small">
                                                                    <CIcon icon={cilUser} size="sm" className="me-1" />
                                                                    {schedule.teacherName}
                                                                </div>
                                                            </CTableDataCell>
                                                            <CTableDataCell style={{ width: '20%' }}>
                                                                <CBadge color="info" className="bg-opacity-10 text-info border border-info border-opacity-25 fw-normal">
                                                                    <CIcon icon={cilLocationPin} size="sm" className="me-1" />
                                                                    {schedule.classroom}
                                                                </CBadge>
                                                            </CTableDataCell>
                                                            <CTableDataCell style={{ width: '10%' }} className="text-end pe-4">
                                                                <small className="text-muted">{calculateDuration(schedule.startTime, schedule.endTime)} min</small>
                                                            </CTableDataCell>
                                                        </CTableRow>
                                                    ))}
                                                </CTableBody>
                                            </CTable>
                                        </div>
                                    )
                                ))}
                                {sortedSchedules.length === 0 && (
                                    <div className="text-center py-5 text-muted">
                                        <CIcon icon={cilCalendar} size="3xl" className="mb-3 opacity-25" />
                                        <p>No hay horarios configurados para esta sección.</p>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter className="bg-white border-top">
                <CButton
                    onClick={onClose}
                    className="fw-bold px-4"
                    style={{
                        background: 'linear-gradient(135deg, #F28C0F 0%, #E07B00 100%)',
                        border: 'none',
                        color: 'white'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(242, 140, 15, 0.4)';
                        e.currentTarget.style.filter = 'brightness(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.filter = 'brightness(1)';
                    }}
                >
                    CERRAR VENTANA
                </CButton>
            </CModalFooter>
            <style>{`
                .fit-content { width: fit-content; }
                .ls-1 { letter-spacing: 1px; }
                .bg-orange-soft { background-color: rgba(242, 140, 15, 0.1); }
            `}</style>
        </CModal>
    )
}

export default InfoHorario