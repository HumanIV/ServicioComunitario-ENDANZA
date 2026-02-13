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
import AsignarEspecialidadGradosModal from './AsignarModal'

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

    // Estados para asignación unificada
    const [showUnifiedModal, setShowUnifiedModal] = useState(false)
    const [actionTeacher, setActionTeacher] = useState(null)
    
    // Datos de catálogos
    const [specialties, setSpecialties] = useState([])
    const [grades, setGrades] = useState([])

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

    // ✅ CORREGIDO: SIN DATOS MOCK - SOLO BACKEND REAL
    async function fetchCatalogData() {
        try {
            const [specials, gradesData] = await Promise.all([
                TeacherService.getSpecialties(),
                TeacherService.getGrades()
            ])
            setSpecialties(specials || [])
            setGrades(gradesData || [])
            console.log('📚 Especialidades cargadas:', specials)
            console.log('📚 Grados cargados:', gradesData)
        } catch (error) {
            console.error('Error fetching catalog data:', error)
            setSpecialties([])
            setGrades([])
        }
    }

    async function fetchTeachers() {
        setLoading(true)
        try {
            const res = await TeacherService.getAll()
            setTeachers(res || [])
            console.log('👨‍🏫 Docentes cargados:', res)
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
    // MODAL UNIFICADO - ESPECIALIDAD + GRADOS
    // ============================================
    const openUnifiedModal = (teacher) => {
        setActionTeacher(teacher)
        setShowUnifiedModal(true)
    }

    async function handleUnifiedSave(teacherId, data) {
        try {
            // Guardar especialidad si se seleccionó
            if (data.specialty) {
                await TeacherService.assignSpecialty(teacherId, data.specialty)
            }
            
            // Guardar grados si se seleccionaron
            if (data.gradeIds.length > 0) {
                await TeacherService.assignGrades(teacherId, data.gradeIds)
            }
            
            showToast('Asignaciones guardadas correctamente', 'success')
            
            // Crear array de grados con nombres (usando datos reales)
            const updatedGrades = data.gradeIds.map(id => {
                const grade = grades.find(g => g.id === id)
                return { 
                    id, 
                    name: grade?.name || `Grado ${id}`,
                    level: grade?.level || 'danza'
                }
            })
            
            // ✅ ACTUALIZAR EL DOCENTE EN EL ESTADO LOCAL INMEDIATAMENTE
            setTeachers(prevTeachers => 
                prevTeachers.map(teacher => 
                    teacher.id === teacherId 
                        ? { 
                            ...teacher, 
                            specialty: data.specialty || teacher.specialty,
                            grades: updatedGrades
                          }
                        : teacher
                )
            )
            
            setShowUnifiedModal(false)
            setActionTeacher(null)
            
            // ✅ Recargar para asegurar consistencia con el backend
            setTimeout(() => {
                fetchTeachers()
            }, 300)
            
        } catch (error) {
            console.error('Error guardando asignaciones:', error)
            showToast(error.message || 'Error al guardar asignaciones', 'danger')
            throw error
        }
    }

    // ============================================
    // RENDERIZADO DE BADGES
    // ============================================
    const getSpecialtyBadge = (specialty) => {
        if (!specialty || specialty === 'Sin asignar') {
            return (
                <CBadge className="rounded-pill px-3 py-2" style={{ 
                    background: 'rgba(108, 117, 125, 0.1)',
                    color: '#6c757d',
                    border: 'none'
                }}>
                    <CIcon icon={cilBan} className="me-1" size="sm" />
                    SIN ASIGNAR
                </CBadge>
            )
        }
        return (
            <CBadge className="rounded-pill px-3 py-2" style={{ 
                background: 'linear-gradient(145deg, #E07A00, #C66900)',
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 8px rgba(224,122,0,0.2)'
            }}>
                <CIcon icon={cilStar} className="me-1" size="sm" />
                {specialty.toUpperCase()}
            </CBadge>
        )
    }

    const getGradeBadges = (grades) => {
        if (!grades || grades.length === 0) {
            return (
                <span className="small fw-medium" style={{ color: '#6c757d' }}>
                    Sin grados asignados
                </span>
            )
        }
        return (
            <div className="d-flex gap-1 flex-wrap">
                {grades.slice(0, 3).map(grade => (
                    <CBadge 
                        key={grade.id} 
                        className="rounded-pill px-2 py-1 fw-normal"
                        style={{ 
                            background: 'rgba(224,122,0,0.08)',
                            color: '#E07A00',
                            border: '1px solid rgba(224,122,0,0.2)'
                        }}
                    >
                        {grade.name}
                    </CBadge>
                ))}
                {grades.length > 3 && (
                    <CBadge 
                        className="rounded-pill px-2 py-1"
                        style={{ 
                            background: 'rgba(0,0,0,0.03)',
                            color: '#6c757d',
                            border: '1px solid rgba(0,0,0,0.1)'
                        }}
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
            'active': { 
                color: '#28a745', 
                text: 'Activo', 
                icon: cilCheck,
                bg: 'rgba(40, 167, 69, 0.1)'
            },
            'suspended': { 
                color: '#ffc107', 
                text: 'Suspendido', 
                icon: cilBan,
                bg: 'rgba(255, 193, 7, 0.1)'
            },
            'inactive': { 
                color: '#6c757d', 
                text: 'Inactivo', 
                icon: cilLockLocked,
                bg: 'rgba(108, 117, 125, 0.1)'
            }
        }[s] || { 
            color: '#6c757d', 
            text: status, 
            icon: cilUser,
            bg: 'rgba(108, 117, 125, 0.1)'
        }
        
        return (
            <CBadge className="rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2" style={{ 
                background: config.bg,
                color: config.color,
                border: 'none'
            }}>
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
                    className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm border-0"
                    style={{ 
                        width: '48px', 
                        height: '48px', 
                        background: 'linear-gradient(145deg, #E07A00, #C66900)',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(224,122,0,0.3)'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'linear-gradient(145deg, #C66900, #B05A00)'}
                    onMouseLeave={(e) => e.target.style.background = 'linear-gradient(145deg, #E07A00, #C66900)'}
                    onClick={() => navigate('/dashboard')}
                >
                    <CIcon icon={cilArrowLeft} size="lg" />
                </CButton>
                <div>
                    <h5 className="fw-bold mb-0 d-flex align-items-center" style={{ color: '#1e293b' }}>
                        <CIcon icon={cilSpeedometer} className="me-2" style={{ color: '#E07A00' }} size="sm" />
                        Dashboard / <span style={{ color: '#E07A00' }}>Gestión de Docentes</span>
                    </h5>
                </div>
            </div>

            <CCard className="shadow-lg border-0 mb-4" style={{ 
                borderRadius: '24px',
                background: 'white',
                boxShadow: '0 20px 40px rgba(0,0,0,0.02)'
            }}>
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
                                    marginRight: '16px',
                                    boxShadow: '0 6px 12px rgba(224,122,0,0.2)'
                                }}>
                                    <CIcon icon={cilSchool} className="text-white" size="lg" />
                                </div>
                                Gestión de Docentes
                            </h3>
                            <p className="mb-0 small" style={{ color: '#64748b', marginLeft: '64px' }}>
                                Asignación de especialidades y grados académicos
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <CButton
                                className="px-4 d-flex align-items-center border-0"
                                style={{
                                    background: 'linear-gradient(145deg, #E07A00, #C66900)',
                                    color: 'white',
                                    borderRadius: '14px',
                                    padding: '12px 24px',
                                    fontWeight: '600',
                                    boxShadow: '0 8px 16px rgba(224,122,0,0.2)'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'linear-gradient(145deg, #C66900, #B05A00)'}
                                onMouseLeave={(e) => e.target.style.background = 'linear-gradient(145deg, #E07A00, #C66900)'}
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
                        <div className="small fw-bold" style={{ color: '#64748b' }}>
                            Total Docentes: <span style={{ color: '#E07A00', fontWeight: '700' }}>{filteredTeachers.length}</span>
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
                            <div className="table-responsive" style={{ borderRadius: '16px', border: '1px solid rgba(224,122,0,0.1)' }}>
                                <CTable align="middle" hover className="mb-0">
                                    <CTableHead style={{ background: 'rgba(224,122,0,0.02)' }}>
                                        <CTableRow>
                                            <CTableHeaderCell className="border-0 py-3" style={{ color: '#64748b', fontWeight: '600' }}>DOCENTE</CTableHeaderCell>
                                            <CTableHeaderCell className="border-0 py-3" style={{ color: '#64748b', fontWeight: '600' }}>CONTACTO</CTableHeaderCell>
                                            <CTableHeaderCell className="border-0 py-3" style={{ color: '#64748b', fontWeight: '600' }}>ESPECIALIDAD</CTableHeaderCell>
                                            <CTableHeaderCell className="border-0 py-3" style={{ color: '#64748b', fontWeight: '600' }}>GRADOS</CTableHeaderCell>
                                            <CTableHeaderCell className="border-0 py-3" style={{ color: '#64748b', fontWeight: '600' }}>ESTADO</CTableHeaderCell>
                                            <CTableHeaderCell className="border-0 py-3 text-end" style={{ color: '#64748b', fontWeight: '600' }}>ACCIONES</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {currentPageData.map(teacher => (
                                            <CTableRow key={teacher.id} style={{ borderBottom: '1px solid rgba(224,122,0,0.05)' }}>
                                                <CTableDataCell className="py-3">
                                                    <div className="d-flex align-items-center">
                                                        <AvatarLetter
                                                            name={teacher.first_name + ' ' + teacher.last_name}
                                                            size="md"
                                                            style={{
                                                                background: 'linear-gradient(145deg, #E07A00, #C66900)',
                                                                color: 'white',
                                                                fontWeight: '600',
                                                                width: '44px',
                                                                height: '44px',
                                                                borderRadius: '14px',
                                                                boxShadow: '0 4px 8px rgba(224,122,0,0.2)'
                                                            }}
                                                        />
                                                        <div className="ms-3">
                                                            <div className="fw-bold" style={{ color: '#1e293b' }}>{teacher.first_name} {teacher.last_name}</div>
                                                            <div className="small" style={{ color: '#64748b' }}>{teacher.dni}</div>
                                                        </div>
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell className="py-3">
                                                    <div style={{ color: '#1e293b' }}>{teacher.email}</div>
                                                    <div className="small" style={{ color: '#64748b' }}>{teacher.phone || 'Sin teléfono'}</div>
                                                </CTableDataCell>
                                                <CTableDataCell className="py-3">{getSpecialtyBadge(teacher.specialty)}</CTableDataCell>
                                                <CTableDataCell className="py-3">{getGradeBadges(teacher.grades)}</CTableDataCell>
                                                <CTableDataCell className="py-3">{getStatusBadge(teacher.status)}</CTableDataCell>
                                                <CTableDataCell className="py-3 text-end">
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        {/* Botón Ver Info */}
                                                        <CButton
                                                            size="sm"
                                                            onClick={() => { setSelectedTeacher(teacher); setShowInfo(true); }}
                                                            title="Ver información"
                                                            style={{
                                                                width: '36px',
                                                                height: '36px',
                                                                borderRadius: '10px',
                                                                background: 'rgba(224,122,0,0.1)',
                                                                border: 'none',
                                                                color: '#E07A00',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                padding: 0
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.background = 'rgba(224,122,0,0.2)'}
                                                            onMouseLeave={(e) => e.target.style.background = 'rgba(224,122,0,0.1)'}
                                                        >
                                                            <CIcon icon={cilInfo} />
                                                        </CButton>
                                                        
                                                        {/* Botón Asignar */}
                                                        <CButton
                                                            size="sm"
                                                            onClick={() => openUnifiedModal(teacher)}
                                                            title="Asignar especialidad y grados"
                                                            style={{
                                                                width: '36px',
                                                                height: '36px',
                                                                borderRadius: '10px',
                                                                background: 'linear-gradient(145deg, #E07A00, #C66900)',
                                                                border: 'none',
                                                                color: 'white',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                padding: 0,
                                                                boxShadow: '0 4px 8px rgba(224,122,0,0.2)'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.background = 'linear-gradient(145deg, #C66900, #B05A00)'}
                                                            onMouseLeave={(e) => e.target.style.background = 'linear-gradient(145deg, #E07A00, #C66900)'}
                                                        >
                                                            <CIcon icon={cilStar} />
                                                        </CButton>

                                                        {/* Botón Editar */}
                                                        <CButton
                                                            size="sm"
                                                            onClick={() => { setEditing(teacher); setShowForm(true); }}
                                                            title="Editar"
                                                            style={{
                                                                width: '36px',
                                                                height: '36px',
                                                                borderRadius: '10px',
                                                                background: 'rgba(224,122,0,0.1)',
                                                                border: 'none',
                                                                color: '#E07A00',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                padding: 0
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.background = 'rgba(224,122,0,0.2)'}
                                                            onMouseLeave={(e) => e.target.style.background = 'rgba(224,122,0,0.1)'}
                                                        >
                                                            <CIcon icon={cilPencil} />
                                                        </CButton>

                                                        {/* Botón Eliminar */}
                                                        <CButton
                                                            size="sm"
                                                            onClick={() => setDeleteModal({ 
                                                                visible: true, 
                                                                teacherId: teacher.id, 
                                                                teacherName: `${teacher.first_name} ${teacher.last_name}` 
                                                            })}
                                                            title="Eliminar"
                                                            style={{
                                                                width: '36px',
                                                                height: '36px',
                                                                borderRadius: '10px',
                                                                background: 'rgba(220, 53, 69, 0.1)',
                                                                border: 'none',
                                                                color: '#dc3545',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                padding: 0
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.background = 'rgba(220, 53, 69, 0.2)'}
                                                            onMouseLeave={(e) => e.target.style.background = 'rgba(220, 53, 69, 0.1)'}
                                                        >
                                                            <CIcon icon={cilTrash} />
                                                        </CButton>
                                                    </div>
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
                                <CIcon icon={cilSearch} size="3xl" style={{ color: '#E07A00', opacity: 0.5 }} />
                            </div>
                            <h5 style={{ color: '#1e293b', fontWeight: '600' }}>No se encontraron docentes</h5>
                        </div>
                    )}
                </CCardBody>
            </CCard>

            {/* ✅ MODAL UNIFICADO - ESPECIALIDAD + GRADOS */}
            <AsignarEspecialidadGradosModal
                visible={showUnifiedModal}
                onClose={() => setShowUnifiedModal(false)}
                teacher={actionTeacher}
                specialties={specialties}
                grades={grades}
                onSave={handleUnifiedSave}
            />

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