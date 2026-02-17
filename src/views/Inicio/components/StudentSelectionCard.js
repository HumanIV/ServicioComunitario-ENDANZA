import React from 'react'
import { CCard, CCardBody, CButton, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendarCheck, cilArrowRight } from '@coreui/icons'
import PropTypes from 'prop-types'

const StudentSelectionCard = ({ child, colorClass, buttonText, onClick }) => {
    // Determinar la clase de fondo suave
    let bgSoftClass = 'bg-orange-soft';
    if (colorClass === 'success') bgSoftClass = 'bg-green-soft';
    if (colorClass === 'info') bgSoftClass = 'bg-blue-soft';
    if (colorClass === 'indigo') bgSoftClass = 'bg-purple-soft';
    if (colorClass === 'warning') bgSoftClass = 'bg-orange-soft';

    // ✅ Valores por defecto para evitar errores
    const firstInitial = child.first_name ? child.first_name[0] : '';
    const lastInitial = child.last_name ? child.last_name[0] : '';
    const initials = firstInitial + lastInitial || '?';

    return (
        <CCard className={`premium-card student-card h-100 border-0 border-start border-4 border-${colorClass}`} style={{ borderRadius: '16px' }}>
            <CCardBody className="p-4">
                <div className="d-flex align-items-center mb-4">
                    <div className="position-relative me-4">
                        <div
                            className={`rounded-circle d-flex align-items-center justify-content-center text-${colorClass} fw-bold shadow-sm student-avatar ${bgSoftClass}`}
                            style={{ width: '90px', height: '90px', fontSize: '1.8rem', letterSpacing: '1px' }}
                        >
                            {initials}
                        </div>
                    </div>
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <h4 className="fw-bold child-name mb-1">{child.full_name || child.fullName}</h4>
                                <div className="d-flex align-items-center child-id small fw-bold text-uppercase ls-1">
                                    <CIcon icon={cilCalendarCheck} className="me-1" size="sm" />
                                    {/* ✅ Mostrar cédula en lugar de code que no existe */}
                                    ID: {child.dni || child.id}
                                </div>
                            </div>
                            <CBadge className="px-3 py-2 rounded-pill fw-bold bg-green-soft" style={{ fontSize: '0.75rem', border: 'none' }}>
                                {/* ✅ Estado por defecto si no existe */}
                                {child.status || 'Activo'}
                            </CBadge>
                        </div>
                    </div>
                </div>

                <div className="p-3 child-info-box rounded-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="child-info-label small fw-bold text-uppercase">Grado y Programa</span>
                        <span className={`fw-bold text-${colorClass} text-end`}>{child.grade_level || child.gradeLevel}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="child-info-label small fw-bold text-uppercase">Periodo Actual</span>
                        <span className="fw-medium child-info-value">{child.academicYear || '2024-2025'}</span>
                    </div>
                </div>

                <CButton
                    onClick={() => onClick(child.id)}
                    color={colorClass}
                    className="w-100 btn-premium text-white py-3 fw-bold d-flex align-items-center justify-content-center"
                    style={{ borderRadius: '14px' }}
                >
                    {buttonText}
                    <CIcon icon={cilArrowRight} className="ms-2" />
                </CButton>

                <style>{`
                    .child-name { color: var(--neutral-800); }
                    .child-id { color: var(--neutral-600); }
                    .child-info-box { 
                        background-color: rgba(0, 0, 0, 0.02); 
                        border: 1px solid rgba(0, 0, 0, 0.06);
                    }
                    .child-info-label { color: var(--neutral-500); }
                    .child-info-value { color: var(--neutral-700); }
                    .student-avatar { border: 4px solid white; }

                    [data-coreui-theme="dark"] .child-name { color: rgba(255, 255, 255, 0.95); }
                    [data-coreui-theme="dark"] .child-id { color: rgba(255, 255, 255, 0.6); }
                    [data-coreui-theme="dark"] .child-info-box { 
                        background-color: rgba(255, 255, 255, 0.03); 
                        border-color: rgba(255, 255, 255, 0.1);
                    }
                    [data-coreui-theme="dark"] .child-info-label { color: rgba(255, 255, 255, 0.5); }
                    [data-coreui-theme="dark"] .child-info-value { color: rgba(255, 255, 255, 0.8); }
                    [data-coreui-theme="dark"] .student-avatar { border-color: rgba(255, 255, 255, 0.1); }
                `}</style>
            </CCardBody>
        </CCard>
    )
}

StudentSelectionCard.propTypes = {
    child: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        full_name: PropTypes.string,
        fullName: PropTypes.string,
        dni: PropTypes.string,
        grade_level: PropTypes.string,
        gradeLevel: PropTypes.string,
        status: PropTypes.string,
        academicYear: PropTypes.string
    }).isRequired,
    colorClass: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
}

export default StudentSelectionCard