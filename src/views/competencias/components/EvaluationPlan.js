import React from 'react'
import {
    CButton,
    CFormInput,
    CBadge,
    CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilTrash, cilCheckCircle, cilWarning, cilChartPie } from '@coreui/icons'

const EvaluationPlan = ({ evaluations = [], isLocked = false, onChange }) => {
    const handleAdd = () => {
        if (isLocked) return
        const currentTotal = evaluations.reduce((sum, ev) => sum + (parseInt(ev.weight) || 0), 0)
        const remaining = Math.max(0, 100 - currentTotal)

        const newEval = [
            ...evaluations,
            { name: `Evaluación ${evaluations.length + 1}`, weight: remaining }
        ]
        onChange(newEval)
    }

    const handleDelete = (index) => {
        if (isLocked) return
        const newEval = [...evaluations]
        newEval.splice(index, 1)
        onChange(newEval)
    }

    const handleUpdate = (index, field, value) => {
        if (isLocked) return
        const newEval = [...evaluations]
        newEval[index][field] = value
        onChange(newEval)
    }

    const totalWeight = evaluations.reduce((sum, ev) => sum + (parseInt(ev.weight) || 0), 0)

    return (
        <div className="h-100 d-flex flex-column bg-body-tertiary bg-opacity-50 p-4 rounded-4 border border-light-custom">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h6 className="fw-bold mb-1 text-uppercase ls-1 text-primary d-flex align-items-center">
                        <CIcon icon={cilChartPie} className="me-2" />
                        Plan de Evaluación
                    </h6>
                </div>
                {!isLocked && (
                    <CButton color="primary" variant="ghost" size="sm" onClick={handleAdd} className="rounded-pill fw-bold" disabled={totalWeight >= 100}>
                        <CIcon icon={cilPlus} size="sm" className="me-1" /> Nota
                    </CButton>
                )}
            </div>

            <div className="flex-grow-1 overflow-auto pe-1 mb-3">
                {evaluations.length === 0 ? (
                    <div className="text-center py-4 text-body-secondary small">
                        Sin evaluaciones definidas.
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-2">
                        {evaluations.map((ev, idx) => (
                            <div key={idx} className="d-flex align-items-center bg-body-secondary p-2 rounded-3 shadow-sm border border-light border-opacity-10">
                                <span className="fw-bold text-body-secondary me-2 small ps-2">{idx + 1}.</span>
                                <CFormInput
                                    size="sm"
                                    className="border-0 bg-transparent fw-medium text-body"
                                    value={ev.name}
                                    disabled={isLocked}
                                    onChange={(e) => handleUpdate(idx, 'name', e.target.value)}
                                    placeholder="Nombre Evaluación"
                                />
                                <div className="d-flex align-items-center ms-2 bg-body-tertiary rounded-pill px-2 py-1 border">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="form-control-plaintext form-control-sm text-end fw-bold p-0 text-primary"
                                        style={{ width: '30px' }}
                                        value={ev.weight}
                                        disabled={isLocked}
                                        onChange={(e) => handleUpdate(idx, 'weight', e.target.value)}
                                    />
                                    <span className="small fw-bold text-body-secondary ms-1">%</span>
                                </div>
                                {!isLocked && (
                                    <button className="btn btn-link text-danger p-1 ms-1 opacity-50 hover-opacity-100" onClick={() => handleDelete(idx)}>
                                        <CIcon icon={cilTrash} size="sm" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-auto pt-3 border-top border-light-custom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small fw-bold text-uppercase text-body-secondary">Total Ponderación</span>
                    <CBadge
                        color={totalWeight === 100 ? 'success' : 'warning'}
                        className="fs-6 px-3 py-2 rounded-pill shadow-sm"
                    >
                        {totalWeight}%
                    </CBadge>
                </div>

                {totalWeight !== 100 && (
                    <div className="d-flex align-items-center text-danger small">
                        <CIcon icon={cilWarning} className="me-1" size="sm" />
                        <span>La suma debe ser exactamente 100%</span>
                    </div>
                )}

                {totalWeight === 100 && (
                    <CAlert color="success" className="d-flex align-items-center border-0 small bg-success bg-opacity-10 text-success p-2 mb-0 mt-2 rounded-3">
                        <CIcon icon={cilCheckCircle} className="me-2 flex-shrink-0" />
                        <div className="lh-1" style={{ fontSize: '0.75rem' }}>
                            <strong>Plan Válido.</strong> La nota final del lapso se calculará automáticamente.
                        </div>
                    </CAlert>
                )}
            </div>

            <style>{`
        .hover-opacity-100:hover { opacity: 1 !important; }
        [data-coreui-theme="dark"] .bg-body-secondary { background-color: rgba(255, 255, 255, 0.05) !important; }
        [data-coreui-theme="dark"] .bg-body-tertiary { background-color: rgba(0, 0, 0, 0.2) !important; }
      `}</style>
        </div>
    )
}

export default EvaluationPlan
