import React, { useEffect, useState, useMemo } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CContainer,
    CRow,
    CCol,
    CSpinner,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CDropdownDivider
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilCalendar, cilSchool, cilChevronBottom } from '@coreui/icons'

// Componentes y servicios del dominio
import HorarioForm from './HorarioForm'
import InfoHorario from './InfoHorario'
import {
    listSections,
    createSection,
    updateSection,
    deleteSection,
    getAvailableYears,
    addAcademicYear,
    GRADE_LEVELS
} from 'src/services/schedules'

// Componentes comunes
import ConfirmationModal from 'src/components/ConfirmationModal'
import Pagination from 'src/components/Pagination'

// Componentes extraídos
import ScheduleCard from './components/ScheduleCard'
import ScheduleFilters from './components/ScheduleFilters'

const Horarios = () => {
    // ---------------------- ESTADOS ---------------------- //
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [editing, setEditing] = useState(null)
    const [selectedSection, setSelectedSection] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(9)
    const [searchTerm, setSearchTerm] = useState('')
    const DEFAULT_YEAR = "2025-2026"
    const [currentAcademicYear, setCurrentAcademicYear] = useState(DEFAULT_YEAR)
    const [availableYears, setAvailableYears] = useState([DEFAULT_YEAR])
    const [filters, setFilters] = useState({ gradeLevel: '', academicYear: DEFAULT_YEAR })
    const [deleteModal, setDeleteModal] = useState({ visible: false, sectionId: null, sectionName: '' })

    // ---------------------- EFECTOS ---------------------- //
    useEffect(() => {
        loadInitialData()
    }, [])

    useEffect(() => {
        setFilters(prev => ({ ...prev, academicYear: currentAcademicYear }))
    }, [currentAcademicYear])

    useEffect(() => {
        fetchData()
    }, [filters])

    // ---------------------- LOGICA DE DATOS ---------------------- //
    const loadInitialData = async () => {
        try {
            const years = await getAvailableYears()
            setAvailableYears(years)
            if (years.length > 0) setCurrentAcademicYear(years[0])
        } catch (error) { console.error("Error loading initial data:", error) }
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await listSections(filters)
            setData(res || [])
        } catch (error) {
            console.error('Error fetching sections:', error)
            setData([])
        } finally { setLoading(false) }
    }

    // ---------------------- FILTRADO Y PAGINACIÓN ---------------------- //
    const filteredSections = useMemo(() => {
        return data.filter(section => {
            if (!searchTerm) return true
            const searchLower = searchTerm.toLowerCase()
            return (
                section.id?.toString().includes(searchTerm) ||
                section.sectionName?.toLowerCase().includes(searchLower) ||
                section.gradeLevel?.toLowerCase().includes(searchLower)
            )
        })
    }, [data, searchTerm])

    const currentPageData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredSections.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredSections, currentPage, itemsPerPage])

    const totalPages = Math.ceil(filteredSections.length / itemsPerPage)

    // ---------------------- ACCIONES ---------------------- //
    const handleSave = async (payload) => {
        try {
            if (editing && editing.id) await updateSection(editing.id, payload)
            else await createSection(payload)
            setShowForm(false); setEditing(null); fetchData()
        } catch (error) { alert('Error al guardar: ' + error.message) }
    }

    const handleDelete = async (id) => {
        try { await deleteSection(id); fetchData() }
        catch (error) { alert('Error al eliminar: ' + error.message) }
    }

    const confirmDelete = () => {
        if (deleteModal.sectionId) handleDelete(deleteModal.sectionId)
        setDeleteModal({ visible: false, sectionId: null, sectionName: '' })
    }

    // Validación de Septiembre para nuevos años
    const checkCanCreateYear = () => {
        const now = new Date()
        const currentMonth = now.getMonth() // 0-11
        const currentCalendarYear = now.getFullYear()

        if (currentMonth !== 8) { // 8 es Septiembre
            return {
                allowed: false,
                reason: 'Apertura de ciclos solo en Septiembre.'
            }
        }

        const lastCreated = localStorage.getItem('last_academic_year_creation_calendar_year')
        if (lastCreated === currentCalendarYear.toString()) {
            return {
                allowed: false,
                reason: 'El ciclo para este periodo ya fue aperturado.'
            }
        }
        return { allowed: true }
    }

    const handleCreateNextYear = async () => {
        const validation = checkCanCreateYear()
        if (!validation.allowed) {
            alert(validation.reason)
            return
        }

        const [start, end] = currentAcademicYear.split('-').map(Number);
        const nextYear = `${start + 1}-${end + 1}`;

        if (window.confirm(`¿Desea aperturar el nuevo Ciclo Académico ${nextYear}?`)) {
            try {
                await addAcademicYear(nextYear)
                localStorage.setItem('last_academic_year_creation_calendar_year', new Date().getFullYear().toString())
                const years = await getAvailableYears()
                setAvailableYears(years);
                setCurrentAcademicYear(nextYear)
            } catch (e) { alert('Error: ' + e.message) }
        }
    }

    const handleYearChange = (e) => {
        const val = e.target.value;
        if (val === 'new_year_action') handleCreateNextYear();
        else setCurrentAcademicYear(val);
    }

    return (
        <CContainer fluid>
            <CRow>
                <CCol>
                    <CCard className="shadow-sm border-0 mb-4 overflow-hidden" style={{ borderRadius: '16px' }}>
                        <div className="bg-primary" style={{ height: '6px' }}></div>
                        <CCardHeader className="border-bottom-0 pt-4 pb-3 px-4 bg-white">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                <div>
                                    <h4 className="mb-1 fw-bold text-dark d-flex align-items-center">
                                        <CIcon icon={cilCalendar} className="me-2 text-primary" />
                                        Gestión de Horarios
                                    </h4>
                                    <p className="text-muted mb-0 small fw-medium">Administración de Secciones y Cargas Horarias</p>
                                </div>

                                <div className="d-flex align-items-center gap-2 bg-light p-1 px-3 rounded-pill border hover-shadow-sm transition-all" style={{ cursor: 'pointer' }}>
                                    <CIcon icon={cilSchool} className="text-secondary" />
                                    <CDropdown variant="nav-item">
                                        <CDropdownToggle
                                            caret={false}
                                            className="border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center"
                                        >
                                            Ciclo {currentAcademicYear}
                                            <CIcon icon={cilChevronBottom} size="sm" className="ms-2 opacity-50" />
                                        </CDropdownToggle>
                                        <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 animate-fade-in dropdown-menu-premium-scroll" style={{ minWidth: '180px' }}>
                                            <div className="px-3 py-2 text-muted small fw-bold text-uppercase ls-1">Seleccionar Periodo</div>
                                            {availableYears.map(year => (
                                                <CDropdownItem
                                                    key={year}
                                                    onClick={() => setCurrentAcademicYear(year)}
                                                    active={currentAcademicYear === year}
                                                    className="py-2 px-3 fw-medium dropdown-item-premium"
                                                >
                                                    Ciclo {year}
                                                </CDropdownItem>
                                            ))}
                                            <CDropdownDivider className="mx-2" />
                                            <CDropdownItem
                                                onClick={handleCreateNextYear}
                                                className="py-2 px-3 fw-bold text-success dropdown-item-premium"
                                            >
                                                + Nuevo Año Escolar
                                            </CDropdownItem>
                                        </CDropdownMenu>
                                    </CDropdown>
                                </div>
                            </div>
                        </CCardHeader>

                        <CCardBody className="px-4 pb-4">
                            {loading ? (
                                <div className="text-center py-5">
                                    <CSpinner color="primary" variant="grow" />
                                    <div className="mt-3 text-muted fw-medium">Cargando datos académicos...</div>
                                </div>
                            ) : (
                                <>
                                    <ScheduleFilters
                                        searchTerm={searchTerm}
                                        onSearch={(val) => { setSearchTerm(val); setCurrentPage(1) }}
                                        gradeLevel={filters.gradeLevel}
                                        onFilterChange={(name, val) => { setFilters(prev => ({ ...prev, [name]: val })); setCurrentPage(1) }}
                                        gradeLevels={GRADE_LEVELS}
                                        onClear={() => { setFilters({ gradeLevel: '', academicYear: currentAcademicYear }); setSearchTerm(''); setCurrentPage(1) }}
                                        activeFilters={{ totalResults: filteredSections.length }}
                                        extraAction={
                                            <CButton
                                                onClick={() => { setEditing(null); setShowForm(true) }}
                                                className="btn-premium px-4 py-2 shadow-sm d-flex align-items-center"
                                            >
                                                <CIcon icon={cilPlus} className="me-2" />
                                                NUEVA SECCIÓN
                                            </CButton>
                                        }
                                    />

                                    {currentPageData.length > 0 ? (
                                        <>
                                            <div className="mb-3 text-muted small fw-bold text-uppercase ls-1">
                                                Mostrando horarios del Ciclo {currentAcademicYear}
                                            </div>
                                            <CRow className="g-4">
                                                {currentPageData.map(section => (
                                                    <ScheduleCard
                                                        key={section.id}
                                                        section={section}
                                                        onShowInfo={(s) => { setSelectedSection(s); setShowInfo(true) }}
                                                        onEdit={(s) => { setEditing(s); setShowForm(true) }}
                                                        onDelete={(id, name) => setDeleteModal({ visible: true, sectionId: id, sectionName: name })}
                                                    />
                                                ))}
                                            </CRow>
                                            {totalPages > 1 && (
                                                <div className="mt-5 d-flex justify-content-center">
                                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-5 border border-dashed rounded-4 bg-light text-muted mt-4">
                                            <CIcon icon={cilCalendar} size="4xl" className="mb-3 text-secondary opacity-25" />
                                            <h5>No existen secciones para el ciclo {currentAcademicYear}</h5>
                                            <p className="mb-4">Comienza creando una nueva sección para este período escolar.</p>
                                            <CButton color="primary" variant="outline" onClick={() => { setEditing(null); setShowForm(true) }}>
                                                <CIcon icon={cilPlus} className="me-2" />
                                                Crear Primera Sección
                                            </CButton>
                                        </div>
                                    )}
                                </>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <HorarioForm
                visible={showForm}
                onClose={() => { setShowForm(false); setEditing(null) }}
                onSave={handleSave}
                initial={editing}
                academicYear={currentAcademicYear}
            />
            <InfoHorario
                visible={showInfo}
                onClose={() => { setShowInfo(false); setSelectedSection(null) }}
                section={selectedSection}
            />
            <ConfirmationModal
                visible={deleteModal.visible}
                onClose={() => setDeleteModal({ visible: false, sectionId: null, sectionName: '' })}
                onConfirm={confirmDelete}
                title="Eliminar Sección"
                message={`¿Estás seguro de eliminar "${deleteModal.sectionName}"? Esta acción no se puede deshacer.`}
                confirmText="Sí, Eliminar"
                type="danger"
            />
            <style>{`
                .btn-premium {
                    background: #E07B00;
                    border: none;
                    color: white;
                    transition: all 0.3s ease;
                }
                .btn-premium:hover { 
                    background: #F28C0F !important;
                    color: white !important;
                    transform: translateY(-2px); 
                    box-shadow: 0 4px 12px rgba(242, 140, 15, 0.3); 
                }
                .ls-1 { letter-spacing: 1px; }
            `}</style>
        </CContainer>
    )
}

export default Horarios