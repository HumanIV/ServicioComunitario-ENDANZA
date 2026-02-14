import React, { useState, useEffect } from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CFormSelect,
    CSpinner,
    CFormCheck,
    CFormLabel,
    CAlert,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilStar,
    cilBookmark,
    cilCheck,
    cilBan,
    cilInfo,
    cilUser,
    cilWarning,
    cilCalendar
} from '@coreui/icons'
import PropTypes from 'prop-types'

const AsignarEspecialidadGradosModal = ({
    visible,
    onClose,
    teacher,
    specialties = [],
    grades = [],
    onSave,
    currentYear // año actual
}) => {
    const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('')
    const [selectedGrades, setSelectedGrades] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Resetear cuando se abre el modal
    useEffect(() => {
        if (teacher && visible) {
            // Buscar la especialidad del año actual si existe
            if (currentYear && teacher.specialties && teacher.specialties.length > 0) {
                const currentYearSpecialty = teacher.specialties.find(
                    s => s.academicYearId === currentYear.id
                )
                setSelectedSpecialtyId(currentYearSpecialty?.id?.toString() || '')
            } else {
                setSelectedSpecialtyId('')
            }

            // Filtrar solo los grados del año actual si existen
            const currentYearGrades = currentYear
                ? (teacher.grades || []).filter(g => g.academicYearId === currentYear.id)
                : teacher.grades || []
            setSelectedGrades(currentYearGrades.map(g => g.id))
            setError('')
        }
    }, [teacher, currentYear, visible])

    // Manejador para checkboxes de grados
    const handleGradeToggle = (gradeId) => {
        setSelectedGrades(prev =>
            prev.includes(gradeId)
                ? prev.filter(id => id !== gradeId)
                : [...prev, gradeId]
        )
    }

    // Manejador para "Seleccionar todos"
    const handleSelectAll = () => {
        if (selectedGrades.length === grades.length) {
            setSelectedGrades([])
        } else {
            setSelectedGrades(grades.map(g => g.id))
        }
    }

    const handleSubmit = async () => {
        if (!teacher) return

        // Validar que al menos seleccione algo
        if (!selectedSpecialtyId && selectedGrades.length === 0) {
            setError('Debes seleccionar al menos una especialidad o un grado')
            return
        }

        setLoading(true)
        setError('')

        try {
            await onSave(teacher.id, {
                specialtyId: selectedSpecialtyId ? parseInt(selectedSpecialtyId) : null,
                gradeIds: selectedGrades
            })
            // No cerrar aquí - onSave debe manejar el cierre
        } catch (err) {
            setError(err.message || 'Error al guardar las asignaciones')
        } finally {
            setLoading(false)
        }
    }

    if (!teacher) return null;

    const selectedSpecialtyName = specialties.find(s => s.id.toString() === selectedSpecialtyId)?.name;

    return (
        <CModal
            visible={visible}
            onClose={onClose}
            size="lg"
            alignment="center"
            backdrop="static"
            className="premium-modal"
        >
            <CModalHeader className="border-0 pb-3 bg-glass-premium" style={{
                borderBottom: '1px solid rgba(224,122,0,0.2)'
            }}>
                <CModalTitle className="fw-bold d-flex align-items-center">
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
                        <CIcon icon={cilUser} className="text-white" size="lg" />
                    </div>
                    <div>
                        <div className="header-title-custom" style={{ fontSize: '1.25rem' }}>
                            Asignar Especialidad y Grados
                        </div>
                        <div className="text-muted-custom" style={{ fontSize: '0.85rem', fontWeight: 'normal', marginTop: '4px' }}>
                            {teacher.first_name} {teacher.last_name}
                        </div>
                        {currentYear && (
                            <div className="d-flex align-items-center mt-1">
                                <CIcon icon={cilCalendar} size="sm" className="text-muted me-1" />
                                <span className="small text-muted">
                                    Asignaciones para: <strong>{currentYear.name}</strong>
                                </span>
                            </div>
                        )}
                    </div>
                </CModalTitle>
            </CModalHeader>

            <CModalBody className="p-4 bg-glass-premium">
                {error && (
                    <CAlert color="danger" className="d-flex align-items-center mb-4 rounded-4 shadow-sm">
                        <CIcon icon={cilWarning} className="me-2" />
                        {error}
                    </CAlert>
                )}

                {/* BANNER INFORMATIVO */}
                <div style={{
                    background: 'linear-gradient(145deg, rgba(224,122,0,0.05), rgba(224,122,0,0.02))',
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '24px',
                    border: '1px solid rgba(224,122,0,0.1)'
                }}>
                    <div className="d-flex align-items-center gap-2">
                        <CIcon icon={cilInfo} style={{ color: '#E07A00' }} size="lg" />
                        <div>
                            <span style={{ color: '#E07A00', fontWeight: '600' }}>Configuración Académica</span>
                            <p className="mb-0 small text-muted-custom">
                                Define la especialidad y los grados que este docente podrá dictar en el ciclo actual
                            </p>
                        </div>
                    </div>
                </div>

                <CRow className="g-4">
                    {/* COLUMNA IZQUIERDA - ESPECIALIDAD */}
                    <CCol md={5}>
                        <CCard className="border-0 h-100 bg-glass-premium" style={{
                            borderRadius: '20px',
                            border: '1px solid rgba(224,122,0,0.1)'
                        }}>
                            <CCardBody className="p-4">
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        background: 'rgba(224,122,0,0.1)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <CIcon icon={cilStar} style={{ color: '#E07A00' }} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1 header-title-custom">
                                            Especialidad
                                        </h6>
                                        <p className="small mb-0 text-muted-custom">
                                            Área de enseñanza
                                        </p>
                                    </div>
                                </div>

                                <CFormSelect
                                    value={selectedSpecialtyId}
                                    onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                                    className="bg-glass-premium text-contrast mb-3"
                                    style={{
                                        borderRadius: '14px',
                                        padding: '12px',
                                        border: '1px solid rgba(224,122,0,0.2)'
                                    }}
                                >
                                    <option value="">-- Seleccionar --</option>
                                    {specialties.map(spec => (
                                        <option key={spec.id} value={spec.id}>
                                            {spec.name} {spec.area ? `(${spec.area})` : ''}
                                        </option>
                                    ))}
                                </CFormSelect>

                                {selectedSpecialtyId && (
                                    <div className="mt-3 text-center">
                                        <CBadge style={{
                                            background: 'linear-gradient(145deg, #E07A00, #C66900)',
                                            color: 'white',
                                            padding: '8px 16px',
                                            borderRadius: '30px',
                                            fontSize: '0.85rem'
                                        }}>
                                            <CIcon icon={cilCheck} className="me-1" size="sm" />
                                            {selectedSpecialtyName}
                                        </CBadge>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>

                    {/* COLUMNA DERECHA - GRADOS */}
                    <CCol md={7}>
                        <CCard className="border-0 h-100 bg-glass-premium" style={{
                            borderRadius: '20px',
                            border: '1px solid rgba(224,122,0,0.1)'
                        }}>
                            <CCardBody className="p-4">
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            background: 'rgba(224,122,0,0.1)',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <CIcon icon={cilBookmark} style={{ color: '#E07A00' }} />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1 header-title-custom">
                                                Grados
                                            </h6>
                                            <p className="small mb-0 text-muted-custom">
                                                Selección {currentYear?.name}
                                            </p>
                                        </div>
                                    </div>
                                    <CButton
                                        color="link"
                                        onClick={handleSelectAll}
                                        size="sm"
                                        className="text-decoration-none fw-bold"
                                        style={{ color: '#E07A00' }}
                                    >
                                        {selectedGrades.length === grades.length ? 'Ninguno' : 'Todos'}
                                    </CButton>
                                </div>

                                <div className="mb-3">
                                    <CBadge style={{
                                        background: selectedGrades.length > 0
                                            ? 'linear-gradient(145deg, #E07A00, #C66900)'
                                            : 'rgba(100,116,139,0.1)',
                                        color: selectedGrades.length > 0 ? 'white' : 'var(--neutral-500)',
                                        padding: '8px 16px',
                                        borderRadius: '30px'
                                    }}>
                                        {selectedGrades.length} grado(s) seleccionado(s)
                                    </CBadge>
                                </div>

                                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                    <CRow className="g-2">
                                        {grades.map(grade => (
                                            <CCol xs={6} key={grade.id}>
                                                <CButton
                                                    className={`w-100 py-3 grade-btn ${selectedGrades.includes(grade.id) ? 'active' : 'bg-glass-premium text-contrast'}`}
                                                    style={{
                                                        borderRadius: '14px',
                                                        fontWeight: '500',
                                                        fontSize: '0.85rem',
                                                        transition: 'all 0.2s ease',
                                                        textAlign: 'left',
                                                        paddingLeft: '15px'
                                                    }}
                                                    onClick={() => handleGradeToggle(grade.id)}
                                                >
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <span className="text-truncate">{grade.name}</span>
                                                        {selectedGrades.includes(grade.id) && (
                                                            <CIcon icon={cilCheck} className="ms-1" size="sm" />
                                                        )}
                                                    </div>
                                                </CButton>
                                            </CCol>
                                        ))}
                                    </CRow>
                                </div>

                                {grades.length === 0 && (
                                    <div className="text-center mt-3 py-3 border border-dashed rounded-4">
                                        <span className="text-muted-custom" style={{ fontSize: '0.85rem' }}>
                                            <CIcon icon={cilBan} className="me-1" size="sm" />
                                            No hay grados disponibles
                                        </span>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CModalBody>

            <CModalFooter className="border-0 p-4 bg-glass-premium" style={{
                borderTop: '1px solid rgba(224,122,0,0.1)'
            }}>
                <CButton
                    className="bg-glass-premium text-contrast px-4"
                    onClick={onClose}
                    disabled={loading}
                    style={{
                        borderRadius: '14px',
                        padding: '12px 24px',
                        fontWeight: '600',
                        border: '1px solid rgba(224,122,0,0.2)'
                    }}
                >
                    Cancelar
                </CButton>
                <CButton
                    className="px-4 text-white border-0"
                    style={{
                        background: 'linear-gradient(145deg, #E07A00, #C66900)',
                        borderRadius: '14px',
                        fontWeight: '600',
                        minWidth: '160px',
                        padding: '12px 24px',
                        boxShadow: '0 8px 16px rgba(224,122,0,0.2)',
                        opacity: loading ? 0.8 : 1
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.background = 'linear-gradient(145deg, #C66900, #B05A00)')}
                    onMouseLeave={(e) => !loading && (e.target.style.background = 'linear-gradient(145deg, #E07A00, #C66900)')}
                    onClick={handleSubmit}
                    disabled={loading || (!selectedSpecialtyId && selectedGrades.length === 0)}
                >
                    {loading ? (
                        <>
                            <CSpinner size="sm" className="me-2" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <CIcon icon={cilCheck} className="me-2" size="sm" />
                            Guardar Asignaciones
                        </>
                    )}
                </CButton>
            </CModalFooter>

            <style>{`
                .text-contrast { color: var(--neutral-800); }
                [data-coreui-theme="dark"] .text-contrast { color: white; }
                .bg-glass-premium { 
                    background: white !important;
                }
                [data-coreui-theme="dark"] .bg-glass-premium { 
                    background: #1e293b !important; 
                }
                .grade-btn {
                    border: 1px solid rgba(224,122,0,0.2) !important;
                    color: var(--neutral-800);
                }
                [data-coreui-theme="dark"] .grade-btn {
                    color: white;
                }
                .grade-btn:hover {
                    background: rgba(224,122,0,0.1) !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .grade-btn.active {
                    background: linear-gradient(145deg, #E07A00, #C66900) !important;
                    color: white !important;
                    border: none !important;
                    box-shadow: 0 4px 12px rgba(224,122,0,0.3);
                }
                .grade-btn.active:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.1);
                }
                .bg-orange {
                    background-color: #E07A00 !important;
                }
                .shadow-orange-sm {
                    box-shadow: 0 4px 8px rgba(224, 122, 0, 0.2);
                }
            `}</style>
        </CModal>
    )
}

AsignarEspecialidadGradosModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    teacher: PropTypes.object,
    specialties: PropTypes.array,
    grades: PropTypes.array,
    onSave: PropTypes.func.isRequired,
    currentYear: PropTypes.object
}

export default AsignarEspecialidadGradosModal
