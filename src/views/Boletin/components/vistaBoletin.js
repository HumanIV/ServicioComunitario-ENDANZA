import React from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CRow,
  CCol
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPrint, cilArrowLeft, cilEducation, cilUser, cilCalendar, cilCheckCircle, cilInfo } from "@coreui/icons";

export const VistaBoletin = ({ boletinData, calculos, dispatch, academicYear }) => {
  if (!boletinData) return null;

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <CButton
          className="btn-back-premium px-3 py-2"
          onClick={() => dispatch({ type: 'OCULTAR_BOLETIN' })}
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Volver al listado
        </CButton>
        <CButton
          className="btn-premium d-flex align-items-center shadow-sm"
          onClick={() => window.print()}
        >
          <CIcon icon={cilPrint} className="me-2 text-white" />
          Imprimir Boletín Oficial
        </CButton>
      </div>

      <CCard className="mb-4 border-0 shadow-lg printable-area overflow-hidden premium-card" style={{ minHeight: '800px' }}>
        <CCardHeader className="bg-light-custom border-bottom border-secondary border-opacity-25 py-5 px-5">
          <div className="d-flex justify-content-between align-items-start">
            <div className="d-flex align-items-center">
              <div className="bg-orange-soft p-3 rounded-circle me-4 text-primary">
                <CIcon icon={cilEducation} size="3xl" />
              </div>
              <div>
                <h2 className="mb-1 fw-bold header-title-custom text-uppercase ls-1">Boletín Oficial</h2>
                <p className="text-muted-custom mb-0 fw-medium ls-1 text-uppercase small">Escuela Nacional de Danza (ENDANZA)</p>
                <small className="text-muted-custom opacity-75">Año Académico {academicYear || "2024 - 2025"}</small>
              </div>
            </div>
            <div className="text-end">
              <CBadge color={calculos.getColorEstado(boletinData.promocion)} className="fs-5 px-4 py-2 rounded-pill shadow-sm border mb-2 d-inline-block">
                {boletinData.promocion.toUpperCase()}
              </CBadge>
              <div className="text-muted-custom small fw-bold text-uppercase ls-1">Estado Final</div>
            </div>
          </div>
        </CCardHeader>

        <CCardBody className="p-5">
          {/* Información del Estudiante */}
          <div className="bg-light-custom bg-opacity-25 p-4 rounded-4 border border-light-custom mb-5">
            <h6 className="text-warning fw-bold text-uppercase ls-1 mb-4 d-flex align-items-center border-bottom pb-2">
              <CIcon icon={cilUser} className="me-2 text-warning" />
              Datos del Alumno
            </h6>
            <CRow className="g-4">
              <CCol md={6}>
                <div className="mb-3">
                  <label className="text-muted-custom small fw-bold text-uppercase ls-1 d-block mb-1">Nombre Completo</label>
                  <div className="fs-5 fw-bold header-title-custom">{boletinData.estudiante.nombre}</div>
                </div>
                <div>
                  <label className="text-muted-custom small fw-bold text-uppercase ls-1 d-block mb-1">Nivel Cursado</label>
                  <div className="fs-5 header-title-custom">{boletinData.grado}</div>
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <label className="text-muted-custom small fw-bold text-uppercase ls-1 d-block mb-1">Expediente Académico</label>
                  <div className="fs-5 fw-bold header-title-custom font-monospace">{boletinData.estudiante.codigo}</div>
                </div>
                <div>
                  <label className="text-muted-custom small fw-bold text-uppercase ls-1 d-block mb-1">Fecha de Emisión</label>
                  <div className="fs-5 header-title-custom d-flex align-items-center">
                    <CIcon icon={cilCalendar} className="me-2 text-muted-custom" size="sm" />
                    {boletinData.fecha}
                  </div>
                </div>
              </CCol>
            </CRow>
          </div>

          <h6 className="text-warning fw-bold text-uppercase ls-1 mb-4 ps-2 border-start border-4 border-warning">
            Rendimiento Académico Por Asignatura
          </h6>

          <CTable hover responsive className="mb-5 align-middle bg-transparent">
            <CTableHead>
              <CTableRow className="border-bottom border-warning border-2">
                <CTableHeaderCell className="bg-transparent py-3 text-muted-custom text-uppercase small fw-bold ls-1 border-0">Asignatura</CTableHeaderCell>
                <CTableHeaderCell className="bg-transparent py-3 text-center text-muted-custom text-uppercase small fw-bold ls-1 border-0">Código</CTableHeaderCell>
                <CTableHeaderCell className="bg-transparent py-3 text-center text-muted-custom text-uppercase small fw-bold ls-1 border-0">Horario</CTableHeaderCell>
                <CTableHeaderCell className="bg-transparent py-3 text-center text-muted-custom text-uppercase small fw-bold ls-1 border-0">1er Lapso</CTableHeaderCell>
                <CTableHeaderCell className="bg-transparent py-3 text-center text-muted-custom text-uppercase small fw-bold ls-1 border-0">2do Lapso</CTableHeaderCell>
                <CTableHeaderCell className="bg-transparent py-3 text-center text-muted-custom text-uppercase small fw-bold ls-1 border-0">3er Lapso</CTableHeaderCell>
                <CTableHeaderCell className="bg-orange-soft py-3 text-center text-primary text-uppercase small fw-bold ls-1 border-0 rounded-top">Definitiva</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {boletinData.materias.map((materia) => (
                <CTableRow key={materia.id} className="border-bottom border-light-custom border-opacity-10">
                  <CTableDataCell className="py-3 ps-3">
                    <strong className="header-title-custom d-block mb-1">{materia.nombre}</strong>
                  </CTableDataCell>
                  <CTableDataCell className="text-center py-3 text-muted-custom small font-monospace">
                    {materia.id}
                  </CTableDataCell>
                  <CTableDataCell className="text-center py-3 text-muted-custom small">
                    {materia.horario}
                  </CTableDataCell>
                  <CTableDataCell className="text-center py-3">
                    <span className="fw-medium text-muted-custom">{materia.notas.t1 || "-"}</span>
                  </CTableDataCell>
                  <CTableDataCell className="text-center py-3">
                    <span className="fw-medium text-muted-custom">{materia.notas.t2 || "-"}</span>
                  </CTableDataCell>
                  <CTableDataCell className="text-center py-3">
                    <span className="fw-medium text-muted-custom">{materia.notas.t3 || "-"}</span>
                  </CTableDataCell>
                  <CTableDataCell className="text-center py-3 bg-orange-soft bg-opacity-25 border-0">
                    <span className={`fs-5 fw-bold ${calculos.getColorNota(materia.notas.final) === 'success' ? 'text-success' : 'text-danger'}`}>
                      {materia.notas.final || "-"}
                    </span>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          <div className="d-flex justify-content-end mb-5">
            <div className="text-end bg-light-custom p-4 rounded-4 border border-light-custom shadow-sm" style={{ minWidth: '300px' }}>
              <small className="text-uppercase text-muted-custom fw-bold ls-1 d-block mb-2">Promedio General</small>
              <div className="display-4 fw-bold header-title-custom lh-1 mb-2">{boletinData.promedio || "0.0"}</div>
              <div className="text-muted-custom small">Escala de evaluación 1 - 20 pts</div>
            </div>
          </div>

          <CRow>
            <CCol md={12}>
              <div className="p-4 rounded-4 border border-warning bg-warning bg-opacity-10">
                <h6 className="header-title-custom fw-bold text-uppercase ls-1 mb-3 d-flex align-items-center">
                  <CIcon icon={cilInfo} className="me-2 text-warning" />
                  Observaciones del Consejo Docente
                </h6>
                <p className="mb-0 header-title-custom opacity-75 fw-medium" style={{ lineHeight: '1.6' }}>
                  {boletinData.observaciones}
                </p>
              </div>
            </CCol>
          </CRow>

          <div className="mt-5 pt-5 border-top border-secondary border-opacity-10 text-center">
            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="border-top border-secondary border-2 w-75 mx-auto mb-2 opacity-50"></div>
                <small className="text-uppercase fw-bold ls-1 text-muted-custom d-block">Dirección Académica</small>
              </div>
              <div className="col-md-4">
                <div className="border-top border-secondary border-2 w-75 mx-auto mb-2 opacity-50"></div>
                <small className="text-uppercase fw-bold ls-1 text-muted-custom d-block">Control de Estudios</small>
              </div>
            </div>
            <div className="mt-4">
              <small className="text-muted-custom fst-italic bg-light-custom px-3 py-1 rounded-pill">
                Documento válido solo con sello húmedo de la institución. Generado el {new Date().toLocaleDateString()}.
              </small>
            </div>
          </div>
        </CCardBody>
      </CCard>

      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .hover-lift:hover { transform: translateY(-2px); }
        @media print {
            .no-print { display: none !important; }
            .printable-area { box-shadow: none !important; border: none !important; background-color: white !important; color: black !important; }
            .printable-area .header-title-custom, 
            .printable-area .text-muted-custom,
            .printable-area label,
            .printable-area .fs-5 { color: black !important; }
            .bg-orange-soft { background-color: #fff7ed !important; -webkit-print-color-adjust: exact; }
            .bg-light-custom { background-color: #f8fafc !important; }
            .premium-card { background-color: white !important; }
        }
      `}</style>
    </div>
  );
};