import React from 'react'
import { CRow, CCol, CCard, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilTask, cilCheckCircle, cilXCircle } from '@coreui/icons'
import PropTypes from 'prop-types'

const SummaryCard = ({ label, value, icon, colorClass, iconColor }) => (
    <CCard className="premium-card border-0 h-100 overflow-hidden shadow-sm transition-all hover-lift-xs">
        <CCardBody className="p-4">
            <div className="d-flex align-items-center">
                <div className={`rounded-circle p-3 me-3 d-flex align-items-center justify-content-center ${colorClass}`} style={{ width: '56px', height: '56px', color: iconColor }}>
                    {icon}
                </div>
                <div>
                    <h6 className="text-muted-custom mb-1 small fw-bold text-uppercase ls-1" style={{ fontSize: '0.65rem' }}>{label}</h6>
                    <h2 className="mb-0 fw-bold header-title-custom">{value}</h2>
                </div>
            </div>
        </CCardBody>
    </CCard>
)

const EvaluationSummary = ({ subject, notas, calculatePromedio }) => {
    const withGrades = subject.estudiantes.filter(est => {
        const notasEst = notas[est.id]
        return notasEst && Object.values(notasEst).some(n => n !== "")
    }).length

    const approved = subject.estudiantes.filter(est => {
        const promedio = calculatePromedio(est.id)
        return promedio && parseFloat(promedio) >= 10
    }).length

    const failed = subject.estudiantes.filter(est => {
        const promedio = calculatePromedio(est.id)
        return promedio && parseFloat(promedio) < 10
    }).length

    return (
        <CRow className="mt-4 g-3 no-print">
            <CCol xs={12} sm={6} lg={3}>
                <SummaryCard
                    label="Estudiantes"
                    value={subject.estudiantes.length}
                    icon={<CIcon icon={cilPeople} size="lg" />}
                    colorClass="bg-orange-soft"
                    iconColor="var(--primary-600)"
                />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
                <SummaryCard
                    label="Calificados"
                    value={withGrades}
                    icon={<CIcon icon={cilTask} size="lg" />}
                    colorClass="bg-info bg-opacity-10"
                    iconColor="var(--info)"
                />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
                <SummaryCard
                    label="Aprobados"
                    value={approved}
                    icon={<CIcon icon={cilCheckCircle} size="lg" />}
                    colorClass="bg-success bg-opacity-10"
                    iconColor="var(--success)"
                />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
                <SummaryCard
                    label="Reprobados"
                    value={failed}
                    icon={<CIcon icon={cilXCircle} size="lg" />}
                    colorClass="bg-danger bg-opacity-10"
                    iconColor="var(--danger)"
                />
            </CCol>
        </CRow>
    )
}

EvaluationSummary.propTypes = {
    subject: PropTypes.object.isRequired,
    notas: PropTypes.object.isRequired,
    calculatePromedio: PropTypes.func.isRequired,
}

export default EvaluationSummary