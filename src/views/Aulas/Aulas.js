import React, { useEffect, useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CContainer,
    CFormSelect,
    CSpinner,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilRoom, cilSearch, cilSchool, cilChevronBottom } from '@coreui/icons'
import { listClassrooms, updateClassroom, CLASSROOM_TYPES } from 'src/services/classrooms'
import { listSections, getAvailableYears } from 'src/services/schedules'

// Componentes extraídos
import ClassroomCard from './components/ClassroomCard'
import ScheduleModal from './components/ScheduleModal'

const Aulas = () => {
    // ---------------------- ESTADOS ---------------------- //
    const [classrooms, setClassrooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedAula, setSelectedAula] = useState(null)
    const [showSchedule, setShowSchedule] = useState(false)
    const [aulaSchedules, setAulaSchedules] = useState([])
    const [academicYears, setAcademicYears] = useState([])
    const [selectedYear, setSelectedYear] = useState('2025-2026')

    // ---------------------- EFECTOS ---------------------- //
    useEffect(() => {
        loadInitialData()
    }, [])

    // ---------------------- LOGICA DE DATOS ---------------------- //
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

    // ---------------------- FILTRADO ---------------------- //
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
                    <CCard className="shadow-sm border-0 mb-4 overflow-hidden premium-card" style={{ borderRadius: '16px' }}>
                        <div className="bg-primary" style={{ height: '6px' }}></div>
                        <CCardHeader className="border-bottom-0 pt-4 pb-3 px-4 bg-light-custom">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                <div>
                                    <h4 className="mb-1 fw-bold header-title-custom d-flex align-items-center">
                                        <CIcon icon={cilRoom} className="me-2 text-primary" />
                                        Gestión de Aulas y Espacios
                                    </h4>
                                    <p className="text-muted-custom mb-0 small fw-medium">
                                        Visualiza la disponibilidad y características de cada salón
                                    </p>
                                </div>

                                <div className="d-flex align-items-center gap-2 bg-light-custom p-1 px-3 rounded-pill border hover-shadow-sm transition-all shadow-sm" style={{ cursor: 'pointer' }}>
                                    <CIcon icon={cilSchool} className="text-secondary opacity-75" />
                                    <CDropdown variant="nav-item">
                                        <CDropdownToggle
                                            caret={false}
                                            className="border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center"
                                        >
                                            Ciclo {selectedYear}
                                            <CIcon icon={cilChevronBottom} size="sm" className="ms-2 opacity-50" />
                                        </CDropdownToggle>
                                        <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 overflow-hidden animate-fade-in dropdown-menu-premium-scroll" style={{ minWidth: '180px' }}>
                                            <div className="px-3 py-2 text-muted-custom small fw-bold text-uppercase ls-1">Seleccionar Periodo</div>
                                            {academicYears.map(y => (
                                                <CDropdownItem
                                                    key={y}
                                                    onClick={() => setSelectedYear(y)}
                                                    active={selectedYear === y}
                                                    className="py-2 px-3 fw-medium dropdown-item-premium"
                                                >
                                                    Ciclo {y}
                                                </CDropdownItem>
                                            ))}
                                        </CDropdownMenu>
                                    </CDropdown>
                                </div>
                            </div>
                        </CCardHeader>

                        <CCardBody className="px-4 pb-4">
                            <div className="mb-4 p-4 rounded-4 border border-light-custom bg-light-custom bg-opacity-10 shadow-sm">
                                <CInputGroup style={{ maxWidth: '400px' }} className="shadow-sm rounded-3 overflow-hidden border border-light-custom">
                                    <CInputGroupText className="border-0 text-muted-custom bg-light-custom">
                                        <CIcon icon={cilSearch} />
                                    </CInputGroupText>
                                    <CFormInput
                                        className="border-0 ps-0 bg-light-custom header-title-custom"
                                        placeholder="Buscar aula o tipo..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </CInputGroup>
                            </div>

                            {loading ? (
                                <div className="text-center py-5">
                                    <CSpinner color="primary" variant="grow" />
                                    <div className="mt-3 text-muted-custom fw-medium">Cargando espacios...</div>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3 text-muted-custom small fw-bold text-uppercase ls-1">
                                        Mostrando {filteredRooms.length} espacios disponibles
                                    </div>
                                    <CRow className="g-4">
                                        {filteredRooms.map(room => (
                                            <ClassroomCard
                                                key={room.id}
                                                room={room}
                                                onTypeChange={handleTypeChange}
                                                onSeeSchedule={handleSeeSchedule}
                                                getStatusColor={getStatusColor}
                                                classroomTypes={CLASSROOM_TYPES}
                                            />
                                        ))}
                                    </CRow>
                                </>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <ScheduleModal
                visible={showSchedule}
                onClose={() => setShowSchedule(false)}
                aula={selectedAula}
                selectedYear={selectedYear}
                schedules={aulaSchedules}
            />

            <style>{`
                .ls-1 { letter-spacing: 1px; }
            `}</style>
        </CContainer>
    )
}

export default Aulas