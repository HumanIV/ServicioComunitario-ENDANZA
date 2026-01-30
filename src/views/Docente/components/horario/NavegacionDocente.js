import React from 'react'
import { CNavItem, CNavLink, CBadge } from "@coreui/react"

const NavegacionDocente = ({ diasSemana, activeDay, setActiveDay, teacherSchedules }) => {
    return (
        <div className="mb-4 d-flex justify-content-center">
            <div className="p-2 bg-light-custom bg-opacity-25 rounded-pill shadow-sm border border-light-custom d-inline-flex flex-wrap justify-content-center gap-2">
                {diasSemana.map(dia => (
                    <CNavItem key={dia} className="list-unstyled">
                        <CNavLink
                            active={activeDay === dia}
                            onClick={() => setActiveDay(dia)}
                            className={`rounded-pill px-4 py-2 border-0 fw-bold d-flex align-items-center gap-2 transition-all cursor-pointer ${activeDay === dia
                                ? 'btn-premium text-white shadow'
                                : 'text-muted-custom bg-transparent hover-light'
                                }`}
                        >
                            <CBadge className={`rounded-pill px-2 py-1 ${activeDay === dia ? 'bg-white text-primary' : 'bg-orange-soft text-primary'}`}>
                                {dia.substring(0, 3)}
                            </CBadge>
                            <span className="d-none d-md-inline">{dia}</span>
                            <small className={`opacity-75 ${activeDay === dia ? 'text-white' : 'text-muted-custom'}`}>
                                {teacherSchedules[dia]?.length || 0}
                            </small>
                        </CNavLink>
                    </CNavItem>
                ))}
            </div>
            <style>
                {`
            .cursor-pointer { cursor: pointer; }
            .hover-light:hover { background: rgba(242, 140, 15, 0.1) !important; color: #F28C0F !important; }
            .transition-all { transition: all 0.2s ease; }
            .btn-premium {
                background: linear-gradient(135deg, #F28C0F 0%, #E07B00 100%);
                border: none;
            }
          `}
            </style>
        </div>
    )
}

export default NavegacionDocente
