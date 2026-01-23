// VistaBoletin.jsx
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
  CListGroup,
  CListGroupItem,
  CRow,
  CCol
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPrint } from "@coreui/icons";

export const VistaBoletin = ({ boletinData, calculos, dispatch }) => {
  if (!boletinData) return null;

  return (
    <CCard className="mt-4 printable-area">
      <CCardHeader className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">BOLETÍN ACADÉMICO</h4>
            <small>Escuela de Danza Endanza - Año Académico 2024</small>
          </div>
          <div className="d-flex gap-2">
            <CButton
              color="light"
              variant="outline"
              className="text-primary"
              onClick={() => dispatch({ type: 'OCULTAR_BOLETIN' })}
            >
              ← Volver
            </CButton>
            <CButton
              color="light"
              className="text-primary"
              onClick={() => window.print()}
            >
              <CIcon icon={cilPrint} /> Imprimir
            </CButton>
          </div>
        </div>
      </CCardHeader>
      
      <CCardBody>
        <CRow className="mb-4">
          <CCol md={8}>
            <h5>INFORMACIÓN DEL ESTUDIANTE</h5>
            <CListGroup>
              <CListGroupItem>
                <strong>Nombre:</strong> {boletinData.estudiante.nombre}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Código:</strong> {boletinData.estudiante.codigo}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Grado:</strong> {boletinData.grado}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Fecha de Emisión:</strong> {boletinData.fecha}
              </CListGroupItem>
            </CListGroup>
          </CCol>
          <CCol md={4}>
            <CCard className="border-primary">
              <CCardBody className="text-center">
                <h5>RESUMEN ACADÉMICO</h5>
                <div className="mb-3">
                  <h1 className={`text-${calculos.getColorNota(boletinData.promedio)}`}>
                    {boletinData.promedio || "N/A"}
                  </h1>
                  <small>Promedio General</small>
                </div>
                <CBadge 
                  color={calculos.getColorEstado(boletinData.promocion)}
                  className="fs-5 py-2 px-3"
                >
                  {boletinData.promocion}
                </CBadge>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <h5 className="mb-3">CALIFICACIONES POR MATERIA</h5>
        <CTable bordered responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Materia / Disciplina</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Código</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Horario</CTableHeaderCell>
              <CTableHeaderCell className="text-center">1er Trim.</CTableHeaderCell>
              <CTableHeaderCell className="text-center">2do Trim.</CTableHeaderCell>
              <CTableHeaderCell className="text-center">3er Trim.</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Nota Final</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {boletinData.materias.map((materia) => (
              <CTableRow key={materia.id}>
                <CTableDataCell>
                  <strong>{materia.nombre}</strong>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  {materia.id}
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <small>{materia.horario}</small>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CBadge color={calculos.getColorNota(materia.notas.t1)}>
                    {materia.notas.t1 || "--"}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CBadge color={calculos.getColorNota(materia.notas.t2)}>
                    {materia.notas.t2 || "--"}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CBadge color={calculos.getColorNota(materia.notas.t3)}>
                    {materia.notas.t3 || "--"}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CBadge 
                    color={calculos.getColorNota(materia.notas.final)}
                    className="fs-5 px-3"
                  >
                    {materia.notas.final || "--"}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CBadge color={calculos.getColorEstado(materia.estado)}>
                    {materia.estado}
                  </CBadge>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <CRow className="mt-4">
          <CCol md={8}>
            <CCard className="border-warning">
              <CCardHeader className="bg-warning text-dark">
                <strong>OBSERVACIONES Y RECOMENDACIONES</strong>
              </CCardHeader>
              <CCardBody>
                <p>{boletinData.observaciones}</p>
                <div className="mt-4">
                  <small className="text-muted">Este boletín es un documento oficial de la Escuela de Danza Endanza</small>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};