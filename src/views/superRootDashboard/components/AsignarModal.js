import React, { useState, useEffect } from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CRow,
    CCol,
    CFormSelect,
    CBadge,
    CCard,
    CCardBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
    cilStar, 
    cilBookmark, 
    cilCheck,
    cilBan,
    cilInfo
} from '@coreui/icons'

const AsignarEspecialidadGradosModal = ({ 
    visible, 
    onClose, 
    teacher, 
    specialties = [], 
    grades = [],
    onSave 
}) => {
    const [selectedSpecialty, setSelectedSpecialty] = useState('')
    const [selectedGrades, setSelectedGrades] = useState([])
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (visible && teacher) {
            setSelectedSpecialty(teacher.specialty || '')
            setSelectedGrades(teacher.grades?.map(g => g.id) || [])
        }
    }, [visible, teacher])

    const handleGradeToggle = (gradeId) => {
        setSelectedGrades(prev => {
            if (prev.includes(gradeId)) {
                return prev.filter(id => id !== gradeId)
            } else {
                return [...prev, gradeId]
            }
        })
    }

    const handleSave = async () => {
        if (!teacher) return
        
        setSaving(true)
        try {
            await onSave(teacher.id, {
                specialty: selectedSpecialty,
                gradeIds: selectedGrades
            })
            onClose()
        } catch (error) {
            console.error('Error guardando asignaciones:', error)
        } finally {
            setSaving(false)
        }
    }

    if (!teacher) return null

    return (
        <CModal 
            visible={visible} 
            onClose={onClose} 
            size="lg" 
            alignment="center"
            className="premium-modal"
        >
            <CModalHeader className="border-0 pb-3" style={{ 
                borderBottom: '1px solid rgba(224,122,0,0.2)',
                background: 'linear-gradient(145deg, #ffffff, #f8fafc)'
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
                        <CIcon icon={cilStar} className="text-white" size="lg" />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.25rem', color: '#1e293b' }}>
                            Asignar Especialidad y Grados
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal', marginTop: '4px' }}>
                            {teacher.first_name} {teacher.last_name}
                        </div>
                    </div>
                </CModalTitle>
            </CModalHeader>

            <CModalBody className="p-4">
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
                            <p className="mb-0 small" style={{ color: '#64748b' }}>
                                Define la especialidad y los grados que este docente podrá dictar
                            </p>
                        </div>
                    </div>
                </div>

                <CRow className="g-4">
                    {/* COLUMNA IZQUIERDA - ESPECIALIDAD */}
                    <CCol md={5}>
                        <CCard className="border-0 h-100" style={{
                            background: 'rgba(224,122,0,0.02)',
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
                                        <h6 className="fw-bold mb-1" style={{ color: '#1e293b' }}>
                                            Especialidad
                                        </h6>
                                        <p className="small mb-0" style={{ color: '#64748b' }}>
                                            Área principal de enseñanza
                                        </p>
                                    </div>
                                </div>

                                <CFormSelect
                                    value={selectedSpecialty}
                                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                                    style={{
                                        borderRadius: '14px',
                                        padding: '12px',
                                        border: '1px solid rgba(224,122,0,0.2)',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <option value="">-- Seleccionar especialidad --</option>
                                    {specialties.map(spec => (
                                        <option key={spec.id} value={spec.name}>
                                            {spec.name}
                                        </option>
                                    ))}
                                </CFormSelect>

                                {selectedSpecialty && (
                                    <div className="mt-3 text-center">
                                        <CBadge style={{
                                            background: 'linear-gradient(145deg, #E07A00, #C66900)',
                                            color: 'white',
                                            padding: '8px 16px',
                                            borderRadius: '30px',
                                            fontSize: '0.85rem'
                                        }}>
                                            <CIcon icon={cilCheck} className="me-1" size="sm" />
                                            {selectedSpecialty}
                                        </CBadge>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>

                    {/* COLUMNA DERECHA - GRADOS */}
                    <CCol md={7}>
                        <CCard className="border-0 h-100" style={{
                            background: 'rgba(224,122,0,0.02)',
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
                                        <CIcon icon={cilBookmark} style={{ color: '#E07A00' }} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1" style={{ color: '#1e293b' }}>
                                            Grados Académicos
                                        </h6>
                                        <p className="small mb-0" style={{ color: '#64748b' }}>
                                            Selecciona los grados que dictará
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <CBadge style={{
                                        background: selectedGrades.length > 0 
                                            ? 'linear-gradient(145deg, #E07A00, #C66900)'
                                            : 'rgba(100,116,139,0.1)',
                                        color: selectedGrades.length > 0 ? 'white' : '#64748b',
                                        padding: '8px 16px',
                                        borderRadius: '30px'
                                    }}>
                                        {selectedGrades.length} grado(s) seleccionado(s)
                                    </CBadge>
                                </div>

                                <CRow className="g-2">
                                    {grades.map(grade => (
                                        <CCol xs={6} key={grade.id}>
                                            <CButton
                                                className="w-100 py-3"
                                                style={{
                                                    background: selectedGrades.includes(grade.id)
                                                        ? 'linear-gradient(145deg, #E07A00, #C66900)'
                                                        : 'white',
                                                    border: selectedGrades.includes(grade.id)
                                                        ? 'none'
                                                        : '1px solid rgba(224,122,0,0.2)',
                                                    color: selectedGrades.includes(grade.id)
                                                        ? 'white'
                                                        : '#1e293b',
                                                    borderRadius: '14px',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: selectedGrades.includes(grade.id)
                                                        ? '0 4px 12px rgba(224,122,0,0.3)'
                                                        : 'none'
                                                }}
                                                onClick={() => handleGradeToggle(grade.id)}
                                                onMouseEnter={(e) => {
                                                    if (!selectedGrades.includes(grade.id)) {
                                                        e.target.style.background = 'rgba(224,122,0,0.05)'
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!selectedGrades.includes(grade.id)) {
                                                        e.target.style.background = 'white'
                                                    }
                                                }}
                                            >
                                                {grade.name}
                                                {selectedGrades.includes(grade.id) && (
                                                    <CIcon icon={cilCheck} className="ms-2" size="sm" />
                                                )}
                                            </CButton>
                                        </CCol>
                                    ))}
                                </CRow>

                                {selectedGrades.length === 0 && (
                                    <div className="text-center mt-3">
                                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                            <CIcon icon={cilBan} className="me-1" size="sm" />
                                            Ningún grado seleccionado
                                        </span>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CModalBody>

            <CModalFooter className="border-0 p-4" style={{ 
                background: 'linear-gradient(145deg, #f8fafc, #f1f5f9)',
                borderTop: '1px solid rgba(224,122,0,0.1)'
            }}>
                <CButton
                    color="light"
                    onClick={onClose}
                    style={{
                        borderRadius: '14px',
                        padding: '12px 24px',
                        fontWeight: '600',
                        border: '1px solid rgba(224,122,0,0.2)',
                        background: 'white'
                    }}
                >
                    CANCELAR
                </CButton>
                <CButton
                    style={{
                        background: 'linear-gradient(145deg, #E07A00, #C66900)',
                        border: 'none',
                        borderRadius: '14px',
                        padding: '12px 32px',
                        fontWeight: '600',
                        color: 'white',
                        boxShadow: '0 8px 16px rgba(224,122,0,0.2)',
                        opacity: saving ? 0.8 : 1
                    }}
                    onClick={handleSave}
                    disabled={saving || (!selectedSpecialty && selectedGrades.length === 0)}
                >
                    {saving ? 'GUARDANDO...' : (
                        <>
                            <CIcon icon={cilCheck} className="me-2" size="sm" />
                            GUARDAR ASIGNACIONES
                        </>
                    )}
                </CButton>
            </CModalFooter>
        </CModal>
    )
}

export default AsignarEspecialidadGradosModal