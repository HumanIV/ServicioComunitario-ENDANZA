// components/NavegacionDias.js
import React from 'react'
import { CNav, CNavItem, CNavLink, CBadge } from "@coreui/react"

const NavegacionDias = ({ diasSemana, activeDay, setActiveDay, calcularHorasDia }) => {
  return (
    <div className="mb-4">
      <CNav variant="tabs" role="tablist">
        {diasSemana.map(dia => (
          <CNavItem key={dia.id}>
            <CNavLink
              active={activeDay === dia.id}
              onClick={() => setActiveDay(dia.id)}
              className="d-flex align-items-center"
            >
              <CBadge color={dia.color} className="me-2">
                {dia.nombre.substring(0, 3)}
              </CBadge>
              {dia.nombre}
              <small className="ms-2 text-muted">
                {calcularHorasDia(dia.id)}h
              </small>
            </CNavLink>
          </CNavItem>
        ))}
      </CNav>
    </div>
  )
}

export default NavegacionDias