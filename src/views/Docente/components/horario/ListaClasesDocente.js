import React from 'react'
import { CCard, CCardBody, CBadge } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar, cilClock } from "@coreui/icons"
import CardClaseDocente from './CardClaseDocente'

const ListaClasesDocente = ({ dia, clases, teacherName }) => {
    const totalHoras = clases.length * 1.5;

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="d-flex flex-column mb-4 px-2">
                <h4 className="mb-0 fw-bold header-title-custom d-flex align-items-center">
                    <CIcon icon={cilCalendar} className="me-2 text-primary" />
                    {dia}
                </h4>
                <div className="text-muted-custom small fw-medium mb-3">Docente Académico • Endanza</div>

                <div className="bg-orange-soft text-primary rounded-pill px-4 py-2 border border-primary border-opacity-10 shadow-sm d-flex align-items-center justify-content-center w-100" style={{ maxWidth: '400px' }}>
                    <CIcon icon={cilClock} className="me-2" />
                    <span className="small fw-bold text-uppercase">{totalHoras} Horas Programadas</span>
                </div>
            </div>

            <div className="pb-5">
                {clases.length > 0 ? (
                    <div className="timeline-container px-2">
                        {clases.map((clase, index) => (
                            <CardClaseDocente
                                key={index}
                                clase={clase}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <CCard className="border-0 shadow-sm text-center py-5 premium-card" style={{ borderRadius: '16px' }}>
                        <CCardBody>
                            <div className="p-4 bg-light-custom bg-opacity-25 rounded-circle d-inline-flex mb-3">
                                <CIcon icon={cilCalendar} size="3xl" className="text-muted-custom opacity-50" />
                            </div>
                            <h5 className="fw-bold header-title-custom mb-1">Día sin Actividades</h5>
                            <p className="text-muted-custom mb-0 fw-medium">No tiene bloques horarios asignados para este día.</p>
                        </CCardBody>
                    </CCard>
                )}
            </div>
        </div>
    )
}

export default ListaClasesDocente
