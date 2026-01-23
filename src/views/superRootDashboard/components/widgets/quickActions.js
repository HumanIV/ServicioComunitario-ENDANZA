import React from 'react'
import { CRow, CCol, CCard, CCardHeader, CCardBody, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions, cilClipboard, cilChartLine, cilCalendar, cilLockLocked } from '@coreui/icons'

const QuickActions = ({
  periodoInscripcion,
  onOpenValidacionNotas,
  onOpenControlBoletines,
  onOpenPeriodoInscripcion,
  onOpenGestionAccesos
}) => {
  return (
    <CRow className="mb-4">
      <CCol xs={12}>
        <CCard className="shadow-sm">
          <CCardHeader className="fw-bold">
            <CIcon icon={cilOptions} className="me-2" />
            Acciones Rápidas
          </CCardHeader>
          <CCardBody>
            <CRow className="g-3">
              <CCol xs={12} md={3}>
                <CButton 
                  color="warning" 
                  className="w-100"
                  onClick={onOpenValidacionNotas}
                >
                  <CIcon icon={cilClipboard} className="me-2" />
                  Validar Notas
                </CButton>
              </CCol>
              <CCol xs={12} md={3}>
                <CButton 
                  color="info" 
                  className="w-100"
                  onClick={onOpenControlBoletines}
                >
                  <CIcon icon={cilChartLine} className="me-2" />
                  Controlar Boletines
                </CButton>
              </CCol>
              <CCol xs={12} md={3}>
                <CButton 
                  color={periodoInscripcion.activo ? "success" : "secondary"} 
                  className="w-100"
                  onClick={onOpenPeriodoInscripcion}
                >
                  <CIcon icon={cilCalendar} className="me-2" />
                  Inscripciones
                </CButton>
              </CCol>
              <CCol xs={12} md={3}>
                <CButton 
                  color="primary" 
                  className="w-100"
                  onClick={onOpenGestionAccesos}
                >
                  <CIcon icon={cilLockLocked} className="me-2" />
                  Gestionar Accesos
                </CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default QuickActions