import React from 'react'
import { CNav, CNavItem, CNavLink, CBadge } from "@coreui/react"

const NavegacionDias = ({ diasSemana, activeDay, setActiveDay, calcularHorasDia }) => {
  return (
    <div className="mb-4 d-flex justify-content-center">
      <div className="p-2 bg-white rounded-pill shadow-sm border border-light d-inline-flex flex-wrap justify-content-center gap-2">
        {diasSemana.map(dia => (
          <CNavItem key={dia.id} className="list-unstyled">
            <CNavLink
              active={activeDay === dia.id}
              onClick={() => setActiveDay(dia.id)}
              className={`rounded-pill px-4 py-2 border-0 fw-bold d-flex align-items-center gap-2 transition-all cursor-pointer ${activeDay === dia.id
                ? 'btn-premium text-white shadow'
                : 'text-muted bg-transparent hover-light'
                }`}
            >
              <CBadge className={`rounded-pill px-2 py-1 ${activeDay === dia.id ? 'bg-white text-primary' : 'bg-orange-soft text-primary'}`}>
                {dia.nombre.substring(0, 3)}
              </CBadge>
              <span className="d-none d-md-inline">{dia.nombre}</span>
              <small className={`opacity-75 ${activeDay === dia.id ? 'text-white' : 'text-muted'}`}>
                {calcularHorasDia(dia.id)}h
              </small>
            </CNavLink>
          </CNavItem>
        ))}
      </div>
      <style>
        {`
            .cursor-pointer { cursor: pointer; }
            .hover-light:hover { background: var(--primary-50) !important; color: var(--primary-600) !important; }
            .transition-all { transition: all 0.2s ease; }
          `}
      </style>
    </div>
  )
}

export default NavegacionDias