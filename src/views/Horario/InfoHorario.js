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
    CListGroup,
    CListGroupItem,
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
    cilGroup
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
        <CModal size="xl" visible={visible} onClose={onClose}>
            <CModalHeader>
                <CModalTitle>
                    <CIcon icon={cilCalendar} className="me-2" />
                    Horario Completo - {section.sectionName}
                </CModalTitle>
            </CModalHeader>
            <CModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <CRow className="g-3">
                    <CCol md={12}>
                        <CCard className="mb-4 border-secondary-subtle">
                            <CCardHeader className="bg-body-tertiary border-secondary-subtle">
                                <h6 className="mb-0">
                                    <CIcon icon={cilGroup} className="me-2 text-info" />
                                    Información de la Sección
                                </h6>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="g-3">
                                    <CCol md={6}>
                                        <div className="d-flex flex-column gap-2">
                                            <div className="d-flex justify-content-between">
                                                <span>Nombre de la Sección:</span>
                                                <strong>{section.sectionName}</strong>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>Grado:</span>
                                                <strong>{section.gradeLevel}</strong>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>Año Escolar:</span>
                                                <strong>{section.academicYear}</strong>
                                            </div>

                                        </div>
                                    </CCol>
                                    <CCol md={6}>
                                        <div className="d-flex flex-column gap-2">
                                            <div className="d-flex justify-content-between">
                                                <span>Total de Clases por Semana:</span>
                                                <strong>{section.schedules?.length || 0}</strong>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>Horas Totales por Semana:</span>
                                                <strong>{section.totalHoursPerWeek} horas</strong>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>ID de la Sección:</span>
                                                <strong>#{section.id}</strong>
                                            </div>

                                        </div>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>

                    <CCol md={12}>
                        <CCard className="mb-4 border-secondary-subtle">
                            <CCardHeader className="bg-body-tertiary border-secondary-subtle">
                                <h6 className="mb-0">
                                    <CIcon icon={cilCalendar} className="me-2 text-info" />
                                    Resumen del Horario
                                </h6>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="g-3">
                                    <CCol md={4}>
                                        <CCard className="border-secondary-subtle bg-body-tertiary">
                                            <CCardBody className="text-center py-3">
                                                <h6 className="text-info">Profesores</h6>
                                                <div className="mt-2">
                                                    {uniqueTeachers.length > 0 ? (
                                                        uniqueTeachers.map((teacher, index) => (
                                                            <div key={index} className="small text-body-secondary">
                                                                {teacher}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <small className="text-body-secondary">Sin profesores asignados</small>
                                                    )}
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                    <CCol md={4}>
                                        <CCard className="border-secondary-subtle bg-body-tertiary">
                                            <CCardBody className="text-center py-3">
                                                <h6 className="text-info">Asignaturas</h6>
                                                <div className="mt-2">
                                                    {uniqueSubjects.length > 0 ? (
                                                        uniqueSubjects.map((subject, index) => (
                                                            <div key={index} className="small text-body-secondary">
                                                                {subject}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <small className="text-body-secondary">Sin asignaturas</small>
                                                    )}
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                    <CCol md={4}>
                                        <CCard className="border-secondary-subtle bg-body-tertiary">
                                            <CCardBody className="text-center py-3">
                                                <h6 className="text-info">Aulas Utilizadas</h6>
                                                <div className="mt-2">
                                                    {uniqueClassrooms.length > 0 ? (
                                                        uniqueClassrooms.map((classroom, index) => (
                                                            <div key={index} className="small text-body-secondary">
                                                                {classroom}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <small className="text-body-secondary">Sin aulas asignadas</small>
                                                    )}
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>

                    <CCol md={12}>
                        <CCard className="border-secondary-subtle">
                            <CCardHeader className="bg-body-tertiary border-secondary-subtle">
                                <h6 className="mb-0">
                                    <CIcon icon={cilCalendar} className="me-2 text-info" />
                                    Horario Semanal Detallado
                                </h6>
                            </CCardHeader>
                            <CCardBody>
                                {orderedDays.map(day => (
                                    <div key={day} className="mb-4">
                                        <h6 className="text-primary mb-3">
                                            {day === 'LUNES' ? 'Lunes' :
                                                day === 'MARTES' ? 'Martes' :
                                                    day === 'MIÉRCOLES' ? 'Miércoles' :
                                                        day === 'JUEVES' ? 'Jueves' :
                                                            'Viernes'}
                                        </h6>

                                        {schedulesByDay[day] && schedulesByDay[day].length > 0 ? (
                                            <CTable responsive bordered hover className="border-secondary-subtle">
                                                <CTableHead color="dark">
                                                    <CTableRow>
                                                        <CTableHeaderCell style={{ width: '20%' }}>Horario</CTableHeaderCell>
                                                        <CTableHeaderCell style={{ width: '25%' }}>Asignatura</CTableHeaderCell>
                                                        <CTableHeaderCell style={{ width: '25%' }}>Profesor</CTableHeaderCell>
                                                        <CTableHeaderCell style={{ width: '20%' }}>Aula</CTableHeaderCell>
                                                        <CTableHeaderCell style={{ width: '10%' }}>Duración</CTableHeaderCell>
                                                    </CTableRow>
                                                </CTableHead>
                                                <CTableBody>
                                                    {schedulesByDay[day].map(schedule => (
                                                        <CTableRow key={schedule.id}>
                                                            <CTableDataCell>
                                                                <div className="fw-semibold">
                                                                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                                                </div>
                                                            </CTableDataCell>
                                                            <CTableDataCell>
                                                                <div className="d-flex align-items-center">
                                                                    <CIcon icon={cilBook} className="me-2 text-primary" size="sm" />
                                                                    {schedule.subject}
                                                                </div>
                                                            </CTableDataCell>
                                                            <CTableDataCell>
                                                                <div className="d-flex align-items-center">
                                                                    <CIcon icon={cilUser} className="me-2 text-primary" size="sm" />
                                                                    {schedule.teacherName}
                                                                    {schedule.teacherId && (
                                                                        <small className="text-muted ms-2">(ID: #{schedule.teacherId})</small>
                                                                    )}
                                                                </div>
                                                            </CTableDataCell>
                                                            <CTableDataCell>
                                                                <div className="d-flex align-items-center">
                                                                    <CIcon icon={cilLocationPin} className="me-2 text-primary" size="sm" />
                                                                    {schedule.classroom}
                                                                </div>
                                                            </CTableDataCell>
                                                            <CTableDataCell>
                                                                <div className="text-center">
                                                                    <CBadge color="info" className="px-2">
                                                                        {calculateDuration(schedule.startTime, schedule.endTime)} min
                                                                    </CBadge>
                                                                </div>
                                                            </CTableDataCell>
                                                        </CTableRow>
                                                    ))}
                                                </CTableBody>
                                            </CTable>
                                        ) : (
                                            <div className="text-center p-4 border rounded bg-body-tertiary">
                                                <CIcon icon={cilCalendar} className="text-secondary opacity-50 mb-2" size="xl" />
                                                <p className="text-body-secondary mb-0">No hay clases programadas para este día</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </CCardBody>
                        </CCard>
                    </CCol>

                    <CCol md={12}>
                        <CCard className="border-secondary-subtle mt-4">
                            <CCardHeader className="bg-body-tertiary border-secondary-subtle">
                                <h6 className="mb-0">
                                    <CIcon icon={cilInfo} className="me-2 text-info" />
                                    Estadísticas del Horario
                                </h6>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="g-3">
                                    <CCol md={3}>
                                        <div className="text-center p-3 border rounded border-secondary-subtle bg-body-tertiary">
                                            <h4 className="text-info mb-1">{section.schedules?.length || 0}</h4>
                                            <small className="text-body-secondary">Clases por semana</small>
                                        </div>
                                    </CCol>
                                    <CCol md={3}>
                                        <div className="text-center p-3 border rounded border-secondary-subtle bg-body-tertiary">
                                            <h4 className="text-info mb-1">{section.totalHoursPerWeek}</h4>
                                            <small className="text-body-secondary">Horas totales</small>
                                        </div>
                                    </CCol>
                                    <CCol md={3}>
                                        <div className="text-center p-3 border rounded border-secondary-subtle bg-body-tertiary">
                                            <h4 className="text-info mb-1">{uniqueSubjects.length}</h4>
                                            <small className="text-body-secondary">Asignaturas diferentes</small>
                                        </div>
                                    </CCol>
                                    <CCol md={3}>
                                        <div className="text-center p-3 border rounded border-secondary-subtle bg-body-tertiary">
                                            <h4 className="text-info mb-1">{uniqueTeachers.length}</h4>
                                            <small className="text-body-secondary">Profesores asignados</small>
                                        </div>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>
                    Cerrar
                </CButton>
            </CModalFooter>
        </CModal>
    )
}

export default InfoHorario