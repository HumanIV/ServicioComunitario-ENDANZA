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

            // Filtrar docentes que tienen asignaciones en el año actual
            const filtered = teachers.filter(teacher => {
                const hasGradesInCurrentYear = teacher.grades?.some(g => g.academicYearId === currentYear.id) || false;
                const hasSpecialtyInCurrentYear = teacher.specialties?.some(s => s.academicYearId === currentYear.id) || false;
                return hasGradesInCurrentYear || hasSpecialtyInCurrentYear;
            });

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
                    <CSpinner style={{ color: '#F28C0F' }} />
                </CCardBody>
            </CCard>
        )
    }

    return (
        <CCard className="premium-card border-0 shadow-lg h-100 overflow-hidden bg-glass-premium" style={{ borderRadius: '32px' }}>
            <CCardHeader className="bg-transparent border-0 pt-4 px-4 pb-0">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                    <div>
                        <h4 className="fw-black header-title-custom mb-1 d-flex align-items-center text-uppercase ls-1">
                            <div className="header-icon-box me-3">
                                <CIcon icon={cilAddressBook} size="lg" />
                            </div>
                            Plantilla Docente
                        </h4>
                        <p className="text-muted-custom small mb-0 fw-medium d-flex align-items-center text-uppercase ls-1" style={{ fontSize: '0.65rem' }}>
                            <CIcon icon={cilCalendar} className="me-2 text-primary" size="sm" />
                            {getYearMessage()}
                        </p>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        <CButton
                            className="rounded-pill px-4 py-2 fw-bold d-flex align-items-center premium-outline-btn border-2 hover-lift text-uppercase ls-1"
                            onClick={() => navigate('/docenteAsignacion')}
                            style={{ fontSize: '0.7rem' }}
                        >
                            <CIcon icon={cilSchool} className="me-2" size="sm" />
                            <span>GESTIONAR DOCENTES</span>
                            <CIcon icon={cilArrowRight} className="ms-2" size="sm" />
                        </CButton>
                        <CBadge
                            color="warning"
                            className="premium-role-badge rounded-pill p-2 px-3 fw-bold d-flex align-items-center text-uppercase ls-1"
                        >
                            <CIcon icon={cilStar} className="me-2" size="sm" />
                            {teachersByYear.length} / {teachers.length} ASIGNADOS
                        </CBadge>
                    </div>
                </div>
            </CCardHeader>

            <CCardBody className="px-4 py-4">
                {teachersByYear.length > 0 ? (
                    <div className="table-responsive">
                        <CTable align="middle" hover className="mb-0 bg-transparent premium-table">
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell className="text-muted-custom small text-uppercase fw-black ls-1 border-0 pb-3">
                                        Docente
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-muted-custom small text-uppercase fw-black ls-1 border-0 pb-3">
                                        Especialidad ({currentYear?.name || 'Año actual'})
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-center text-muted-custom small text-uppercase fw-black ls-1 border-0 pb-3">
                                        Grados Asignados
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {teachersByYear.map((teacher) => {
                                    const currentYearGrades = currentYear
                                        ? (teacher.grades || []).filter(g => g.academicYearId === currentYear.id)
                                        : teacher.grades || []

                                    const currentYearSpecialty = getCurrentYearSpecialty(teacher)

                                    return (
                                        <CTableRow key={teacher.id} className="premium-table-row">
                                            <CTableDataCell className="py-4 border-0">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-square-premium me-3 d-flex align-items-center justify-content-center fw-bold shadow-sm"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #F28C0F, #F8A13E)',
                                                            width: '46px',
                                                            height: '46px',
                                                            borderRadius: '14px',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold header-title-custom mb-0" style={{ fontSize: '0.95rem' }}>{teacher.first_name} {teacher.last_name}</div>
                                                        <div className="text-primary text-uppercase fw-bold ls-1" style={{ fontSize: '0.6rem' }}>
                                                            DOCENTE ACTURANTE
                                                        </div>
                                                        {!hasAssignmentsInCurrentYear(teacher) && (
                                                            <CBadge
                                                                className="mt-1"
                                                                color="danger"
                                                                style={{ fontSize: '0.6rem' }}
                                                            >
                                                                SIN ASIGNACIÓN
                                                            </CBadge>
                                                        )}
                                                    </div>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell className="py-4 border-0">
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-orange-soft p-2 rounded-3 me-3">
                                                        <CIcon icon={cilBookmark} className="text-primary" size="sm" />
                                                    </div>
                                                    <div>
                                                        <span className="fw-bold text-dark-custom d-block" style={{ fontSize: '0.9rem' }}>
                                                            {currentYearSpecialty?.name || teacher.specialty || 'Sin especialidad'}
                                                        </span>
                                                        {currentYearSpecialty && (
                                                            <div className="small text-muted-custom opacity-75 fw-medium">
                                                                {currentYearSpecialty.area || 'Área General'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell className="py-4 border-0 text-center">
                                                <div className="d-flex gap-2 flex-wrap justify-content-center">
                                                    {currentYearGrades.length > 0 ? (
                                                        currentYearGrades.map(grade => (
                                                            <CBadge
                                                                key={grade.id}
                                                                className="premium-info-box rounded-pill px-3 py-2 fw-bold border-light-custom text-primary"
                                                                style={{ fontSize: '0.7rem' }}
                                                            >
                                                                {grade.name}
                                                            </CBadge>
                                                        ))
                                                    ) : (
                                                        <span className="small text-muted-custom opacity-50 italic">
                                                            Sin grados asignados
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
                                <CIcon icon={cilWarning} size="3xl" className="text-primary opacity-25 mb-4" />
                                <h5 className="header-title-custom fw-bold">No hay docentes con asignaciones</h5>
                                <p className="text-muted-custom mb-4 small px-5">
                                    Los docentes deben ser vinculados a especialidades y grados para el período <b>{currentYear.name}</b>.
                                </p>
                                <CButton
                                    className="premium-outline-btn rounded-pill px-4"
                                    onClick={() => navigate('/docenteAsignacion')}
                                >
                                    GESTIONAR DOCENTES
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
            </CCardBody>

            <style>{`
                .fw-black { font-weight: 950; }
                .ls-1 { letter-spacing: 1px; }
                
                .premium-table thead th {
                    background: transparent !important;
                    color: var(--cui-text-muted) !important;
                }

                .premium-table-row {
                    transition: all 0.2s ease;
                    border-bottom: 1px solid rgba(var(--cui-border-color-rgb), 0.05) !important;
                }

                .premium-table-row:hover {
                    background: rgba(var(--cui-primary-rgb), 0.02) !important;
                }

                [data-coreui-theme="dark"] .premium-table-row:hover {
                    background: rgba(255, 255, 255, 0.02) !important;
                }
            `}</style>
        </CCard>
    )
}

export default TeacherSectionsList