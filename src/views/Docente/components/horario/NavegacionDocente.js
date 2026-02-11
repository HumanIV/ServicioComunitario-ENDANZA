import React from 'react'
import { CNavItem, CNavLink, CBadge } from "@coreui/react"

const NavegacionDocente = ({ diasSemana, activeDay, setActiveDay, teacherSchedules }) => {
    return (
        <div className="mb-4">
            <div className="nav-pills-responsive p-2 bg-neutral-100 rounded-pill shadow-sm border border-light d-flex gap-2">
                {diasSemana.map(dia => {
                    const totalClases = teacherSchedules[dia]?.length || 0;
                    const horasDia = totalClases * 1.5;

                    return (
                        <div key={dia} className="flex-grow-1 flex-md-grow-0">
                            <button
                                onClick={() => setActiveDay(dia)}
                                className={`w-100 rounded-pill px-3 px-md-4 py-2 border-0 fw-bold d-flex align-items-center justify-content-center gap-2 transition-all cursor-pointer ${activeDay === dia
                                    ? 'btn-premium text-white shadow'
                                    : 'text-muted-custom bg-transparent hover-light'
                                    }`}
                            >
                                <span className="d-md-inline">{dia.substring(0, 3)}</span>
                                <CBadge className={`rounded-pill px-2 py-1 small ${activeDay === dia ? 'bg-white text-primary' : 'bg-orange-soft text-primary'}`} style={{ fontSize: '0.65rem' }}>
                                    {horasDia.toFixed(1)}h
                                </CBadge>
                            </button>
                        </div>
                    );
                })}
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
            .nav-pills-responsive {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
            }
            .nav-pills-responsive::-webkit-scrollbar {
                display: none;
            }
          `}
            </style>
        </div>
    )
}

export default NavegacionDocente
