import React, { useState } from 'react'
import {
    CRow,
    CCol,
    CButton,
    CFormInput,
    CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilTrash, cilPencil, cilList, cilCheckCircle, cilX } from '@coreui/icons'

const CompetencyList = ({ competencies = [], isLocked = false, onChange }) => {
    const [editingIndex, setEditingIndex] = useState(-1)
    const [tempValue, setTempValue] = useState('')

    const handleAdd = () => {
        if (isLocked) return
        const newComp = [...competencies, "Nueva Competencia..."]
        onChange(newComp)
        setEditingIndex(newComp.length - 1)
        setTempValue("Nueva Competencia...")
    }

    const handleDelete = (index) => {
        if (isLocked) return
        const newComp = [...competencies]
        newComp.splice(index, 1)
        onChange(newComp)
    }

    const handleEdit = (index) => {
        if (isLocked) return
        setEditingIndex(index)
        setTempValue(competencies[index])
    }

    const handleSaveEdit = (index) => {
        const newComp = [...competencies]
        newComp[index] = tempValue
        onChange(newComp)
        setEditingIndex(-1)
    }

    const handleCancelEdit = () => {
        setEditingIndex(-1)
    }

    return (
        <div className="h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="fw-bold mb-0 text-primary ls-tight">Competencias e Indicadores</h5>
                    <small className="text-muted">Lista de objetivos a evaluar en este lapso.</small>
                </div>
                {!isLocked && (
                    <CButton color="primary" variant="ghost" onClick={handleAdd} className="rounded-pill btn-sm d-flex align-items-center">
                        <CIcon icon={cilPlus} size="sm" className="me-2" />
                        <span className="fw-bold small">AGREGAR</span>
                    </CButton>
                )}
            </div>

            <div className="flex-grow-1 overflow-auto pe-2" style={{ maxHeight: '60vh' }}>
                {competencies.length === 0 ? (
                    <div className="text-center p-5 bg-body-tertiary rounded-4 border border-dashed">
                        <div className="mb-3 opacity-25">
                            <CIcon icon={cilList} size="4xl" />
                        </div>
                        <h6 className="text-body-secondary fw-bold">Sin Competencias Definidas</h6>
                        <p className="small text-body-secondary mb-0">Comienza agregando los indicadores de logro para este período.</p>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {competencies.map((comp, idx) => (
                            <div key={idx} className="p-3 bg-body-tertiary border rounded-4 shadow-sm position-relative group-hover-actions" style={{ borderLeft: '4px solid var(--cui-primary)' }}>
                                {editingIndex === idx ? (
                                    <div className="d-flex align-items-center w-100">
                                        <CFormInput
                                            autoFocus
                                            value={tempValue}
                                            onChange={(e) => setTempValue(e.target.value)}
                                            className="me-2 form-control-lg border-0 bg-body-tertiary fw-medium"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveEdit(idx)
                                                if (e.key === 'Escape') handleCancelEdit()
                                            }}
                                        />
                                        <CButton color="success" size="sm" variant="ghost" onClick={() => handleSaveEdit(idx)}>
                                            <CIcon icon={cilCheckCircle} />
                                        </CButton>
                                        <CButton color="danger" size="sm" variant="ghost" onClick={handleCancelEdit}>
                                            <CIcon icon={cilX} />
                                        </CButton>
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-start w-100">
                                        <span className="fw-bold text-primary me-3 mt-1 h5 mb-0" style={{ minWidth: '24px' }}>{idx + 1}.</span>
                                        <p className="mb-0 flex-grow-1 fw-medium text-body lh-base" style={{ fontSize: '0.95rem' }}>{comp}</p>

                                        {!isLocked && (
                                            <div className="d-flex ms-2 opacity-0 group-hover-visible transition-all">
                                                <CButton color="info" size="sm" variant="ghost" className="p-1 me-1 text-info" onClick={() => handleEdit(idx)}>
                                                    <CIcon icon={cilPencil} size="sm" />
                                                </CButton>
                                                <CButton color="danger" size="sm" variant="ghost" className="p-1 text-danger" onClick={() => handleDelete(idx)}>
                                                    <CIcon icon={cilTrash} size="sm" />
                                                </CButton>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
         .group-hover-visible { transform: translateX(10px); transition: all 0.2s ease; }
         
         [data-coreui-theme="dark"] .bg-body-tertiary { background-color: rgba(255, 255, 255, 0.05) !important; }
      `}</style>
        </div>
    )
}


export default CompetencyList
