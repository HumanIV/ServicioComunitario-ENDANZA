// Archivo: src/dashboard/components/TeacherSectionsList.jsx

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
    cilArrowRight,
    cilWarning,
    cilCalendar
} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const TeacherSectionsList = ({ sections = [], teachers = [], currentYear, loading }) => {
    const navigate = useNavigate()
    const [teachersByYear, setTeachersByYear] = useState([])

    // ✅ FILTRAR DOCENTES POR AÑO ACADÉMICO SELECCIONADO
    useEffect(() => {
        if (currentYear && teachers.length > 0) {
            console.log('🔍 Filtrando docentes para año:', currentYear.id, currentYear.name);
            console.log('📊 Teachers recibidos:', teachers);
            
            // Verificar estructura de specialties y grades
            teachers.forEach(teacher => {
                console.log(`\n📋 Teacher ${teacher.first_name} ${teacher.last_name}:`);
                
                if (teacher.specialties && teacher.specialties.length > 0) {
                    console.log(`  ✅ Specialties:`, 
                        teacher.specialties.map(s => ({ 
                            name: s.name, 
                            year: s.academicYearId,
                            yearName: s.academicYearId === currentYear.id ? '✅ ACTUAL' : '❌ OTRO AÑO'
                        }))
                    );
                } else {
                    console.log(`  ⚠️ Sin especialidades`);
                }
                
                if (teacher.grades && teacher.grades.length > 0) {
                    console.log(`  ✅ Grades:`, 
                        teacher.grades.map(g => ({ 
                            name: g.name, 
                            year: g.academicYearId,
                            yearName: g.academicYearId === currentYear.id ? '✅ ACTUAL' : '❌ OTRO AÑO'
                        }))
                    );
                } else {
                    console.log(`  ⚠️ Sin grados`);
                }
            });
            
            // Filtrar docentes que tienen asignaciones en el año actual
            const filtered = teachers.filter(teacher => {
                // Verificar si tiene grados O especialidad del año actual
                const hasGradesInCurrentYear = teacher.grades?.some(g => g.academicYearId === currentYear.id) || false;
                const hasSpecialtyInCurrentYear = teacher.specialties?.some(s => s.academicYearId === currentYear.id) || false;
                
                console.log(`🔎 ${teacher.first_name} ${teacher.last_name}: ${hasGradesInCurrentYear ? 'TIENE GRADOS' : 'NO TIENE GRADOS'} | ${hasSpecialtyInCurrentYear ? 'TIENE ESPECIALIDAD' : 'NO TIENE ESPECIALIDAD'} en ${currentYear.name}`);
                
                return hasGradesInCurrentYear || hasSpecialtyInCurrentYear;
            });
            
            console.log('📋 Docentes filtrados para el año:', filtered.length);
            setTeachersByYear(filtered);
        } else {
            setTeachersByYear([]);
        }
    }, [currentYear, teachers])

    // ✅ Obtener mensaje según el año seleccionado
    const getYearMessage = () => {
        if (!currentYear) return "Seleccione un año académico"
        if (teachersByYear.length === 0) {
            return `No hay docentes con asignaciones para el período ${currentYear.name}`
        }
        return `${teachersByYear.length} docente(s) con asignaciones en ${currentYear.name}`
    }

    // ✅ Verificar si un docente tiene asignaciones en el año actual
    const hasAssignmentsInCurrentYear = (teacher) => {
        if (!currentYear) return false
        const hasGrades = teacher.grades?.some(g => g.academicYearId === currentYear.id) || false
        const hasSpecialty = teacher.specialties?.some(s => s.academicYearId === currentYear.id) || false
        return hasGrades || hasSpecialty
    }

    // ✅ Obtener especialidad del año actual
    const getCurrentYearSpecialty = (teacher) => {
        if (!currentYear || !teacher.specialties) return null
        return teacher.specialties.find(s => s.academicYearId === currentYear.id)
    }

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
                        <p className="text-muted-custom small mb-0 fw-medium d-flex align-items-center">
                            <CIcon icon={cilCalendar} className="me-1" size="sm" style={{ color: '#E07A00' }} />
                            {getYearMessage()}
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
                            {teachersByYear.length} / {teachers.length} CON ASIGNACIONES
                        </CBadge>
                    </div>
                </div>
            </CCardHeader>

            <CCardBody className="px-4 py-4">
                {teachersByYear.length > 0 ? (
                    <div className="table-responsive">
                        <CTable align="middle" hover className="mb-0 bg-transparent custom-table-modern">
                            <CTableHead className="border-0">
                                <CTableRow>
                                    <CTableHeaderCell className="text-muted-custom small text-uppercase fw-black ls-1 border-0 pb-3">
                                        Docente
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-muted-custom small text-uppercase fw-black ls-1 border-0 pb-3">
                                        Especialidad ({currentYear?.name || 'Año actual'})
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-center text-muted-custom small text-uppercase fw-black ls-1 border-0 pb-3">
                                        Grados Asignados ({currentYear?.name || 'Año actual'})
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody className="border-0">
                                {teachersByYear.map((teacher) => {
                                    // Filtrar solo los grados del año actual
                                    const currentYearGrades = currentYear 
                                        ? (teacher.grades || []).filter(g => g.academicYearId === currentYear.id)
                                        : teacher.grades || []
                                    
                                    // Obtener especialidad del año actual
                                    const currentYearSpecialty = getCurrentYearSpecialty(teacher)
                                    
                                    return (
                                        <CTableRow key={teacher.id} className="border-0">
                                            <CTableDataCell className="py-4 border-0 border-bottom border-light-custom border-opacity-5">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-square-premium me-3 d-flex align-items-center justify-content-center fw-bold shadow-sm"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #E07A00, #C66900)'
                                                        }}
                                                    >
                                                        {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold header-title-custom mb-0">{teacher.first_name} {teacher.last_name}</div>
                                                        <div className="small fw-bold" style={{ color: '#E07A00', fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                                                            DOCENTE
                                                        </div>
                                                        {!hasAssignmentsInCurrentYear(teacher) && (
                                                            <CBadge 
                                                                className="mt-1"
                                                                color="warning"
                                                                style={{ fontSize: '0.6rem' }}
                                                            >
                                                                Sin asignaciones en {currentYear?.name}
                                                            </CBadge>
                                                        )}
                                                    </div>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell className="py-4 border-0 border-bottom border-light-custom border-opacity-5">
                                                <div className="d-flex align-items-center">
                                                    <CIcon icon={cilBookmark} className="me-2 text-muted-custom opacity-50" size="sm" />
                                                    <div>
                                                        <span className="fw-semibold header-title-custom">
                                                            {currentYearSpecialty?.name || teacher.specialty || 'Sin especialidad'}
                                                        </span>
                                                        {currentYearSpecialty && (
                                                            <div className="small text-muted">
                                                                {currentYearSpecialty.area || ''}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell className="py-4 border-0 border-bottom border-light-custom border-opacity-5 text-center">
                                                <div className="d-flex gap-1 flex-wrap justify-content-center">
                                                    {currentYearGrades.length > 0 ? (
                                                        currentYearGrades.map(grade => (
                                                            <CBadge 
                                                                key={grade.id} 
                                                                className="rounded-pill px-3 py-2 fw-bold"
                                                                style={{
                                                                    backgroundColor: 'rgba(224, 122, 0, 0.05)',
                                                                    borderColor: 'rgba(224, 122, 0, 0.2)',
                                                                    color: '#E07A00',
                                                                    border: '1px solid'
                                                                }}
                                                            >
                                                                {grade.name}
                                                            </CBadge>
                                                        ))
                                                    ) : (
                                                        <span className="small text-muted">
                                                            Sin grados asignados en {currentYear?.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </CTableDataCell>
                                        </CTableRow>
                                    )
                                })}
                            </CTableBody>
                        </CTable>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        {currentYear ? (
                            <>
                                <CIcon icon={cilWarning} size="3xl" className="text-muted opacity-25 mb-3" />
                                <h5 className="text-muted">No hay docentes con asignaciones en {currentYear.name}</h5>
                                <p className="small text-muted mb-3">
                                    Los docentes deben ser asignados a especialidades y grados en este período académico
                                </p>
                                <CButton
                                    color="link"
                                    onClick={() => navigate('/docenteAsignacion')}
                                    style={{ color: '#E07A00' }}
                                >
                                    Ir a gestión de docentes para asignar
                                </CButton>
                            </>
                        ) : (
                            <>
                                <CIcon icon={cilSchool} size="3xl" className="text-muted opacity-25 mb-3" />
                                <h5 className="text-muted">Seleccione un año académico</h5>
                            </>
                        )}
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