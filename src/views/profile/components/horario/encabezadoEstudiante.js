// components/EncabezadoEstudiante.js
import React from 'react'
import { CCard, CCardHeader, CCardBody, CRow, CCol, CBadge } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar, cilUser, cilEducation, cilInfo } from "@coreui/icons"

const EncabezadoEstudiante = ({ estudiante, estadisticas, onDescargarPDF, onImprimir }) => {
  return (
    <CCard className="shadow-sm mb-4 border-primary">
      <CCardHeader className="bg-primary text-white">
        <CRow className="align-items-center">
          <CCol md={8}>
            <h4 className="mb-1">
              <CIcon icon={cilCalendar} className="me-2" />
              MI HORARIO ACADÉMICO
            </h4>
            <p className="mb-0">
              Escuela de Danza Endanza • {estudiante.anoAcademico}
            </p>
          </CCol>
          <CCol md={4} className="text-end">
            <CBadge color="light" className="text-dark fs-6">
              <CIcon icon={cilUser} className="me-1" />
              {estudiante.codigo}
            </CBadge>
          </CCol>
        </CRow>
      </CCardHeader>
      
      <CCardBody>
        <CRow className="mb-4">
          <CCol md={8}>
            <div className="d-flex flex-column">
              <h5 className="mb-3">
                <CIcon icon={cilEducation} className="me-2" />
                {estudiante.nombre}
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Grado y Sección:</strong> {estudiante.grado} - {estudiante.seccion}
                  </p>
                  <p className="mb-1">
                    <strong>Representante:</strong> {estudiante.representante}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Año Académico:</strong> {estudiante.anoAcademico}
                  </p>
                  <p className="mb-0">
                    <strong>Estado:</strong> <CBadge color="success">Activo</CBadge>
                  </p>
                </div>
              </div>
            </div>
          </CCol>
          
          <CCol md={4}>
            <div className="border-start ps-4">
              <h6 className="text-muted mb-3">
                <CIcon icon={cilInfo} className="me-2" />
                Resumen Semanal
              </h6>
              <div className="row">
                <div className="col-6">
                  <div className="text-center p-2 border rounded mb-2">
                    <h4 className="text-primary mb-1">{estadisticas.totalClasesSemana}</h4>
                    <small className="text-muted">Clases</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center p-2 border rounded mb-2">
                    <h4 className="text-success mb-1">{estadisticas.totalHorasSemana}</h4>
                    <small className="text-muted">Horas</small>
                  </div>
                </div>
              </div>
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default EncabezadoEstudiante