import React from 'react'
import { CFooter } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilEducation } from '@coreui/icons'

const AppFooter = () => {
  return (
    <CFooter className="px-4 header-premium border-0 py-3 mt-5">
      <div className="d-flex align-items-center">
        <div className="bg-orange-soft p-2 rounded-circle me-2 animate__animated animate__pulse animate__infinite">
          <CIcon icon={cilEducation} style={{ color: 'var(--primary-600)' }} size="sm" />
        </div>
        <span className="fw-bold" style={{ color: 'var(--primary-700)', letterSpacing: '0.5px' }}>
          ENDANZA
        </span>
        <span className="ms-2 text-muted small border-start ps-2">
          &copy; {new Date().getFullYear()} Sistema de Gestión Académica
        </span>
      </div>
      <div className="ms-auto d-flex align-items-center">
        <span className="me-2 text-muted small text-uppercase fw-bold ls-1" style={{ fontSize: '0.65rem' }}>
          Desarrollado con pasión para la cultura
        </span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
