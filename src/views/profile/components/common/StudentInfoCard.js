import React from 'react'
import { CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilEducation } from '@coreui/icons'
import PropTypes from 'prop-types'

const StudentInfoCard = ({
    student,
    colorClass = 'primary'
}) => {
    // Determine soft background class based on colorClass
    let bgSoftClass = 'bg-orange-soft';
    if (colorClass === 'success') bgSoftClass = 'bg-green-soft';
    if (colorClass === 'info') bgSoftClass = 'bg-blue-soft';
    if (colorClass === 'indigo') bgSoftClass = 'bg-purple-soft';

    return (
        <div className="p-3 p-md-4 rounded-4 h-100 student-info-card">
            <div className="d-flex align-items-center mb-3 mb-md-4">
                <span className={`p-2 ${bgSoftClass} rounded-circle me-3 flex-shrink-0`}>
                    <CIcon icon={cilEducation} size="sm" />
                </span>
                <h6 className={`text-${colorClass} mb-0 label-micro`}>Información del Estudiante</h6>
            </div>

            <CRow className="g-3 g-md-4">
                <CCol xs={12} sm={6}>
                    <label className="form-label label-micro mb-0 d-block student-label">Nombre Completo</label>
                    <div className="fw-bold fs-6 fs-sm-5 student-value">{student.nombre}</div>
                </CCol>
                <CCol xs={12} sm={6}>
                    <label className="form-label label-micro mb-0 d-block student-label">Nivel Actual</label>
                    <div className={`fw-bold fs-6 fs-sm-5 text-${colorClass}`}>
                        {student.grado} <span className="student-label fw-normal ms-1 small">– Secc {student.seccion}</span>
                    </div>
                </CCol>
                {student.dni && (
                    <CCol xs={12} sm={6}>
                        <label className="form-label label-micro mb-0 d-block student-label">Documento de Identidad</label>
                        <div className="fw-bold fs-6 fs-sm-5 student-value font-monospace">{student.dni}</div>
                    </CCol>
                )}
                {student.representante && (
                    <CCol xs={12} sm={6}>
                        <label className="form-label label-micro mb-0 d-block student-label">Representante Legal</label>
                        <div className="fw-bold fs-6 fs-sm-5 student-value">{student.representante}</div>
                    </CCol>
                )}
            </CRow>

            <style>{`
                .student-info-card {
                    background-color: rgba(0, 0, 0, 0.02);
                    border: 1px solid rgba(0, 0, 0, 0.08);
                }
                .student-label { color: var(--neutral-500); }
                .student-value { color: var(--neutral-800); }

                [data-coreui-theme="dark"] .student-info-card {
                    background-color: rgba(255, 255, 255, 0.03);
                    border-color: rgba(255, 255, 255, 0.1);
                }
                [data-coreui-theme="dark"] .student-label { color: rgba(255, 255, 255, 0.5); }
                [data-coreui-theme="dark"] .student-value { color: rgba(255, 255, 255, 0.9); }
            `}</style>
        </div>
    )
}

StudentInfoCard.propTypes = {
    student: PropTypes.object.isRequired,
    colorClass: PropTypes.string
}

export default StudentInfoCard
