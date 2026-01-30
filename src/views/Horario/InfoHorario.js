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
        <CModal size="xl" visible={visible} onClose={onClose} backdrop="static" className="premium-modal">
            <CModalHeader className="bg-primary text-white border-0 py-3">
                <CModalTitle className="fw-bold d-flex align-items-center ls-1 small">
                    <CIcon icon={cilCalendar} className="me-2" />
                    DETALLE DE HORARIO
                </CModalTitle>
            </CModalHeader>
            <CModalBody className="p-4 bg-light-custom bg-opacity-10" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                <CRow className="g-4">
                    {/* INFO SECCION */}
                    <CCol md={12}>
                        <CCard className="border-0 shadow-lg mb-2 overflow-hidden premium-card">
                            <div className="bg-orange-soft px-4 py-3 border-bottom border-warning border-opacity-10">
                                <h6 className="mb-0 text-primary fw-bold text-uppercase small ls-1 d-flex align-items-center">
                                    <CIcon icon={cilSchool} className="me-2" />
                                    {section.sectionName} - {section.academicYear}
                                </h6>
                            </div>
                            <CCardBody className="p-4">
                                <CRow className="g-3">
                                    <CCol md={3}>
                                        <div className="d-flex flex-column p-3 bg-light-custom bg-opacity-10 rounded-4 border border-light-custom shadow-sm">
                                            <span className="text-muted-custom small text-uppercase fw-bold ls-1" style={{ fontSize: '10px' }}>Nivel Académico</span>
                                            <strong className="fs-5 header-title-custom">{section.gradeLevel}</strong>
                                        </div>
                                    </CCol>
                                    <CCol md={3}>
                                        <div className="d-flex flex-column p-3 bg-light-custom bg-opacity-10 rounded-4 border border-light-custom shadow-sm">
                                            <span className="text-muted-custom small text-uppercase fw-bold ls-1" style={{ fontSize: '10px' }}>ID Sección</span>
                                            <strong className="fs-5 header-title-custom">#{section.id}</strong>
                                        </div>
                                    </CCol>
                                    <CCol md={3}>
                                        <div className="d-flex flex-column p-3 bg-light-custom bg-opacity-10 rounded-4 border border-light-custom shadow-sm">
                                            <span className="text-muted-custom small text-uppercase fw-bold ls-1" style={{ fontSize: '10px' }}>Total Clases</span>
                                            <strong className="fs-5 text-primary">{section.schedules?.length || 0}</strong>
                                        </div>
                                    </CCol>
                                    <CCol md={3}>
                                        <div className="d-flex flex-column p-3 bg-light-custom bg-opacity-10 rounded-4 border border-light-custom shadow-sm">
                                            <span className="text-muted-custom small text-uppercase fw-bold ls-1" style={{ fontSize: '10px' }}>Carga Horaria</span>
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
                                <div className="p-4 bg-light-custom bg-opacity-10 border border-light-custom rounded-4 shadow-sm h-100">
                                    <h6 className="text-primary fw-bold small text-uppercase border-bottom border-light-custom border-opacity-10 pb-3 mb-3 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <CIcon icon={cilGroup} className="me-2" />
                                            Profesores
                                        </div>
                                        <CBadge color="primary" shape="rounded-pill" className="bg-opacity-10 text-primary border border-primary border-opacity-10">{uniqueTeachers.length}</CBadge>
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {uniqueTeachers.length > 0 ? (
                                            uniqueTeachers.map((teacher, index) => (
                                                <span key={index} className="badge bg-light-custom bg-opacity-25 text-muted-custom border border-light-custom fw-medium py-2 px-3 rounded-pill">{teacher}</span>
                                            ))
                                        ) : <small className="text-muted-custom fst-italic">Sin asignar</small>}
                                    </div>
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="p-4 bg-light-custom bg-opacity-10 border border-light-custom rounded-4 shadow-sm h-100">
                                    <h6 className="text-success fw-bold small text-uppercase border-bottom border-light-custom border-opacity-10 pb-3 mb-3 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <CIcon icon={cilBook} className="me-2" />
                                            Asignaturas
                                        </div>
                                        <CBadge color="success" shape="rounded-pill" className="bg-opacity-10 text-success border border-success border-opacity-10">{uniqueSubjects.length}</CBadge>
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {uniqueSubjects.length > 0 ? (
                                            uniqueSubjects.map((subject, index) => (
                                                <span key={index} className="badge bg-light-custom bg-opacity-25 text-success border border-success border-opacity-10 fw-medium py-2 px-3 rounded-pill">{subject}</span>
                                            ))
                                        ) : <small className="text-muted-custom fst-italic">Sin asignar</small>}
                                    </div>
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="p-4 bg-light-custom bg-opacity-10 border border-light-custom rounded-4 shadow-sm h-100">
                                    <h6 className="text-info fw-bold small text-uppercase border-bottom border-light-custom border-opacity-10 pb-3 mb-3 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <CIcon icon={cilLocationPin} className="me-2" />
                                            Aulas
                                        </div>
                                        <CBadge color="info" shape="rounded-pill" className="bg-opacity-10 text-info border border-info border-opacity-10">{uniqueClassrooms.length}</CBadge>
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {uniqueClassrooms.length > 0 ? (
                                            uniqueClassrooms.map((room, index) => (
                                                <span key={index} className="badge bg-light-custom bg-opacity-25 text-info border border-info border-opacity-10 fw-medium py-2 px-3 rounded-pill">{room}</span>
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
                                {orderedDays.map(day => (
                                    schedulesByDay[day] && schedulesByDay[day].length > 0 && (
                                        <div key={day} className="border-bottom border-light-custom border-opacity-10 last-border-0">
                                            <div className="px-4 py-2 bg-light-custom bg-opacity-10 border-bottom border-light-custom border-opacity-10">
                                                <span className="text-primary fw-bold small text-uppercase ls-1">{day}</span>
                                            </div>
                                            <CTable hover responsive className="mb-0 align-middle bg-transparent">
                                                <CTableBody>
                                                    {schedulesByDay[day].map(schedule => (
                                                        <CTableRow key={schedule.id} className="border-0">
                                                            <CTableDataCell style={{ width: '20%' }} className="ps-4 border-0">
                                                                <div className="d-flex align-items-center bg-light-custom bg-opacity-25 rounded-3 px-3 py-2 fit-content border border-light-custom shadow-sm">
                                                                    <CIcon icon={cilClock} size="sm" className="me-2 text-primary" />
                                                                    <span className="font-monospace fw-bold header-title-custom small">
                                                                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                                                    </span>
                                                                </div>
                                                            </CTableDataCell>
                                                            <CTableDataCell style={{ width: '25%' }} className="border-0">
                                                                <span className="fw-bold header-title-custom">{schedule.subject}</span>
                                                            </CTableDataCell>
                                                            <CTableDataCell style={{ width: '25%' }} className="border-0">
                                                                <div className="d-flex align-items-center text-muted-custom small fw-medium">
                                                                    <CIcon icon={cilUser} size="sm" className="me-1 text-primary opacity-75" />
                                                                    {schedule.teacherName}
                                                                </div>
                                                            </CTableDataCell>
                                                            <CTableDataCell style={{ width: '20%' }} className="border-0">
                                                                <CBadge color="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-10 fw-bold px-3 py-2 text-uppercase" style={{ fontSize: '0.65rem' }}>
                                                                    <CIcon icon={cilLocationPin} size="sm" className="me-1" />
                                                                    {schedule.classroom}
                                                                </CBadge>
                                                            </CTableDataCell>
                                                            <CTableDataCell style={{ width: '10%' }} className="text-end pe-4 border-0">
                                                                <small className="text-muted-custom fw-bold">{calculateDuration(schedule.startTime, schedule.endTime)} min</small>
                                                            </CTableDataCell>
                                                        </CTableRow>
                                                    ))}
                                                </CTableBody>
                                            </CTable>
                                        </div>
                                    )
                                ))}
                                {sortedSchedules.length === 0 && (
                                    <div className="text-center py-5 text-muted-custom bg-light-custom bg-opacity-10">
                                        <CIcon icon={cilCalendar} size="3xl" className="mb-3 opacity-25" />
                                        <p className="fw-medium">No hay horarios configurados para esta sección.</p>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter className="bg-light-custom bg-opacity-10 border-top border-light-custom border-opacity-10">
                <CButton
                    onClick={onClose}
                    className="fw-bold px-4 py-2 btn-premium shadow-sm"
                >
                    CERRAR VENTANA
                </CButton>
            </CModalFooter>
            <style>{`
                .fit-content { width: fit-content; }
                .ls-1 { letter-spacing: 1px; }
                .bg-orange-soft { background-color: rgba(242, 140, 15, 0.12); }
                .last-border-0:last-child { border-bottom: 0 !important; }
            `}</style>
        </CModal>
    )
}

export default InfoHorario