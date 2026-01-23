// components/ControlesVista.js
import React from 'react'
import { CButton } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar, cilArrowBottom, cilPrint } from "@coreui/icons"

const ControlesVista = ({ modoVista, setModoVista, onDescargarPDF, onImprimir }) => {
  return (
    <div className="d-flex flex-wrap gap-3 justify-content-between mb-4">
      <div className="d-flex gap-2">
        <CButton 
          color={modoVista === 'diario' ? 'primary' : 'secondary'} 
          variant={modoVista === 'diario' ? '' : 'outline'}
          onClick={() => setModoVista('diario')}
        >
          <CIcon icon={cilCalendar} /> Vista por Día
        </CButton>
        <CButton 
          color={modoVista === 'semanal' ? 'primary' : 'secondary'} 
          variant={modoVista === 'semanal' ? '' : 'outline'}
          onClick={() => setModoVista('semanal')}
        >
          <CIcon icon={cilCalendar} /> Vista Semanal
        </CButton>
      </div>
      
      <div className="d-flex gap-2">
        <CButton 
          color="success" 
          onClick={onDescargarPDF}
          className="d-flex align-items-center"
        >
          <CIcon icon={cilArrowBottom} className="me-2" />
          Descargar Horario (PDF)
        </CButton>
        <CButton 
          color="info" 
          variant="outline"
          onClick={onImprimir}
        >
          <CIcon icon={cilPrint} /> Imprimir
        </CButton>
      </div>
    </div>
  )
}

export default ControlesVista