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
  CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilSettings, cilCheckCircle, cilCloudDownload } from '@coreui/icons'

const ControlBoletinesModal = ({
  visible,
  onClose,
  boletines,
  onToggleDisponible,
  onHabilitarTodos
}) => {
  return (
    <CModal visible={visible} onClose={onClose} size="xl" backdrop="static" scrollable className="premium-modal">
      <div className="bg-primary" style={{ height: '6px', borderTopLeftRadius: 'var(--cui-modal-border-radius)', borderTopRightRadius: 'var(--cui-modal-border-radius)' }}></div>
      <CModalHeader className="bg-light-custom border-bottom border-light-custom border-opacity-10 py-3 px-4">
        <CModalTitle className="fw-bold d-flex align-items-center header-title-custom">
          <CIcon icon={cilSettings} className="me-2 text-primary" size="xl" />
          Control Central de Boletines
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="p-4 bg-light-custom">
        <div className="mb-4 text-center">
          <p className="text-muted-custom small">
            Gestione la visibilidad y descarga de boletines informativos por cada curso del periodo actual.
          </p>
        </div>

        <div className="table-responsive rounded-3 overflow-hidden shadow-sm border border-light-custom">
          <CTable align="middle" hover className="mb-0 custom-premium-table">
            <CTableHead className="bg-light-custom bg-opacity-25 border-bottom border-light-custom border-opacity-10">
              <CTableRow>
                <CTableHeaderCell className="ps-4 py-3 text-muted-custom">Período</CTableHeaderCell>
                <CTableHeaderCell className="text-muted-custom">Curso / Materia</CTableHeaderCell>
                <CTableHeaderCell className="text-center text-muted-custom">Descargas</CTableHeaderCell>
                <CTableHeaderCell className="text-center text-muted-custom">Disponible</CTableHeaderCell>
                <CTableHeaderCell className="pe-4 text-end text-muted-custom">Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {boletines.map((boletin) => (
                <CTableRow key={boletin.id} className="border-bottom-light hover-row">
                  <CTableDataCell className="ps-4 fw-bold header-title-custom border-0">{boletin.periodo}</CTableDataCell>
                  <CTableDataCell className="border-0">
                    <div className="fw-semibold text-primary">{boletin.curso}</div>
                    <small className="text-muted-custom">Reporte Académico</small>
                  </CTableDataCell>
                  <CTableDataCell className="text-center border-0">
                    <CBadge color="info" className="px-3 py-2 rounded-pill fw-bold text-white shadow-sm" style={{ fontSize: '0.7rem' }}>
                      {boletin.descargas} Total
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="text-center border-0">
                    <div className="d-flex justify-content-center">
                      <CFormCheck
                        className="form-check-premium"
                        checked={boletin.disponible}
                        onChange={() => onToggleDisponible(boletin.id)}
                      />
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="pe-4 text-end border-0">
                    <CButton
                      size="sm"
                      className={`rounded-pill px-3 fw-bold shadow-sm ${boletin.disponible ? 'btn-premium' : 'btn-outline-secondary'}`}
                      disabled={!boletin.disponible}
                    >
                      <CIcon icon={cilCloudDownload} className="me-1" /> DESCARGAR
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
              {boletines.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center py-5 text-muted-custom border-0">
                    No hay boletines generados en este periodo.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>

        <div className="mt-4 p-3 bg-light-custom bg-opacity-10 rounded-3 border border-dashed border-light-custom border-opacity-25 text-muted-custom">
          <h6 className="fw-bold mb-2 header-title-custom">
            <CIcon icon={cilCheckCircle} className="me-2 text-success" />
            Lineamientos de Gestión:
          </h6>
          <ul className="mb-0 small ps-4">
            <li className="mb-1">El marcado de <strong className="header-title-custom">"Disponible"</strong> activa el botón de descarga en los portales de Representantes y Alumnos.</li>
            <li>Las descargas exitosas actualizan el contador global del sistema en tiempo real.</li>
          </ul>
        </div>
      </CModalBody>
      <CModalFooter className="border-0 bg-light-custom bg-opacity-50 p-4">
        <CButton color="secondary" variant="ghost" onClick={onClose} className="fw-bold text-muted-custom hover-lift">
          CERRAR PANEL
        </CButton>
        <CButton onClick={onHabilitarTodos} className="btn-premium px-4 fw-bold ms-auto shadow-sm">
          HABILITAR TODO EL CICLO
        </CButton>
      </CModalFooter>

      <style>{`
        .form-check-premium .form-check-input:checked {
          background-color: #F28C0F;
          border-color: #F28C0F;
        }
      `}</style>
    </CModal>
  )
}

export default ControlBoletinesModal