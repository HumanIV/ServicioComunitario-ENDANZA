import React, { useState, useEffect, useMemo } from 'react'
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CButton,
    CBadge,
    CAvatar,
    CSpinner,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilPeople, cilClock, cilSchool, cilUser, cilChevronBottom, cilArrowRight, cilSearch } from '@coreui/icons'
import { listSections, getAvailableYears } from 'src/services/schedules'
import { listStudents } from 'src/services/students'

const InicioDocente = () => {
    const [loading, setLoading] = useState(true)
    const [sections, setSections] = useState([])
    const [academicYears, setAcademicYears] = useState([])
    const [selectedYear, setSelectedYear] = useState('2025-2026')
    const [selectedTeacher, setSelectedTeacher] = useState('Fiorella Márquez')
    const [fullTeachersList, setFullTeachersList] = useState([])
    const [selectedSection, setSelectedSection] = useState(null)
    const [students, setStudents] = useState([])
    const [showStudentModal, setShowStudentModal] = useState(false)
    const [loadingStudents, setLoadingStudents] = useState(false)

    useEffect(() => {
        loadInitialData()
    }, [])

    useEffect(() => {
        fetchDashboardData()
    }, [selectedTeacher, selectedYear])

    const loadInitialData = async () => {
        try {
            const years = await getAvailableYears()
            setAcademicYears(years)
            if (years.length > 0) setSelectedYear(years[0])
        } catch (error) {
            console.error("Error loading years:", error)
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

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            const allSections = await listSections()

            // Poblar lista de profesores
            const teachers = extractTeachers(allSections)
            setFullTeachersList(teachers)

            // Filtrar secciones por año y docente
            const teacherGroups = allSections.filter(section =>
                section.academicYear === selectedYear &&
                section.schedules.some(s => s.teacherName === selectedTeacher)
            )
            setSections(teacherGroups)
        } catch (error) {
            console.error("Error fetching teacher dashboard:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSeeStudents = async (section) => {
        setSelectedSection(section)
        setLoadingStudents(true)
        setShowStudentModal(true)
        try {
            // Lógica de "Inscripción Automática": 
            // Buscamos a todos los estudiantes que pertenezcan al Grado de esta sección
            const studentsList = await listStudents({ gradeLevel: section.gradeLevel, status: 'Inscrito' })
            setStudents(studentsList)
        } catch (error) {
            console.error("Error loading students:", error)
        } finally {
            setLoadingStudents(false)
        }
    }

    const teacherStats = useMemo(() => {
        const totalClasses = sections.reduce((acc, sec) =>
            acc + sec.schedules.filter(s => s.teacherName === selectedTeacher).length, 0
        )
        return {
            groups: sections.length,
            classes: totalClasses
        }
    }, [sections, selectedTeacher])

    return (
        <CContainer fluid className="pb-5">
            <CRow>
                <CCol>
                    {/* BIENVENIDA DOCENTE */}
                    <CCard className="shadow-sm border-0 mb-4" style={{ borderRadius: '20px' }}>
                        <div className="bg-primary" style={{ height: '8px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}></div>
                        <CCardBody className="p-4 bg-white" style={{ borderRadius: '20px' }}>
                            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
                                <div>
                                    <h2 className="fw-bold text-dark mb-1 display-5">¡Bienvenido!</h2>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    {/* SELECTOR DE CICLO */}
                                    <div className="bg-light p-1 px-3 rounded-pill border hover-shadow-sm transition-all shadow-sm" style={{ cursor: 'pointer' }}>
                                        <CDropdown>
                                            <CDropdownToggle caret={false} className="border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center" style={{ whiteSpace: 'nowrap' }}>
                                                <CIcon icon={cilCalendar} className="me-2 opacity-50" />
                                                Ciclo {selectedYear}
                                                <CIcon icon={cilChevronBottom} size="sm" className="ms-2 opacity-50" />
                                            </CDropdownToggle>
                                            <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 animate-fade-in dropdown-menu-premium-scroll">
                                                {academicYears.map(y => (
                                                    <CDropdownItem key={y} onClick={() => setSelectedYear(y)} active={selectedYear === y} className="py-2 px-3 dropdown-item-premium">
                                                        Ciclo {y}
                                                    </CDropdownItem>
                                                ))}
                                            </CDropdownMenu>
                                        </CDropdown>
                                    </div>

                                    {/* SELECTOR DE PROFESOR */}
                                    <div className="bg-light p-1 px-3 rounded-pill border hover-shadow-sm transition-all shadow-sm" style={{ cursor: 'pointer' }}>
                                        <CDropdown>
                                            <CDropdownToggle caret={false} className="border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center" style={{ whiteSpace: 'nowrap' }}>
                                                <CIcon icon={cilUser} className="me-2 opacity-50" />
                                                {selectedTeacher || 'Seleccionar Docente'}
                                                <CIcon icon={cilChevronBottom} size="sm" className="ms-2 opacity-50" />
                                            </CDropdownToggle>
                                            <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 animate-fade-in dropdown-menu-premium-scroll" style={{ minWidth: '220px' }}>
                                                {fullTeachersList.map(t => (
                                                    <CDropdownItem key={t} onClick={() => setSelectedTeacher(t)} active={selectedTeacher === t} className="py-2 px-3 dropdown-item-premium">
                                                        {t}
                                                    </CDropdownItem>
                                                ))}
                                            </CDropdownMenu>
                                        </CDropdown>
                                    </div>

                                    <div className="d-flex gap-3 ms-md-3 border-start ps-3">
                                        <div className="text-center">
                                            <h3 className="mb-0 fw-bold text-primary">{teacherStats.groups}</h3>
                                            <small className="text-muted text-uppercase fw-bold ls-1" style={{ fontSize: '0.6rem' }}>Grupos</small>
                                        </div>
                                        <div className="text-center ms-3 border-start ps-3">
                                            <h3 className="mb-0 fw-bold text-primary">{teacherStats.classes}</h3>
                                            <small className="text-muted text-uppercase fw-bold ls-1" style={{ fontSize: '0.6rem' }}>Clases/Sem</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>

                    <h4 className="mb-4 fw-bold text-dark text-uppercase ls-1 d-flex align-items-center">
                        <CIcon icon={cilSchool} className="me-2 text-primary" />
                        Mis Grupos de Clase
                    </h4>

                    {loading ? (
                        <div className="text-center py-5">
                            <CSpinner color="primary" variant="grow" />
                        </div>
                    ) : (
                        <CRow className="g-4">
                            {sections.map((section) => (
                                <CCol key={section.id} lg={4} md={6}>
                                    <CCard className="h-100 shadow-sm border-0 border-top border-4 border-warning hover-lift transition-all" style={{ borderRadius: '16px' }}>
                                        <CCardBody className="p-4 d-flex flex-column">
                                            <div className="d-flex justify-content-between mb-3">
                                                <div className="bg-orange-soft p-2 rounded-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                                    <CIcon icon={cilSchool} size="lg" />
                                                </div>
                                                <CBadge color="light" className="text-primary border p-2 px-3 rounded-pill h-fit">
                                                    ID: {section.id}
                                                </CBadge>
                                            </div>

                                            <h5 className="fw-bold text-primary mb-1 text-uppercase ls-1" style={{ fontSize: '1.25rem' }}>
                                                {[...new Set(section.schedules.filter(s => s.teacherName === selectedTeacher).map(s => s.subject))].join(' / ')}
                                            </h5>
                                            <div className="mb-3">
                                                <small className="text-muted fw-bold text-uppercase ls-1">{section.sectionName}</small>
                                            </div>

                                            <div className="bg-light p-3 rounded-3 mb-4 border border-dashed">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="small text-muted fw-bold text-uppercase">Carga Horaria</span>
                                                    <CBadge color="primary" className="rounded-pill p-2 px-3 fw-bold">
                                                        {section.schedules.filter(s => s.teacherName === selectedTeacher).length} Clases
                                                    </CBadge>
                                                </div>
                                                <div className="d-flex align-items-center pt-2 border-top">
                                                    <CIcon icon={cilSchool} size="sm" className="me-2 text-primary opacity-75" />
                                                    <span className="small text-dark fw-bold">Nivel: {section.gradeLevel}</span>
                                                </div>
                                            </div>

                                            <CButton
                                                onClick={() => handleSeeStudents(section)}
                                                className="mt-auto btn-premium py-2 fw-bold d-flex align-items-center justify-content-center"
                                            >
                                                <CIcon icon={cilSearch} className="me-2" />
                                                LISTA DE ESTUDIANTES
                                            </CButton>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            ))}

                            {sections.length === 0 && (
                                <CCol xs={12}>
                                    <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-dashed">
                                        <CIcon icon={cilCalendar} size="4xl" className="text-muted opacity-25 mb-3" />
                                        <h5>No tienes clases asignadas actualmente</h5>
                                        <p className="text-muted">Contacta con el administrador para verificar tu carga horaria.</p>
                                    </div>
                                </CCol>
                            )}
                        </CRow>
                    )}
                </CCol>
            </CRow>

            {/* MODAL DE LISTA DE ESTUDIANTES */}
            <CModal size="xl" visible={showStudentModal} onClose={() => setShowStudentModal(false)} backdrop="static" scrollable>
                <CModalHeader className="bg-primary text-white border-0">
                    <CModalTitle className="fw-bold d-flex align-items-center">
                        <CIcon icon={cilPeople} className="me-2" />
                        LISTA DE ESTUDIANTES: {selectedSection?.sectionName}
                    </CModalTitle>
                </CModalHeader>
                <CModalBody className="p-4">
                    <div className="mb-4 text-center">
                        <CBadge color="warning" className="px-4 py-2 rounded-pill shadow-sm">
                            NIVEL: {selectedSection?.gradeLevel}
                        </CBadge>
                        <p className="mt-3 text-muted small">
                            Los estudiantes que aparecen a continuación se vinculan automáticamente al nivel <strong>{selectedSection?.gradeLevel}</strong> al momento de su inscripción.
                        </p>
                    </div>

                    {loadingStudents ? (
                        <div className="text-center py-5">
                            <CSpinner color="primary" />
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <CTable hover align="middle" className="border-secondary-subtle">
                                <CTableHead color="dark">
                                    <CTableRow>
                                        <CTableHeaderCell className="ps-4">Código</CTableHeaderCell>
                                        <CTableHeaderCell>Estudiante</CTableHeaderCell>
                                        <CTableHeaderCell>Estatus</CTableHeaderCell>
                                        <CTableHeaderCell>Periodo</CTableHeaderCell>
                                        <CTableHeaderCell className="pe-4 text-end">Acciones</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {students.map((student) => (
                                        <CTableRow key={student.id}>
                                            <CTableDataCell className="ps-4 fw-bold">{student.code}</CTableDataCell>
                                            <CTableDataCell>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-orange-soft rounded-circle me-3 d-flex align-items-center justify-content-center text-primary fw-bold" style={{ width: '35px', height: '35px', fontSize: '0.8rem' }}>
                                                        {student.name[0]}{student.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <span className="fw-semibold d-block text-dark leading-tight">{student.fullName}</span>
                                                        <small className="text-muted">{student.age} • {student.gender}</small>
                                                    </div>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CBadge color="success" className="bg-opacity-10 text-success border border-success border-opacity-25 px-3">
                                                    {student.status}
                                                </CBadge>
                                            </CTableDataCell>
                                            <CTableDataCell>{student.academicYear}</CTableDataCell>
                                            <CTableDataCell className="pe-4 text-end">
                                                <CButton variant="outline" color="primary" size="sm" className="rounded-pill px-3 fw-bold">
                                                    Asistencia
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                    {students.length === 0 && (
                                        <CTableRow>
                                            <CTableDataCell colSpan="5" className="text-center py-4 text-muted">
                                                No hay alumnos inscritos en este nivel académico.
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                </CTableBody>
                            </CTable>
                        </div>
                    )}
                </CModalBody>
                <CModalFooter className="border-0 bg-light bg-opacity-50">
                    <CButton color="secondary" onClick={() => setShowStudentModal(false)}>
                        CERRAR LISTA
                    </CButton>
                    <CButton className="btn-premium px-4">
                        DESCARGAR LISTA (PDF)
                    </CButton>
                </CModalFooter>
            </CModal>

            <style>{`
                .ls-1 { letter-spacing: 1px; }
                .bg-orange-soft { background-color: rgba(242, 140, 15, 0.12); }
                .btn-premium {
                    background: #E07B00;
                    border: none;
                    color: white;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                }
                .btn-premium:hover { 
                    background: #F28C0F !important;
                    color: white !important;
                    transform: translateY(-1px); 
                }
                .h-fit { height: fit-content; }
                .leading-tight { line-height: 1.2; }
            `}</style>
        </CContainer>
    )
}

export default InicioDocente
