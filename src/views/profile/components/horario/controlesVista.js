import React from 'react'
import { CButton, CButtonGroup } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar, cilCloudDownload, cilPrint, cilCheckCircle } from "@coreui/icons"

const ControlesVista = ({ modoVista, setModoVista, onDescargarPDF, onImprimir }) => {
  return (
    <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-5 no-print">
      <div className="p-1 bg-light rounded-pill shadow-sm border border-light">
        <CButton
          className={`rounded-pill px-4 py-2 border-0 fw-bold ${modoVista === 'diario' ? 'btn-premium text-white' : 'bg-transparent text-muted'}`}
          onClick={() => setModoVista('diario')}
        >
          <CIcon icon={cilCalendar} className="me-2" />
          Vista por Día
        </CButton>
        <CButton
          className={`rounded-pill px-4 py-2 border-0 fw-bold ${modoVista === 'semanal' ? 'btn-premium text-white' : 'bg-transparent text-muted'}`}
          onClick={() => setModoVista('semanal')}
        >
          <CIcon icon={cilCalendar} className="me-2" />
          Vista Semanal
        </CButton>
      </div>

      <div className="d-flex gap-3">
        <CButton
          className="btn-premium rounded-pill px-4 py-2 border-0 d-flex align-items-center shadow-sm"
          onClick={onDescargarPDF}
        >
          <CIcon icon={cilCloudDownload} className="me-2" />
          Descargar Horario (PDF)
        </CButton>
        <CButton
          color="light"
          variant="outline"
          className="border-2 rounded-pill px-4 py-2 fw-bold text-muted hover-orange"
          onClick={onImprimir}
        >
          <CIcon icon={cilPrint} className="me-2 text-primary" />
          Imprimir
        </CButton>
      </div>

      <style>
        {`
            .hover-orange:hover {
                border-color: var(--primary-400) !important;
                color: var(--primary-600) !important;
                background: var(--primary-50) !important;
            }
          `}
      </style>
    </div>
  )
}

export default ControlesVista