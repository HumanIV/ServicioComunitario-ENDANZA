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
        <CCard className="premium-card border-0 overflow-hidden">
          <CCardHeader className="bg-orange-soft border-0 py-3 fw-bold d-flex align-items-center">
            <CIcon icon={cilOptions} className="me-2 text-primary" style={{ color: 'var(--primary-500)' }} />
            <span className="text-uppercase small ls-1">Centro de Acciones Administrativas</span>
          </CCardHeader>
          <CCardBody className="p-4">
            <CRow className="g-4">
              <CCol xs={12} md={3}>
                <CButton
                  className="btn-premium w-100 py-3 d-flex flex-column align-items-center gap-2"
                  onClick={onOpenValidacionNotas}
                >
                  <CIcon icon={cilClipboard} size="xl" />
                  <span>Validar Notas</span>
                </CButton>
              </CCol>
              <CCol xs={12} md={3}>
                <CButton
                  color="light"
                  variant="outline"
                  className="w-100 py-3 d-flex flex-column align-items-center gap-2 border-2 fw-bold text-dark"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                  onClick={onOpenControlBoletines}
                >
                  <CIcon icon={cilChartLine} size="xl" className="text-primary" />
                  <span>Boletines</span>
                </CButton>
              </CCol>
              <CCol xs={12} md={3}>
                <CButton
                  color="light"
                  variant="outline"
                  className={`w-100 py-3 d-flex flex-column align-items-center gap-2 border-2 fw-bold ${periodoInscripcion.activo ? 'text-success' : 'text-muted'}`}
                  style={{ borderRadius: 'var(--radius-lg)' }}
                  onClick={onOpenPeriodoInscripcion}
                >
                  <CIcon icon={cilCalendar} size="xl" />
                  <span>Inscripciones</span>
                </CButton>
              </CCol>
              <CCol xs={12} md={3}>
                <CButton
                  color="light"
                  variant="outline"
                  className="w-100 py-3 d-flex flex-column align-items-center gap-2 border-2 fw-bold text-dark"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                  onClick={onOpenGestionAccesos}
                >
                  <CIcon icon={cilLockLocked} size="xl" className="text-primary" />
                  <span>Accesos</span>
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