import React, { useEffect, useState } from 'react'
import {
    CCard, CCardBody, CCardHeader, CContainer, CRow, CCol,
    CButton, CButtonGroup, CTable, CTableHead, CTableRow, CTableHeaderCell,
    CTableBody, CTableDataCell, CBadge, CSpinner,
    CToaster, CToast, CToastHeader, CToastBody,
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CFormSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPlus, cilPencil, cilTrash, cilUser, cilSchool,
    cilInfo, cilSearch, cilCheckCircle,
    cilBan, cilCheck, cilLockLocked, cilStar, cilBookmark,
    cilArrowLeft, cilSpeedometer
} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

// Componentes reutilizados
import TeacherForm from './docenteForm'
import InfoTeacher from './infoDocente'
import AvatarLetter from '../../../components/AvatarLetter'
import SearchInput from '../../../components/SearchInput'
import Pagination from '../../../components/Pagination'
import SystemMessageModal from '../../../components/SystemMessageModal'

// ✅ SERVICIO CORREGIDO - IMPORTACIÓN ÚNICA
import * as TeacherService from '../../../services/teacherService'

const TeacherManagement = () => {
    const navigate = useNavigate()
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [editing, setEditing] = useState(null)
    const [selectedTeacher, setSelectedTeacher] = useState(null)
    const [toasts, setToasts] = useState([])

    // Estados para asignación de especialidad
    const [showSpecialtyModal, setShowSpecialtyModal] = useState(false)
    const [showGradeModal, setShowGradeModal] = useState(false)
    const [actionTeacher, setActionTeacher] = useState(null)
    
    // Datos de catálogos
    const [specialties, setSpecialties] = useState([])
    const [grades, setGrades] = useState([])
    const [selectedSpecialty, setSelectedSpecialty] = useState('')
    const [selectedGrades, setSelectedGrades] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(8)
    const [searchTerm, setSearchTerm] = useState('')

    const [deleteModal, setDeleteModal] = useState({
        visible: false,
        teacherId: null,
        teacherName: ''
    })

    useEffect(() => {
        fetchTeachers()
        fetchCatalogData()
    }, [])

    // ✅ CORREGIDO: Usar TeacherService en lugar de servicios antiguos
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
            // Datos de respaldo SOLO para desarrollo
            if (process.env.NODE_ENV === 'development') {
                setSpecialties([
                    { id: 1, name: 'Danza Clásica' },
                    { id: 2, name: 'Ballet Inicial' },
                    { id: 3, name: 'Jazz Contemporáneo' },
                    { id: 4, name: 'Pre-Ballet' },
                    { id: 5, name: 'Acrodanza' },
                    { id: 6, name: 'Danza Moderna' }
                ])
                setGrades([
                    { id: 1, name: 'Baby Ballet', level: 'Inicial' },
                    { id: 2, name: 'Preparatorio', level: 'Inicial' },
                    { id: 3, name: '1er Grado', level: 'Básica' },
                    { id: 4, name: '2do Grado', level: 'Básica' },
                    { id: 5, name: '3er Grado', level: 'Básica' },
                    { id: 6, name: '4to Grado', level: 'Básica' }
                ])
            }
        }
    }

    async function fetchTeachers() {
        setLoading(true)
        try {
            const res = await TeacherService.getAll()
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

    const filteredTeachers = teachers.filter(teacher => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        return (
            teacher.first_name?.toLowerCase().includes(searchLower) ||
            teacher.last_name?.toLowerCase().includes(searchLower) ||
            teacher.dni?.toLowerCase().includes(searchLower) ||
            teacher.email?.toLowerCase().includes(searchLower) ||
            teacher.specialty?.toLowerCase().includes(searchLower)
        )
    })

    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage)
    const currentPageData = filteredTeachers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    async function handleSave(payload) {
        try {
            if (editing) {
                await TeacherService.update(editing.id, payload)
                showToast('Docente actualizado correctamente')
            } else {
                await TeacherService.create(payload)
                showToast('Docente registrado exitosamente')
            }
            setShowForm(false)
            setEditing(null)
            fetchTeachers()
        } catch (error) {
            showToast(error.message || 'Error al procesar la solicitud', 'danger')
        }
    }

    async function handleDelete() {
        try {
            await TeacherService.remove(deleteModal.teacherId)
            showToast('Docente eliminado del sistema', 'warning')
            setDeleteModal({ visible: false, teacherId: null, teacherName: '' })
            fetchTeachers()
        } catch (error) {
            showToast(error.message || 'Error al eliminar docente', 'danger')
        }
    }

    // ============================================
    // ASIGNACIÓN DE ESPECIALIDAD - CORREGIDO
    // ============================================
    const openSpecialtyModal = (teacher) => {
        setActionTeacher(teacher)
        setSelectedSpecialty(teacher.specialty || '')
        setShowSpecialtyModal(true)
    }

    async function handleSpecialtyUpdate() {
        if (!actionTeacher || !selectedSpecialty) return
        try {
            const result = await TeacherService.assignSpecialty(actionTeacher.id, selectedSpecialty)
            showToast(`Especialidad asignada: ${selectedSpecialty}`)
            
            // ✅ ACTUALIZAR EL DOCENTE EN EL ESTADO LOCAL INMEDIATAMENTE
            setTeachers(prevTeachers => 
                prevTeachers.map(teacher => 
                    teacher.id === actionTeacher.id 
                        ? { ...teacher, specialty: selectedSpecialty }
                        : teacher
                )
            )
            
            setShowSpecialtyModal(false)
            setActionTeacher(null)
            setSelectedSpecialty('')
            
            // ✅ Recargar para asegurar consistencia
            fetchTeachers()
        } catch (error) {
            showToast(error.message || 'Error al asignar especialidad', 'danger')
        }
    }

    // ============================================
    // ASIGNACIÓN DE GRADOS - VERSIÓN CORREGIDA Y MEJORADA
    // ============================================
    const openGradeModal = (teacher) => {
        setActionTeacher(teacher)
        setSelectedGrades(teacher.grades?.map(g => g.id) || [])
        setShowGradeModal(true)
    }

    const handleGradeToggle = (gradeId) => {
        setSelectedGrades(prev => {
            if (prev.includes(gradeId)) {
                return prev.filter(id => id !== gradeId)
            } else {
                return [...prev, gradeId]
            }
        })
    }

    // ✅ FUNCIÓN COMPLETAMENTE CORREGIDA
    async function handleGradeUpdate() {
        if (!actionTeacher) return;
        
        // Mostrar toast de procesando
        showToast('Asignando grados...', 'info');
        
        try {
            const result = await TeacherService.assignGrades(actionTeacher.id, selectedGrades);
            
            // Crear array de grados con nombres
            const updatedGrades = selectedGrades.map(id => {
                const grade = grades.find(g => g.id === id);
                return { 
                    id, 
                    name: grade?.name || `Grado ${id}`,
                    level: grade?.level || 'danza'
                };
            });
            
            // ✅ ACTUALIZAR EL DOCENTE EN EL ESTADO LOCAL INMEDIATAMENTE
            setTeachers(prevTeachers => 
                prevTeachers.map(teacher => 
                    teacher.id === actionTeacher.id 
                        ? { 
                            ...teacher, 
                            grades: updatedGrades
                          }
                        : teacher
                )
            );
            
            showToast(`${selectedGrades.length} grado(s) asignado(s) correctamente`, 'success');
            
            setShowGradeModal(false);
            setActionTeacher(null);
            setSelectedGrades([]);
            
            // ✅ Recargar para asegurar consistencia con el backend
            setTimeout(() => {
                fetchTeachers();
            }, 300);
            
        } catch (error) {
            console.error('Error asignando grados:', error);
            showToast(error.message || 'Error al asignar grados', 'danger');
        }
    }

    // ============================================
    // RENDERIZADO DE BADGES
    // ============================================
    const getSpecialtyBadge = (specialty) => {
        if (!specialty || specialty === 'Sin asignar') {
            return (
                <CBadge color="secondary" className="rounded-pill px-3 py-2 bg-opacity-10 text-secondary">
                    <CIcon icon={cilBan} className="me-1" size="sm" />
                    SIN ASIGNAR
                </CBadge>
            )
        }
        return (
            <CBadge className="rounded-pill px-3 py-2" style={{ backgroundColor: 'rgba(224,122,0,0.1)', color: '#E07A00' }}>
                <CIcon icon={cilStar} className="me-1" size="sm" />
                {specialty.toUpperCase()}
            </CBadge>
        )
    }

    const getGradeBadges = (grades) => {
        if (!grades || grades.length === 0) {
            return (
                <span className="text-muted-custom small fw-medium">Sin grados asignados</span>
            )
        }
        return (
            <div className="d-flex gap-1 flex-wrap">
                {grades.slice(0, 3).map(grade => (
                    <CBadge 
                        key={grade.id} 
                        className="rounded-pill px-2 py-1 fw-normal"
                        style={{ backgroundColor: 'rgba(224,122,0,0.05)', color: '#E07A00', border: '1px solid rgba(224,122,0,0.2)' }}
                    >
                        {grade.name}
                    </CBadge>
                ))}
                {grades.length > 3 && (
                    <CBadge 
                        className="rounded-pill px-2 py-1"
                        style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#666' }}
                    >
                        +{grades.length - 3}
                    </CBadge>
                )}
            </div>
        )
    }

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase()
        const config = {
            'active': { color: 'success', text: 'Activo', icon: cilCheck },
            'suspended': { color: 'warning', text: 'Suspendido', icon: cilBan },
            'inactive': { color: 'secondary', text: 'Inactivo', icon: cilLockLocked }
        }[s] || { color: 'secondary', text: status, icon: cilUser }
        return (
            <CBadge color={config.color} className="d-flex align-items-center gap-1 px-3 py-2 rounded-pill">
                <CIcon icon={config.icon} size="sm" />
                {config.text.toUpperCase()}
            </CBadge>
        )
    }

    return (
        <CContainer fluid className="mt-4 pb-5">
            {/* BOTÓN DE REGRESO */}
            <div className="mb-4 d-flex align-items-center">
                <CButton
                    color="light"
                    className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm border-0"
                    style={{ width: '48px', height: '48px', backgroundColor: 'rgba(224,122,0,0.1)' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(224,122,0,0.2)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(224,122,0,0.1)'}
                    onClick={() => navigate('/dashboard')}
                >
                    <CIcon icon={cilArrowLeft} style={{ color: '#E07A00' }} size="lg" />
                </CButton>
                <div>
                    <h5 className="fw-bold mb-0 d-flex align-items-center">
                        <CIcon icon={cilSpeedometer} className="me-2" style={{ color: '#E07A00' }} size="sm" />
                        Dashboard / <span style={{ color: '#E07A00' }}>Gestión de Docentes</span>
                    </h5>
                </div>
            </div>

            <CCard className="shadow-lg border-0 mb-4" style={{ borderRadius: '20px' }}>
                <div style={{ height: '8px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', backgroundColor: '#E07A00' }}></div>
                <CCardHeader className="bg-light-custom border-0 pt-4 px-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h3 className="fw-bold mb-1">
                                <CIcon icon={cilSchool} className="me-2" style={{ color: '#E07A00' }} size="lg" />
                                Gestión de Docentes
                            </h3>
                            <p className="text-muted-custom mb-0 small">Asignación de especialidades y grados académicos</p>
                        </div>
                        <div className="d-flex gap-2">
                            <CButton
                                className="px-4 d-flex align-items-center shadow-sm"
                                style={{ backgroundColor: '#E07A00', borderColor: '#E07A00', color: 'white' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#C66900'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#E07A00'}
                                onClick={() => { setEditing(null); setShowForm(true); }}
                            >
                                <CIcon icon={cilPlus} className="me-2" />
                                NUEVO DOCENTE
                            </CButton>
                        </div>
                    </div>
                </CCardHeader>
                <CCardBody className="p-4">
                    {/* BÚSQUEDA */}
                    <div className="mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                        <div className="small fw-bold">
                            Total Docentes: <span style={{ color: '#E07A00' }}>{filteredTeachers.length}</span>
                        </div>
                        <div style={{ maxWidth: '400px', width: '100%' }}>
                            <SearchInput
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                placeholder="Buscar docente..."
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <CSpinner style={{ color: '#E07A00' }} />
                        </div>
                    ) : currentPageData.length > 0 ? (
                        <>
                            <div className="table-responsive">
                                <CTable align="middle" hover>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell>DOCENTE</CTableHeaderCell>
                                            <CTableHeaderCell>CONTACTO</CTableHeaderCell>
                                            <CTableHeaderCell>ESPECIALIDAD</CTableHeaderCell>
                                            <CTableHeaderCell>GRADOS</CTableHeaderCell>
                                            <CTableHeaderCell>ESTADO</CTableHeaderCell>
                                            <CTableHeaderCell className="text-end">ACCIONES</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {currentPageData.map(teacher => (
                                            <CTableRow key={teacher.id}>
                                                <CTableDataCell>
                                                    <div className="d-flex align-items-center">
                                                        <AvatarLetter
                                                            name={teacher.first_name + ' ' + teacher.last_name}
                                                            size="md"
                                                            style={{ background: 'linear-gradient(135deg, #E07A00, #C66900)' }}
                                                        />
                                                        <div className="ms-3">
                                                            <div className="fw-bold">{teacher.first_name} {teacher.last_name}</div>
                                                            <div className="small text-muted">{teacher.dni}</div>
                                                        </div>
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div>{teacher.email}</div>
                                                    <div className="small text-muted">{teacher.phone || 'Sin teléfono'}</div>
                                                </CTableDataCell>
                                                <CTableDataCell>{getSpecialtyBadge(teacher.specialty)}</CTableDataCell>
                                                <CTableDataCell>{getGradeBadges(teacher.grades)}</CTableDataCell>
                                                <CTableDataCell>{getStatusBadge(teacher.status)}</CTableDataCell>
                                                <CTableDataCell className="text-end">
                                                    <CButtonGroup>
                                                        <CButton
                                                            color="light"
                                                            size="sm"
                                                            onClick={() => { setSelectedTeacher(teacher); setShowInfo(true); }}
                                                            title="Ver información"
                                                        >
                                                            <CIcon icon={cilInfo} style={{ color: '#E07A00' }} />
                                                        </CButton>
                                                        <CButton
                                                            color="light"
                                                            size="sm"
                                                            onClick={() => openSpecialtyModal(teacher)}
                                                            title="Asignar especialidad"
                                                        >
                                                            <CIcon icon={cilStar} style={{ color: '#E07A00' }} />
                                                        </CButton>
                                                        <CButton
                                                            color="light"
                                                            size="sm"
                                                            onClick={() => openGradeModal(teacher)}
                                                            title="Asignar grados"
                                                        >
                                                            <CIcon icon={cilBookmark} style={{ color: '#E07A00' }} />
                                                        </CButton>
                                                        <CButton
                                                            color="light"
                                                            size="sm"
                                                            onClick={() => { setEditing(teacher); setShowForm(true); }}
                                                            title="Editar"
                                                        >
                                                            <CIcon icon={cilPencil} style={{ color: '#E07A00' }} />
                                                        </CButton>
                                                        <CButton
                                                            color="light"
                                                            size="sm"
                                                            onClick={() => setDeleteModal({ 
                                                                visible: true, 
                                                                teacherId: teacher.id, 
                                                                teacherName: `${teacher.first_name} ${teacher.last_name}` 
                                                            })}
                                                            title="Eliminar"
                                                        >
                                                            <CIcon icon={cilTrash} style={{ color: '#E07A00' }} />
                                                        </CButton>
                                                    </CButtonGroup>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </div>
                            {totalPages > 1 && (
                                <div className="mt-4 d-flex justify-content-center">
                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-5">
                            <CIcon icon={cilSearch} size="3xl" className="text-muted opacity-25 mb-3" />
                            <h5 className="text-muted">No se encontraron docentes</h5>
                        </div>
                    )}
                </CCardBody>
            </CCard>

            {/* MODAL ASIGNAR ESPECIALIDAD */}
            <CModal visible={showSpecialtyModal} onClose={() => setShowSpecialtyModal(false)} alignment="center">
                <CModalHeader>
                    <CModalTitle>Asignar Especialidad</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p><strong>Docente:</strong> {actionTeacher?.first_name} {actionTeacher?.last_name}</p>
                    <CFormSelect 
                        value={selectedSpecialty} 
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                    >
                        <option value="">-- Selecciona especialidad --</option>
                        {specialties.map(spec => (
                            <option key={spec.id} value={spec.name}>{spec.name}</option>
                        ))}
                    </CFormSelect>
                </CModalBody>
                <CModalFooter>
                    <CButton color="light" onClick={() => setShowSpecialtyModal(false)}>CANCELAR</CButton>
                    <CButton
                        style={{ backgroundColor: '#E07A00', borderColor: '#E07A00', color: 'white' }}
                        onClick={handleSpecialtyUpdate}
                        disabled={!selectedSpecialty}
                    >
                        ASIGNAR
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* MODAL ASIGNAR GRADOS - CORREGIDO */}
            <CModal visible={showGradeModal} onClose={() => setShowGradeModal(false)} size="lg" alignment="center">
                <CModalHeader>
                    <CModalTitle>Asignar Grados</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p><strong>Docente:</strong> {actionTeacher?.first_name} {actionTeacher?.last_name}</p>
                    <CRow className="g-2">
                        {grades.map(grade => (
                            <CCol xs={6} md={4} key={grade.id}>
                                <CButton
                                    className="w-100"
                                    color={selectedGrades.includes(grade.id) ? "primary" : "light"}
                                    onClick={() => handleGradeToggle(grade.id)}
                                    style={selectedGrades.includes(grade.id) ? { backgroundColor: '#E07A00', borderColor: '#E07A00', color: 'white' } : {}}
                                >
                                    {grade.name}
                                </CButton>
                            </CCol>
                        ))}
                    </CRow>
                    <div className="mt-3">
                        <CBadge color="info" className="px-3 py-2">
                            {selectedGrades.length} grado(s) seleccionado(s)
                        </CBadge>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="light" onClick={() => setShowGradeModal(false)}>CANCELAR</CButton>
                    <CButton
                        style={{ backgroundColor: '#E07A00', borderColor: '#E07A00', color: 'white' }}
                        onClick={handleGradeUpdate}
                        disabled={selectedGrades.length === 0}
                    >
                        ASIGNAR {selectedGrades.length} GRADO(S)
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* COMPONENTES */}
            <TeacherForm 
                visible={showForm} 
                onClose={() => setShowForm(false)} 
                onSave={handleSave} 
                initial={editing} 
            />
            
            <InfoTeacher 
                visible={showInfo} 
                onClose={() => setShowInfo(false)} 
                teacher={selectedTeacher} 
            />
            
            <SystemMessageModal
                visible={deleteModal.visible}
                onClose={() => setDeleteModal({ visible: false, teacherId: null, teacherName: '' })}
                onConfirm={handleDelete}
                variant="confirm"
                type="error"
                title="Eliminar Docente"
                message={`¿Eliminar a "${deleteModal.teacherName}"?`}
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

export default TeacherManagement