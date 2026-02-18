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
import { cilCheckCircle, cilWarning, cilCheck, cilX, cilHistory } from '@coreui/icons'

const ValidacionNotasModal = ({
  visible,
  onClose,
  notasPendientes,
  onAprobar,
  onRechazar
}) => {
  return (
    <CModal visible={visible} onClose={onClose} size="xl" scrollable backdrop="static" className="premium-modal">
      <div className="bg-primary" style={{ height: '6px', borderTopLeftRadius: 'var(--cui-modal-border-radius)', borderTopRightRadius: 'var(--cui-modal-border-radius)' }}></div>
      <CModalHeader className="bg-light-custom border-bottom border-light-custom border-opacity-10 py-3 px-4">
        <CModalTitle className="fw-bold d-flex align-items-center header-title-custom">
          <CIcon icon={cilCheckCircle} className="me-2 text-primary" size="xl" />
          Validación y Aprobación de Calificaciones
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="p-4 bg-light-custom">
        <div className="mb-4 text-center">
          <p className="text-muted-custom small">Supervise y valide las notas cargadas por el personal docente antes de su publicación oficial.</p>
        </div>

        <div className="table-responsive rounded-3 overflow-hidden shadow-sm border border-light-custom">
          <CTable align="middle" hover className="mb-0 custom-premium-table">
            <CTableHead className="bg-light-custom bg-opacity-25 border-bottom border-light-custom border-opacity-10">
              <CTableRow>
                <CTableHeaderCell className="ps-4 py-3 text-muted-custom">Profesor / Docente</CTableHeaderCell>
                <CTableHeaderCell className="text-muted-custom">Asignatura / Curso</CTableHeaderCell>
                <CTableHeaderCell className="text-center text-muted-custom">Quórum</CTableHeaderCell>
                <CTableHeaderCell className="text-center text-muted-custom">Cargado el</CTableHeaderCell>
                <CTableHeaderCell className="text-center text-muted-custom">Estado</CTableHeaderCell>
                <CTableHeaderCell className="pe-4 text-end text-muted-custom">Resolución</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {notasPendientes.map((nota) => (
                <CTableRow key={nota.id} className="border-bottom-light hover-row">
                  <CTableDataCell className="ps-4 border-0">
                    <div className="fw-bold header-title-custom">{nota.profesor}</div>
                    <small className="text-muted-custom">Personal Docente</small>
                  </CTableDataCell>
                  <CTableDataCell className="border-0">
                    <div className="fw-semibold text-primary">{nota.curso}</div>
                    <small className="text-muted-custom small text-uppercase" style={{ fontSize: '0.6rem' }}>{nota.seccion}</small>
                  </CTableDataCell>
                  <CTableDataCell className="text-center fw-bold header-title-custom border-0">{nota.estudiantes} Est.</CTableDataCell>
                  <CTableDataCell className="text-center border-0">
                    <div className="small text-muted-custom">
                      <CIcon icon={cilHistory} className="me-1" size="sm" />
                      {nota.fecha}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="text-center border-0">
                    <CBadge color={
                      nota.estado === 'aprobado' ? 'success' :
                        nota.estado === 'rechazado' ? 'danger' : 'warning'
                    } className="px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '0.7rem', color: nota.estado === 'pendiente' ? '#000' : '#fff' }}>
                      {nota.estado.toUpperCase()}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="pe-4 text-end border-0">
                    {nota.estado === 'pendiente' ? (
                      <div className="d-flex justify-content-end gap-2">
                        <CButton
                          size="sm"
                          color="success"
                          className="rounded-pill px-3 fw-bold text-white d-flex align-items-center hover-lift"
                          onClick={() => onAprobar(nota.id)}
                        >
                          <CIcon icon={cilCheck} className="me-1" /> Aprobar
                        </CButton>
                        <CButton
                          size="sm"
                          color="danger"
                          className="rounded-pill px-3 fw-bold text-white d-flex align-items-center hover-lift"
                          onClick={() => onRechazar(nota.id)}
                        >
                          <CIcon icon={cilX} className="me-1" /> Rechazar
                        </CButton>
                      </div>
                    ) : (
                      <CButton
                        size="sm"
                        color="secondary"
                        variant="outline"
                        disabled
                        className="rounded-pill px-4 fw-bold"
                      >
                        {nota.estado === 'aprobado' ? 'VALIDADO' : 'RECHAZADO'}
                      </CButton>
                    )}
                  </CTableDataCell>
                </CTableRow>
              ))}
              {notasPendientes.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan="6" className="text-center py-5 text-muted-custom small border-0">
                    No hay registros de calificaciones pendientes por validar.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>
      </CModalBody>
      <CModalFooter className="border-0 bg-light-custom bg-opacity-50 p-4">
        <CButton color="secondary" variant="ghost" onClick={onClose} className="fw-bold text-muted-custom hover-lift">
          CERRAR REVISIÓN
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ValidacionNotasModal