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
        <CModal size="xl" visible={visible} onClose={onClose} backdrop="static" className="premium-modal">
            <CModalHeader className="bg-primary text-white border-0 py-3">
                <CModalTitle className="fw-bold d-flex align-items-center ls-1 small">
                    <CIcon icon={cilRoom} className="me-2" />
                    DISPONIBILIDAD DE AULA
                </CModalTitle>
            </CModalHeader>
            <CModalBody className="p-4 bg-light-custom bg-opacity-10" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                {/* INFO DEL AULA */}
                <CCard className="border-0 shadow-lg mb-4 overflow-hidden premium-card">
                    <div className="bg-orange-soft px-4 py-3 border-bottom border-warning border-opacity-10">
                        <h6 className="mb-0 text-primary fw-bold text-uppercase small ls-1 d-flex align-items-center">
                            <CIcon icon={cilRoom} className="me-2" />
                            {aula?.name} - Ciclo {selectedYear}
                        </h6>
                    </div>
                    <CCardBody className="p-4">
                        <CRow className="g-3">
                            <CCol md={4}>
                                <div className="d-flex flex-column p-3 bg-light-custom bg-opacity-10 rounded-4 border border-light-custom shadow-sm">
                                    <span className="text-muted-custom small text-uppercase fw-bold ls-1" style={{ fontSize: '10px' }}>Tipo de Espacio</span>
                                    <strong className="fs-5 header-title-custom">{aula?.type}</strong>
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="d-flex flex-column p-3 bg-light-custom bg-opacity-10 rounded-4 border border-light-custom shadow-sm">
                                    <span className="text-muted-custom small text-uppercase fw-bold ls-1" style={{ fontSize: '10px' }}>Capacidad</span>
                                    <strong className="fs-5 text-primary">{aula?.capacity} personas</strong>
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="d-flex flex-column p-3 bg-light-custom bg-opacity-10 rounded-4 border border-light-custom shadow-sm">
                                    <span className="text-muted-custom small text-uppercase fw-bold ls-1" style={{ fontSize: '10px' }}>Total Clases</span>
                                    <strong className="fs-5 text-primary">{schedules.length}</strong>
                                </div>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>

                {schedules.length > 0 ? (
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
                                                {schedulesByDay[day].map((item, idx) => (
                                                    <CTableRow key={idx} className="border-0">
                                                        <CTableDataCell style={{ width: '20%' }} className="ps-4 border-0">
                                                            <div className="d-flex align-items-center bg-light-custom bg-opacity-25 rounded-3 px-3 py-2 fit-content border border-light-custom shadow-sm">
                                                                <CIcon icon={cilClock} size="sm" className="me-2 text-primary" />
                                                                <span className="font-monospace fw-bold header-title-custom small">
                                                                    {item.startTime} - {item.endTime}
                                                                </span>
                                                            </div>
                                                        </CTableDataCell>
                                                        <CTableDataCell style={{ width: '25%' }} className="border-0">
                                                            <div className="d-flex align-items-center">
                                                                <CIcon icon={cilBook} size="sm" className="me-2 text-primary" />
                                                                <span className="fw-bold header-title-custom">{item.subject}</span>
                                                            </div>
                                                        </CTableDataCell>
                                                        <CTableDataCell style={{ width: '25%' }} className="border-0">
                                                            <div>
                                                                <span className="fw-bold header-title-custom">{item.sectionName}</span>
                                                                <small className="d-block text-muted-custom fw-medium">{item.gradeLevel}</small>
                                                            </div>
                                                        </CTableDataCell>
                                                        <CTableDataCell style={{ width: '30%' }} className="pe-4 border-0">
                                                            <div className="d-flex align-items-center text-muted-custom small fw-medium">
                                                                <CIcon icon={cilUser} size="sm" className="me-1 text-primary opacity-75" />
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
                    <div className="text-center py-5 border border-dashed rounded-4 bg-light-custom bg-opacity-10 text-muted-custom shadow-sm border-light-custom">
                        <CIcon icon={cilClock} size="4xl" className="mb-3 opacity-25" />
                        <h5 className="header-title-custom">No hay clases programadas</h5>
                        <p className="mb-0">Este espacio está totalmente disponible para el ciclo {selectedYear}.</p>
                    </div>
                )}
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

ScheduleModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    aula: PropTypes.object,
    selectedYear: PropTypes.string,
    schedules: PropTypes.array.isRequired,
}

export default ScheduleModal
