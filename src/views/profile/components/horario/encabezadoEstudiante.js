import React from 'react'
import { CCard, CCardHeader, CCardBody, CRow, CCol, CBadge } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar, cilUser, cilInfo } from "@coreui/icons"

const EncabezadoEstudiante = ({ estudiante, estadisticas }) => {
  return (
    <CCard className="premium-card border-0 overflow-hidden mb-5">
      <CCardHeader className="bg-orange-soft border-0 py-4 px-4">
        <CRow className="align-items-center">
          <CCol md={8}>
            <div className="d-flex align-items-center">
              <div className="p-3 bg-primary rounded-3 me-3">
                <CIcon icon={cilCalendar} size="xl" className="text-white" />
              </div>
              <div>
                <h3 className="mb-0 fw-bold text-dark text-uppercase ls-1">Mi Horario Académico</h3>
                <p className="mb-0 text-muted small text-uppercase">Escuela de Danza Endanza • {estudiante.anoAcademico}</p>
              </div>
            </div>
          </CCol>
          <CCol md={4} className="text-md-end mt-3 mt-md-0">
            <CBadge className="bg-white text-primary border border-primary border-opacity-10 px-3 py-2 rounded-pill fs-6 shadow-sm">
              ID Estudiante: {estudiante.codigo}
            </CBadge>
          </CCol>
        </CRow>
      </CCardHeader>

      <CCardBody className="p-4">
        <CRow className="g-4 align-items-center">
          <CCol lg={7}>
            <div className="p-4 rounded-4 bg-light border border-primary border-opacity-10">
              <div className="d-flex align-items-center mb-4">
                <div className="avatar avatar-lg bg-orange-soft text-primary rounded-circle me-3 fw-bold fs-4">
                  {estudiante.nombre.charAt(0)}
                </div>
                <div>
                  <h4 className="mb-0 fw-bold text-dark">{estudiante.nombre}</h4>
                  <CBadge className="bg-success bg-opacity-10 text-success rounded-pill px-2 small">ESTADO: ACTIVO</CBadge>
                </div>
              </div>

              <CRow className="g-3">
                <CCol sm={6}>
                  <label className="text-muted small text-uppercase ls-1 fw-bold mb-1">Grado y Sección</label>
                  <div className="fw-bold fs-5 text-primary">{estudiante.grado} <span className="text-muted fw-normal">Secc {estudiante.seccion}</span></div>
                </CCol>
                <CCol sm={6}>
                  <label className="text-muted small text-uppercase ls-1 fw-bold mb-1">Año Académico</label>
                  <div className="fw-bold fs-5">{estudiante.anoAcademico}</div>
                </CCol>
                <CCol sm={12}>
                  <label className="text-muted small text-uppercase ls-1 fw-bold mb-1">Representante Legal</label>
                  <div className="fw-bold fs-5 text-dark">{estudiante.representante}</div>
                </CCol>
              </CRow>
            </div>
          </CCol>

          <CCol lg={5}>
            <div className="p-4 rounded-4 bg-orange-soft h-100">
              <h6 className="text-primary small fw-bold text-uppercase ls-1 mb-4">
                <CIcon icon={cilInfo} className="me-2" />
                Resumen de Carga Académica
              </h6>
              <CRow className="g-3">
                <CCol sm={6}>
                  <div className="p-3 bg-white rounded-4 text-center shadow-sm border border-primary border-opacity-10 h-100 d-flex flex-column justify-content-center">
                    <div className="display-5 fw-bold text-primary mb-1">{estadisticas.totalClasesSemana}</div>
                    <div className="text-muted small text-uppercase fw-bold ls-1">Clases / Sem</div>
                  </div>
                </CCol>
                <CCol sm={6}>
                  <div className="p-3 bg-white rounded-4 text-center shadow-sm border border-primary border-opacity-10 h-100 d-flex flex-column justify-content-center">
                    <div className="display-5 fw-bold text-primary mb-1">{estadisticas.totalHorasSemana}</div>
                    <div className="text-muted small text-uppercase fw-bold ls-1">Horas Totales</div>
                  </div>
                </CCol>
              </CRow>
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default EncabezadoEstudiante