import React, { useEffect, useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCardTitle,
    CCardText,
    CContainer,
    CRow,
    CCol,
    CSpinner,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CFormSelect,
    CBadge,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPlus,
    cilPencil,
    cilTrash,
    cilInfo,
    cilCalendar,
    cilClock,
    cilSearch,
    cilUser,
    cilBook,
    cilGroup
} from '@coreui/icons'
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
import ConfirmationModal from 'src/components/ConfirmationModal'
import Pagination from 'src/components/Pagination'

const Horarios = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [editing, setEditing] = useState(null)
    const [selectedSection, setSelectedSection] = useState(null)

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(9)
    const [searchTerm, setSearchTerm] = useState('')

    const DEFAULT_YEAR = "2025-2026"
    const [currentAcademicYear, setCurrentAcademicYear] = useState(DEFAULT_YEAR)
    const [availableYears, setAvailableYears] = useState([DEFAULT_YEAR])


    const [filters, setFilters] = useState({
        gradeLevel: '',
        academicYear: DEFAULT_YEAR
    })

    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            academicYear: currentAcademicYear
        }))
    }, [currentAcademicYear])

    const [deleteModal, setDeleteModal] = useState({
        visible: false,
        sectionId: null,
        sectionName: ''
    })

    const checkCanCreateYear = () => {
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentCalendarYear = now.getFullYear()

        if (currentMonth !== 8) {
            return {
                allowed: false,
                reason: 'La creación de nuevos años escolares solo está permitida durante el mes de Septiembre.'
            }
        }

        const lastCreated = localStorage.getItem('last_academic_year_creation_calendar_year')
        if (lastCreated === currentCalendarYear.toString()) {
            return {
                allowed: false,
                reason: 'Ya se ha registrado un nuevo año escolar este año. Solo se permite una creación anual en el mes de Septiembre.'
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

        const latestYear = availableYears[0] || "2025-2026"
        const parts = latestYear.split('-')

        let nextYear = ""
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            nextYear = `${parseInt(parts[0]) + 1}-${parseInt(parts[1]) + 1}`
        } else {
            const currentYear = new Date().getFullYear()
            nextYear = `${currentYear}-${currentYear + 1}`
        }

        if (window.confirm(`¿Seguro que deseas iniciar el nuevo año escolar ${nextYear}?`)) {
            try {
                await addAcademicYear(nextYear)
                localStorage.setItem('last_academic_year_creation_calendar_year', new Date().getFullYear().toString())

                const years = await getAvailableYears()
                setAvailableYears(years)
                setCurrentAcademicYear(nextYear)
                alert(`Año académico ${nextYear} creado exitosamente.`)
            } catch (e) {
                alert('Error al abrir el nuevo año: ' + e.message)
            }
        }
    }

    useEffect(() => {
        loadInitialData()
    }, [])

    const loadInitialData = async () => {
        try {
            const years = await getAvailableYears()
            setAvailableYears(years)

            if (years.length > 0) {
                setCurrentAcademicYear(years[0])
            }
        } catch (error) {
            console.error("Error loading initial data:", error)
        }
    }

    async function fetchData() {
        setLoading(true)
        try {
            const res = await listSections(filters)
            setData(res || [])
        } catch (error) {
            console.error('Error fetching sections:', error)
            setData([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [filters])

    const handleSearch = (term) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
        setCurrentPage(1)
    }

    const clearFilters = () => {
        setFilters({
            gradeLevel: '',
            academicYear: currentAcademicYear
        })
        setSearchTerm('')
        setCurrentPage(1)
    }

    const filteredSections = data.filter(section => {
        if (!searchTerm) return true

        const searchLower = searchTerm.toLowerCase()
        return (
            section.id?.toString().includes(searchTerm) ||
            section.sectionName?.toLowerCase().includes(searchLower) ||
            section.sectionName?.toLowerCase().includes(searchLower) ||
            section.gradeLevel?.toLowerCase().includes(searchLower)
        )
    })

    const getCurrentPageData = () => {
        if (!Array.isArray(filteredSections) || filteredSections.length === 0) return []

        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage

        return filteredSections.slice(startIndex, endIndex)
    }

    const currentPageData = getCurrentPageData()
    const totalPages = Math.ceil(filteredSections.length / itemsPerPage)

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    async function handleSave(payload) {
        try {
            if (editing && editing.id) {
                await updateSection(editing.id, payload)
            } else {
                await createSection(payload)
            }
            setShowForm(false)
            setEditing(null)
            await fetchData()
        } catch (error) {
            console.error('Error saving section:', error)
            alert('Error al guardar la sección: ' + error.message)
        }
    }

    const showDeleteConfirmation = (id, name) => {
        setDeleteModal({
            visible: true,
            sectionId: id,
            sectionName: name
        })
    }

    async function handleDelete(id) {
        try {
            await deleteSection(id)
            await fetchData()
        } catch (error) {
            console.error('Error deleting section:', error)
            alert('Error al eliminar la sección: ' + error.message)
        }
    }

    const confirmDelete = () => {
        if (deleteModal.sectionId) {
            handleDelete(deleteModal.sectionId)
        }
        setDeleteModal({ visible: false, sectionId: null, sectionName: '' })
    }

    const handleShowInfo = (section) => {
        setSelectedSection(section)
        setShowInfo(true)
    }

    return (
        <CContainer fluid>
            <CRow>
                <CCol>
                    <CCard className="shadow-sm border-0 mb-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <div className="bg-primary" style={{ height: '5px' }}></div>

                        <CCardHeader className="border-bottom-0 pt-4 pb-3 px-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                <div>
                                    <h4 className="mb-1 fw-bold" style={{ letterSpacing: '-0.5px' }}>
                                        <CIcon icon={cilCalendar} className="me-2 text-primary" />
                                        Gestión de Horarios por Sección
                                    </h4>
                                    <p className="text-body-secondary mb-0 small">
                                        Administra los horarios completos de cada sección/grado
                                    </p>
                                </div>
                                <div>
                                    <CButton
                                        color="primary"
                                        onClick={() => {
                                            setEditing(null)
                                            setShowForm(true)
                                        }}
                                        className="d-flex align-items-center px-4 py-2 shadow-sm"
                                        shape="rounded-pill"
                                    >
                                        <CIcon icon={cilPlus} className="me-2 fw-bold" />
                                        NUEVA SECCIÓN
                                    </CButton>
                                </div>
                            </div>
                        </CCardHeader>

                        <CCardBody className="px-4 pb-4">
                            {loading ? (
                                <div className="text-center py-5">
                                    <CSpinner color="primary" variant="grow" />
                                    <div className="mt-3 text-muted">Cargando secciones...</div>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4 p-3 rounded-3 border bg-body-tertiary">
                                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3">
                                            <div className="text-body-secondary fw-semibold small">
                                                Total Secciones: <span className="fs-6">{filteredSections.length}</span>
                                            </div>

                                            <div style={{ maxWidth: '400px', width: '100%' }}>
                                                <CInputGroup>
                                                    <CInputGroupText className="border-end-0 text-body-secondary bg-transparent">
                                                        <CIcon icon={cilSearch} />
                                                    </CInputGroupText>
                                                    <CFormInput
                                                        className="border-start-0 ps-0"
                                                        placeholder="Buscar por nombre de sección o grado..."
                                                        value={searchTerm}
                                                        onChange={(e) => handleSearch(e.target.value)}
                                                    />
                                                </CInputGroup>
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <CFormSelect
                                                    value={filters.gradeLevel}
                                                    onChange={(e) => handleFilterChange('gradeLevel', e.target.value)}
                                                >
                                                    <option value="">Todos los grados</option>
                                                    {GRADE_LEVELS.map(grade => (
                                                        <option key={grade.value} value={grade.value}>
                                                            {grade.label}
                                                        </option>
                                                    ))}
                                                </CFormSelect>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="d-flex align-items-center">
                                                    <CFormSelect
                                                        value={currentAcademicYear}
                                                        onChange={(e) => {
                                                            if (e.target.value === 'new') {
                                                                handleCreateNextYear()
                                                            } else {
                                                                setCurrentAcademicYear(e.target.value)
                                                            }
                                                        }}
                                                        className="fw-bold text-primary"
                                                    >
                                                        {availableYears.map(year => (
                                                            <option key={year} value={year}>{year}</option>
                                                        ))}
                                                        <option value="new">+ Nuevo Año...</option>
                                                    </CFormSelect>
                                                </div>
                                            </div>
                                        </div>

                                        {(filters.gradeLevel || searchTerm) && (
                                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                                <div className="small text-muted">
                                                    Filtros activos:
                                                    {filters.gradeLevel && <CBadge color="info" className="ms-2">{filters.gradeLevel}</CBadge>}
                                                </div>
                                                <CButton
                                                    size="sm"
                                                    color="secondary"
                                                    variant="ghost"
                                                    onClick={clearFilters}
                                                >
                                                    Limpiar Filtros
                                                </CButton>
                                            </div>
                                        )}
                                    </div>

                                    {currentPageData.length > 0 ? (
                                        <>
                                            <CRow className="g-4">
                                                {currentPageData.map(section => (
                                                    <CCol key={section.id} lg={4} md={6}>
                                                        <CCard className="shadow-sm h-100">
                                                            <CCardBody className="d-flex flex-column">
                                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                                    <div>
                                                                        <CCardTitle className="mb-1">
                                                                            {section.sectionName}
                                                                        </CCardTitle>
                                                                        <small className="text-muted">
                                                                            ID: #{section.id}
                                                                        </small>
                                                                    </div>

                                                                </div>

                                                                <div className="mb-3">
                                                                    <div className="d-flex align-items-center mb-2">
                                                                        <CIcon icon={cilGroup} className="me-2 text-primary" size="sm" />
                                                                        <span>{section.gradeLevel}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="mb-3 flex-grow-1">
                                                                    <h6 className="text-muted mb-2">Resumen del Horario:</h6>
                                                                    <div className="row g-2 small">
                                                                        <CCol md={6}>
                                                                            <div className="d-flex align-items-center mb-1">
                                                                                <CIcon icon={cilCalendar} className="me-2 text-primary" size="xs" />
                                                                                <span>{section.schedules?.length || 0} clases</span>
                                                                            </div>
                                                                        </CCol>
                                                                        <CCol md={6}>
                                                                            <div className="d-flex align-items-center mb-1">
                                                                                <CIcon icon={cilClock} className="me-2 text-primary" size="xs" />
                                                                                <span>{section.totalHoursPerWeek || 0} horas/sem</span>
                                                                            </div>
                                                                        </CCol>
                                                                    </div>

                                                                    <h6 className="text-muted mt-3 mb-2">Profesores:</h6>
                                                                    <div className="d-flex flex-wrap gap-1">
                                                                        {[...new Set(section.schedules?.map(s => s.teacherName) || [])].slice(0, 3).map((teacher, idx) => (
                                                                            <CBadge key={idx} color="info" className="me-1 mb-1">
                                                                                {teacher.split(' ')[0]}
                                                                            </CBadge>
                                                                        ))}
                                                                        {[...new Set(section.schedules?.map(s => s.teacherName) || [])].length > 3 && (
                                                                            <CBadge color="secondary" className="me-1 mb-1">
                                                                                +{[...new Set(section.schedules?.map(s => s.teacherName) || [])].length - 3}
                                                                            </CBadge>
                                                                        )}
                                                                    </div>

                                                                    <h6 className="text-muted mt-3 mb-2">Asignaturas:</h6>
                                                                    <div className="d-flex flex-wrap gap-1">
                                                                        {[...new Set(section.schedules?.map(s => s.subject) || [])].slice(0, 3).map((subject, idx) => (
                                                                            <CBadge key={idx} color="success" className="me-1 mb-1">
                                                                                {subject.split(' ')[0]}
                                                                            </CBadge>
                                                                        ))}
                                                                        {[...new Set(section.schedules?.map(s => s.subject) || [])].length > 3 && (
                                                                            <CBadge color="secondary" className="me-1 mb-1">
                                                                                +{[...new Set(section.schedules?.map(s => s.subject) || [])].length - 3}
                                                                            </CBadge>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="d-flex justify-content-between mt-3">
                                                                    <CButton
                                                                        size="sm"
                                                                        color="info"
                                                                        variant="outline"
                                                                        onClick={() => handleShowInfo(section)}
                                                                        className="d-flex align-items-center"
                                                                    >
                                                                        <CIcon icon={cilInfo} className="me-1" />
                                                                        Ver Horario Completo
                                                                    </CButton>
                                                                    <div>
                                                                        <CButton
                                                                            size="sm"
                                                                            color="primary"
                                                                            variant="outline"
                                                                            onClick={() => {
                                                                                setEditing(section)
                                                                                setShowForm(true)
                                                                            }}
                                                                            className="me-2"
                                                                        >
                                                                            <CIcon icon={cilPencil} />
                                                                        </CButton>
                                                                        <CButton
                                                                            size="sm"
                                                                            color="danger"
                                                                            variant="outline"
                                                                            onClick={() => showDeleteConfirmation(section.id, section.sectionName)}
                                                                        >
                                                                            <CIcon icon={cilTrash} />
                                                                        </CButton>
                                                                    </div>
                                                                </div>
                                                            </CCardBody>
                                                        </CCard>
                                                    </CCol>
                                                ))}
                                            </CRow>

                                            {totalPages > 1 && (
                                                <div className="mt-4 d-flex justify-content-center">
                                                    <Pagination
                                                        currentPage={currentPage}
                                                        totalPages={totalPages}
                                                        onPageChange={handlePageChange}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-5 rounded-3 border border-dashed">
                                            <div className="text-muted">
                                                <CIcon icon={cilCalendar} size="3xl" className="mb-3 text-secondary opacity-25" />
                                                <h5>{searchTerm || filters.gradeLevel ? 'No se encontraron secciones' : 'No hay secciones registradas'}</h5>
                                                <p className="text-secondary">
                                                    {searchTerm || filters.gradeLevel
                                                        ? 'Intenta con otros términos de búsqueda o elimina los filtros.'
                                                        : 'Crea una nueva sección con su horario para comenzar.'
                                                    }
                                                </p>
                                                {searchTerm || filters.gradeLevel ? (
                                                    <CButton
                                                        color="secondary"
                                                        variant="ghost"
                                                        onClick={clearFilters}
                                                    >
                                                        Limpiar Búsqueda
                                                    </CButton>
                                                ) : (
                                                    <CButton
                                                        color="primary"
                                                        onClick={() => {
                                                            setEditing(null)
                                                            setShowForm(true)
                                                        }}
                                                    >
                                                        Crear Primera Sección
                                                    </CButton>
                                                )}
                                            </div>
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
                onClose={() => {
                    setShowForm(false)
                    setEditing(null)
                }}
                onSave={handleSave}
                initial={editing}
                academicYear={currentAcademicYear}
            />

            <InfoHorario
                visible={showInfo}
                onClose={() => {
                    setShowInfo(false)
                    setSelectedSection(null)
                }}
                section={selectedSection}
            />

            <ConfirmationModal
                visible={deleteModal.visible}
                onClose={() => setDeleteModal({ visible: false, sectionId: null, sectionName: '' })}
                onConfirm={confirmDelete}
                title="Eliminar Sección"
                message={`¿Estás seguro de que deseas eliminar la sección "${deleteModal.sectionName}" y todos sus horarios? Esta acción no se puede deshacer.`}
                confirmText="Confirmar Eliminación"
                type="danger"
            />
        </CContainer >
    )
}

export default Horarios