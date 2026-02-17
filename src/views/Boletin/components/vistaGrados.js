import React from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CBadge
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser, cilSchool, cilBook, cilArrowRight } from "@coreui/icons";

export const VistaGrados = ({ data, onSeleccionarGrado }) => {
  return (
    <div className="animate__animated animate__fadeIn">
      <div className="d-flex align-items-center mb-5">
        <div className="p-3 grade-card-icon-wrapper rounded-circle shadow-sm me-3 text-primary">
          <CIcon icon={cilSchool} size="xl" />
        </div>
        <div>
          <h3 className="mb-0 fw-bold header-title-custom text-uppercase ls-1">Niveles Académicos</h3>
          <p className="text-muted-custom small mb-0">Seleccione un grado para gestionar boletines</p>
        </div>
      </div>

      <CRow className="g-4">
        {data.map((grado) => (
          <CCol md={6} lg={4} xl={3} key={grado.id}>
            <CCard className="premium-card border-0 shadow-sm overflow-hidden hover-lift transition-all" style={{ borderRadius: '24px' }}>
              <div className="position-absolute top-0 start-0 w-100 bg-orange-soft" style={{ height: '4px' }}></div>
              <CCardBody className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                    <CIcon icon={cilBook} size="lg" />
                  </div>
                  <CBadge color="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-10 rounded-pill px-3 py-1 fw-bold small">
                    ACTIVO
                  </CBadge>
                </div>

                <div className="mb-4">
                  <h4 className="fw-bold header-title-custom mb-1">
                    {grado.materias && grado.materias.length > 0
                      ? grado.materias.map(m => m.nombre).join(', ')
                      : grado.grado}
                  </h4>
                  <small className="text-muted-custom text-uppercase ls-1 fw-bold" style={{ fontSize: '0.65rem' }}>Ciclo 2024</small>
                </div>

                <div className="d-flex gap-2 mb-4">
                  <div className="flex-fill bg-light-custom text-muted-custom fw-bold p-2 rounded-3 d-flex flex-column align-items-center small shadow-sm border border-light-custom">
                    <span className="text-primary fs-5">{grado.materias.length}</span>
                    <span style={{ fontSize: '0.6rem' }} className="text-uppercase opacity-75">Materias</span>
                  </div>
                  <div className="flex-fill bg-light-custom text-muted-custom fw-bold p-2 rounded-3 d-flex flex-column align-items-center small shadow-sm border border-light-custom">
                    <span className="text-primary fs-5">{grado.estudiantes?.length || 0}</span>
                    <span style={{ fontSize: '0.6rem' }} className="text-uppercase opacity-75">Alumnos</span>
                  </div>
                </div>

                <CButton
                  className="btn-premium w-100 py-2 d-flex justify-content-center align-items-center gap-2 mt-2 shadow-sm"
                  onClick={() => onSeleccionarGrado(grado)}
                >
                  <span className="fw-bold small text-uppercase ls-1">Gestionar</span>
                  <CIcon icon={cilArrowRight} size="sm" />
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); }
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
};