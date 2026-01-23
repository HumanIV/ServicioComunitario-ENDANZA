import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CButton,
  CFormSelect,
  CFormInput
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom,cilUser } from '@coreui/icons'

const ControlBoletinesModal = ({
  visible,
  onClose,
  boletines,
  onToggleDisponible,
  onHabilitarTodos
}) => {
  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Control de Boletines</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Período</CTableHeaderCell>
              <CTableHeaderCell>Curso</CTableHeaderCell>
              <CTableHeaderCell>Descargas</CTableHeaderCell>
              <CTableHeaderCell>Disponible</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {boletines.map((boletin) => (
              <CTableRow key={boletin.id}>
                <CTableDataCell>{boletin.periodo}</CTableDataCell>
                <CTableDataCell>{boletin.curso}</CTableDataCell>
                <CTableDataCell>{boletin.descargas}</CTableDataCell>
                <CTableDataCell>
                  <CFormCheck
                    checked={boletin.disponible}
                    onChange={() => onToggleDisponible(boletin.id)}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <CButton 
                    size="sm" 
                    color="primary"
                    disabled={!boletin.disponible}
                  >
                    <CIcon icon={cilArrowBottom} /> Descargar
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <div className="mt-3">
          <h6>Notas:</h6>
          <ul className="text-muted small">
            <li>Cuando el boletín está marcado como "Disponible", los estudiantes pueden descargarlo</li>
            <li>Puedes habilitar/deshabilitar la descarga por curso</li>
            <li>Las descargas se registran automáticamente</li>
          </ul>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cerrar
        </CButton>
        <CButton color="primary" onClick={onHabilitarTodos}>
          Habilitar Todos
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ControlBoletinesModal