import React from 'react'
import {
    CButton,
    CFormInput,
    CBadge,
    CAlert,
    CRow,
    CCol,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilTrash, cilCheckCircle, cilWarning, cilList } from '@coreui/icons'

const CompetencyEvaluationPlan = ({ evaluations = [], isLocked = false, onChange }) => {
    const handleAdd = () => {
        if (isLocked) return
        const currentTotal = evaluations.reduce((sum, ev) => sum + (parseInt(ev.weight) || 0), 0)
        const remaining = Math.max(0, 100 - currentTotal)

        const newEval = [
            ...evaluations,
            { name: `Nueva Competencia...`, weight: remaining }
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
        <div className="h-100 d-flex flex-column">
            {/* Header - Responsive */}
            <div className="header-section mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-start gap-3">
                    <div className="text-center text-md-start">
                        <h5 className="fw-bold mb-0 text-primary ls-tight d-none d-md-block">Plan de Evaluación y Competencias</h5>
                        <h5 className="fw-bold mb-0 text-primary ls-tight d-md-none">Competencias</h5>
                        <small className="text-body-secondary d-none d-md-block">Defina los indicadores de logro y su ponderación porcentual.</small>
                    </div>
                    {!isLocked && (
                        <CButton
                            onClick={handleAdd}
                            className="btn-premium rounded-pill btn-sm d-flex align-items-center px-4 add-button"
                            disabled={totalWeight >= 100}
                        >
                            <CIcon icon={cilPlus} size="sm" className="me-2" />
                            <span className="fw-bold small">AGREGAR</span>
                        </CButton>
                    )}
                </div>
            </div>

            {/* Competency List - Table Design */}
            <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '60vh' }}>
                {evaluations.length === 0 ? (
                    <div className="text-center p-5 bg-body-tertiary rounded-4 border border-dashed">
                        <div className="mb-3 opacity-25">
                            <CIcon icon={cilList} size="4xl" />
                        </div>
                        <h6 className="text-body-secondary fw-bold">Sin Competencias Definidas</h6>
                        <p className="small text-body-secondary mb-0">Comienza agregando los indicadores para este período.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <CTable align="middle" className="mb-0 custom-premium-table border-0" hover responsive>
                            <CTableHead className="table-header-custom border-bottom">
                                <CTableRow>
                                    <CTableHeaderCell className="ps-4 py-3 text-muted-custom small fw-bold text-uppercase ls-1" width="50">
                                        #
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="py-3 text-muted-custom small fw-bold text-uppercase ls-1">
                                        Competencia / Indicador
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="py-3 text-muted-custom small fw-bold text-uppercase ls-1 text-center" width="140">
                                        Ponderación
                                    </CTableHeaderCell>
                                    {!isLocked && (
                                        <CTableHeaderCell className="py-3 text-muted-custom small fw-bold text-uppercase ls-1 text-end pe-4" width="80">
                                            Acciones
                                        </CTableHeaderCell>
                                    )}
                                </CTableRow>
                            </CTableHead>
                            <CTableBody className="border-0">
                                {evaluations.map((ev, idx) => (
                                    <CTableRow key={idx} className="hover-row transition-all border-0">
                                        <CTableDataCell className="ps-4 border-bottom-light">
                                            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                                                {idx + 1}
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell className="border-bottom-light">
                                            <CFormInput
                                                className="border-0 bg-transparent fw-medium text-body py-2 competency-input"
                                                value={ev.name}
                                                disabled={isLocked}
                                                onChange={(e) => handleUpdate(idx, 'name', e.target.value)}
                                                placeholder="Descripción de la competencia o indicador..."
                                                style={{ fontSize: '0.95rem' }}
                                            />
                                        </CTableDataCell>
                                        <CTableDataCell className="border-bottom-light text-center">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <div className="d-flex align-items-center bg-body-tertiary rounded-pill px-3 py-2 border shadow-sm transition-all weight-input-container">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="form-control-plaintext form-control-sm text-end fw-black p-0 text-primary"
                                                        style={{ width: '50px', fontSize: '1rem', paddingRight: '8px' }}
                                                        value={ev.weight}
                                                        disabled={isLocked}
                                                        onChange={(e) => handleUpdate(idx, 'weight', e.target.value)}
                                                    />
                                                    <span className="small fw-bold text-body-secondary" style={{ borderLeft: '1px solid var(--cui-border-color)', paddingLeft: '8px' }}>%</span>
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                        {!isLocked && (
                                            <CTableDataCell className="text-end pe-4 border-bottom-light">
                                                <CButton
                                                    color="danger"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="rounded-circle hover-opacity-100 opacity-50 transition-all p-2"
                                                    onClick={() => handleDelete(idx)}
                                                    title="Eliminar"
                                                >
                                                    <CIcon icon={cilTrash} />
                                                </CButton>
                                            </CTableDataCell>
                                        )}
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-3 border-top border-light-custom total-section">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                        <span className="small fw-bold text-uppercase text-body-secondary me-3">Total Ponderación Acumulada</span>
                        {totalWeight !== 100 && (
                            <div className="d-flex align-items-center text-danger small animate__animated animate__pulse animate__infinite">
                                <CIcon icon={cilWarning} className="me-1" size="sm" />
                                <span className="fw-semibold">Debe sumar 100%</span>
                            </div>
                        )}
                    </div>
                    <CBadge
                        color={totalWeight === 100 ? 'success' : 'warning'}
                        className="fs-5 px-4 py-2 rounded-pill shadow-sm fw-black"
                    >
                        {totalWeight}%
                    </CBadge>
                </div>

                {totalWeight === 100 && (
                    <CAlert color="success" className="d-flex align-items-center border-0 small bg-success bg-opacity-10 text-success p-3 mb-0 mt-2 rounded-4">
                        <CIcon icon={cilCheckCircle} className="me-2 flex-shrink-0" size="xl" />
                        <div>
                            <strong className="d-block">Estructura de Evaluación Perfecta</strong>
                            <span style={{ fontSize: '0.8rem' }}>El plan de este lapso cumple con los requisitos del sistema.</span>
                        </div>
                    </CAlert>
                )}
            </div>

            <style>{`
                .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(0,0,0,0.1) !important; }
                .fw-black { font-weight: 900; }
                [data-coreui-theme="dark"] .bg-body { background-color: rgba(255, 255, 255, 0.03) !important; }
                [data-coreui-theme="dark"] .bg-body-tertiary { background-color: rgba(0, 0, 0, 0.3) !important; }
                
                .competency-input:focus {
                    outline: none !important;
                    box-shadow: none !important;
                }
                
                /* Responsive Styles */
                @media (max-width: 768px) {
                    /* Header Section */
                    .header-section {
                        width: 100%;
                    }
                    
                    .add-button {
                        width: 100%;
                        justify-content: center !important;
                    }
                    
                    /* Total Section */
                    .total-section {
                        padding-top: 1.5rem !important;
                    }
                    
                    .total-section > div {
                        flex-direction: column !important;
                        gap: 1rem !important;
                        align-items: stretch !important;
                    }
                    
                    .total-section .badge {
                        width: 100%;
                        text-align: center;
                        padding: 0.75rem !important;
                    }
                }
            `}</style>
        </div>
    )
}

export default CompetencyEvaluationPlan
