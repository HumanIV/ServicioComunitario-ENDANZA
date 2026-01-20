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
    CFormTextarea,
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
    cilPlus,
    cilTrash
} from '@coreui/icons'

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

    const handleAddSchedule = () => {
        if (!newSchedule.subject || !newSchedule.teacherName || !newSchedule.dayOfWeek ||
            !newSchedule.startTime || !newSchedule.endTime || !newSchedule.classroom) {
            alert('Por favor complete todos los campos del horario')
            return
        }

        if (newSchedule.startTime >= newSchedule.endTime) {
            alert('La hora de fin debe ser posterior a la hora de inicio')
            return
        }

        const scheduleId = Math.max(...schedules.map(s => s.id), 0) + 1
        setSchedules([...schedules, { id: scheduleId, ...newSchedule }])

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
        if (!sectionName.trim()) {
            alert('El nombre de la sección es obligatorio')
            return false
        }
        if (!gradeLevel) {
            alert('El grado es obligatorio')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!validateForm()) {
            return
        }

        const payload = {
            sectionName: sectionName.trim(),
            gradeLevel,
            section: section.trim() || null,
            schedules,
            totalHoursPerWeek: calculateTotalHours(),
            academicYear: initial ? initial.academicYear : academicYear
        }

        console.log('Guardando sección con horarios:', payload)
        await onSave(payload)
        onClose()
    }

    const formatTime = (time) => {
        if (!time) return ''
        const [hours, minutes] = time.split(':')
        return `${hours}:${minutes}`
    }

    return (
        <CModal size="xl" visible={visible} onClose={onClose}>
            <CModalHeader>
                <CModalTitle>
                    {initial ? 'Editar Sección y Horario' : 'Nueva Sección y Horario'}
                </CModalTitle>
            </CModalHeader>
            <CForm onSubmit={handleSubmit}>
                <CModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <h6 className="mb-3 text-primary">
                        <CIcon icon={cilCalendar} className="me-2" />
                        Información de la Sección
                    </h6>

                    <CRow className="g-3">
                        <CCol md={6}>
                            <CFormInput
                                label="Nombre de la Sección *"
                                placeholder="Ej: 1er Grado A, Preparatorio, 2do Grado"
                                value={sectionName}
                                onChange={(e) => setSectionName(e.target.value)}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormSelect
                                label="Grado *"
                                value={gradeLevel}
                                onChange={(e) => setGradeLevel(e.target.value)}
                                required
                            >
                                {GRADE_LEVELS.map(grade => (
                                    <option key={grade.value} value={grade.value}>
                                        {grade.label}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <div className="mt-3">
                        <CFormInput
                            label="Sección (opcional)"
                            placeholder="A, B, C (dejar vacío si no aplica)"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                        />
                    </div>

                    <h6 className="mb-3 mt-4 text-primary">
                        Agregar Horarios a la Sección
                    </h6>

                    <CCard className="mb-4 border-secondary-subtle">
                        <CCardBody className="bg-body-tertiary">
                            <CRow className="g-3">
                                <CCol md={3}>
                                    <CFormSelect
                                        label="Asignatura"
                                        value={newSchedule.subject}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, subject: e.target.value })}
                                    >
                                        {SUBJECTS.map(subject => (
                                            <option key={subject.value} value={subject.value}>
                                                {subject.label}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CCol>
                                <CCol md={3}>
                                    <CFormSelect
                                        label="Día"
                                        value={newSchedule.dayOfWeek}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, dayOfWeek: e.target.value })}
                                    >
                                        {DAYS_OF_WEEK.map(day => (
                                            <option key={day.value} value={day.value}>
                                                {day.label}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CCol>
                                <CCol md={2}>
                                    <CFormInput
                                        label="Hora Inicio"
                                        type="time"
                                        value={newSchedule.startTime}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                                    />
                                </CCol>
                                <CCol md={2}>
                                    <CFormInput
                                        label="Hora Fin"
                                        type="time"
                                        value={newSchedule.endTime}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                                    />
                                </CCol>
                                <CCol md={2}>
                                    <CButton
                                        color="primary"
                                        variant="outline"
                                        onClick={handleAddSchedule}
                                        className="mt-4"
                                        style={{ width: '100%' }}
                                    >
                                        <CIcon icon={cilPlus} /> Agregar
                                    </CButton>
                                </CCol>
                            </CRow>

                            <CRow className="g-3 mt-3">
                                <CCol md={6}>
                                    <CFormInput
                                        label="Nombre del Profesor *"
                                        placeholder="Nombre completo"
                                        value={newSchedule.teacherName}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, teacherName: e.target.value })}
                                    />
                                </CCol>
                                <CCol md={3}>
                                    <CFormInput
                                        label="ID Profesor"
                                        placeholder="123"
                                        type="number"
                                        value={newSchedule.teacherId}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, teacherId: e.target.value })}
                                    />
                                </CCol>
                                <CCol md={3}>
                                    <CFormSelect
                                        label="Aula"
                                        value={newSchedule.classroom}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, classroom: e.target.value })}
                                    >
                                        {CLASSROOMS.map(room => (
                                            <option key={room.value} value={room.value}>
                                                {room.label}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>

                    <h6 className="mb-3 text-primary">
                        Horarios Programados ({schedules.length} clases, {calculateTotalHours()} horas totales)
                    </h6>

                    {schedules.length > 0 ? (
                        <CCard className="mb-4 border-secondary-subtle">
                            <CCardBody className="p-0">
                                <CTable responsive bordered hover className="mb-0 border-secondary-subtle">
                                    <CTableHead color="dark">
                                        <CTableRow>
                                            <CTableHeaderCell>Día</CTableHeaderCell>
                                            <CTableHeaderCell>Horario</CTableHeaderCell>
                                            <CTableHeaderCell>Asignatura</CTableHeaderCell>
                                            <CTableHeaderCell>Profesor</CTableHeaderCell>
                                            <CTableHeaderCell>Aula</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: '80px' }}>Acciones</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {schedules.map(schedule => (
                                            <CTableRow key={schedule.id}>
                                                <CTableDataCell>
                                                    <div className="fw-semibold">
                                                        {schedule.dayOfWeek}
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {schedule.subject}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {schedule.teacherName}
                                                    {schedule.teacherId && (
                                                        <small className="text-muted ms-1">(ID: {schedule.teacherId})</small>
                                                    )}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {schedule.classroom}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-center">
                                                    <CButton
                                                        size="sm"
                                                        color="danger"
                                                        variant="outline"
                                                        onClick={() => handleRemoveSchedule(schedule.id)}
                                                    >
                                                        <CIcon icon={cilTrash} />
                                                    </CButton>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </CCardBody>
                        </CCard>
                    ) : (
                        <div className="text-center p-4 border rounded bg-body-tertiary mb-4">
                            <CIcon icon={cilCalendar} className="text-secondary opacity-50 mb-2" size="xl" />
                            <p className="text-body-secondary mb-0">No hay horarios programados aún. Agrega clases usando el formulario anterior.</p>
                        </div>
                    )}

                    <div className="mt-3">
                        <small className="text-muted">* Campos obligatorios</small>
                    </div>
                </CModalBody>
                <CModalFooter className="border-top-0 pt-0">
                    <CButton type="submit" color="success" disabled={schedules.length === 0} className="px-4 fw-bold">
                        {initial ? 'Actualizar' : 'Crear'} Sección y Horario
                    </CButton>
                    <CButton type="button" color="secondary" variant="ghost" onClick={onClose} className="ms-auto fw-bold">
                        Cancelar
                    </CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    )
}

export default HorarioForm