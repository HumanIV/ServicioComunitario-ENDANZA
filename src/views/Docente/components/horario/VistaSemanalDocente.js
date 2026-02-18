import React from 'react'
import {
    CCard,
    CCardHeader,
    CCardBody,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar, cilUser, cilLocationPin, cilClock, cilPeople } from "@coreui/icons"

const VistaSemanalDocente = ({ diasSemana, horario }) => {
    return (
        <CCard className="premium-card border-0 overflow-hidden shadow-lg animate__animated animate__fadeIn">
            <CCardHeader className="schedule-header border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold header-title-custom text-uppercase ls-1">
                    <CIcon icon={cilCalendar} className="me-2 text-primary" />
                    Calendario Semanal Docente
                </h5>
                <div className="badge bg-light-custom text-primary rounded-pill px-3 py-2 border border-primary border-opacity-10 shadow-sm">
                    Planificación de Cátedra
                </div>
            </CCardHeader>
            <CCardBody className="p-0 schedule-body-main">
                <div className="table-responsive schedule-responsive-container">
                    <table className="table table-bordered mb-0 schedule-table-fixed">
                        <thead className="schedule-thead">
                            <tr>
                                <th className="py-3 px-4 text-center border-0 small fw-bold text-muted-custom text-uppercase" style={{ width: '10%' }}>
                                    <CIcon icon={cilClock} className="me-1" /> Hora
                                </th>
                                {diasSemana.map(dia => (
                                    <th key={dia} className="py-3 px-3 text-center border-0 small fw-bold text-muted-custom text-uppercase">
                                        {dia}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                // Calcular qué horas tienen al menos una clase
                                const horasConClases = new Set()
                                diasSemana.forEach(dia => {
                                    (horario[dia] || []).forEach(clase => {
                                        const h = parseInt(clase.startTime?.substring(0, 2))
                                        if (!isNaN(h)) horasConClases.add(h)
                                    })
                                })

                                // Ordenar y usar solo esas horas
                                const horasAMostrar = Array.from(horasConClases).sort((a, b) => a - b)

                                if (horasAMostrar.length === 0) {
                                    return (
                                        <tr>
                                            <td colSpan={diasSemana.length + 1} className="text-center py-5 text-muted-custom">
                                                No hay clases programadas para este docente.
                                            </td>
                                        </tr>
                                    )
                                }

                                return horasAMostrar.map(hora => {
                                    const horaStr = hora.toString().padStart(2, '0') + ':00'

                                    return (
                                        <tr key={hora} className="schedule-row">
                                            <td className="py-4 text-center fw-bold text-primary font-monospace schedule-time-col">
                                                {horaStr}
                                            </td>
                                            {diasSemana.map(dia => {
                                                const claseEnEstaHora = horario[dia]?.find(clase => {
                                                    const horaInicio = clase.startTime
                                                    return horaInicio?.startsWith(horaStr.substring(0, 2))
                                                })

                                                return (
                                                    <td key={dia} className="p-1 schedule-cell">
                                                        {claseEnEstaHora ? (
                                                            <div className="p-3 rounded-4 schedule-class-card border border-primary border-opacity-20 h-100 transition-all hover-lift-sm">
                                                                <div className="fw-bold header-title-custom lh-sm mb-2" style={{ fontSize: '0.9rem' }}>{claseEnEstaHora.subject}</div>
                                                                <div className="d-flex flex-column gap-1">
                                                                    <div className="small text-muted-custom d-flex align-items-center">
                                                                        <CIcon icon={cilPeople} size="sm" className="me-1 text-primary" />
                                                                        {claseEnEstaHora.sectionName}
                                                                    </div>
                                                                    <div className="small text-muted-custom d-flex align-items-center">
                                                                        <CIcon icon={cilLocationPin} size="sm" className="me-1 text-primary" />
                                                                        {claseEnEstaHora.classroom}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="h-100 d-flex align-items-center justify-content-center py-4">
                                                                <div className="schedule-empty-dot"></div>
                                                            </div>
                                                        )}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })
                            })()}
                        </tbody>
                    </table>
                </div>
            </CCardBody>

        </CCard>
    )
}

export default VistaSemanalDocente
