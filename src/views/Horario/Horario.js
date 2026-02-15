// src/views/horarios/Horarios.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react'
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
    CToaster,
    CToast,
    CToastBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilCalendar, cilSchool, cilChevronBottom, cilArrowLeft } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

// Servicios reales
import { 
    getAllSections, 
    deleteSection, 
    adaptSectionFromDB,
    createSection,  // ← IMPORTANTE: Ahora espera 2 parámetros
    updateSection    // ← IMPORTANTE: Para editar
} from '../../services/scheduleService'
import { getAvailableYears } from '../../services/configService'

// Componentes
import HorarioForm from './HorarioForm'
import InfoHorario from './InfoHorario'
import SystemMessageModal from '../../components/SystemMessageModal'
import Pagination from '../../components/Pagination'
import ScheduleCard from './components/ScheduleCard'
import ScheduleFilters from './components/ScheduleFilters'

// Constantes
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

const Horarios = () => {
    const navigate = useNavigate()
    
    // ---------------------- ESTADOS ---------------------- //
    const [sections, setSections] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [editing, setEditing] = useState(null)
    const [selectedSection, setSelectedSection] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(9)
    const [searchTerm, setSearchTerm] = useState('')
    const [availableYears, setAvailableYears] = useState([])
    const [currentYear, setCurrentYear] = useState(null)
    const [filters, setFilters] = useState({ gradeLevel: '' })
    const [deleteModal, setDeleteModal] = useState({ visible: false, sectionId: null, sectionName: '' })
    const [toasts, setToasts] = useState([])

    // ---------------------- EFECTOS ---------------------- //
    useEffect(() => {
        loadInitialData()
    }, [])

    useEffect(() => {
        if (currentYear) {
            fetchSections()
        }
    }, [currentYear, filters])

    // ---------------------- FUNCIONES AUXILIARES ---------------------- //
    const showToast = (message, color = 'success') => {
        setToasts(prev => [...prev, { id: Date.now(), message, color }])
    }

    // ---------------------- CARGA DE DATOS ---------------------- //
    const loadInitialData = async () => {
        try {
            // Cargar años académicos desde configService
            const years = await getAvailableYears()
            console.log('📅 Años cargados:', years)
            setAvailableYears(Array.isArray(years) ? years : [])
            
            if (years.length > 0) {
                // Buscar año activo o usar el primero
                const activeYear = years.find(y => y.active === true)
                setCurrentYear(activeYear || years[0])
            }
        } catch (error) {
            console.error("Error loading initial data:", error)
            showToast('Error al cargar datos iniciales', 'danger')
        }
    }

    const fetchSections = async () => {
        if (!currentYear) return
        
        setLoading(true)
        try {
            console.log(`📥 Cargando secciones para año ${currentYear.id}...`)
            const data = await getAllSections(currentYear.id)
            console.log('📋 Secciones recibidas:', data)
            
            // Adaptar datos de BD al formato del frontend
            const adaptedData = data.map(section => adaptSectionFromDB(section))
            setSections(adaptedData)
        } catch (error) {
            console.error('Error fetching sections:', error)
            showToast('Error al cargar secciones', 'danger')
            setSections([])
        } finally {
            setLoading(false)
        }
    }

    // ---------------------- FILTRADO Y PAGINACIÓN ---------------------- //
    const filteredSections = useMemo(() => {
        return sections.filter(section => {
            // Filtro por búsqueda
            let matchesSearch = true
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase()
                matchesSearch = (
                    section.sectionName?.toLowerCase().includes(searchLower) ||
                    section.gradeLevel?.toLowerCase().includes(searchLower) ||
                    section.id?.toString().includes(searchTerm)
                )
            }
            
            // Filtro por nivel/grado
            let matchesGrade = true
            if (filters.gradeLevel) {
                matchesGrade = section.gradeLevel === filters.gradeLevel
            }
            
            return matchesSearch && matchesGrade
        })
    }, [sections, searchTerm, filters])

    const currentPageData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredSections.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredSections, currentPage, itemsPerPage])

    const totalPages = Math.ceil(filteredSections.length / itemsPerPage)

    // ---------------------- ACCIONES CRUD - VERSIÓN CORREGIDA ---------------------- //
    // src/views/horarios/Horarios.jsx - handleSave CORREGIDO
