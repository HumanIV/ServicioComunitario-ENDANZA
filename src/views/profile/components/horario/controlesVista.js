import React from 'react'
import { CButton, CButtonGroup } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar, cilCloudDownload, cilPrint, cilCheckCircle } from "@coreui/icons"

const ControlesVista = ({ modoVista, setModoVista, onDescargarPDF, onImprimir }) => {
  return (
    <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-5 no-print">
      <div className="p-1 controls-bg rounded-pill shadow-sm border border-light">
        <CButton
          className={`rounded-pill px-4 py-2 border-0 fw-bold transition-all ${modoVista === 'diario' ? 'btn-premium text-white shadow-sm' : 'bg-transparent controls-text'}`}
          onClick={() => setModoVista('diario')}
        >
          <CIcon icon={cilCalendar} className="me-2" />
          Vista por Día
        </CButton>
        <CButton
          className={`rounded-pill px-4 py-2 border-0 fw-bold transition-all ${modoVista === 'semanal' ? 'btn-premium text-white shadow-sm' : 'bg-transparent controls-text'}`}
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
          className="border-2 rounded-pill px-4 py-2 fw-bold controls-outline-btn hover-orange transition-all d-flex align-items-center"
          onClick={onImprimir}
        >
          <CIcon icon={cilPrint} className="me-2 text-warning" />
          Imprimir
        </CButton>
      </div>

      <style>
        {`
            .hover-orange:hover {
                border-color: #F28C0F !important;
                color: #F28C0F !important;
                background: rgba(242, 140, 15, 0.05) !important;
            }
            .transition-all { transition: all 0.2s ease; }
            .controls-bg { background-color: rgba(0, 0, 0, 0.03); }
            .controls-text { color: var(--neutral-500); }
            .controls-outline-btn { color: var(--neutral-600); border-color: rgba(0, 0, 0, 0.08); background-color: transparent; }

            [data-coreui-theme="dark"] .controls-bg { background-color: rgba(255,255,255,0.05); }
            [data-coreui-theme="dark"] .controls-text { color: rgba(255,255,255,0.4); }
            [data-coreui-theme="dark"] .controls-outline-btn { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.1); }
            [data-coreui-theme="dark"] .hover-orange:hover {
                background: rgba(242, 140, 15, 0.1) !important;
            }
          `}
      </style>
    </div>
  )
}

export default ControlesVista