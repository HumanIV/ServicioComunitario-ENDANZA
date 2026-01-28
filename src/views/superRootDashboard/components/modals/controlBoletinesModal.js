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
    <CModal visible={visible} onClose={onClose} size="xl" backdrop="static" scrollable>
      <div className="bg-primary" style={{ height: '6px', borderTopLeftRadius: 'var(--cui-modal-border-radius)', borderTopRightRadius: 'var(--cui-modal-border-radius)' }}></div>
      <CModalHeader className="bg-white border-bottom py-3 px-4">
        <CModalTitle className="fw-bold d-flex align-items-center text-dark">
          <CIcon icon={cilSettings} className="me-2 text-primary" size="xl" />
          Control Central de Boletines
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="p-4">
        <div className="mb-4 text-center">
          <p className="text-muted small">
            Gestione la visibilidad y descarga de boletines informativos por cada curso del periodo actual.
          </p>
        </div>

        <div className="table-responsive rounded-3 overflow-hidden shadow-sm border">
          <CTable align="middle" hover className="mb-0 border-secondary-subtle">
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell className="ps-4 py-3">Período</CTableHeaderCell>
                <CTableHeaderCell>Curso / Materia</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Descargas</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Disponible</CTableHeaderCell>
                <CTableHeaderCell className="pe-4 text-end">Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {boletines.map((boletin) => (
                <CTableRow key={boletin.id}>
                  <CTableDataCell className="ps-4 fw-bold text-dark">{boletin.periodo}</CTableDataCell>
                  <CTableDataCell>
                    <div className="fw-semibold text-primary">{boletin.curso}</div>
                    <small className="text-muted">Reporte Académico</small>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge color="info" className="px-3 py-2 rounded-pill fw-bold text-white shadow-sm" style={{ fontSize: '0.7rem' }}>
                      {boletin.descargas} Total
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <div className="d-flex justify-content-center">
                      <CFormCheck
                        className="form-check-premium"
                        checked={boletin.disponible}
                        onChange={() => onToggleDisponible(boletin.id)}
                      />
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="pe-4 text-end">
                    <CButton
                      size="sm"
                      className={`rounded-pill px-3 fw-bold ${boletin.disponible ? 'btn-premium' : 'btn-outline-secondary'}`}
                      disabled={!boletin.disponible}
                    >
                      <CIcon icon={cilCloudDownload} className="me-1" /> DESCARGAR
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
              {boletines.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center py-5 text-muted">
                    No hay boletines generados en este periodo.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>

        <div className="mt-4 p-3 bg-light rounded-3 border border-dashed text-dark">
          <h6 className="fw-bold mb-2">
            <CIcon icon={cilCheckCircle} className="me-2 text-success" />
            Lineamientos de Gestión:
          </h6>
          <ul className="mb-0 small ps-4">
            <li className="mb-1">El marcado de <strong>"Disponible"</strong> activa el botón de descarga en los portales de Representantes y Alumnos.</li>
            <li>Las descargas exitosas actualizan el contador global del sistema en tiempo real.</li>
          </ul>
        </div>
      </CModalBody>
      <CModalFooter className="border-0 bg-light bg-opacity-50 p-4">
        <CButton color="secondary" variant="ghost" onClick={onClose} className="fw-bold">
          CERRAR PANEL
        </CButton>
        <CButton onClick={onHabilitarTodos} className="btn-premium px-4 fw-bold ms-auto">
          HABILITAR TODO EL CICLO
        </CButton>
      </CModalFooter>

      <style>{`
        .btn-premium {
          background: linear-gradient(135deg, #F28C0F 0%, #E07B00 100%);
          border: none;
          color: white;
          transition: all 0.3s ease;
        }
        .btn-premium:hover { filter: brightness(1.1); transform: translateY(-1px); color: white; }
        .form-check-premium .form-check-input:checked {
          background-color: #F28C0F;
          border-color: #F28C0F;
        }
      `}</style>
    </CModal>
  )
}

export default ControlBoletinesModal