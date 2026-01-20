import React, { useEffect, useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CContainer,
    CBadge,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CFormSelect,
    CSpinner,
    CInputGroup,
    CInputGroupText,
    CFormInput
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilRoom,
    cilClock,
    cilInfo,
    cilSearch,
    cilCalendar,
    cilLocationPin
} from '@coreui/icons'
import { listClassrooms, updateClassroom, CLASSROOM_TYPES } from 'src/services/classrooms'
import { listSections, getAvailableYears } from 'src/services/schedules'

const Aulas = () => {
    const [classrooms, setClassrooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedAula, setSelectedAula] = useState(null)
    const [showSchedule, setShowSchedule] = useState(false)
    const [aulaSchedules, setAulaSchedules] = useState([])
    const [academicYears, setAcademicYears] = useState([])
    const [selectedYear, setSelectedYear] = useState('2025-2026')

    useEffect(() => {
        loadInitialData()
    }, [])

    const loadInitialData = async () => {
        setLoading(true)
        try {
            const [rooms, years] = await Promise.all([
                listClassrooms(),
                getAvailableYears()
            ])
            setClassrooms(rooms)
            setAcademicYears(years)
            if (years.length > 0) setSelectedYear(years[0])
        } catch (error) {
            console.error("Error loading classrooms data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSeeSchedule = async (aula) => {
        setSelectedAula(aula)
        try {
            const sections = await listSections({ academicYear: selectedYear })
            const extractedSchedules = []

            sections.forEach(section => {
                section.schedules.forEach(sched => {
                    if (sched.classroom === aula.name) {
                        extractedSchedules.push({
                            ...sched,
                            sectionName: section.sectionName,
                            gradeLevel: section.gradeLevel
                        })
                    }
                })
            })

            // Ordenar por día y hora
            const daysOrder = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES']
            extractedSchedules.sort((a, b) => {
                const dayDiff = daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek)
                if (dayDiff !== 0) return dayDiff
                return a.startTime.localeCompare(b.startTime)
            })

            setAulaSchedules(extractedSchedules)
            setShowSchedule(true)
        } catch (error) {
            console.error("Error fetching schedules for aula:", error)
        }
    }

    const handleTypeChange = async (aulaId, newType) => {
        try {
            await updateClassroom(aulaId, { type: newType })
            const updatedRooms = classrooms.map(c => c.id === aulaId ? { ...c, type: newType } : c)
            setClassrooms(updatedRooms)
        } catch (error) {
            alert("Error al actualizar tipo de aula")
        }
    }

    const filteredRooms = classrooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusColor = (type) => {
        switch (type) {
            case 'Con Espejos': return 'primary'
            case 'Área Abierta': return 'success'
            case 'Con Tarima': return 'warning'
            case 'Cancha/Abierto': return 'info'
            case 'Salón de Teoría': return 'secondary'
            default: return 'dark'
        }
    }

    return (
        <CContainer fluid>
            <CRow>
                <CCol>
                    <CCard className="shadow-sm border-0 mb-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <div className="bg-info" style={{ height: '5px' }}></div>
                        <CCardHeader className="border-bottom-0 pt-4 pb-3 px-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                <div>
                                    <h4 className="mb-1 fw-bold">
                                        <CIcon icon={cilRoom} className="me-2 text-info" />
                                        Gestión de Aulas y Espacios
                                    </h4>
                                    <p className="text-body-secondary mb-0 small">
                                        Visualiza la disponibilidad y características de cada salón
                                    </p>
                                </div>
                                <div className="d-flex gap-2 align-items-center">
                                    <CFormSelect
                                        size="sm"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="fw-bold text-info border-info"
                                    >
                                        {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                                    </CFormSelect>
                                </div>
                            </div>
                        </CCardHeader>

                        <CCardBody className="px-4 pb-4">
                            <div className="mb-4">
                                <CInputGroup style={{ maxWidth: '400px' }}>
                                    <CInputGroupText className="bg-body-tertiary border-end-0">
                                        <CIcon icon={cilSearch} className="text-muted" />
                                    </CInputGroupText>
                                    <CFormInput
                                        className="bg-body-tertiary border-start-0 ps-0"
                                        placeholder="Buscar aula o tipo..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </CInputGroup>
                            </div>

                            {loading ? (
                                <div className="text-center py-5">
                                    <CSpinner color="info" />
                                    <div className="mt-2 text-muted">Cargando espacios...</div>
                                </div>
                            ) : (
                                <CRow className="g-4">
                                    {filteredRooms.map(room => (
                                        <CCol key={room.id} lg={4} md={6}>
                                            <CCard className="h-100 shadow-sm border-secondary-subtle aula-card hover-lift">
                                                <CCardBody className="d-flex flex-column p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div>
                                                            <h5 className="fw-bold mb-1">{room.name}</h5>
                                                            <CBadge color={getStatusColor(room.type)} shape="rounded-pill">
                                                                {room.type}
                                                            </CBadge>
                                                        </div>
                                                        <div className="text-info">
                                                            <CIcon icon={cilLocationPin} size="xl" />
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 mb-4">
                                                        <CFormSelect
                                                            size="sm"
                                                            value={room.type}
                                                            onChange={(e) => handleTypeChange(room.id, e.target.value)}
                                                            className="text-muted small"
                                                        >
                                                            {CLASSROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                        </CFormSelect>
                                                    </div>

                                                    <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                                                        <div className="text-body-secondary small">
                                                            <CIcon icon={cilInfo} className="me-1" />
                                                            Capacidad: {room.capacity} pers.
                                                        </div>
                                                        <CButton
                                                            color="info"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleSeeSchedule(room)}
                                                            className="fw-bold"
                                                        >
                                                            <CIcon icon={cilClock} className="me-1" />
                                                            VER HORARIO
                                                        </CButton>
                                                    </div>
                                                </CCardBody>
                                            </CCard>
                                        </CCol>
                                    ))}
                                </CRow>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Modal de Horarios del Aula */}
            <CModal size="lg" visible={showSchedule} onClose={() => setShowSchedule(false)}>
                <CModalHeader className="bg-info text-white">
                    <CModalTitle>
                        <CIcon icon={cilCalendar} className="me-2" />
                        Disponibilidad: {selectedAula?.name} ({selectedYear})
                    </CModalTitle>
                </CModalHeader>
                <CModalBody className="p-4">
                    {aulaSchedules.length > 0 ? (
                        <div className="table-responsive">
                            <CTable hover align="middle" className="border-secondary-subtle shadow-sm">
                                <CTableHead color="dark">
                                    <CTableRow>
                                        <CTableHeaderCell>Día</CTableHeaderCell>
                                        <CTableHeaderCell>Hora</CTableHeaderCell>
                                        <CTableHeaderCell>Materia</CTableHeaderCell>
                                        <CTableHeaderCell>Sección</CTableHeaderCell>
                                        <CTableHeaderCell>Profesor</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {aulaSchedules.map((item, idx) => (
                                        <CTableRow key={idx}>
                                            <CTableDataCell className="fw-bold text-info">{item.dayOfWeek}</CTableDataCell>
                                            <CTableDataCell>
                                                <CBadge color="light" className="text-dark border">
                                                    {item.startTime} - {item.endTime}
                                                </CBadge>
                                            </CTableDataCell>
                                            <CTableDataCell className="fw-semibold">{item.subject}</CTableDataCell>
                                            <CTableDataCell>{item.sectionName} <small className="text-muted">({item.gradeLevel})</small></CTableDataCell>
                                            <CTableDataCell>{item.teacherName}</CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <CIcon icon={cilClock} size="3xl" className="text-muted opacity-25 mb-3" />
                            <h5>No hay clases programadas</h5>
                            <p className="text-muted">Este espacio está totalmente disponible para este año académico.</p>
                        </div>
                    )}
                </CModalBody>
            </CModal>

            <style>{`
                .aula-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
            `}</style>
        </CContainer>
    )
}

export default Aulas