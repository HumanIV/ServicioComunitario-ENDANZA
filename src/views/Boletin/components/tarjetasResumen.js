// TarjetasResumen.jsx
import React from 'react';
import { CRow, CCol, CCard, CCardBody, CProgress } from "@coreui/react";

export const TarjetasResumen = ({ 
  estadisticas, 
  estudiantesSeleccionados, 
  totalEstudiantes 
}) => {
  return (
    <CRow className="mt-4">
      <CCol md={3}>
        <CCard className="text-center border-primary">
          <CCardBody>
            <h5>Total Estudiantes</h5>
            <h2 className="text-primary">{estadisticas.total}</h2>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={3}>
        <CCard className="text-center border-success">
          <CCardBody>
            <h5>Aprobados</h5>
            <h2 className="text-success">{estadisticas.aprobados}</h2>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={3}>
        <CCard className="text-center border-warning">
          <CCardBody>
            <h5>Pendientes</h5>
            <h2 className="text-warning">{estadisticas.pendientes}</h2>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={3}>
        <CCard className="text-center border-info">
          <CCardBody>
            <h5>Seleccionados</h5>
            <h2 className="text-info">{estudiantesSeleccionados.size}</h2>
            <CProgress 
              value={(estudiantesSeleccionados.size / totalEstudiantes) * 100} 
              className="mt-2" 
              color="primary"
              style={{ height: '5px' }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};