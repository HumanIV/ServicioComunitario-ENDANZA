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
                <CModalTitle className="d-flex align-items-center header-title-custom">
                    <div className="bg-primary rounded-4 p-2 me-3 d-flex align-items-center justify-content-center shadow-orange"
                        style={{ width: '48px', height: '48px' }}
                    >
                        <CIcon icon={cilUser} className="text-white" size="lg" />
                    </div>
                    <div>
                        <h5 className="mb-0 fw-bold header-title-custom">Asignar Especialidad y Grados</h5>
                        <small className="text-muted-custom fw-medium">
                            {teacher.first_name} {teacher.last_name}
                        </small>
                        {currentYear && (
                            <div className="d-flex align-items-center mt-1">
                                <CIcon icon={cilCalendar} size="sm" className="text-muted-custom me-1" />
                                <span className="small text-muted-custom">
                                    Asignaciones para: <strong className="text-primary">{currentYear.name}</strong>
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
                    <CFormLabel className="fw-bold mb-2 header-title-custom">
                        Especialidad para {currentYear?.name}
                    </CFormLabel>
                    <CFormSelect
                        value={selectedSpecialtyId}
                        onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                        className="bg-light-custom border-light-custom rounded-3 p-2"
                    >
                        <option value="">Selecciona una especialidad...</option>
                        {specialties.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.name} {s.area ? `(${s.area})` : ''}
                            </option>
                        ))}
                    </CFormSelect>
                    <small className="text-muted-custom d-block mt-1 fw-medium">
                        {selectedSpecialtyId ? 'Especialidad seleccionada' : 'Sin especialidad asignada'}
                    </small>
                </div>

                {/* GRADOS */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <CFormLabel className="fw-bold mb-0 header-title-custom">
                            Grados a Asignar ({currentYear?.name || ''})
                        </CFormLabel>
                        <CButton
                            color="link"
                            onClick={handleSelectAll}
                            size="sm"
                            className="text-primary text-decoration-none fw-bold"
                        >
                            {selectedGrades.length === grades.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                        </CButton>
                    </div>
                    <div className="bg-light-custom border border-light-custom rounded-4 p-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {grades.length > 0 ? (
                            grades.map(grade => (
                                <div key={grade.id} className="mb-2">
                                    <CFormCheck
                                        id={`grade-${grade.id}`}
                                        label={`${grade.name} (${grade.level || 'danza'})`}
                                        checked={selectedGrades.includes(grade.id)}
                                        onChange={() => handleGradeToggle(grade.id)}
                                        className={`p-2 rounded-3 transition-all ${selectedGrades.includes(grade.id) ? 'bg-primary bg-opacity-10' : ''}`}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-custom text-center py-3">No hay grados disponibles</p>
                        )}
                    </div>
                    <small className="text-muted-custom d-block mt-2 fw-medium">
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
                    className="px-4 rounded-3 text-muted-custom fw-bold"
                >
                    Cancelar
                </CButton>
                <CButton
                    className="px-4 text-white border-0 docente-btn-primary"
                    style={{ borderRadius: '12px', minWidth: '120px' }}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <CSpinner size="sm" className="me-2" />
                    ) : null}
                    {loading ? 'Guardando...' : 'Guardar Asignaciones'}
                </CButton>
            </CModalFooter>
        </CModal>
    )
}

export default AsignarEspecialidadGradosModal