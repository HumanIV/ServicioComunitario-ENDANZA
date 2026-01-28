import React from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CBadge,
    CButton,
    CCard,
    CCardBody,
    CRow,
    CCol
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilClock, cilRoom, cilBook, cilUser } from '@coreui/icons'
import PropTypes from 'prop-types'

const ScheduleModal = ({ visible, onClose, aula, selectedYear, schedules }) => {
    // Agrupar por día
    const orderedDays = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES']
    const schedulesByDay = schedules.reduce((acc, schedule) => {
        if (!acc[schedule.dayOfWeek]) {
            acc[schedule.dayOfWeek] = []
        }
        acc[schedule.dayOfWeek].push(schedule)
        return acc
    }, {})

    return (
        <CModal size="xl" visible={visible} onClose={onClose} backdrop="static">
            <CModalHeader className="bg-primary text-white border-0">
                <CModalTitle className="fw-bold d-flex align-items-center">
                    <CIcon icon={cilRoom} className="me-2" />
                    DISPONIBILIDAD DE AULA
                </CModalTitle>
            </CModalHeader>
            <CModalBody className="p-4 bg-light bg-opacity-10" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                {/* INFO DEL AULA */}
                <CCard className="border-0 shadow-sm mb-4 overflow-hidden">
                    <div className="bg-orange-soft px-4 py-3 border-bottom border-warning border-opacity-10">
                        <h6 className="mb-0 text-primary fw-bold text-uppercase small ls-1 d-flex align-items-center">
                            <CIcon icon={cilRoom} className="me-2" />
                            {aula?.name} - Ciclo {selectedYear}
                        </h6>
                    </div>
                    <CCardBody className="p-4">
                        <CRow className="g-3">
                            <CCol md={4}>
                                <div className="d-flex flex-column">
                                    <span className="text-muted small text-uppercase fw-bold">Tipo de Espacio</span>
                                    <strong className="fs-5 text-dark">{aula?.type}</strong>
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="d-flex flex-column">
                                    <span className="text-muted small text-uppercase fw-bold">Capacidad</span>
                                    <strong className="fs-5 text-primary">{aula?.capacity} personas</strong>
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="d-flex flex-column">
                                    <span className="text-muted small text-uppercase fw-bold">Total Clases</span>
                                    <strong className="fs-5 text-primary">{schedules.length}</strong>
                                </div>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>

                {schedules.length > 0 ? (
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
                                                {schedulesByDay[day].map((item, idx) => (
                                                    <CTableRow key={idx}>
                                                        <CTableDataCell style={{ width: '20%' }} className="ps-4">
                                                            <div className="d-flex align-items-center bg-light rounded px-2 py-1 fit-content border d-inline-flex">
                                                                <CIcon icon={cilClock} size="sm" className="me-2 text-muted" />
                                                                <span className="font-monospace fw-bold text-dark small">
                                                                    {item.startTime} - {item.endTime}
                                                                </span>
                                                            </div>
                                                        </CTableDataCell>
                                                        <CTableDataCell style={{ width: '25%' }}>
                                                            <div className="d-flex align-items-center">
                                                                <CIcon icon={cilBook} size="sm" className="me-2 text-primary" />
                                                                <span className="fw-bold text-dark">{item.subject}</span>
                                                            </div>
                                                        </CTableDataCell>
                                                        <CTableDataCell style={{ width: '25%' }}>
                                                            <div>
                                                                <span className="fw-semibold text-dark">{item.sectionName}</span>
                                                                <small className="d-block text-muted">{item.gradeLevel}</small>
                                                            </div>
                                                        </CTableDataCell>
                                                        <CTableDataCell style={{ width: '30%' }} className="pe-4">
                                                            <div className="d-flex align-items-center text-muted small">
                                                                <CIcon icon={cilUser} size="sm" className="me-1" />
                                                                {item.teacherName}
                                                            </div>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ))}
                                            </CTableBody>
                                        </CTable>
                                    </div>
                                )
                            ))}
                        </CCardBody>
                    </CCard>
                ) : (
                    <div className="text-center py-5 border border-dashed rounded-4 bg-light text-muted">
                        <CIcon icon={cilClock} size="4xl" className="mb-3 opacity-25" />
                        <h5>No hay clases programadas</h5>
                        <p className="mb-0">Este espacio está totalmente disponible para el ciclo {selectedYear}.</p>
                    </div>
                )}
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

ScheduleModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    aula: PropTypes.object,
    selectedYear: PropTypes.string,
    schedules: PropTypes.array.isRequired,
}

export default ScheduleModal
