import React from 'react'
import { CCard, CCardBody } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar } from "@coreui/icons"
import CardClaseDocente from './CardClaseDocente'

const ListaClasesDocente = ({ dia, clases }) => {
    return (
        <div className="animate__animated animate__fadeIn">
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
                        <CCardBody className="bg-light-custom bg-opacity-10">
                            <div className="p-4 bg-light-custom bg-opacity-25 rounded-circle d-inline-flex mb-3">
                                <CIcon icon={cilCalendar} size="3xl" className="text-muted-custom opacity-50" />
                            </div>
                            <h5 className="fw-bold header-title-custom mb-1">Día Libre</h5>
                            <p className="text-muted-custom mb-0 fw-medium">No tiene actividades programadas para este día.</p>
                        </CCardBody>
                    </CCard>
                )}
            </div>
        </div>
    )
}

export default ListaClasesDocente
