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
import { cilNotes, cilFile, cilMagnifyingGlass, cilPlus } from "@coreui/icons";

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
    <div className="table-responsive">
      <CTable hover align="middle" className="mb-0 border-0 bg-transparent">
        <CTableHead className="bg-light-custom bg-opacity-10 border-0">
          <CTableRow className="border-0">
            <CTableHeaderCell width="50" className="text-center py-3 border-0">
              <input
                type="checkbox"
                className="form-check-input cursor-pointer shadow-sm"
                checked={estudiantesSeleccionados.size === estudiantes.length && estudiantes.length > 0}
                onChange={(e) => onToggleSeleccion('todos')}
                style={{ borderColor: '#F28C0F' }}
              />
            </CTableHeaderCell>
            <CTableHeaderCell className="text-uppercase text-muted-custom small fw-bold ls-1 py-3 border-0">Estudiante</CTableHeaderCell>
            <CTableHeaderCell className="text-center text-uppercase text-muted-custom small fw-bold ls-1 py-3 border-0">Código</CTableHeaderCell>
            <CTableHeaderCell className="text-center text-uppercase text-muted-custom small fw-bold ls-1 py-3 border-0">Edad</CTableHeaderCell>
            <CTableHeaderCell className="text-center text-uppercase text-muted-custom small fw-bold ls-1 py-3 border-0">Promedio</CTableHeaderCell>
            <CTableHeaderCell className="text-center text-uppercase text-muted-custom small fw-bold ls-1 py-3 border-0">Estado</CTableHeaderCell>
            <CTableHeaderCell className="text-center text-uppercase text-muted-custom small fw-bold ls-1 py-3 border-0">Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody className="border-0">
          {estudiantes.map((estudiante) => {
            const promedio = promediosCache[estudiante.id];
            const estado = calculos.determinarPromocion(promedio);
            const estaSeleccionado = estudiantesSeleccionados.has(estudiante.id);

            return (
              <CTableRow
                key={estudiante.id}
                className={`border-0 ${estaSeleccionado ? 'bg-orange-soft' : ''}`}
                style={{ transition: 'background-color 0.2s' }}
              >
                <CTableDataCell className="text-center border-0 border-bottom border-light-custom border-opacity-10">
                  <input
                    type="checkbox"
                    className="form-check-input cursor-pointer shadow-sm"
                    checked={estaSeleccionado}
                    onChange={() => onToggleSeleccion(estudiante.id)}
                    style={{ borderColor: '#F28C0F' }}
                  />
                </CTableDataCell>

                <CTableDataCell className="border-0 border-bottom border-light-custom border-opacity-10">
                  <div className="py-1">
                    <strong className="header-title-custom d-block">{estudiante.nombre}</strong>
                    <small className="text-muted-custom">Expediente Regular</small>
                  </div>
                </CTableDataCell>

                <CTableDataCell className="text-center border-0 border-bottom border-light-custom border-opacity-10">
                  <CBadge color="dark" className="rounded-pill px-3 bg-dark bg-opacity-75 font-monospace">
                    {estudiante.codigo}
                  </CBadge>
                </CTableDataCell>

                <CTableDataCell className="text-center border-0 border-bottom border-light-custom border-opacity-10 text-muted-custom fw-bold">
                  {estudiante.edad} años
                </CTableDataCell>

                <CTableDataCell className="text-center border-0 border-bottom border-light-custom border-opacity-10">
                  {promedio ? (
                    <span
                      className={`fw-bold fs-6 ${parseFloat(promedio) >= 10 ? 'text-success' : 'text-danger'}`}
                    >
                      {promedio}
                    </span>
                  ) : (
                    <small className="text-muted-custom fst-italic">Sin notas</small>
                  )}
                </CTableDataCell>

                <CTableDataCell className="text-center border-0 border-bottom border-light-custom border-opacity-10">
                  <CBadge
                    className="rounded-pill px-3 text-uppercase small py-2 border fw-bold"
                    style={{
                      backgroundColor: calculos.getColorEstado(estado) === 'success' ? 'rgba(16, 185, 129, 0.1)' : calculos.getColorEstado(estado) === 'danger' ? 'rgba(195, 86, 4, 0.1)' : 'rgba(105, 165, 195, 0.1)',
                      color: calculos.getColorEstado(estado) === 'success' ? '#10b981' : calculos.getColorEstado(estado) === 'danger' ? '#C35604' : '#69A5C3',
                      borderColor: 'transparent'
                    }}
                  >
                    {estado || "Pendiente"}
                  </CBadge>
                </CTableDataCell>

                <CTableDataCell className="text-center border-0 border-bottom border-light-custom border-opacity-10">
                  <div className="d-flex justify-content-center gap-2">
                    <CButton
                      className="btn-sm d-flex align-items-center bg-info bg-opacity-10 text-info border-0 fw-bold px-3 hover-lift shadow-sm"
                      onClick={() => onVerBoletin(estudiante)}
                      title="Ver boletín detallado"
                    >
                      <CIcon icon={cilMagnifyingGlass} className="me-1" size="sm" /> Ver
                    </CButton>
                    <CButton
                      className="btn-sm d-flex align-items-center bg-success bg-opacity-10 text-success border-0 fw-bold px-3 hover-lift shadow-sm"
                      onClick={() => onAgregarBoletin(estudiante)}
                      title="Agregar para generar boletín"
                    >
                      <CIcon icon={cilFile} className="me-1" size="sm" /> Boletín
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            );
          })}
        </CTableBody>
      </CTable>
      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .hover-lift:hover { transform: translateY(-2px); opacity: 0.8; }
        .cursor-pointer { cursor: pointer; }
        [data-coreui-theme="dark"] .table { color: white !important; }
        [data-coreui-theme="dark"] .form-check-input { background-color: rgba(255,255,255,0.05); }
      `}</style>
    </div>
  );
};