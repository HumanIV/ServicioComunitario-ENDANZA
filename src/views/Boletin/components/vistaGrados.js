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
        <div className="p-3 bg-white rounded-circle shadow-sm me-3 text-primary">
          <CIcon icon={cilSchool} size="xl" />
        </div>
        <div>
          <h3 className="mb-0 fw-bold text-dark text-uppercase ls-1">Niveles Académicos</h3>
          <p className="text-muted small mb-0">Seleccione un grado para gestionar boletines</p>
        </div>
      </div>

      <CRow className="g-4">
        {data.map((grado) => (
          <CCol md={6} lg={4} xl={3} key={grado.id}>
            <CCard className="h-100 premium-card border-0 shadow-sm overflow-hidden hover-lift transition-all group-hover" style={{ borderRadius: '32px' }}>
              <div className="position-absolute top-0 start-0 w-100 bg-orange-soft" style={{ height: '6px' }}></div>
              <CCardBody className="p-4 d-flex flex-column h-100">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                    <CIcon icon={cilUser} size="lg" />
                  </div>
                  <CBadge color="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-10 rounded-pill px-3 py-1">
                    ACTIVO
                  </CBadge>
                </div>

                <h4 className="fw-bold text-dark mb-1">{grado.grado}</h4>
                <small className="text-muted text-uppercase ls-1 fw-bold mb-4" style={{ fontSize: '0.65rem' }}>Ciclo Académico 2024</small>

                <div className="d-flex gap-2 mb-4">
                  <div className="bg-light text-secondary fw-bold px-3 py-2 rounded-3 d-flex align-items-center small">
                    <CIcon icon={cilBook} size="sm" className="me-2" />
                    {grado.materias.length} Materias
                  </div>
                  <div className="bg-light text-secondary fw-bold px-3 py-2 rounded-3 d-flex align-items-center small">
                    <CIcon icon={cilUser} size="sm" className="me-2" />
                    {grado.estudiantes?.length || 0} Alumnos
                  </div>
                </div>

                <div className="mb-4 flex-grow-1">
                  <small className="text-uppercase text-muted fw-bold ls-1 d-block mb-2" style={{ fontSize: '0.65rem' }}>Disciplinas Principales</small>
                  <ul className="list-unstyled ps-0 mb-0">
                    {grado.materias.slice(0, 3).map((materia, j) => (
                      <li key={j} className="mb-2 d-flex align-items-center small text-dark p-2 rounded-3 bg-light bg-opacity-50">
                        <div className="bullet-point bg-warning me-2 rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                        {materia.nombre}
                      </li>
                    ))}
                    {grado.materias.length > 3 && (
                      <li className="mt-2 small text-primary fw-bold ps-3">
                        + {grado.materias.length - 3} asignaturas más
                      </li>
                    )}
                  </ul>
                </div>

                <CButton
                  className="btn-premium w-100 py-2 d-flex justify-content-between align-items-center px-4 mt-auto shadow-sm"
                  onClick={() => onSeleccionarGrado(grado)}
                >
                  <span className="fw-bold small text-uppercase ls-1">Gestionar Grado</span>
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