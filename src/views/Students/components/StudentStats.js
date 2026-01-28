import React from 'react'
import { CRow, CCol, CCard, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilCheckCircle, cilFilter, cilCursor } from '@coreui/icons'
import PropTypes from 'prop-types'

const StatItem = ({ label, value, icon, colorClass, iconColor }) => (
    <CCard className="premium-card border-0 h-100 overflow-hidden shadow-sm hover-lift-xs">
        <CCardBody className="p-4">
            <div className="d-flex align-items-center">
                <div className={`rounded-circle p-3 me-3 d-flex align-items-center justify-content-center ${colorClass}`} style={{ width: '64px', height: '64px', color: iconColor }}>
                    {icon}
                </div>
                <div>
                    <h6 className="text-muted mb-1 small fw-bold text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>{label}</h6>
                    <h2 className="mb-0 fw-bold text-dark">{value}</h2>
                </div>
            </div>
        </CCardBody>
        <style>
            {`
                .hover-lift-xs { transition: transform 0.2s ease; }
                .hover-lift-xs:hover { transform: translateY(-3px); }
            `}
        </style>
    </CCard>
)

const StudentStats = ({ total, actives, filtered, selected }) => {
    return (
        <CRow className="mb-4 g-3">
            <CCol xs={12} sm={6} lg={3}>
                <StatItem
                    label="Matrícula Total"
                    value={total}
                    icon={<CIcon icon={cilUser} size="xl" />}
                    colorClass="bg-orange-soft"
                    iconColor="var(--primary-600)"
                />
            </CCol>

            <CCol xs={12} sm={6} lg={3}>
                <StatItem
                    label="Estudiantes Activos"
                    value={actives}
                    icon={<CIcon icon={cilCheckCircle} size="xl" />}
                    colorClass="bg-success bg-opacity-10"
                    iconColor="var(--success)"
                />
            </CCol>

            <CCol xs={12} sm={6} lg={3}>
                <StatItem
                    label="Resultado Filtro"
                    value={filtered}
                    icon={<CIcon icon={cilFilter} size="xl" />}
                    colorClass="bg-info bg-opacity-10"
                    iconColor="var(--info)"
                />
            </CCol>

            <CCol xs={12} sm={6} lg={3}>
                <StatItem
                    label="Seleccionados"
                    value={selected}
                    icon={<CIcon icon={cilCursor} size="xl" />}
                    colorClass="bg-warning bg-opacity-10"
                    iconColor="var(--warning)"
                />
            </CCol>
        </CRow>
    )
}

StudentStats.propTypes = {
    total: PropTypes.number,
    actives: PropTypes.number,
    filtered: PropTypes.number,
    selected: PropTypes.number,
}

export default StudentStats