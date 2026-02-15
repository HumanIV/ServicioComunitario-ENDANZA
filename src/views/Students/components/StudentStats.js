// StudentStats.jsx
import React from 'react'
import { CRow, CCol, CCard, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilCheckCircle, cilFilter, cilCursor } from '@coreui/icons'
import PropTypes from 'prop-types'

const StatItem = ({ label, value, icon, colorClass }) => (
    <CCard className="premium-card border-0 h-100 overflow-hidden shadow-sm hover-lift-xs">
        <CCardBody className="p-4">
            <div className="d-flex align-items-center">
                <div className={`rounded-circle p-3 me-3 d-flex align-items-center justify-content-center ${colorClass}`}>
                    {icon}
                </div>
                <div>
                    <h6 className="text-muted-custom mb-1 small fw-bold text-uppercase ls-1">
                        {label}
                    </h6>
                    <h2 className="mb-0 fw-bold header-title-custom">{value}</h2>
                </div>
            </div>
        </CCardBody>
    </CCard>
)

const StudentStats = ({ total, actives, filtered, selected }) => {
    return (
        <CRow className="mb-4 g-3">
            <CCol xs={12} sm={6} lg={3}>
                <StatItem
                    label="Matrícula Total"
                    value={total}
                    icon={<CIcon icon={cilUser} size="xl" className="text-primary" />}
                    colorClass="bg-orange-soft"
                />
            </CCol>

            <CCol xs={12} sm={6} lg={3}>
                <StatItem
                    label="Estudiantes Activos"
                    value={actives}
                    icon={<CIcon icon={cilCheckCircle} size="xl" className="text-success" />}
                    colorClass="bg-success bg-opacity-10"
                />
            </CCol>

            <CCol xs={12} sm={6} lg={3}>
                <StatItem
                    label="Resultado Filtro"
                    value={filtered}
                    icon={<CIcon icon={cilFilter} size="xl" className="text-info" />}
                    colorClass="bg-info bg-opacity-10"
                />
            </CCol>

            <CCol xs={12} sm={6} lg={3}>
                <StatItem
                    label="Seleccionados"
                    value={selected}
                    icon={<CIcon icon={cilCursor} size="xl" className="text-warning" />}
                    colorClass="bg-warning bg-opacity-10"
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