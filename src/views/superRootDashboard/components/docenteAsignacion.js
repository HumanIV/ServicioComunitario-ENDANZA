import React, { useEffect, useState } from 'react'
import {
    CCard, CCardBody, CCardHeader, CContainer, CRow, CCol,
    CButton, CTable, CTableHead, CTableRow, CTableHeaderCell,
    CTableBody, CTableDataCell, CBadge, CSpinner,
    CToaster, CToast, CToastBody,
    CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilInfo, cilSearch, cilCheck,
    cilBan, cilLockLocked, cilStar, cilBookmark,
    cilArrowLeft, cilSpeedometer, cilChevronBottom, cilCalendar,
    cilUser, cilSchool
} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

// Componentes y servicios
import SearchInput from '../../../components/SearchInput'
import SystemMessageModal from '../../../components/SystemMessageModal'
import AsignarEspecialidadGradosModal from './AsignarModal'
import * as TeacherService from '../../../services/teacherService'
import { getAvailableYears } from '../../../services/configService'

const TeacherManagement = () => {
    const navigate = useNavigate()
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(false)
    const [toasts, setToasts] = useState([])

    // Estados para catálogos
    const [specialties, setSpecialties] = useState([])
    const [grades, setGrades] = useState([])

    // Estados para selector de años
    const [availableYears, setAvailableYears] = useState([])
    const [currentYear, setCurrentYear] = useState(null)

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(8)
    const [searchTerm, setSearchTerm] = useState('')

    // Estado para el modal de asignación
    const [showUnifiedModal, setShowUnifiedModal] = useState(false)
    const [selectedTeacherForModal, setSelectedTeacherForModal] = useState(null)

    useEffect(() => {
        fetchTeachers()
        fetchCatalogData()
        fetchYears()
    }, [])

    const fetchYears = async () => {
        try {
            const years = await getAvailableYears()
            setAvailableYears(Array.isArray(years) ? years : [])
            if (years.length > 0 && !currentYear) {
                const activeYear = years.find(y => y.active === true)
                setCurrentYear(activeYear || years[0])
            }
        } catch (error) {
            console.error("Error fetching years:", error)
            setAvailableYears([])
        }
    }

    async function fetchCatalogData() {
        try {
            const [specials, gradesData] = await Promise.all([
                TeacherService.getSpecialties(),
                TeacherService.getGrades()
            ])
            setSpecialties(specials || [])
            setGrades(gradesData || [])
        } catch (error) {
            console.error('Error fetching catalog data:', error)
        }
    }

    async function fetchTeachers() {
        setLoading(true)
        try {
            const res = await TeacherService.getTeachers()
            setTeachers(res || [])
        } catch (error) {
            console.error('Error fetching teachers:', error)
            showToast('Error al cargar docentes', 'danger')
        } finally {
            setLoading(false)
        }
    }

    const showToast = (message, color = 'success') => {
        setToasts(prev => [...prev, { id: Date.now(), message, color }])
    }

    const handleUnifiedSave = async (teacherId, data) => {
        try {
            if (data.specialtyId && currentYear) {
                await TeacherService.assignSpecialtyByYear(teacherId, data.specialtyId, currentYear.id)
            }

            if (data.gradeIds.length > 0 && currentYear) {
                await TeacherService.assignGrades(teacherId, data.gradeIds, currentYear.id)
            }

            showToast('Asignaciones guardadas correctamente', 'success')
            fetchTeachers() // Recargar para ver cambios
            setShowUnifiedModal(false)
        } catch (error) {
            console.error('Error saving assignments:', error)
            showToast('Error al guardar asignaciones', 'danger')
        }
    }

    const handleCopyPreviousYearAssignments = async () => {
        if (!currentYear) {
            showToast('Selecciona un año académico', 'warning')
            return
        }

        try {
            const previousYearId = currentYear.id - 1
            const response = await TeacherService.copyTeacherAssignments(previousYearId, currentYear.id)

            if (response.ok) {
                showToast(`✅ Se copiaron las asignaciones del año anterior a ${currentYear.name}`, 'success')
                fetchTeachers()
            } else {
                showToast(response.message || 'Error al copiar asignaciones', 'danger')
            }
        } catch (error) {
            console.error('Error copying assignments:', error)
            showToast('Error al copiar asignaciones', 'danger')
        }
    }

    const filteredTeachers = teachers.filter(teacher => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        return (
            teacher.first_name?.toLowerCase().includes(searchLower) ||
            teacher.last_name?.toLowerCase().includes(searchLower) ||
            teacher.dni?.toLowerCase().includes(searchLower) ||
            teacher.email?.toLowerCase().includes(searchLower)
        )
    })

    const getSpecialtyBadge = (teacher) => {
        const currentYearSpecialty = currentYear && teacher.specialties
            ? teacher.specialties.find(s => s.academicYearId === currentYear.id)
            : null

        const specialtyName = currentYearSpecialty?.name || teacher.specialty || null

        if (!specialtyName) {
            return <CBadge color="secondary" className="rounded-pill px-3 py-2 opacity-50">Sin asignar</CBadge>
        }

        return (
            <CBadge style={{ background: 'rgba(224,122,0,0.1)', color: '#E07A00', border: '1px solid rgba(224,122,0,0.2)' }} className="rounded-pill px-3 py-2">
                <CIcon icon={cilStar} className="me-1" size="sm" />
                {specialtyName.toUpperCase()}
            </CBadge>
        )
    }

    const getGradeBadges = (allGrades = []) => {
        const filteredGrades = currentYear
            ? allGrades.filter(g => g.academicYearId === currentYear.id)
            : allGrades

        if (filteredGrades.length === 0) {
            return <span className="small text-muted">Sin asignaciones</span>
        }

        return (
            <div className="d-flex gap-1 flex-wrap">
                {filteredGrades.slice(0, 3).map(grade => (
                    <CBadge key={grade.id} className="rounded-pill px-2 py-1 fw-normal" style={{ background: 'rgba(224,122,0,0.08)', color: '#E07A00', border: '1px solid rgba(224,122,0,0.1)' }}>
                        {grade.name}
                    </CBadge>
                ))}
                {filteredGrades.length > 3 && (
                    <CBadge className="rounded-pill px-2 py-1" style={{ background: 'rgba(0,0,0,0.03)', color: '#666', border: '1px solid rgba(0,0,0,0.1)' }}>
                        +{filteredGrades.length - 3}
                    </CBadge>
                )}
            </div>
        )
    }

    return (
        <CContainer fluid className="mt-4 pb-5">
            <div className="mb-4">
                <CRow className="align-items-center">
                    <CCol xs={12} md={6}>
                        <div className="d-flex align-items-center">
                            <CButton
                                className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm border-0"
                                style={{ width: '48px', height: '48px', background: 'linear-gradient(145deg, #E07A00, #C66900)', color: 'white' }}
                                onClick={() => navigate('/dashboard')}
                            >
                                <CIcon icon={cilArrowLeft} size="lg" />
                            </CButton>
                            <div>
                                <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                    Dashboard / <span style={{ color: '#E07A00' }}>Gestión de Docentes</span>
                                </h5>
                            </div>
                        </div>
                    </CCol>
                    <CCol xs={12} md={6} className="d-flex justify-content-md-end mt-3 mt-md-0 gap-2">
                        <CButton
                            className="d-flex align-items-center px-3 py-2 rounded-pill border-0"
                            style={{ background: 'rgba(224,122,0,0.1)', color: '#E07A00' }}
                            onClick={handleCopyPreviousYearAssignments}
                        >
                            <CIcon icon={cilCalendar} className="me-2" />
                            <span className="d-none d-md-inline">Copiar del año anterior</span>
                        </CButton>

                        <CDropdown>
                            <CDropdownToggle className="rounded-pill px-3 py-2 border-0" style={{ background: 'white', border: '1px solid rgba(224,122,0,0.2)', color: '#E07A00' }}>
                                <CIcon icon={cilSchool} className="me-2" />
                                <span>CICLO {currentYear?.name || '...'}</span>
                                <CIcon icon={cilChevronBottom} className="ms-2 opacity-50" size="sm" />
                            </CDropdownToggle>
                            <CDropdownMenu>
                                {availableYears.map(year => (
                                    <CDropdownItem key={year.id} onClick={() => setCurrentYear(year)} active={currentYear?.id === year.id}>
                                        Período {year.name}
                                    </CDropdownItem>
                                ))}
                            </CDropdownMenu>
                        </CDropdown>
                    </CCol>
                </CRow>
            </div>

            <CCard className="shadow-sm border-0 mb-4 rounded-4 overflow-hidden">
                <CCardHeader className="bg-white p-4 border-0">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="fw-bold mb-0">Gestión de Docentes</h4>
                    </div>
                </CCardHeader>
                <CCardBody className="p-4">
                    <div className="mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                        <div className="small fw-bold text-muted">
                            Total Docentes: <span style={{ color: '#E07A00' }}>{filteredTeachers.length}</span>
                        </div>
                        <div style={{ maxWidth: '400px', width: '100%' }}>
                            <SearchInput
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nombre, DNI o email..."
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <CSpinner color="warning" />
                            <p className="mt-2 text-muted">Cargando docentes...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <CTable align="middle" hover className="mb-0">
                                <CTableHead className="bg-light bg-opacity-50">
                                    <CTableRow>
                                        <CTableHeaderCell className="border-0">DOCENTE</CTableHeaderCell>
                                        <CTableHeaderCell className="border-0">CONTACTO</CTableHeaderCell>
                                        <CTableHeaderCell className="border-0">ESPECIALIDAD</CTableHeaderCell>
                                        <CTableHeaderCell className="border-0">GRADOS</CTableHeaderCell>
                                        <CTableHeaderCell className="border-0 text-end pe-4">ACCIONES</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredTeachers.map(teacher => (
                                        <CTableRow key={teacher.id}>
                                            <CTableDataCell>
                                                <div className="fw-bold">{teacher.first_name} {teacher.last_name}</div>
                                                <div className="small text-muted">{teacher.dni}</div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div className="small">{teacher.email}</div>
                                                <div className="small text-muted">{teacher.phone || 'S/T'}</div>
                                            </CTableDataCell>
                                            <CTableDataCell>{getSpecialtyBadge(teacher)}</CTableDataCell>
                                            <CTableDataCell>{getGradeBadges(teacher.grades)}</CTableDataCell>
                                            <CTableDataCell className="text-end pe-4">
                                                <CButton
                                                    color="warning"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="rounded-circle p-2"
                                                    onClick={() => {
                                                        setSelectedTeacherForModal(teacher)
                                                        setShowUnifiedModal(true)
                                                    }}
                                                >
                                                    <CIcon icon={cilStar} />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </div>
                    )}
                </CCardBody>
            </CCard>

            <AsignarEspecialidadGradosModal
                visible={showUnifiedModal}
                teacher={selectedTeacherForModal}
                specialties={specialties}
                grades={grades}
                onSave={handleUnifiedSave}
                currentYear={currentYear}
                onClose={() => setShowUnifiedModal(false)}
            />

            <CToaster push={toasts} placement="top-end">
                {toasts.map(toast => (
                    <CToast key={toast.id} color={toast.color}>
                        <CToastBody className="text-white">{toast.message}</CToastBody>
                    </CToast>
                ))}
            </CToaster>
        </CContainer>
    )
}

export default TeacherManagement
