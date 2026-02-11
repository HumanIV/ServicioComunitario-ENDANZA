import React from 'react'
import { CCard, CCardBody, CRow, CCol, CBadge } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar, cilInfo } from "@coreui/icons"
import AcademicHeader from '../common/AcademicHeader'

const EncabezadoEstudiante = ({ estudiante, estadisticas }) => {
  return (
    <CCard className="premium-card border-0 overflow-hidden mb-5">
      <AcademicHeader
        title="Mi Horario Académico"
        subtitle={`Escuela de Danza Endanza • ${estudiante.anoAcademico}`}
        studentCode={estudiante.codigo}
        icon={cilCalendar}
        colorClass="warning"
      />

      <CCardBody className="p-3 p-md-4">
        <CRow className="g-3 g-md-4 align-items-stretch">
          <CCol lg={7}>
            <div className="p-3 p-md-4 rounded-4 info-box border border-warning border-opacity-10 h-100">
              <div className="d-flex align-items-center mb-3 mb-md-4">
                <div className="avatar avatar-lg bg-orange-soft text-warning rounded-circle me-3 fw-bold fs-4 flex-shrink-0 shadow-sm" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {estudiante.nombre.charAt(0)}
                </div>
                <div>
                  <h4 className="mb-0 fw-bold header-title fs-5 fs-md-4">{estudiante.nombre}</h4>
                  <CBadge className="bg-success-soft text-success rounded-pill px-2 small mt-1">ESTADO: ACTIVO</CBadge>
                </div>
              </div>

              <CRow className="g-2 g-md-3">
                <CCol xs={12} sm={6}>
                  <label className="header-label label-micro mb-1 d-block">Grado y Sección</label>
                  <div className="fw-bold fs-6 fs-sm-5 text-warning">{estudiante.grado} <span className="header-label fw-normal small">Secc {estudiante.seccion}</span></div>
                </CCol>
                <CCol xs={12} sm={6}>
                  <label className="header-label label-micro mb-1 d-block">Año Académico</label>
                  <div className="fw-bold fs-6 fs-sm-5 header-title">{estudiante.anoAcademico}</div>
                </CCol>
                <CCol xs={12}>
                  <label className="header-label label-micro mb-1 d-block">Representante Legal</label>
                  <div className="fw-bold fs-6 fs-sm-5 header-title">{estudiante.representante}</div>
                </CCol>
              </CRow>
            </div>
          </CCol>

          <CCol lg={5}>
            <div className="p-3 p-md-4 rounded-4 bg-orange-soft h-100 shadow-sm border border-warning border-opacity-10">
              <h6 className="text-warning label-micro mb-3 mb-md-4 d-flex align-items-center">
                <CIcon icon={cilInfo} className="me-2" />
                Resumen de Carga Académica
              </h6>
              <CRow className="g-2 g-md-3">
                <CCol xs={6}>
                  <div className="p-2 p-md-3 bg-stat-box rounded-4 text-center shadow-sm border border-warning border-opacity-10 h-100 d-flex flex-column justify-content-center">
                    <div className="fw-bold text-warning mb-0 fs-3 fs-md-2">{estadisticas.totalClasesSemana}</div>
                    <div className="text-muted-custom label-micro mt-1" style={{ fontSize: '0.6rem' }}>Clases / Sem</div>
                  </div>
                </CCol>
                <CCol xs={6}>
                  <div className="p-2 p-md-3 bg-stat-box rounded-4 text-center shadow-sm border border-warning border-opacity-10 h-100 d-flex flex-column justify-content-center">
                    <div className="fw-bold text-warning mb-0 fs-3 fs-md-2">{estadisticas.totalHorasSemana}</div>
                    <div className="text-muted-custom label-micro mt-1" style={{ fontSize: '0.6rem' }}>Horas Sem</div>
                  </div>
                </CCol>
              </CRow>
            </div>
          </CCol>
        </CRow>
      </CCardBody>
      <style>{`
        .header-title { color: var(--neutral-800); }
        .header-label { color: var(--neutral-500); }
        .info-box { background-color: var(--neutral-50); }
        .bg-stat-box { background-color: white; }
        .bg-success-soft { background-color: rgba(16, 185, 129, 0.1); }

        [data-coreui-theme="dark"] .header-title { color: rgba(255,255,255,0.9); }
        [data-coreui-theme="dark"] .header-label { color: rgba(255,255,255,0.4); }
        [data-coreui-theme="dark"] .info-box { background-color: rgba(255,255,255,0.02); }
        [data-coreui-theme="dark"] .bg-stat-box { background-color: rgba(255,255,255,0.05); }
        [data-coreui-theme="dark"] .bg-success-soft { background-color: rgba(16, 185, 129, 0.15); }
      `}</style>
    </CCard>
  )
}

export default EncabezadoEstudiante