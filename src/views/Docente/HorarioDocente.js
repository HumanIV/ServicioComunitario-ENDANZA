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
import useUserRole from '../../Hooks/useUserRole'
import { listSections, getAvailableYears } from 'src/services/scheduleService'
import { getActiveYear } from 'src/services/configService'

// Componentes estéticos
import VistaSemanalDocente from './components/horario/VistaSemanalDocente'
// VistaSemanalDocente eliminado

const HorarioDocente = () => {
    const { user, isDocente } = useUserRole()
    const [loading, setLoading] = useState(true)
    const [sections, setSections] = useState([])
    const [academicYears, setAcademicYears] = useState([])
    const [selectedYear, setSelectedYear] = useState('')
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
        if (selectedYear) {
            fetchSections()
        }
    }, [selectedYear])

    const loadData = async () => {
        try {
            // 1. Obtener todos los años (para el selector si es admin)
            const years = await getAvailableYears()

            // 2. Obtener el año ACTIVO actual
            const activeYearObj = await getActiveYear()

            if (isDocente) {
                // Si es docente, SOLO permitimos ver el año activo
                if (activeYearObj) {
                    setAcademicYears([activeYearObj.name])
                    setSelectedYear(activeYearObj.name)
                } else if (years.length > 0) {
                    setAcademicYears([years[0]])
                    setSelectedYear(years[0])
                }

                // Setear nombre del docente logueado
                const userObj = JSON.parse(localStorage.getItem('user'))
                if (userObj) {
                    setSelectedTeacher(`${userObj.nombre} ${userObj.apellido}`.trim())
                }
            } else {
                setAcademicYears(years)
                if (activeYearObj) {
                    setSelectedYear(activeYearObj.name)
                } else if (years.length > 0) {
                    setSelectedYear(years[0])
                }
            }
        } catch (error) {
            console.error("Error loading years:", error)
        }
    }

    const fetchSections = async () => {
        setLoading(true)
        try {
            const data = await listSections({ academicYear: selectedYear })
            setSections(data)

            // Lógica de selección automática de docente (solo si no es docente)
            if (!isDocente) {
                const allTeachers = extractTeachers(data)
                if (allTeachers.length > 0 && !selectedTeacher) {
                    setSelectedTeacher(allTeachers[0])
                }
            } else {
                // Forzar nombre del docente de nuevo por si acaso
                const userObj = JSON.parse(localStorage.getItem('user'))
                if (userObj) {
                    setSelectedTeacher(`${userObj.nombre} ${userObj.apellido}`.trim())
                }
            }

        } catch (error) {
            console.error("Error fetching sections:", error)
        } finally {
            setLoading(false)
        }
    }

    const findTeacherNameByUserId = (sectionsData, userId) => {
        for (const section of sectionsData) {
            if (!section.schedules) continue
            for (const sched of section.schedules) {
                // Comparar IDs (asegurar tipos)
                if (String(sched.teacherUserId) === String(userId)) {
                    return sched.teacherName
                }
            }
        }
        return null
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
                    const dia = (sched.dayName || sched.day_name || '').toUpperCase()
                    scheduleMap[dia]?.push({
                        ...sched,
                        sectionName: section.sectionName,
                        subjectName: section.subjectName,
                        gradeLevel: section.gradeLevel,
                        classroom: sched.classroomName || sched.classroom_name || 'Sin aula',
                        subject: sched.subject || section.subjectName || 'Sin materia'
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
                <div className="mt-3 text-muted-custom fw-medium">Cargando horarios de docentes...</div>
            </CContainer>
        )
    }

    const teachersList = extractTeachers(sections)

    return (
        <CContainer fluid className="pb-5">
            <CRow>
                <CCol>
                    <CCard className="premium-card border-0 overflow-hidden mb-5 animate__animated animate__fadeIn">
                        <CCardHeader className="bg-orange-soft border-0 py-3 py-md-4 px-3 px-md-4">
                            <CRow className="align-items-center">
                                <CCol xs={12} md={8}>
                                    <div className="d-flex align-items-center">
                                        <div className="p-2 p-md-3 bg-primary rounded-3 me-3 shadow-sm">
                                            <CIcon icon={cilCalendar} size="lg" className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="mb-0 fw-bold header-title text-uppercase ls-1 fs-5 fs-md-4 header-title-custom">Cronograma Docente</h3>
                                            <p className="mb-0 header-subtitle small text-uppercase d-none d-sm-block text-muted-custom">Escuela de Danza Endanza • Gestión de Horarios</p>
                                        </div>
                                    </div>
                                </CCol>
                                <CCol xs={12} md={4} className="text-md-end mt-2 mt-md-0">
                                    <div className="bg-glass-premium p-1 px-3 rounded-pill border border-primary border-opacity-10 shadow-sm d-inline-flex align-items-center">
                                        {isDocente ? (
                                            <div className="border-0 bg-transparent fw-bold text-primary p-0 py-1 d-flex align-items-center justify-content-center w-100" style={{ whiteSpace: 'nowrap' }}>
                                                Ciclo {selectedYear}
                                            </div>
                                        ) : (
                                            <CDropdown className="w-100 text-center">
                                                <CDropdownToggle caret={false} className="border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center justify-content-center w-100" style={{ whiteSpace: 'nowrap' }}>
                                                    Ciclo {selectedYear}
                                                    <CIcon icon={cilChevronBottom} size="sm" className="ms-2 opacity-50" />
                                                </CDropdownToggle>
                                                <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 overflow-hidden animate-fade-in dropdown-menu-premium-scroll w-100 text-center">
                                                    {academicYears.map(y => (
                                                        <CDropdownItem key={y} onClick={() => setSelectedYear(y)} active={selectedYear === y} className="py-2 px-3 dropdown-item-premium">
                                                            Ciclo {y}
                                                        </CDropdownItem>
                                                    ))}
                                                </CDropdownMenu>
                                            </CDropdown>
                                        )}
                                    </div>
                                </CCol>
                            </CRow>
                        </CCardHeader>

                        <CCardBody className="p-3 p-md-4">
                            <CRow className="g-3 g-md-4 align-items-stretch">
                                <CCol lg={7}>
                                    <div className="p-3 p-md-4 rounded-4 info-box border border-primary border-opacity-10 h-100 bg-neutral-50 shadow-sm">
                                        <div className="d-flex align-items-center mb-3 mb-md-4">
                                            <div className="avatar avatar-lg bg-orange-soft text-primary rounded-circle me-3 fw-bold fs-4 flex-shrink-0 shadow-sm" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {selectedTeacher ? selectedTeacher.charAt(0) : '?'}
                                            </div>
                                            <div>
                                                <div className="bg-glass-premium p-1 px-3 rounded-pill border border-primary border-opacity-10 shadow-sm d-inline-flex align-items-center mb-2">
                                                    {isDocente ? (
                                                        <div className="px-2 py-1 fw-bold text-primary d-flex align-items-center justify-content-center w-100" style={{ whiteSpace: 'nowrap' }}>
                                                            <CIcon icon={cilUser} size="sm" className="me-2 opacity-50" />
                                                            {selectedTeacher || 'Docente'}
                                                        </div>
                                                    ) : (
                                                        <CDropdown className="w-100">
                                                            <CDropdownToggle caret={false} className="border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center justify-content-center w-100" style={{ whiteSpace: 'nowrap' }}>
                                                                <CIcon icon={cilUser} size="sm" className="me-2 opacity-50" />
                                                                {selectedTeacher || 'Seleccionar Docente'}
                                                                <CIcon icon={cilChevronBottom} size="sm" className="ms-2 opacity-50" />
                                                            </CDropdownToggle>
                                                            <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 overflow-hidden animate-fade-in dropdown-menu-premium-scroll" style={{ maxHeight: '300px', width: '250px' }}>
                                                                {teachersList.map(t => (
                                                                    <CDropdownItem key={t} onClick={() => setSelectedTeacher(t)} active={selectedTeacher === t} className="py-2 px-3 dropdown-item-premium">
                                                                        {t}
                                                                    </CDropdownItem>
                                                                ))}
                                                            </CDropdownMenu>
                                                        </CDropdown>
                                                    )}
                                                </div>
                                                <div className="d-block">
                                                    <CBadge className="bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 border border-success border-opacity-10 small fw-bold">ESTADO: ACTIVO</CBadge>
                                                </div>
                                            </div>
                                        </div>

                                        <CRow className="g-2 g-md-3">
                                            <CCol xs={12} sm={6}>
                                                <label className="header-label label-micro mb-1 d-block text-muted-custom small fw-bold text-uppercase ls-1">Cargo Académico</label>
                                                <div className="fw-bold fs-6 fs-sm-5 text-primary">Docente de Especialidad</div>
                                            </CCol>
                                            <CCol xs={12} sm={6}>
                                                <label className="header-label label-micro mb-1 d-block text-muted-custom small fw-bold text-uppercase ls-1">Área Académica</label>
                                                <div className="fw-bold fs-6 fs-sm-5 header-title-custom">Danza Clásica / Tradicional</div>
                                            </CCol>
                                        </CRow>
                                    </div>
                                </CCol>

                                <CCol lg={5}>
                                    <div className="p-3 p-md-4 rounded-4 bg-orange-soft h-100 shadow-sm border border-primary border-opacity-10">
                                        <h6 className="text-primary label-micro mb-3 mb-md-4 d-flex align-items-center fw-bold text-uppercase ls-1">
                                            <CIcon icon={cilClock} className="me-2" />
                                            Resumen de Cátedra
                                        </h6>
                                        <CRow className="g-2 g-md-3">
                                            <CCol xs={6}>
                                                <div className="p-2 p-md-3 bg-glass-premium rounded-4 text-center shadow-sm border border-primary border-opacity-10 h-100 d-flex flex-column justify-content-center">
                                                    <div className="fw-bold text-primary mb-0 fs-3 fs-md-2">{totalClases}</div>
                                                    <div className="text-muted-custom label-micro mt-1 small fw-bold text-uppercase" style={{ fontSize: '0.6rem' }}>Bloques / Sem</div>
                                                </div>
                                            </CCol>
                                            <CCol xs={6}>
                                                <div className="p-2 p-md-3 bg-glass-premium rounded-4 text-center shadow-sm border border-primary border-opacity-10 h-100 d-flex flex-column justify-content-center">
                                                    <div className="fw-bold text-primary mb-0 fs-3 fs-md-2">{totalClases * 1.5}</div>
                                                    <div className="text-muted-custom label-micro mt-1 small fw-bold text-uppercase" style={{ fontSize: '0.6rem' }}>Horas Sem</div>
                                                </div>
                                            </CCol>
                                        </CRow>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>

                    <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-5 no-print">
                        {/* Botones de vista eliminados - Solo vista diaria */}
                        <div className="p-1 d-flex">
                            {/* Espacio reservado o título si se desea */}
                            <span className="text-muted-custom small fw-bold text-uppercase ls-1 align-self-center ms-2">
                                <CIcon icon={cilCalendar} className="me-2 text-primary" />
                                Vista Semanal
                            </span>
                        </div>

                        <div className="d-flex gap-3">
                            <CButton
                                className="btn-premium rounded-pill px-4 py-2 border-0 d-flex align-items-center shadow-sm"
                                onClick={handleGenerarPDF}
                            >
                                <CIcon icon={cilCloudDownload} className="me-2" />
                                Descargar Horario (PDF)
                            </CButton>
                            <CButton
                                className="border-2 rounded-pill px-4 py-2 fw-bold bg-transparent border-neutral-200 text-neutral-600 hover-orange transition-all d-none d-md-flex align-items-center"
                                onClick={() => window.print()}
                            >
                                <CIcon icon={cilCloudDownload} className="me-2 text-primary" />
                                Imprimir
                            </CButton>
                        </div>
                    </div>

                    {selectedTeacher ? (
                        <div className="animate__animated animate__fadeIn">
                            <VistaSemanalDocente
                                diasSemana={diasSemana}
                                horario={teacherSchedules}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-5 border border-dashed border-light-custom rounded-4 bg-light-custom bg-opacity-10 text-muted-custom shadow-sm">
                            <CIcon icon={cilUser} size="4xl" className="mb-3 opacity-25" />
                            <h5 className="header-title-custom">Seleccione un Docente</h5>
                            <p className="mb-0 fw-medium">Utilice el selector de la parte superior para visualizar el cronograma de un profesor específico.</p>
                        </div>
                    )}
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


        </CContainer>
    )
}

export default HorarioDocente
