import React, { useState, useEffect } from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CForm,
    CFormInput,
    CModalFooter,
    CButton,
    CFormSelect,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilCalendar,
    cilPlus,
    cilTrash,
    cilWarning,
    cilXCircle,
    cilSchool,
    cilClock,
    cilUser
} from '@coreui/icons'
import { checkClassroomAvailability } from 'src/services/schedules'

const DAYS_OF_WEEK = [
    { value: 'LUNES', label: 'Lunes' },
    { value: 'MARTES', label: 'Martes' },
    { value: 'MIÉRCOLES', label: 'Miércoles' },
    { value: 'JUEVES', label: 'Jueves' },
    { value: 'VIERNES', label: 'Viernes' }
]

const GRADE_LEVELS = [
    { value: 'Preparatorio', label: 'Preparatorio' },
    { value: '1er Grado', label: '1er Grado' },
    { value: '2do Grado', label: '2do Grado' },
    { value: '3er Grado', label: '3er Grado' },
    { value: '4to Grado', label: '4to Grado' },
    { value: '5to Grado', label: '5to Grado' },
    { value: '6to Grado', label: '6to Grado' },
    { value: '7mo Grado', label: '7mo Grado' },
    { value: '8vo Grado', label: '8vo Grado' }
]

const SUBJECTS = [
    { value: 'Danza Clásica', label: 'Danza Clásica' },
    { value: 'Danza Contemporánea', label: 'Danza Contemporánea' },
    { value: 'Danza Tradicional', label: 'Danza Tradicional' },
    { value: 'Danza Creativa', label: 'Danza Creativa' },
    { value: 'Preparación Física', label: 'Preparación Física' },
    { value: 'Música', label: 'Música' },
    { value: 'Historia de la Danza', label: 'Historia de la Danza' },
    { value: 'Nutrición', label: 'Nutrición' },
    { value: 'Kinesiología', label: 'Kinesiología' },
    { value: 'Francés', label: 'Francés' },
    { value: 'Composición Coreográfica', label: 'Composición Coreográfica' },
    { value: 'Danza de Carácter', label: 'Danza de Carácter' }
]

const CLASSROOMS = [
    { value: 'Salón Rosado', label: 'Salón Rosado' },
    { value: 'Salón Azul', label: 'Salón Azul' },
    { value: 'Salón Violeta', label: 'Salón Violeta' },
    { value: 'Salón Amarillo', label: 'Salón Amarillo' },
    { value: 'Salón Blanco', label: 'Salón Blanco' },
    { value: 'Salón Gris', label: 'Salón Gris' },
    { value: 'Salón de Colores 1', label: 'Salón de Colores 1' },
    { value: 'Salón de Colores 2', label: 'Salón de Colores 2' },
    { value: 'Salón Verde', label: 'Salón Verde' },
    { value: 'Patio', label: 'Patio' },
    { value: 'Tarima', label: 'Tarima' },
    { value: 'Placa I', label: 'Placa I' },
    { value: 'Placa II', label: 'Placa II' },
    { value: 'Placa III', label: 'Placa III' },
    { value: 'Salón Nutrición', label: 'Salón Nutrición' }
]