const handleSave = useCallback(async (newSection) => {
    try {
        // newSection ya viene creada desde HorarioForm
        console.log('✅ Sección recibida del formulario:', newSection);
        
        // Solo recargar la lista
        await fetchSections();
        
        showToast('Operación completada exitosamente');
        
    } catch (error) {
        console.error('❌ Error en handleSave:', error);
        showToast(error.message || 'Error al guardar', 'danger');
    }
}, [fetchSections]);

   // src/views/horarios/Horarios.jsx - handleDelete MEJORADO

const handleDelete = async () => {
    try {
        await deleteSection(deleteModal.sectionId)
        showToast('Sección eliminada correctamente', 'success')
        setDeleteModal({ visible: false, sectionId: null, sectionName: '' })
        fetchSections()
    } catch (error) {
        console.error('Error deleting section:', error)
        
        // Mensaje más específico según el error
        if (error.message.includes('viola la llave foránea') || 
            error.message.includes('estudiantes asociados')) {
            showToast(
                `No se puede eliminar "${deleteModal.sectionName}" porque tiene estudiantes inscritos.`,
                'warning'
            )
        } else {
            showToast(error.message || 'Error al eliminar sección', 'danger')
        }
        
        setDeleteModal({ visible: false, sectionId: null, sectionName: '' })
    }
}

    const confirmDelete = () => {
        if (deleteModal.sectionId) handleDelete()
    }

    // Función para abrir el formulario de edición
    const handleEdit = (section) => {
        console.log('📝 Editando sección:', section)
        setEditing(section)
        setShowForm(true)
    }

    // ---------------------- RENDER ---------------------- //
    return (
        <CContainer fluid className="mt-4 pb-5">
            {/* Botón de regreso y selector de año */}
            <div className="mb-4">
                <CRow className="align-items-center">
                    <CCol xs={12} md={6}>
                        <div className="d-flex align-items-center">
                            <CButton
                                className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm border-0"
                                style={{ 
                                    width: '48px', 
                                    height: '48px', 
                                    background: 'linear-gradient(145deg, #E07A00, #C66900)',
                                    color: 'white'
                                }}
                                onClick={() => navigate('/dashboard')}
                            >
                                <CIcon icon={cilArrowLeft} size="lg" />
                            </CButton>
                            <div>
                                <h5 className="fw-bold mb-0 d-flex align-items-center" style={{ color: '#1e293b' }}>
                                    <CIcon icon={cilCalendar} className="me-2" style={{ color: '#E07A00' }} size="sm" />
                                    Dashboard / <span style={{ color: '#E07A00' }}>Gestión de Horarios</span>
                                </h5>
                            </div>
                        </div>
                    </CCol>
                    <CCol xs={12} md={6} className="d-flex justify-content-md-end mt-3 mt-md-0">
                        <CDropdown>
                            <CDropdownToggle
                                className="d-flex align-items-center px-3 py-2 rounded-pill"
                                style={{
                                    background: 'white',
                                    border: '1px solid rgba(224,122,0,0.2)',
                                    color: '#E07A00'
                                }}
                            >
                                <CIcon icon={cilSchool} className="me-2" />
                                <span>CICLO {currentYear?.name || 'CARGANDO...'}</span>
                                <CIcon icon={cilChevronBottom} className="ms-2" size="sm" />
                            </CDropdownToggle>
                            <CDropdownMenu>
                                {availableYears.map(year => (
                                    <CDropdownItem
                                        key={year.id}
                                        onClick={() => {
                                            setCurrentYear(year)
                                            setCurrentPage(1)
                                        }}
                                        active={currentYear?.id === year.id}
                                    >
                                        Período {year.name}
                                    </CDropdownItem>
                                ))}
                            </CDropdownMenu>
                        </CDropdown>
                    </CCol>
                </CRow>
            </div>

            <CCard className="shadow-lg border-0" style={{ borderRadius: '24px' }}>
                <div style={{ 
                    height: '8px', 
                    borderTopLeftRadius: '24px', 
                    borderTopRightRadius: '24px',
                    background: 'linear-gradient(90deg, #E07A00, #F39C12, #E07A00)'
                }}></div>
                
                <CCardHeader className="bg-transparent border-0 pt-4 px-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h3 className="fw-bold mb-1 d-flex align-items-center" style={{ color: '#1e293b' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'linear-gradient(145deg, #E07A00, #C66900)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '16px'
                                }}>
                                    <CIcon icon={cilCalendar} className="text-white" size="lg" />
                                </div>
                                Gestión de Horarios
                            </h3>
                            <p className="mb-0 small" style={{ color: '#64748b', marginLeft: '64px' }}>
                                Administración de secciones y cargas horarias por período
                            </p>
                        </div>
                    </div>
                </CCardHeader>

                <CCardBody className="p-4">
                    {loading ? (
                        <div className="text-center py-5">
                            <CSpinner style={{ color: '#E07A00' }} />
                            <p className="mt-3 text-muted">Cargando horarios...</p>
                        </div>
                    ) : (
                        <>
                            <ScheduleFilters
                                searchTerm={searchTerm}
                                onSearch={(val) => { setSearchTerm(val); setCurrentPage(1) }}
                                gradeLevel={filters.gradeLevel}
                                onFilterChange={(name, val) => { setFilters(prev => ({ ...prev, [name]: val })); setCurrentPage(1) }}
                                gradeLevels={GRADE_LEVELS}
                                onClear={() => { setFilters({ gradeLevel: '' }); setSearchTerm(''); setCurrentPage(1) }}
                                activeFilters={{ totalResults: filteredSections.length }}
                                extraAction={
                                    <CButton
                                        onClick={() => { setEditing(null); setShowForm(true) }}
                                        className="px-4 py-2 d-flex align-items-center border-0"
                                        style={{
                                            background: 'linear-gradient(145deg, #E07A00, #C66900)',
                                            color: 'white',
                                            borderRadius: '14px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        <CIcon icon={cilPlus} className="me-2" />
                                        NUEVA SECCIÓN
                                    </CButton>
                                }
                            />

                            {currentPageData.length > 0 ? (
                                <>
                                    <div className="mb-3 text-muted small fw-bold">
                                        Mostrando horarios del {currentYear?.name}
                                    </div>
                                    <CRow className="g-4">
                                        {currentPageData.map(section => (
                                            <ScheduleCard
                                                key={section.id}
                                                section={section}
                                                onShowInfo={(s) => { setSelectedSection(s); setShowInfo(true) }}
                                                onEdit={handleEdit}
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
                                <div className="text-center py-5">
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        background: 'rgba(224,122,0,0.1)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 20px'
                                    }}>
                                        <CIcon icon={cilCalendar} size="3xl" style={{ color: '#E07A00', opacity: 0.5 }} />
                                    </div>
                                    <h5 style={{ color: '#1e293b', fontWeight: '600' }}>
                                        {searchTerm || filters.gradeLevel ? 'No se encontraron secciones' : 'No hay secciones registradas'}
                                    </h5>
                                    {currentYear && (
                                        <p className="text-muted small">
                                            Para el período {currentYear.name}
                                        </p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </CCardBody>
            </CCard>

            {/* MODALES */}
            <HorarioForm
                visible={showForm}
                onClose={() => { setShowForm(false); setEditing(null) }}
                onSave={handleSave}
                initial={editing}
                academicYear={currentYear}
            />

            <InfoHorario
                visible={showInfo}
                onClose={() => { setShowInfo(false); setSelectedSection(null) }}
                section={selectedSection}
            />

            <SystemMessageModal
                visible={deleteModal.visible}
                onClose={() => setDeleteModal({ visible: false, sectionId: null, sectionName: '' })}
                onConfirm={confirmDelete}
                variant="confirm"
                type="error"
                title="Eliminar Sección"
                message={`¿Eliminar la sección "${deleteModal.sectionName}"?`}
                confirmText="ELIMINAR"
            />

            <CToaster placement="top-end">
                {toasts.map(t => (
                    <CToast key={t.id} autohide={true} visible={true} color={t.color} className="text-white">
                        <CToastBody>{t.message}</CToastBody>
                    </CToast>
                ))}
            </CToaster>
        </CContainer>
    )
}

export default Horarios