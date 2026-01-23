// TablaEstudiantes.jsx
import React from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilNotes, cilFile } from "@coreui/icons";

export const TablaEstudiantes = ({ 
  estudiantes, 
  estudiantesSeleccionados, 
  promediosCache, 
  calculos, 
  onToggleSeleccion, 
  onVerBoletin,
  onAgregarBoletin 
}) => {
  return (
    <CTable bordered hover responsive striped>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell width="50" className="text-center">
            <input 
              type="checkbox" 
              className="form-check-input"
              checked={estudiantesSeleccionados.size === estudiantes.length && estudiantes.length > 0}
              onChange={(e) => onToggleSeleccion('todos')}
            />
          </CTableHeaderCell>
          <CTableHeaderCell>Estudiante</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Código</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Edad</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Promedio</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {estudiantes.map((estudiante) => {
          const promedio = promediosCache[estudiante.id];
          const estado = calculos.determinarPromocion(promedio);
          const estaSeleccionado = estudiantesSeleccionados.has(estudiante.id);
          
          return (
            <CTableRow key={estudiante.id} className={estaSeleccionado ? 'table-primary' : ''}>
              <CTableDataCell className="text-center">
                <input 
                  type="checkbox" 
                  className="form-check-input"
                  checked={estaSeleccionado}
                  onChange={() => onToggleSeleccion(estudiante.id)}
                />
              </CTableDataCell>
              
              <CTableDataCell>
                <div>
                  <strong>{estudiante.nombre}</strong>
                </div>
              </CTableDataCell>
              
              <CTableDataCell className="text-center align-middle">
                <CBadge color="dark">{estudiante.codigo}</CBadge>
              </CTableDataCell>
              
              <CTableDataCell className="text-center align-middle">
                {estudiante.edad} años
              </CTableDataCell>
              
              <CTableDataCell className="text-center align-middle">
                {promedio ? (
                  <CBadge 
                    color={calculos.getColorNota(promedio)}
                    className="fs-6 px-3"
                  >
                    {promedio}
                  </CBadge>
                ) : (
                  <small className="text-muted">Sin notas</small>
                )}
              </CTableDataCell>
              
              <CTableDataCell className="text-center align-middle">
                <CBadge color={calculos.getColorEstado(estado)}>
                  {estado}
                </CBadge>
              </CTableDataCell>
              
              <CTableDataCell className="text-center align-middle">
                <div className="d-flex justify-content-center gap-2">
                  <CButton
                    color="info"
                    size="sm"
                    onClick={() => onVerBoletin(estudiante)}
                    title="Ver boletín detallado"
                  >
                    <CIcon icon={cilNotes} /> Ver
                  </CButton>
                  <CButton
                    color="success"
                    size="sm"
                    onClick={() => onAgregarBoletin(estudiante)}
                    title="Agregar para generar boletín"
                  >
                    <CIcon icon={cilFile} /> Boletín
                  </CButton>
                </div>
              </CTableDataCell>
            </CTableRow>
          );
        })}
      </CTableBody>
    </CTable>
  );
};