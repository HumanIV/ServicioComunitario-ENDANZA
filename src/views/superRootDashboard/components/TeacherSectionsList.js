import React, { useEffect, useState } from 'react'
import {
    CCard,
    CCardHeader,
    CCardBody,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CBadge,
    CButton,
    CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
    cilAddressBook, 
    cilBookmark, 
    cilStar,
    cilSchool,
    cilUser,
    cilArrowRight 
} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

// ✅ IMPORTAR EL SERVICIO DE DOCENTES
import * as TeacherService from '../../../services/teacherService'

const TeacherSectionsList = ({ sections = [] }) => {
    const navigate = useNavigate()
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(true)

    // ✅ CARGAR DOCENTES REALES DEL BACKEND
    useEffect(() => {
        fetchTeachers()
    }, [])

    const fetchTeachers = async () => {
        setLoading(true)
        try {
            const res = await TeacherService.getAll()
            setTeachers(res || [])
        } catch (error) {
            console.error('Error fetching teachers:', error)
        } finally {
            setLoading(false)
        }
    }

    // ✅ TRANSFORMAR DOCENTES REALES AL FORMATO QUE NECESITA EL COMPONENTE
    const getDisplayData = () => {
        // Si hay secciones reales, úsalas
        if (sections.length > 0) {
            return sections.map(s => ({
                name: s.teacher || 'Sin asignar',
                subject: s.sectionName || 'Materia General',
                grade: s.gradeLevel || 'N/A',
                id: s.id
            }))
        }
        
        // ✅ USAR DOCENTES REALES DEL BACKEND
        if (teachers.length > 0) {
            return teachers.slice(0, 5).map(teacher => ({
                id: teacher.id,
                name: `${teacher.first_name} ${teacher.last_name}`,
                subject: teacher.specialty || 'Sin especialidad',
                grade: teacher.grades?.length > 0 
                    ? teacher.grades.map(g => g.name).join(', ') 
                    : 'Sin grados',
                teacher_id: teacher.teacher_id
            }))
        }

        return []
    }

    const displayData = getDisplayData()

    if (loading) {
        return (
            <CCard className="premium-card border-0 shadow-sm h-100" style={{ borderRadius: '32px' }}>
                <CCardBody className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                    <CSpinner style={{ color: '#E07A00' }} />
                </CCardBody>
            </CCard>
        )
    }

    return (
        <CCard className="premium-card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '32px' }}>
            <CCardHeader className="bg-transparent border-0 pt-4 px-4 pb-0">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                    <div>
                        <h4 className="fw-black header-title-custom mb-1 d-flex align-items-center">
                            <div className="bg-orange rounded-3 p-2 me-3 d-flex align-items-center justify-content-center shadow-orange-sm">
                                <CIcon icon={cilAddressBook} className="text-white" size="lg" />
                            </div>
                            Plantilla Docente
                        </h4>
                        <p className="text-muted-custom small mb-0 fw-medium">
                            {teachers.length} docente(s) activo(s) en el sistema
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <CButton
                            className="rounded-pill px-4 py-2 fw-bold d-flex align-items-center border-2 hover-lift"
                            style={{
                                backgroundColor: 'transparent',
                                borderColor: '#E07A00',
                                color: '#E07A00'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#E07A00';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#E07A00';
                            }}
                            onClick={() => navigate('/docenteAsignacion')}
                        >
                            <CIcon icon={cilSchool} className="me-2" size="sm" />
                            <span>GESTIONAR DOCENTES</span>
                            <CIcon icon={cilArrowRight} className="ms-2" size="sm" />
                        </CButton>
                        <CBadge 
                            style={{
                                backgroundColor: 'rgba(224, 122, 0, 0.1)',
                                color: '#E07A00',
                                border: 'none'
                            }}
                            className="rounded-pill p-2 px-3 fw-bold d-flex align-items-center"
                        >
                            <CIcon icon={cilStar} className="me-1" size="sm" />
                            {teachers.length} TOTAL
                        </CBadge>
                    </div>
                </div>
            </CCardHeader>

            <CCardBody className="px-4 py-4">
                {displayData.length > 0 ? (
                    <div className="table-responsive">
                        <CTable align="middle" hover className="mb-0 bg-transparent custom-table-modern">
                            <CTableHead className="border-0">
                                <CTableRow>
                                    <CTableHeaderCell className="text-muted-custom small text-uppercase fw-black ls-1 border-0 pb-3">
                                        Docente
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-muted-custom small text-uppercase fw-black ls-1 border-0 pb-3">
                                        Especialidad
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-center text-muted-custom small text-uppercase fw-black ls-1 border-0 pb-3">
                                        Grados
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody className="border-0">
                                {displayData.map((item) => (
                                    <CTableRow key={item.id} className="border-0">
                                        <CTableDataCell className="py-4 border-0 border-bottom border-light-custom border-opacity-5">
                                            <div className="d-flex align-items-center">
                                                <div className="avatar-square-premium me-3 d-flex align-items-center justify-content-center fw-bold shadow-sm"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #E07A00, #C66900)'
                                                    }}
                                                >
                                                    {item.name[0]}
                                                </div>
                                                <div>
                                                    <div className="fw-bold header-title-custom mb-0">{item.name}</div>
                                                    <div className="small fw-bold" style={{ color: '#E07A00', fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                                                        DOCENTE
                                                    </div>
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell className="py-4 border-0 border-bottom border-light-custom border-opacity-5">
                                            <div className="d-flex align-items-center">
                                                <CIcon icon={cilBookmark} className="me-2 text-muted-custom opacity-50" size="sm" />
                                                <span className="fw-semibold header-title-custom">{item.subject}</span>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell className="py-4 border-0 border-bottom border-light-custom border-opacity-5 text-center">
                                            <CBadge className="border rounded-pill px-3 py-2 fw-bold"
                                                style={{
                                                    backgroundColor: 'rgba(224, 122, 0, 0.05)',
                                                    borderColor: 'rgba(224, 122, 0, 0.2)',
                                                    color: '#E07A00'
                                                }}
                                            >
                                                {item.grade}
                                            </CBadge>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <CIcon icon={cilUser} size="3xl" className="text-muted opacity-25 mb-3" />
                        <h5 className="text-muted">No hay docentes registrados</h5>
                        <CButton
                            color="link"
                            onClick={() => navigate('/docenteAsignacion')}
                            style={{ color: '#E07A00' }}
                        >
                            Crear nuevo docente
                        </CButton>
                    </div>
                )}

                {/* BOTÓN FLOTANTE MÓVIL */}
                <div className="d-block d-lg-none mt-4 text-center">
                    <CButton
                        className="rounded-pill px-5 py-3 fw-bold text-white w-100 d-flex align-items-center justify-content-center border-0"
                        style={{
                            backgroundColor: '#E07A00'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#C66900'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#E07A00'}
                        onClick={() => navigate('/docenteAsignacion')}
                    >
                        <CIcon icon={cilSchool} className="me-2" size="lg" />
                        GESTIONAR DOCENTES
                        <CIcon icon={cilArrowRight} className="ms-2" size="lg" />
                    </CButton>
                </div>
            </CCardBody>

            <style>{`
                .fw-black { font-weight: 950; }
                .ls-1 { letter-spacing: 1px; }
                .shadow-orange-sm { box-shadow: 0 4px 8px rgba(224, 122, 0, 0.2); }
                .hover-lift {
                    transition: all 0.3s ease;
                }
                .hover-lift:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 12px rgba(224, 122, 0, 0.15);
                }
                .bg-orange {
                    background-color: #E07A00 !important;
                }
                .avatar-square-premium {
                    width: 44px;
                    height: 44px;
                    color: white;
                    border-radius: 12px;
                }
                .custom-table-modern thead th {
                    border: none !important;
                }
            `}</style>
        </CCard>
    )
}

export default TeacherSectionsList