const HorarioForm = ({ visible, onClose, onSave, initial = null, academicYear }) => {
    const [sectionName, setSectionName] = useState('')
    const [gradeLevel, setGradeLevel] = useState('1er Grado')
    const [section, setSection] = useState('')
    const [errorModal, setErrorModal] = useState({ visible: false, message: '' })

    const [newSchedule, setNewSchedule] = useState({
        subject: 'Danza Clásica',
        teacherName: '',
        teacherId: '',
        dayOfWeek: 'LUNES',
        startTime: '14:00',
        endTime: '14:40',
        classroom: 'Salón Rosado'
    })

    const [schedules, setSchedules] = useState([])

    useEffect(() => {
        if (visible) {
            if (initial) {
                setSectionName(initial.sectionName || '')
                setGradeLevel(initial.gradeLevel || '1er Grado')
                setSection(initial.section || '')
                setSchedules(initial.schedules || [])
            } else {
                setSectionName('')
                setGradeLevel('1er Grado')
                setSection('')
                setSchedules([])
                setNewSchedule({
                    subject: 'Danza Clásica',
                    teacherName: '',
                    teacherId: '',
                    dayOfWeek: 'LUNES',
                    startTime: '14:00',
                    endTime: '14:40',
                    classroom: 'Salón Rosado'
                })
            }
        }
    }, [visible, initial])

    const isOverlapping = (start1, end1, start2, end2) => {
        return start1 < end2 && start2 < end1
    }

    const handleAddSchedule = async () => {
        if (!newSchedule.subject || !newSchedule.teacherName || !newSchedule.dayOfWeek ||
            !newSchedule.startTime || !newSchedule.endTime || !newSchedule.classroom) {
            setErrorModal({ visible: true, message: 'Por favor complete todos los campos del horario.' })
            return
        }

        if (newSchedule.startTime >= newSchedule.endTime) {
            setErrorModal({ visible: true, message: 'La hora de fin debe ser posterior a la hora de inicio.' })
            return
        }

        // 1. Verificar conflicto local
        const hasLocalConflict = schedules.some(s =>
            s.dayOfWeek === newSchedule.dayOfWeek &&
            s.classroom === newSchedule.classroom &&
            isOverlapping(s.startTime, s.endTime, newSchedule.startTime, newSchedule.endTime)
        )

        if (hasLocalConflict) {
            setErrorModal({ visible: true, message: `Conflicto Local: El aula ${newSchedule.classroom} ya está asignada en este horario para esta misma sección.` })
            return
        }

        // 2. Verificar conflicto global
        const currentYear = initial ? initial.academicYear : academicYear
        const Availability = await checkClassroomAvailability(
            currentYear,
            newSchedule.dayOfWeek,
            newSchedule.startTime,
            newSchedule.endTime,
            newSchedule.classroom,
            initial ? initial.id : null
        )

        if (!Availability.available) {
            const conflict = Availability.conflict
            setErrorModal({
                visible: true,
                message: (
                    <div className="text-start bg-light p-3 rounded-3 border border-danger border-opacity-25">
                        <div className="d-flex align-items-center mb-2 text-danger fw-bold">
                            <CIcon icon={cilWarning} className="me-2" />
                            ¡AULA OCUPADA!
                        </div>
                        <p className="mb-2 text-dark small">El aula <strong>{newSchedule.classroom}</strong> ya tiene una clase asignada:</p>
                        <ul className="mb-0 small text-muted ps-3">
                            <li><strong>Sección:</strong> {conflict.sectionName}</li>
                            <li><strong>Materia:</strong> {conflict.subject}</li>
                            <li><strong>Horario:</strong> {conflict.startTime} - {conflict.endTime}</li>
                        </ul>
                    </div>
                )
            })
            return
        }

        const scheduleId = Math.max(...schedules.map(s => s.id), 0) + 1
        setSchedules([...schedules, { id: scheduleId, ...newSchedule }])

        // Resetear parcialmente para facilitar la siguiente entrada
        setNewSchedule(prev => ({
            ...prev,
            startTime: prev.endTime, // Sugerir inicio donde terminó la anterior
            endTime: addMinutes(prev.endTime, 40) // Sugerir duración de 40 mins
        }))
    }

    // Helper simple para sumar minutos a hora HH:MM string
    const addMinutes = (time, minsToAdd) => {
        try {
            const [h, m] = time.split(':').map(Number);
            const date = new Date();
            date.setHours(h);
            date.setMinutes(m + minsToAdd);
            const newH = String(date.getHours()).padStart(2, '0');
            const newM = String(date.getMinutes()).padStart(2, '0');
            return `${newH}:${newM}`;
        } catch { return time; }
    }

    const handleRemoveSchedule = (id) => {
        setSchedules(schedules.filter(schedule => schedule.id !== id))
    }

    const calculateTotalHours = () => {
        if (schedules.length === 0) return 0
        let totalMinutes = 0
        schedules.forEach(schedule => {
            const start = new Date(`2000-01-01T${schedule.startTime}:00`)
            const end = new Date(`2000-01-01T${schedule.endTime}:00`)
            totalMinutes += (end - start) / (1000 * 60)
        })
        return Math.round(totalMinutes / 60)
    }

    const validateForm = () => {
        if (!sectionName.trim()) { alert('El nombre de la sección es obligatorio'); return false }
        if (!gradeLevel) { alert('El grado es obligatorio'); return false }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!validateForm()) return
        const payload = {
            sectionName: sectionName.trim(),
            gradeLevel,
            section: section.trim() || null,
            schedules,
            totalHoursPerWeek: calculateTotalHours(),
            academicYear: initial ? initial.academicYear : academicYear
        }
        await onSave(payload)
        onClose()
    }

    const formatTime = (time) => {
        if (!time) return ''
        const [hours, minutes] = time.split(':')
        // Convert to 12h format optionally if needed, for now 24h is standard
        return `${hours}:${minutes}`
    }

    return (
        <>
            <CModal size="xl" visible={visible} onClose={onClose} backdrop="static" className="premium-modal">
                <CModalHeader className="bg-primary text-white border-0 py-3">
                    <CModalTitle className="fw-bold d-flex align-items-center ls-1 small">
                        <CIcon icon={cilSchool} className="me-2" />
                        {initial ? 'EDITAR SECCIÓN' : 'NUEVA SECCIÓN ACADÉMICA'}
                    </CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit}>
                    <CModalBody className="p-4 bg-light-custom bg-opacity-10" style={{ maxHeight: '75vh', overflowY: 'auto' }}>

                        {/* SECCIÓN 1: DATOS GENERALES */}
                        <CCard className="border-0 shadow-lg mb-4 premium-card">
                            <CCardBody className="p-4">
                                <h6 className="mb-4 text-primary fw-bold text-uppercase small ls-1 border-bottom border-light-custom border-opacity-10 pb-3">
                                    Datos Generales
                                </h6>
                                <CRow className="g-4">
                                    <CCol md={5}>
                                        <CFormInput
                                            label={<span className="text-muted-custom small fw-bold text-uppercase ls-1">Nombre de la Sección</span>}
                                            placeholder="Ej: 1er Grado A"
                                            value={sectionName}
                                            onChange={(e) => setSectionName(e.target.value)}
                                            required
                                            className="bg-light-custom border-light-custom header-title-custom fw-bold shadow-sm py-2"
                                        />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormSelect
                                            label={<span className="text-muted-custom small fw-bold text-uppercase ls-1">Nivel Académico</span>}
                                            value={gradeLevel}
                                            onChange={(e) => setGradeLevel(e.target.value)}
                                            required
                                            className="bg-light-custom border-light-custom header-title-custom fw-bold shadow-sm py-2"
                                        >
                                            {GRADE_LEVELS.map(grade => (
                                                <option key={grade.value} value={grade.value} className="bg-dark">{grade.label}</option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={3}>
                                        <CFormInput
                                            label={<span className="text-muted-custom small fw-bold text-uppercase ls-1">Letra (Opcional)</span>}
                                            placeholder="A"
                                            value={section}
                                            onChange={(e) => setSection(e.target.value)}
                                            className="bg-light-custom border-light-custom header-title-custom text-center fw-bold shadow-sm py-2"
                                        />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>

                        {/* SECCIÓN 2: GESTOR DE HORARIOS */}
                        <CCard className="border-0 shadow-lg mb-4 overflow-hidden premium-card">
                            <div className="bg-orange-soft px-4 py-3 border-bottom border-warning border-opacity-10">
                                <h6 className="mb-0 text-primary fw-bold text-uppercase small ls-1 d-flex align-items-center">
                                    <CIcon icon={cilClock} className="me-2" />
                                    Gestor de Clases
                                </h6>
                            </div>
                            <CCardBody className="p-4 bg-light-custom bg-opacity-10">
                                <div className="p-4 bg-light-custom bg-opacity-25 rounded-4 mb-4 border border-light-custom shadow-sm">
                                    <CRow className="g-3 align-items-end">
                                        <CCol md={3}>
                                            <CFormSelect
                                                label={<span className="text-muted-custom small fw-bold text-uppercase" style={{ fontSize: '10px' }}>Asignatura</span>}
                                                value={newSchedule.subject}
                                                onChange={(e) => setNewSchedule({ ...newSchedule, subject: e.target.value })}
                                                className="bg-light-custom border-light-custom header-title-custom fw-bold py-2"
                                            >
                                                {SUBJECTS.map(subject => <option key={subject.value} value={subject.value} className="bg-dark">{subject.label}</option>)}
                                            </CFormSelect>
                                        </CCol>
                                        <CCol md={3}>
                                            <CFormSelect
                                                label={<span className="text-muted-custom small fw-bold text-uppercase" style={{ fontSize: '10px' }}>Día</span>}
                                                value={newSchedule.dayOfWeek}
                                                onChange={(e) => setNewSchedule({ ...newSchedule, dayOfWeek: e.target.value })}
                                                className="bg-light-custom border-light-custom header-title-custom fw-bold py-2"
                                            >
                                                {DAYS_OF_WEEK.map(day => <option key={day.value} value={day.value} className="bg-dark">{day.label}</option>)}
                                            </CFormSelect>
                                        </CCol>
                                        <CCol md={2}>
                                            <CFormInput
                                                label={<span className="text-muted-custom small fw-bold text-uppercase" style={{ fontSize: '10px' }}>Inicio</span>}
                                                type="time"
                                                value={newSchedule.startTime}
                                                onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                                                className="bg-light-custom border-light-custom header-title-custom fw-bold py-2"
                                            />
                                        </CCol>
                                        <CCol md={2}>
                                            <CFormInput
                                                label={<span className="text-muted-custom small fw-bold text-uppercase" style={{ fontSize: '10px' }}>Fin</span>}
                                                type="time"
                                                value={newSchedule.endTime}
                                                onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                                                className="bg-light-custom border-light-custom header-title-custom fw-bold py-2"
                                            />
                                        </CCol>
                                        <CCol md={2}>
                                            <CButton
                                                onClick={handleAddSchedule}
                                                className="w-100 fw-bold py-2 btn-premium shadow-sm mt-3"
                                            >
                                                <CIcon icon={cilPlus} className="me-2" /> AGREGAR
                                            </CButton>
                                        </CCol>

                                        <CCol md={12} className="mt-3 pt-3 border-top border-light-custom border-opacity-10">
                                            <CRow className="g-3">
                                                <CCol md={6}>
                                                    <CFormInput
                                                        placeholder="Nombre del Profesor"
                                                        value={newSchedule.teacherName}
                                                        onChange={(e) => setNewSchedule({ ...newSchedule, teacherName: e.target.value })}
                                                        autoComplete="off"
                                                        className="bg-light-custom border-light-custom header-title-custom fw-medium py-2 shadow-sm"
                                                    />
                                                </CCol>
                                                <CCol md={3}>
                                                    <CFormInput
                                                        placeholder="ID (Opcional)"
                                                        value={newSchedule.teacherId}
                                                        onChange={(e) => setNewSchedule({ ...newSchedule, teacherId: e.target.value })}
                                                        className="bg-light-custom border-light-custom header-title-custom fw-medium py-2 shadow-sm"
                                                    />
                                                </CCol>
                                                <CCol md={3}>
                                                    <CFormSelect
                                                        value={newSchedule.classroom}
                                                        onChange={(e) => setNewSchedule({ ...newSchedule, classroom: e.target.value })}
                                                        className="bg-light-custom border-light-custom header-title-custom fw-bold py-2 shadow-sm"
                                                    >
                                                        {CLASSROOMS.map(room => <option key={room.value} value={room.value} className="bg-dark">{room.label}</option>)}
                                                    </CFormSelect>
                                                </CCol>
                                            </CRow>
                                        </CCol>
                                    </CRow>
                                </div>

                                {schedules.length > 0 ? (
                                    <div className="table-responsive rounded-4 border border-light-custom overflow-hidden shadow-sm">
                                        <CTable hover align="middle" className="mb-0 bg-transparent">
                                            <CTableHead className="bg-light-custom bg-opacity-25 border-bottom border-light-custom border-opacity-10">
                                                <CTableRow>
                                                    <CTableHeaderCell className="text-muted-custom small text-uppercase fw-bold ps-4">Día</CTableHeaderCell>
                                                    <CTableHeaderCell className="text-muted-custom small text-uppercase fw-bold text-center">Horario</CTableHeaderCell>
                                                    <CTableHeaderCell className="text-muted-custom small text-uppercase fw-bold">Materia</CTableHeaderCell>
                                                    <CTableHeaderCell className="text-muted-custom small text-uppercase fw-bold">Profesor</CTableHeaderCell>
                                                    <CTableHeaderCell className="text-muted-custom small text-uppercase fw-bold">Aula</CTableHeaderCell>
                                                    <CTableHeaderCell className="text-end pe-4"></CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {schedules.map(schedule => (
                                                    <CTableRow key={schedule.id} className="border-0">
                                                        <CTableDataCell className="fw-bold text-primary ps-4 border-0">{schedule.dayOfWeek}</CTableDataCell>
                                                        <CTableDataCell className="text-center font-monospace border-0">
                                                            <div className="bg-light-custom bg-opacity-25 rounded-3 px-2 py-1 header-title-custom d-inline-block small shadow-sm border border-light-custom border-opacity-10">
                                                                {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                                            </div>
                                                        </CTableDataCell>
                                                        <CTableDataCell className="fw-bold header-title-custom border-0">{schedule.subject}</CTableDataCell>
                                                        <CTableDataCell className="small text-muted-custom fw-medium border-0">{schedule.teacherName}</CTableDataCell>
                                                        <CTableDataCell className="border-0">
                                                            <CBadge color="primary" className="fw-bold bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-2 text-uppercase" style={{ fontSize: '0.65rem' }}>
                                                                {schedule.classroom}
                                                            </CBadge>
                                                        </CTableDataCell>
                                                        <CTableDataCell className="text-end pe-4 border-0">
                                                            <CButton size="sm" color="transparent" className="text-danger hover-lift shadow-sm bg-light-custom bg-opacity-10 border-light-custom" onClick={() => handleRemoveSchedule(schedule.id)}>
                                                                <CIcon icon={cilTrash} />
                                                            </CButton>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ))}
                                            </CTableBody>
                                        </CTable>
                                    </div>
                                ) : (
                                    <div className="text-center py-5 bg-light-custom bg-opacity-10 rounded-4 border border-dashed text-muted-custom shadow-sm border-light-custom">
                                        <CIcon icon={cilCalendar} size="3xl" className="mb-3 opacity-25" />
                                        <p className="mb-0 fw-medium">No hay horarios asignados aún.</p>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>

                        <div className="d-flex justify-content-end text-muted-custom fw-bold small ls-1 text-uppercase">
                            <span className="me-4 d-flex align-items-center"><div className="bg-primary rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div> Total Clases: <strong className="ms-1 header-title-custom">{schedules.length}</strong></span>
                            <span className="d-flex align-items-center"><div className="bg-success rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div> Carga Horaria: <strong className="ms-1 header-title-custom">{calculateTotalHours()} hrs/sem</strong></span>
                        </div>
                    </CModalBody>
                    <CModalFooter className="bg-light-custom bg-opacity-10 border-top border-light-custom border-opacity-10">
                        <CButton
                            onClick={onClose}
                            className="fw-bold px-4 py-2 border-0 bg-transparent text-muted-custom hover-lift"
                        >
                            CANCELAR
                        </CButton>
                        <CButton
                            type="submit"
                            className={`px-4 py-2 fw-bold shadow-lg transition-all ${schedules.length === 0 ? 'opacity-50 grayscale' : 'hover-lift'}`}
                            disabled={schedules.length === 0}
                            style={{
                                background: schedules.length === 0
                                    ? '#4b5563'
                                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                border: 'none',
                                color: 'white',
                                borderRadius: '12px'
                            }}
                        >
                            <CIcon icon={cilPlus} className="me-2" />
                            {initial ? 'GUARDAR CAMBIOS' : 'CREAR SECCIÓN'}
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModal>

            {/* Modal de Error de Conflicto (Estilizado) */}
            <CModal
                visible={errorModal.visible}
                onClose={() => setErrorModal({ ...errorModal, visible: false })}
                alignment="center"
                className="premium-modal"
            >
                <div className="border-top border-4 border-danger rounded-top premium-card">
                    <CModalHeader className="border-0 pb-0 bg-transparent">
                        <CModalTitle className="text-danger fw-bold d-flex align-items-center ls-1 small">
                            <CIcon icon={cilWarning} className="me-2" />
                            CONFLICTO DE HORARIO
                        </CModalTitle>
                    </CModalHeader>
                    <CModalBody className="p-4 bg-transparent">
                        <div className="header-title-custom">
                            {errorModal.message}
                        </div>
                    </CModalBody>
                    <CModalFooter className="border-0 pt-0 bg-transparent">
                        <CButton className="btn-premium px-4" onClick={() => setErrorModal({ ...errorModal, visible: false })}>
                            ENTENDIDO
                        </CButton>
                    </CModalFooter>
                </div>
            </CModal>

            <style>{`
                .bg-orange-soft { background-color: rgba(242, 140, 15, 0.12); }
                .ls-1 { letter-spacing: 1px; }
                .transition-all { transition: all 0.3s ease; }
                .grayscale { filter: grayscale(1); }
                .hover-lift:hover { 
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
                }
                .last-border-0:last-child { border-bottom: 0 !important; }
            `}</style>
        </>
    )
}

export default HorarioForm