import React from 'react'
import { CCard, CCardBody, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilSchool, cilCalendar, cilDrop } from '@coreui/icons'
import PropTypes from 'prop-types'

const SummaryItem = ({ icon, label, value }) => (
    <div className="d-flex justify-content-between align-items-center mb-3 pb-3 summary-border last-no-border">
        <div className="d-flex align-items-center">
            <div className="p-2 summary-icon-box rounded-circle me-3">
                <CIcon icon={icon} size="sm" />
            </div>
            <span className="summary-label small fw-bold text-uppercase ls-1" style={{ fontSize: '0.65rem' }}>{label}</span>
        </div>
        <div className="fw-bold summary-value">{value || 'N/A'}</div>
    </div>
)

const ProfileSummary = ({ student }) => {
    // Calcular edad desde fecha de nacimiento
    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return 'N/A'
        const hoy = new Date()
        const nacimiento = new Date(fechaNacimiento)
        let edad = hoy.getFullYear() - nacimiento.getFullYear()
        const mes = hoy.getMonth() - nacimiento.getMonth()
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--
        }
        return `${edad} años`
    }

    const StatusBadge = ({ status }) => {
        // Mapear estados del backend a colores
        const colorMap = {
            "active": "success",
            "Activo": "success",
            "inactive": "secondary",
            "Inactivo": "secondary",
            "graduated": "info",
            "Graduado": "info",
            "retired": "danger",
            "Retirado": "danger"
        }
        const statusValue = status || 'Activo'
        const color = colorMap[statusValue] || "primary"

        return (
            <CBadge
                color={color}
                className="rounded-pill px-4 py-2 bg-opacity-10 shadow-sm"
                style={{
                    color: `var(--cui-${color})`,
                    border: `1px solid var(--cui-${color})33`,
                    letterSpacing: '1px'
                }}
            >
                {statusValue?.toUpperCase()}
            </CBadge>
        )
    }

    // Obtener la primera sección si existe
    const seccionActual = student.sections && student.sections.length > 0 
        ? student.sections[0].section_name 
        : 'Sin asignar'

    return (
        <CCard className="h-100 premium-card border-0 shadow-sm overflow-hidden animate__animated animate__fadeIn">
            <div className="position-absolute top-0 start-0 w-100 summary-header-bg" style={{ height: '120px' }}></div>
            <CCardBody className="text-center p-0 position-relative">
                <div className="pt-5 px-4 pb-4">
                    <div className="avatar-circle-xl bg-avatar-frame p-1 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm position-relative">
                        <div className="w-100 h-100 bg-orange-soft rounded-circle d-flex align-items-center justify-content-center text-warning fs-1 fw-bold summary-avatar-border">
                            {student.first_name?.charAt(0) || '?'}{student.last_name?.charAt(0) || '?'}
                        </div>
                        <div className="position-absolute bottom-0 end-0 p-2 bg-success summary-status-border rounded-circle shadow-sm"></div>
                    </div>

                    <h4 className="mb-1 fw-bold summary-title">{student.first_name || ''} {student.last_name || ''}</h4>
                    <p className="summary-subtitle small mb-3 text-uppercase ls-1">Expediente Académico #{student.id}</p>
                    <StatusBadge status={student.status} />
                </div>

                <div className="p-4 pt-2">
                    <SummaryItem 
                        icon={cilSchool} 
                        label="Grado / Sección" 
                        value={`${student.grade_level_name || 'N/A'} - ${seccionActual}`} 
                    />
                    <SummaryItem 
                        icon={cilCalendar} 
                        label="Fecha Nacimiento" 
                        value={student.birth_date || 'N/A'} 
                    />
                    <SummaryItem 
                        icon={cilUser} 
                        label="Edad Cronológica" 
                        value={calcularEdad(student.birth_date)} 
                    />
                    <SummaryItem 
                        icon={cilUser} 
                        label="Representante" 
                        value={student.representative || 'No definido'} 
                    />
                    <SummaryItem 
                        icon={cilDrop} 
                        label="Factor Sanguíneo" 
                        value={student.blood_type || 'N/A'} 
                    />
                </div>
            </CCardBody>
            <style>{`
                .ls-1 { letter-spacing: 1px; }
                .avatar-circle-xl { width: 120px; height: 120px; }
                .last-no-border:last-child { border-bottom: 0 !important; margin-bottom: 0 !important; padding-bottom: 0 !important; }
                
                .summary-header-bg { background-color: rgba(242, 140, 15, 0.1); }
                .bg-avatar-frame { background-color: white; }
                .summary-title { color: var(--neutral-800); }
                .summary-subtitle { color: var(--neutral-500); }
                .summary-icon-box { background-color: var(--neutral-100); color: var(--neutral-500); }
                .summary-label { color: var(--neutral-500); }
                .summary-value { color: var(--neutral-800); }
                .summary-border { border-bottom: 1px solid rgba(0,0,0,0.05); }
                .summary-avatar-border { border: 5px solid white; }
                .summary-status-border { border: 2px solid white; }

                [data-coreui-theme="dark"] .summary-header-bg { background-color: rgba(242, 140, 15, 0.05); }
                [data-coreui-theme="dark"] .bg-avatar-frame { background-color: #2a303d; }
                [data-coreui-theme="dark"] .summary-title { color: white; }
                [data-coreui-theme="dark"] .summary-subtitle { color: rgba(255,255,255,0.5); }
                [data-coreui-theme="dark"] .summary-icon-box { background-color: rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); }
                [data-coreui-theme="dark"] .summary-label { color: rgba(255,255,255,0.5); }
                [data-coreui-theme="dark"] .summary-value { color: white; }
                [data-coreui-theme="dark"] .summary-border { border-bottom: 1px solid rgba(255,255,255,0.05); }
                [data-coreui-theme="dark"] .summary-avatar-border { border-color: #2a303d; }
                [data-coreui-theme="dark"] .summary-status-border { border-color: #2a303d; }
            `}</style>
        </CCard>
    )
}

ProfileSummary.propTypes = {
    student: PropTypes.object.isRequired,
}

export default ProfileSummary