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
      <CTable hover align="middle" className="mb-0 border-white">
        <CTableHead className="bg-light">
          <CTableRow>
            <CTableHeaderCell width="50" className="text-center py-3">
              <input
                type="checkbox"
                className="form-check-input cursor-pointer"
                checked={estudiantesSeleccionados.size === estudiantes.length && estudiantes.length > 0}
                onChange={(e) => onToggleSeleccion('todos')}
                style={{ borderColor: '#F28C0F' }}
              />
            </CTableHeaderCell>
            <CTableHeaderCell className="text-uppercase text-secondary small fw-bold ls-1 py-3 border-0">Estudiante</CTableHeaderCell>
            <CTableHeaderCell className="text-center text-uppercase text-secondary small fw-bold ls-1 py-3 border-0">Código</CTableHeaderCell>
            <CTableHeaderCell className="text-center text-uppercase text-secondary small fw-bold ls-1 py-3 border-0">Edad</CTableHeaderCell>
            <CTableHeaderCell className="text-center text-uppercase text-secondary small fw-bold ls-1 py-3 border-0">Promedio</CTableHeaderCell>
            <CTableHeaderCell className="text-center text-uppercase text-secondary small fw-bold ls-1 py-3 border-0">Estado</CTableHeaderCell>
            <CTableHeaderCell className="text-center text-uppercase text-secondary small fw-bold ls-1 py-3 border-0">Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {estudiantes.map((estudiante) => {
            const promedio = promediosCache[estudiante.id];
            const estado = calculos.determinarPromocion(promedio);
            const estaSeleccionado = estudiantesSeleccionados.has(estudiante.id);

            return (
              <CTableRow
                key={estudiante.id}
                className={estaSeleccionado ? 'bg-orange-soft' : ''}
                style={{ transition: 'background-color 0.2s' }}
              >
                <CTableDataCell className="text-center border-bottom border-light">
                  <input
                    type="checkbox"
                    className="form-check-input cursor-pointer"
                    checked={estaSeleccionado}
                    onChange={() => onToggleSeleccion(estudiante.id)}
                    style={{ borderColor: '#F28C0F' }}
                  />
                </CTableDataCell>

                <CTableDataCell className="border-bottom border-light">
                  <div className="py-1">
                    <strong className="text-dark d-block">{estudiante.nombre}</strong>
                    <small className="text-muted">Expediente Regular</small>
                  </div>
                </CTableDataCell>

                <CTableDataCell className="text-center border-bottom border-light">
                  <CBadge color="dark" className="rounded-pill px-3 bg-dark bg-opacity-75 font-monospace">
                    {estudiante.codigo}
                  </CBadge>
                </CTableDataCell>

                <CTableDataCell className="text-center border-bottom border-light text-muted fw-bold">
                  {estudiante.edad} años
                </CTableDataCell>

                <CTableDataCell className="text-center border-bottom border-light">
                  {promedio ? (
                    <span
                      className={`fw-bold fs-6 ${parseFloat(promedio) >= 10 ? 'text-success' : 'text-danger'}`}
                    >
                      {promedio}
                    </span>
                  ) : (
                    <small className="text-muted fst-italic">Sin notas</small>
                  )}
                </CTableDataCell>

                <CTableDataCell className="text-center border-bottom border-light">
                  <CBadge
                    className="rounded-pill px-3 text-uppercase small py-2 border"
                    style={{
                      backgroundColor: calculos.getColorEstado(estado) === 'success' ? '#ECFDF5' : calculos.getColorEstado(estado) === 'danger' ? '#FEF2F2' : '#EFF6FF',
                      color: calculos.getColorEstado(estado) === 'success' ? '#059669' : calculos.getColorEstado(estado) === 'danger' ? '#DC2626' : '#2563EB',
                      borderColor: calculos.getColorEstado(estado) === 'success' ? '#A7F3D0' : calculos.getColorEstado(estado) === 'danger' ? '#FECACA' : '#BFDBFE'
                    }}
                  >
                    {estado || "Pendiente"}
                  </CBadge>
                </CTableDataCell>

                <CTableDataCell className="text-center border-bottom border-light">
                  <div className="d-flex justify-content-center gap-2">
                    <CButton
                      className="btn-sm d-flex align-items-center bg-info bg-opacity-10 text-info border-0 fw-bold px-3 hover-lift"
                      onClick={() => onVerBoletin(estudiante)}
                      title="Ver boletín detallado"
                    >
                      <CIcon icon={cilMagnifyingGlass} className="me-1" size="sm" /> Ver
                    </CButton>
                    <CButton
                      className="btn-sm d-flex align-items-center bg-success bg-opacity-10 text-success border-0 fw-bold px-3 hover-lift"
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
        .bg-orange-soft { background-color: rgba(242, 140, 15, 0.08) !important; }
        .hover-lift:hover { transform: translateY(-2px); opacity: 0.8; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};