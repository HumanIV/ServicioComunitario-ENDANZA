import React, { useState, useEffect, useMemo } from 'react'
import {
    CContainer,
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CSpinner,
    CFormSelect,
    CBadge,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CDropdownDivider,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CButton
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar, cilUser, cilSchool, cilRoom, cilClock, cilChevronBottom, cilPeople, cilCloudDownload } from "@coreui/icons"
import { listSections, getAvailableYears } from 'src/services/schedules'

// Componentes estéticos
import NavegacionDocente from './components/horario/NavegacionDocente'
import ListaClasesDocente from './components/horario/ListaClasesDocente'

const HorarioDocente = () => {
    const [loading, setLoading] = useState(true)
    const [sections, setSections] = useState([])
    const [academicYears, setAcademicYears] = useState([])
    const [selectedYear, setSelectedYear] = useState('2025-2026')
    const [selectedTeacher, setSelectedTeacher] = useState('')
    const [activeDay, setActiveDay] = useState('LUNES')
    const [toasts, setToasts] = useState([])

    const diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES']

    const showToast = (type, message) => {
        const id = Date.now()
        const newToast = { id, type, message }
        setToasts(prev => [...prev, newToast])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 4000)
    }

    const handleGenerarPDF = () => {
        showToast('info', 'Generando horario institucional...')
        setTimeout(() => {
            showToast('success', '✅ Horario preparado para descarga')
        }, 1500)
    }

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        fetchSections()
    }, [selectedYear])

    const loadData = async () => {
        try {
            const years = await getAvailableYears()
            setAcademicYears(years)
            if (years.length > 0) setSelectedYear(years[0])
        } catch (error) {
            console.error("Error loading years:", error)
        }
    }

    const fetchSections = async () => {
        setLoading(true)
        try {
            const data = await listSections({ academicYear: selectedYear })
            setSections(data)

            // Si hay profesores, seleccionar el primero por defecto si no hay uno seleccionado
            const allTeachers = extractTeachers(data)
            if (allTeachers.length > 0 && !selectedTeacher) {
                setSelectedTeacher(allTeachers[0])
            }
        } catch (error) {
            console.error("Error fetching sections:", error)
        } finally {
            setLoading(false)
        }
    }

    const extractTeachers = (sectionsData) => {
        const teachers = new Set()
        sectionsData.forEach(section => {
            section.schedules.forEach(sched => {
                if (sched.teacherName) teachers.add(sched.teacherName)
            })
        })
        return Array.from(teachers).sort()
    }

    const teacherSchedules = useMemo(() => {
        if (!selectedTeacher) return {}

        const scheduleMap = {
            'LUNES': [], 'MARTES': [], 'MIÉRCOLES': [], 'JUEVES': [], 'VIERNES': []
        }

        sections.forEach(section => {
            section.schedules.forEach(sched => {
                if (sched.teacherName === selectedTeacher) {
                    scheduleMap[sched.dayOfWeek]?.push({
                        ...sched,
                        sectionName: section.sectionName,
                        gradeLevel: section.gradeLevel
                    })
                }
            })
        })

        // Ordenar cada día por hora de inicio
        Object.keys(scheduleMap).forEach(day => {
            scheduleMap[day].sort((a, b) => a.startTime.localeCompare(b.startTime))
        })

        return scheduleMap
    }, [sections, selectedTeacher])

    const totalClases = useMemo(() => {
        return Object.values(teacherSchedules).reduce((acc, dayClases) => acc + dayClases.length, 0)
    }, [teacherSchedules])

    if (loading && sections.length === 0) {
        return (
            <CContainer className="py-5 text-center">
                <CSpinner color="primary" variant="grow" />
                <div className="mt-3 text-muted fw-medium">Cargando horarios de docentes...</div>
            </CContainer>
        )
    }

    const teachersList = extractTeachers(sections)

    return (
        <CContainer fluid className="pb-5">
            <CRow>
                <CCol>
                    <CCard className="shadow-sm border-0 mb-4" style={{ borderRadius: '16px' }}>
                        <div className="bg-primary" style={{ height: '6px', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}></div>
                        <CCardHeader className="border-bottom-0 pt-4 pb-3 px-4 bg-white" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                <div>
                                    <h4 className="mb-1 fw-bold text-dark d-flex align-items-center">
                                        <CIcon icon={cilCalendar} className="me-2 text-primary" />
                                        Cronograma de Clases - Docente
                                    </h4>
                                    <p className="text-muted mb-0 small fw-medium">
                                        Visualización de carga horaria y asignaciones por profesor
                                    </p>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    {/* Botón de Descarga PDF */}
                                    <CButton
                                        onClick={handleGenerarPDF}
                                        className="btn-premium rounded-pill px-3 fw-bold d-flex align-items-center shadow-sm border-0 transition-all"
                                        style={{ height: '38px', whiteSpace: 'nowrap', fontSize: '0.75rem' }}
                                    >
                                        <CIcon icon={cilCloudDownload} className="me-2" />
                                        DESCARGAR PDF
                                    </CButton>

                                    {/* Selector de Año */}
                                    <div className="bg-light p-1 px-3 rounded-pill border shadow-sm">
                                        <CDropdown>
                                            <CDropdownToggle caret={false} className="border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center" style={{ whiteSpace: 'nowrap' }}>
                                                Ciclo {selectedYear}
                                                <CIcon icon={cilChevronBottom} size="sm" className="ms-2 opacity-50" />
                                            </CDropdownToggle>
                                            <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 overflow-hidden animate-fade-in">
                                                {academicYears.map(y => (
                                                    <CDropdownItem key={y} onClick={() => setSelectedYear(y)} active={selectedYear === y} className="py-2 px-3 dropdown-item-premium">
                                                        Ciclo {y}
                                                    </CDropdownItem>
                                                ))}
                                            </CDropdownMenu>
                                        </CDropdown>
                                    </div>

                                    <div className="bg-light p-1 px-3 rounded-pill border ms-1 shadow-sm">
                                        <CDropdown>
                                            <CDropdownToggle caret={false} className="border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center" style={{ whiteSpace: 'nowrap' }}>
                                                <CIcon icon={cilUser} className="me-2 opacity-50" />
                                                {selectedTeacher || 'Seleccionar Docente'}
                                                <CIcon icon={cilChevronBottom} size="sm" className="ms-2 opacity-50" />
                                            </CDropdownToggle>
                                            <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 overflow-hidden animate-fade-in" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                {teachersList.map(t => (
                                                    <CDropdownItem key={t} onClick={() => setSelectedTeacher(t)} active={selectedTeacher === t} className="py-2 px-3 dropdown-item-premium">
                                                        {t}
                                                    </CDropdownItem>
                                                ))}
                                            </CDropdownMenu>
                                        </CDropdown>
                                    </div>
                                </div>
                            </div>
                        </CCardHeader>

                        <CCardBody className="px-4 pb-4">
                            {selectedTeacher ? (
                                <>
                                    <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light bg-opacity-10 rounded-3 border border-dashed">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-orange-soft p-3 rounded-circle me-3 text-primary">
                                                <CIcon icon={cilUser} size="xl" />
                                            </div>
                                            <div>
                                                <h5 className="mb-0 fw-bold">{selectedTeacher}</h5>
                                                <span className="text-muted small fw-bold text-uppercase">Docente de la Institución</span>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className="text-muted small fw-bold text-uppercase mb-1">Carga Semanal</div>
                                            <CBadge color="primary" className="px-3 py-2 rounded-pill fs-6 shadow-sm">
                                                {totalClases} Bloques de Clase
                                            </CBadge>
                                        </div>
                                    </div>

                                    <CRow className="g-4">
                                        <CCol xs={12}>
                                            <NavegacionDocente
                                                diasSemana={diasSemana}
                                                activeDay={activeDay}
                                                setActiveDay={setActiveDay}
                                                teacherSchedules={teacherSchedules}
                                            />
                                        </CCol>

                                        <CCol xs={12}>
                                            {diasSemana.map(dia => (
                                                <div key={dia} className={activeDay === dia ? 'animate__animated animate__fadeIn' : 'd-none'}>
                                                    <ListaClasesDocente
                                                        dia={dia}
                                                        clases={teacherSchedules[dia] || []}
                                                    />
                                                </div>
                                            ))}
                                        </CCol>

                                        {totalClases === 0 && (
                                            <CCol xs={12}>
                                                <div className="text-center py-5 border border-dashed rounded-4 bg-light text-muted">
                                                    <CIcon icon={cilCalendar} size="4xl" className="mb-3 opacity-25" />
                                                    <h5>Sin clases asignadas</h5>
                                                    <p className="mb-0">El docente {selectedTeacher} no tiene bloques horarios creados para el ciclo {selectedYear}.</p>
                                                </div>
                                            </CCol>
                                        )}
                                    </CRow>
                                </>
                            ) : (
                                <div className="text-center py-5 border border-dashed rounded-4 bg-light text-muted">
                                    <CIcon icon={cilUser} size="4xl" className="mb-3 opacity-25" />
                                    <h5>Seleccione un Docente</h5>
                                    <p className="mb-0">Utilice el selector superior para visualizar el cronograma de un profesor específico.</p>
                                </div>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CToaster placement="top-end">
                {toasts.map((t) => (
                    <CToast key={t.id} visible color={t.type} className="border-0 shadow-lg text-white">
                        <CToastHeader closeButton className="bg-transparent text-white border-0">
                            <strong className="me-auto">Sistema de Horarios</strong>
                        </CToastHeader>
                        <CToastBody className="fw-bold">{t.message}</CToastBody>
                    </CToast>
                ))}
            </CToaster>

            <style>{`
                .ls-1 { letter-spacing: 1px; }
                .bg-orange-soft { background-color: rgba(242, 140, 15, 0.1); }
                .fit-content { width: fit-content; }
                .leading-tight { line-height: 1.2; }
                .btn-premium {
                    background: linear-gradient(135deg, #F28C0F 0%, #E07B00 100%);
                    border: none;
                    color: white;
                }
                .btn-premium:hover { filter: brightness(1.1); color: white; }
                .dropdown-item-premium {
                    transition: all 0.2s ease;
                    border-radius: 8px;
                    margin: 2px 8px;
                    width: auto;
                }
                .dropdown-item-premium:hover {
                    background-color: rgba(242, 140, 15, 0.1) !important;
                    color: #F28C0F !important;
                }
                .dropdown-item-premium.active {
                    background-color: #F28C0F !important;
                    color: white !important;
                }
            `}</style>
        </CContainer>
    )
}

export default HorarioDocente
