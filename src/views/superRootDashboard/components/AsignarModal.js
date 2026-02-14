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
    CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilSchool, cilWarning, cilCalendar } from '@coreui/icons'

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
            // No cerrar aquí - onSave debe manejar el cierre
        } catch (err) {
            setError(err.message || 'Error al guardar las asignaciones')
        } finally {
            setLoading(false)
        }
    }

    if (!teacher) return null

    return (
        <CModal 
            visible={visible} 
            onClose={onClose} 
            size="lg"
            alignment="center"
            backdrop="static"
        >
            <CModalHeader className="border-0 pb-0">
                <CModalTitle className="d-flex align-items-center">
                    <div className="bg-orange rounded-3 p-2 me-3 d-flex align-items-center justify-content-center shadow-orange-sm" 
                        style={{ width: '48px', height: '48px' }}
                    >
                        <CIcon icon={cilUser} className="text-white" size="lg" />
                    </div>
                    <div>
                        <h5 className="mb-0 fw-bold">Asignar Especialidad y Grados</h5>
                        <small className="text-muted">
                            {teacher.first_name} {teacher.last_name}
                        </small>
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

            <CModalBody>
                {error && (
                    <CAlert color="danger" className="d-flex align-items-center">
                        <CIcon icon={cilWarning} className="me-2" />
                        {error}
                    </CAlert>
                )}

                {/* ESPECIALIDAD */}
                <div className="mb-4">
                    <CFormLabel className="fw-bold mb-2" style={{ color: '#1e293b' }}>
                        Especialidad para {currentYear?.name}
                    </CFormLabel>
                    <CFormSelect
                        value={selectedSpecialtyId}
                        onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                        style={{
                            border: '1px solid rgba(224,122,0,0.2)',
                            borderRadius: '12px',
                            padding: '12px'
                        }}
                    >
                        <option value="">Selecciona una especialidad...</option>
                        {specialties.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.name} {s.area ? `(${s.area})` : ''}
                            </option>
                        ))}
                    </CFormSelect>
                    <small className="text-muted d-block mt-1">
                        {selectedSpecialtyId ? 'Especialidad seleccionada' : 'Sin especialidad asignada'}
                    </small>
                </div>

                {/* GRADOS */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <CFormLabel className="fw-bold mb-0" style={{ color: '#1e293b' }}>
                            Grados a Asignar ({currentYear?.name || ''})
                        </CFormLabel>
                        <CButton
                            color="link"
                            onClick={handleSelectAll}
                            size="sm"
                            style={{ color: '#E07A00', textDecoration: 'none' }}
                        >
                            {selectedGrades.length === grades.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                        </CButton>
                    </div>
                    <div style={{
                        maxHeight: '250px',
                        overflowY: 'auto',
                        border: '1px solid rgba(224,122,0,0.1)',
                        borderRadius: '12px',
                        padding: '12px'
                    }}>
                        {grades.length > 0 ? (
                            grades.map(grade => (
                                <div key={grade.id} className="mb-2">
                                    <CFormCheck
                                        id={`grade-${grade.id}`}
                                        label={`${grade.name} (${grade.level || 'danza'})`}
                                        checked={selectedGrades.includes(grade.id)}
                                        onChange={() => handleGradeToggle(grade.id)}
                                        style={{ 
                                            cursor: 'pointer',
                                            padding: '8px',
                                            borderRadius: '8px',
                                            backgroundColor: selectedGrades.includes(grade.id) ? 'rgba(224,122,0,0.05)' : 'transparent'
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-muted text-center py-3">No hay grados disponibles</p>
                        )}
                    </div>
                    <small className="text-muted d-block mt-2">
                        {selectedGrades.length} grado(s) seleccionado(s)
                    </small>
                </div>
            </CModalBody>

            <CModalFooter className="border-0">
                <CButton
                    color="secondary"
                    variant="ghost"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4"
                    style={{ borderRadius: '12px' }}
                >
                    Cancelar
                </CButton>
                <CButton
                    className="px-4 text-white border-0"
                    style={{
                        background: 'linear-gradient(145deg, #E07A00, #C66900)',
                        borderRadius: '12px',
                        minWidth: '120px'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'linear-gradient(145deg, #C66900, #B05A00)'}
                    onMouseLeave={(e) => e.target.style.background = 'linear-gradient(145deg, #E07A00, #C66900)'}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <CSpinner size="sm" className="me-2" />
                    ) : null}
                    {loading ? 'Guardando...' : 'Guardar Asignaciones'}
                </CButton>
            </CModalFooter>

            <style>{`
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

export default AsignarEspecialidadGradosModal