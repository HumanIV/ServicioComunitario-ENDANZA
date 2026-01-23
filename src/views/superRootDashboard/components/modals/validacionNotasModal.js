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
  CBadge,
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilWarning } from '@coreui/icons'

const ValidacionNotasModal = ({
  visible,
  onClose,
  notasPendientes,
  onAprobar,
  onRechazar
}) => {
  return (
    <CModal visible={visible} onClose={onClose} size="xl" scrollable>
      <CModalHeader>
        <CModalTitle>Validación y Aprobación de Notas</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Profesor</CTableHeaderCell>
              <CTableHeaderCell>Curso</CTableHeaderCell>
              <CTableHeaderCell>Estudiantes</CTableHeaderCell>
              <CTableHeaderCell>Fecha Carga</CTableHeaderCell>
              <CTableHeaderCell>Estado</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {notasPendientes.map((nota) => (
              <CTableRow key={nota.id}>
                <CTableDataCell>{nota.profesor}</CTableDataCell>
                <CTableDataCell>{nota.curso}</CTableDataCell>
                <CTableDataCell>{nota.estudiantes}</CTableDataCell>
                <CTableDataCell>{nota.fecha}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={
                    nota.estado === 'aprobado' ? 'success' : 
                    nota.estado === 'rechazado' ? 'danger' : 'warning'
                  }>
                    {nota.estado.toUpperCase()}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  {nota.estado === 'pendiente' ? (
                    <>
                      <CButton 
                        size="sm" 
                        color="success" 
                        className="me-2"
                        onClick={() => onAprobar(nota.id)}
                      >
                        <CIcon icon={cilCheckCircle} /> Aprobar
                      </CButton>
                      <CButton 
                        size="sm" 
                        color="danger"
                        onClick={() => onRechazar(nota.id)}
                      >
                        <CIcon icon={cilWarning} /> Rechazar
                      </CButton>
                    </>
                  ) : (
                    <CButton 
                      size="sm" 
                      color="secondary" 
                      disabled
                    >
                      {nota.estado === 'aprobado' ? 'Aprobado' : 'Rechazado'}
                    </CButton>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ValidacionNotasModal