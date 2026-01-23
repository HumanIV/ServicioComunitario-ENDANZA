// VistaGrados.jsx
import React from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CButton,
  CBadge
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser } from "@coreui/icons";

export const VistaGrados = ({ data, onSeleccionarGrado }) => {
  return (
    <>
      <h3 className="mb-4">
        <CIcon icon={cilUser} className="me-2" />
        Seleccionar Grado de Danza
      </h3>
      <CRow>
        {data.map((grado) => (
          <CCol md={6} lg={4} xl={3} key={grado.id} className="mb-3">
            <CCard className="h-100 shadow-sm border-primary hover-shadow">
              <CCardHeader className="bg-primary text-white text-center">
                <strong className="fs-5">{grado.grado}</strong>
              </CCardHeader>
              <CCardBody className="text-center">
                <div className="mb-3">
                  <CBadge color="info" className="fs-6 py-2 px-3">
                    {grado.materias.length} Materias
                  </CBadge>
                </div>
                <div className="mb-3">
                  <CBadge color="success" className="fs-6 py-2 px-3">
                    {grado.estudiantes?.length || 0} Estudiantes
                  </CBadge>
                </div>
                <div className="text-start">
                  <small className="text-muted d-block mb-1">Disciplinas:</small>
                  <ul className="list-unstyled ps-3">
                    {grado.materias.slice(0, 2).map((materia, j) => (
                      <li key={j} className="mb-1">
                        <small>• {materia.nombre}</small>
                      </li>
                    ))}
                    {grado.materias.length > 2 && (
                      <li className="mb-1">
                        <small className="text-muted">y {grado.materias.length - 2} más...</small>
                      </li>
                    )}
                  </ul>
                </div>
              </CCardBody>
              <CCardFooter className="text-center">
                <CButton 
                  color="primary" 
                  className="w-100"
                  onClick={() => onSeleccionarGrado(grado)}
                >
                  Ver Estudiantes
                </CButton>
              </CCardFooter>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </>
  );
};