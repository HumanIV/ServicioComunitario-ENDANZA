// Archivo: src/views/docente/AsignarModal.jsx

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
    CCol
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
    cilUser, 
    cilSchool, 
    cilWarning, 
    cilCalendar,
    cilColorBorder,
    cilCheckCircle,
    cilXCircle,
    cilStar,
} from '@coreui/icons'

const AsignarEspecialidadGradosModal = ({ 
    visible, 
    onClose, 
    teacher, 
    specialties = [], 
    grades = [], 
    onSave,
    currentYear 
}) => {
    const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('')
    const [selectedGrades, setSelectedGrades] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Resetear cuando se abre el modal con un nuevo teacher
    useEffect(() => {
        if (teacher) {
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
    }, [teacher, currentYear])

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
            // El modal se cierra en onSave
        } catch (err) {
            setError(err.message || 'Error al guardar las asignaciones')
        } finally {
            setLoading(false)
        }
    }

    if (!teacher) return null

    // Organizar grados por nivel para mejor visualización
    const gradesByLevel = grades.reduce((acc, grade) => {
        const level = grade.level || 'danza'
        if (!acc[level]) acc[level] = []
        acc[level].push(grade)
        return acc
    }, {})

    return (
        <CModal 
            visible={visible} 
            onClose={onClose} 
            size="lg"
            alignment="center"
            backdrop="static"
            className="teacher-assign-modal"
        >
            <CModalHeader className="border-0 pb-0">
                <CModalTitle className="d-flex align-items-center w-100">
                    <div 
                        className="rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" 
                        style={{ 
                            width: '56px', 
                            height: '56px',
                            background: 'linear-gradient(145deg, #E07A00, #C66900)',
                            boxShadow: '0 8px 16px rgba(224,122,0,0.2)'
                        }}
                    >
                        <CIcon icon={cilUser} className="text-white" size="xl" />
                    </div>
                    <div className="flex-grow-1">
                        <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>
                            Asignar Especialidad y Grados
                        </h4>
                        <div className="d-flex align-items-center mt-1">
                            <span className="text-muted" style={{ fontSize: '1rem' }}>
                                {teacher.first_name} {teacher.last_name}
                            </span>
                            {currentYear && (
                                <>
                                    <span className="mx-2 text-muted">•</span>
                                    <div className="d-flex align-items-center">
                                        <CIcon icon={cilCalendar} size="sm" className="text-muted me-1" />
                                        <span className="fw-semibold" style={{ color: '#E07A00' }}>
                                            {currentYear.name}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </CModalTitle>
            </CModalHeader>

            <CModalBody className="px-4 py-4">
                {error && (
                    <CAlert 
                        color="danger" 
                        className="d-flex align-items-center border-0 rounded-4 mb-4"
                        style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}
                    >
                        <CIcon icon={cilWarning} className="me-2 flex-shrink-0" size="lg" />
                        <span>{error}</span>
                    </CAlert>
                )}

                {/* SECCIÓN ESPECIALIDAD */}
                <div className="mb-5">
                    <div className="d-flex align-items-center mb-3">
                        <div 
                            className="d-flex align-items-center justify-content-center rounded-2 me-2"
                            style={{ 
                                width: '32px', 
                                height: '32px',
                                background: 'rgba(224,122,0,0.1)',
                                borderRadius: '8px'
                            }}
                        >
                            <CIcon icon={cilStar} style={{ color: '#E07A00' }} size="sm" />
                        </div>
                        <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                            Especialidad
                        </h5>
                        <span className="ms-2 text-muted small">(solo una por año)</span>
                    </div>
                    
                    <div className="ps-4">
                        <CFormSelect
                            value={selectedSpecialtyId}
                            onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                            style={{
                                border: selectedSpecialtyId 
                                    ? '2px solid rgba(224,122,0,0.3)' 
                                    : '1px solid rgba(224,122,0,0.2)',
                                borderRadius: '14px',
                                padding: '14px 16px',
                                fontSize: '1rem',
                                backgroundColor: selectedSpecialtyId ? 'rgba(224,122,0,0.02)' : 'white',
                                transition: 'all 0.2s ease'
                            }}
                            className="hover-lift"
                        >
                            <option value="">Selecciona una especialidad...</option>
                            {specialties.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.name} {s.area ? `(${s.area})` : ''}
                                </option>
                            ))}
                        </CFormSelect>
                        
                        {selectedSpecialtyId && (
                            <div className="d-flex align-items-center mt-2 text-success small">
                                <CIcon icon={cilCheckCircle} size="sm" className="me-1" />
                                Especialidad seleccionada
                            </div>
                        )}
                    </div>
                </div>

                {/* SECCIÓN GRADOS */}
                <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                            <div 
                                className="d-flex align-items-center justify-content-center rounded-2 me-2"
                                style={{ 
                                    width: '32px', 
                                    height: '32px',
                                    background: 'rgba(224,122,0,0.1)',
                                    borderRadius: '8px'
                                }}
                            >
                                <CIcon icon={cilSchool} style={{ color: '#E07A00' }} size="sm" />
                            </div>
                            <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                                Grados
                            </h5>
                            <span className="ms-2 text-muted small">(puedes seleccionar varios)</span>
                        </div>
                        
                        <CButton
                            color="link"
                            onClick={handleSelectAll}
                            size="sm"
                            className="p-0 fw-semibold"
                            style={{ 
                                color: '#E07A00', 
                                textDecoration: 'none',
                                borderBottom: '1px dashed #E07A00',
                                borderRadius: 0
                            }}
                        >
                            {selectedGrades.length === grades.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                        </CButton>
                    </div>

                    <div 
                        className="ps-4"
                        style={{
                            maxHeight: '350px',
                            overflowY: 'auto',
                            paddingRight: '8px'
                        }}
                    >
                        {grades.length > 0 ? (
                            <CRow>
                                {Object.entries(gradesByLevel).map(([level, levelGrades]) => (
                                    <CCol xs={12} key={level} className="mb-3">
                                        <div className="small fw-semibold text-muted mb-2" style={{ letterSpacing: '0.5px' }}>
                                            {level.toUpperCase()}
                                        </div>
                                        <div className="d-flex flex-wrap gap-2">
                                            {levelGrades.map(grade => (
                                                <div
                                                    key={grade.id}
                                                    onClick={() => handleGradeToggle(grade.id)}
                                                    className="d-inline-flex align-items-center rounded-3 px-3 py-2"
                                                    style={{
                                                        backgroundColor: selectedGrades.includes(grade.id) 
                                                            ? '#E07A00' 
                                                            : 'rgba(224,122,0,0.05)',
                                                        border: selectedGrades.includes(grade.id)
                                                            ? 'none'
                                                            : '1px solid rgba(224,122,0,0.2)',
                                                        color: selectedGrades.includes(grade.id) 
                                                            ? 'white' 
                                                            : '#1e293b',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        fontSize: '0.95rem',
                                                        fontWeight: selectedGrades.includes(grade.id) ? '600' : '500',
                                                        boxShadow: selectedGrades.includes(grade.id)
                                                            ? '0 4px 8px rgba(224,122,0,0.3)'
                                                            : 'none'
                                                    }}
                                                >
                                                    {grade.name}
                                                    {selectedGrades.includes(grade.id) && (
                                                        <CIcon icon={cilCheckCircle} size="sm" className="ms-2" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CCol>
                                ))}
                            </CRow>
                        ) : (
                            <div className="text-center py-5 text-muted">
                                <CIcon icon={cilXCircle} size="2xl" className="mb-3 opacity-50" />
                                <p>No hay grados disponibles</p>
                            </div>
                        )}
                    </div>

                    <div className="d-flex justify-content-end mt-3 pt-2 border-top border-light">
                        <span className="text-muted small">
                            <span className="fw-bold" style={{ color: '#E07A00' }}>{selectedGrades.length}</span> grado(s) seleccionado(s)
                        </span>
                    </div>
                </div>
            </CModalBody>

            <CModalFooter className="border-0 pt-0 pb-4 px-4">
                <CRow className="w-100 g-3">
                    <CCol xs={6}>
                        <CButton
                            color="secondary"
                            variant="ghost"
                            onClick={onClose}
                            disabled={loading}
                            className="w-100 py-3 fw-semibold"
                            style={{
                                borderRadius: '14px',
                                border: '1px solid rgba(224,122,0,0.2)',
                                color: '#64748b'
                            }}
                        >
                            Cancelar
                        </CButton>
                    </CCol>
                    <CCol xs={6}>
                        <CButton
                            className="w-100 py-3 text-white border-0 fw-semibold"
                            style={{
                                background: 'linear-gradient(145deg, #E07A00, #C66900)',
                                borderRadius: '14px',
                                boxShadow: '0 8px 16px rgba(224,122,0,0.2)'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'linear-gradient(145deg, #C66900, #B05A00)'}
                            onMouseLeave={(e) => e.target.style.background = 'linear-gradient(145deg, #E07A00, #C66900)'}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <CSpinner size="sm" className="me-2" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Asignaciones'
                            )}
                        </CButton>
                    </CCol>
                </CRow>
            </CModalFooter>

            <style>{`
                .teacher-assign-modal .modal-content {
                    border: none;
                    border-radius: 32px !important;
                    overflow: hidden;
                }
                .hover-lift {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .hover-lift:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(224,122,0,0.15) !important;
                }
                .ps-4 {
                    padding-left: 1.5rem !important;
                }
            `}</style>
        </CModal>
    )
}

export default AsignarEspecialidadGradosModal