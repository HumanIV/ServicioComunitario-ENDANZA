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
import { listClassrooms, updateClassroom, CLASSROOM_TYPES } from 'src/services/classroomsService'
import { getAllSections } from 'src/services/scheduleService'
import { getAvailableYears } from 'src/services/configService'

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
    const [selectedYear, setSelectedYear] = useState(null)

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
            if (years.length > 0) {
                // Buscar año activo primero
                const activeYear = years.find(y => y.active === true)
                setSelectedYear(activeYear || years[0])
            }
        } catch (error) {
            console.error("Error loading classrooms data:", error)
        } finally {
            setLoading(false)
        }
    }

    /**
     * Función helper para obtener el ID del aula de un horario
     * Intenta múltiples formatos posibles
     */
    const getClassroomIdFromSchedule = (schedule) => {
        return schedule.classroomId || 
               schedule.classroom_id || 
               schedule.aulaId || 
               schedule.aula_id || 
               null
    }

    /**
     * Función helper para obtener el nombre del aula de un horario
     * Intenta múltiples formatos posibles
     */
    const getClassroomNameFromSchedule = (schedule) => {
        return schedule.classroom || 
               schedule.classroom_name || 
               schedule.aula || 
               schedule.aula_name || 
               schedule.nombre_aula || 
               null
    }

    const handleSeeSchedule = async (aula) => {
        setSelectedAula(aula)
        try {
            if (!selectedYear?.id) {
                console.error("No hay año seleccionado")
                return
            }
            
            console.log('🔍 Año seleccionado:', selectedYear.id)
            console.log('🔍 Aula seleccionada:', aula)
            
            const sections = await getAllSections(selectedYear.id)
            console.log('📋 Secciones recibidas:', sections)
            
            const extractedSchedules = []

            sections.forEach(section => {
                if (section.schedules && section.schedules.length > 0) {
                    console.log(`📌 Sección ${section.sectionName || section.section_name || 'Sin nombre'} (ID: ${section.id}) - ${section.schedules.length} horarios`)
                    
                    section.schedules.forEach(sched => {
                        // Obtener valores usando funciones helper
                        const schedClassroomId = getClassroomIdFromSchedule(sched)
                        const schedClassroomName = getClassroomNameFromSchedule(sched)
                        
                        // Verificar si hay coincidencia por ID o nombre
                        const matchById = schedClassroomId === aula.id
                        const matchByName = schedClassroomName?.toLowerCase() === aula.name?.toLowerCase()
                        
                        // Log detallado para debug
                        console.log('   📊 Análisis de horario:', {
                            id: sched.id,
                            schedClassroomId,
                            schedClassroomName,
                            aulaId: aula.id,
                            aulaName: aula.name,
                            matchById,
                            matchByName,
                            rawData: sched
                        })
                        
                        if (matchById || matchByName) {
                            console.log('   ✅ COINCIDENCIA ENCONTRADA!', matchById ? 'por ID' : 'por nombre')
                            
                            // Construir objeto normalizado
                            extractedSchedules.push({
                                id: sched.id,
                                subject: sched.subject || sched.subject_name || 'Sin materia',
                                teacherName: sched.teacherName || sched.teacher_name || 'Sin asignar',
                                teacherId: sched.teacherId || sched.teacher_id,
                                dayOfWeek: (sched.dayOfWeek || sched.day_name || '').toUpperCase() || 'LUNES',
                                startTime: (sched.startTime || sched.start_time || '00:00').substring(0, 5),
                                endTime: (sched.endTime || sched.end_time || '00:00').substring(0, 5),
                                classroom: schedClassroomName || 'Sin aula',
                                classroomId: schedClassroomId,
                                dayId: sched.dayId || sched.day_id,
                                blockId: sched.blockId || sched.block_id,
                                sectionName: section.sectionName || section.section_name || 'Sección',
                                gradeLevel: section.gradeLevel || section.grade_level || 'N/A'
                            })
                        }
                    })
                } else {
                    console.log(`📌 Sección ${section.sectionName || section.section_name || 'Sin nombre'} (ID: ${section.id}) - SIN HORARIOS`)
                }
            })

            console.log('🎯 Horarios extraídos:', extractedSchedules)

            // Ordenar por día y hora
            const daysOrder = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES']
            extractedSchedules.sort((a, b) => {
                const dayDiff = daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek)
                if (dayDiff !== 0) return dayDiff
                return a.startTime.localeCompare(b.startTime)
            })

            setAulaSchedules(extractedSchedules)
            setShowSchedule(true)
            
            if (extractedSchedules.length === 0) {
                console.warn('⚠️ No se encontraron horarios para esta aula')
            }
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
                        <CCardHeader className="border-bottom-0 pt-3 pt-md-4 pb-3 px-3 px-md-4 bg-light-custom">
                            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
                                <div className="text-center text-lg-start">
                                    <h4 className="mb-1 fw-bold header-title-custom d-flex align-items-center justify-content-center justify-content-lg-start fs-5 fs-md-4">
                                        <CIcon icon={cilRoom} className="me-2 text-primary" />
                                        Gestión de Aulas
                                    </h4>
                                    <p className="text-muted-custom mb-0 small fw-medium d-none d-sm-block">
                                        Visualiza la disponibilidad y características de cada salón
                                    </p>
                                </div>

                                <div className="d-flex align-items-center justify-content-center gap-2 bg-light-custom p-1 px-3 rounded-pill border hover-shadow-sm transition-all shadow-sm w-100 w-lg-auto" style={{ cursor: 'pointer' }}>
                                    <CIcon icon={cilSchool} className="text-secondary opacity-75" />
                                    <CDropdown variant="nav-item">
                                        <CDropdownToggle
                                            caret={false}
                                            className="border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center"
                                        >
                                            Ciclo {selectedYear?.name || 'CARGANDO...'}
                                            <CIcon icon={cilChevronBottom} size="sm" className="ms-2 opacity-50" />
                                        </CDropdownToggle>
                                        <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 overflow-hidden animate-fade-in dropdown-menu-premium-scroll" style={{ minWidth: '180px' }}>
                                            <div className="px-3 py-2 text-muted-custom small fw-bold text-uppercase ls-1">Seleccionar Periodo</div>
                                            {academicYears.map(y => (
                                                <CDropdownItem
                                                    key={y.id}
                                                    onClick={() => setSelectedYear(y)}
                                                    active={selectedYear?.id === y.id}
                                                    className="py-2 px-3 fw-medium dropdown-item-premium"
                                                >
                                                    Ciclo {y.name}
                                                </CDropdownItem>
                                            ))}
                                        </CDropdownMenu>
                                    </CDropdown>
                                </div>
                            </div>
                        </CCardHeader>

                        <CCardBody className="px-3 px-md-4 pb-4">
                            <div className="mb-4 p-3 p-md-4 rounded-4 border border-light-custom bg-light-custom bg-opacity-10 shadow-sm">
                                <CInputGroup style={{ maxWidth: '400px' }} className="shadow-sm rounded-3 overflow-hidden border border-light-custom w-100">
                                    <CInputGroupText className="border-0 text-muted-custom bg-light-custom">
                                        <CIcon icon={cilSearch} />
                                    </CInputGroupText>
                                    <CFormInput
                                        className="border-0 ps-0 bg-light-custom header-title-custom shadow-none"
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
                selectedYear={selectedYear?.name}
                schedules={aulaSchedules}
            />

            <style>{`
                .ls-1 { letter-spacing: 1px; }
            `}</style>
        </CContainer>
    )
}

export default Aulas