// InscripcionPrincipal.js - Versión simplificada SIN cupos
import React, { useState } from "react";
import {
  CCard, CCardBody, CCardHeader, CButton,
  CContainer, CAlert, CCol
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilFile, cilEducation, cilCheckCircle, cilInfo } from "@coreui/icons";
import InscripcionCompletaForm from "./components/inscripcion/inscripcionCompletaForm";

const InscripcionPrincipal = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const inscripcionesAbiertas = true;

  if (mostrarFormulario) {
    return <InscripcionCompletaForm onVolver={() => setMostrarFormulario(false)} />;
  }

  return (
    <CContainer className="py-5">
      <CCard className="premium-card border-0 overflow-hidden shadow-lg animate__animated animate__fadeIn">
        <CCardHeader className="bg-orange-soft border-0 text-center py-5">
          <div className="brand-logo mx-auto mb-4" style={{
            width: '100px', height: '100px',
            background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
            borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 15px 35px rgba(242, 140, 15, 0.3)'
          }}>
            <CIcon icon={cilEducation} size="3xl" className="text-white" />
          </div>
          <h1 className="fw-bold mb-1 ls-1" style={{ color: 'var(--neutral-900)' }}>SISTEMA DE INSCRIPCIONES</h1>
          <h5 className="text-muted fw-normal">Escuela Nacional de Danza (Período 2024-2025)</h5>
        </CCardHeader>

        <CCardBody className="p-4 p-md-5">
          <div className="row justify-content-center">
            <CCol lg={12}>
              <div className="text-center mb-5">
                <p className="text-muted lead mb-5">
                  Bienvenido al portal de ingreso. A través de este sistema podrá registrar de forma oficial
                  a los nuevos talentos de nuestra institución.
                </p>

                <div className="d-grid gap-3 d-sm-flex justify-content-center mb-5">
                  <div className="px-4 py-3 bg-light rounded-4 border-2 border border-info border-opacity-10 d-flex align-items-center">
                    <CIcon icon={cilInfo} className="text-info me-3" size="lg" />
                    <div className="text-start">
                      <div className="fw-bold small">Proceso Digital</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>100% en línea</div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-light rounded-4 border-2 border border-success border-opacity-10 d-flex align-items-center">
                    <CIcon icon={cilCheckCircle} className="text-success me-3" size="lg" />
                    <div className="text-start">
                      <div className="fw-bold small">Validación</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>Inmediata</div>
                    </div>
                  </div>
                </div>

                <CButton
                  className={`btn-premium px-5 py-3 ${!inscripcionesAbiertas ? 'opacity-50' : ''}`}
                  disabled={!inscripcionesAbiertas}
                  onClick={() => setMostrarFormulario(true)}
                  style={{ fontSize: '1.2rem', borderRadius: '16px' }}
                >
                  {inscripcionesAbiertas ? (
                    <>
                      <CIcon icon={cilFile} className="me-2" />
                      COMENZAR REGISTRO OFICIAL
                    </>
                  ) : (
                    "SISTEMA CERRADO POR EL MOMENTO"
                  )}
                </CButton>
              </div>

              <div className="mt-5 p-4 bg-orange-soft rounded-4 border border-primary border-opacity-10">
                <h6 className="fw-bold mb-3 d-flex align-items-center">
                  <CIcon icon={cilInfo} className="me-2 text-primary" />
                  Requisitos Previos
                </h6>
                <ul className="text-start list-unstyled small text-muted mb-0">
                  <li className="mb-2 d-flex align-items-center"><CIcon icon={cilCheckCircle} className="text-success me-2" size="sm" /> Cédula de identidad del representante y acta de nacimiento del alumno.</li>
                  <li className="mb-2 d-flex align-items-center"><CIcon icon={cilCheckCircle} className="text-success me-2" size="sm" /> Datos de salud (alergias, tipo de sangre, peso y altura actual).</li>
                  <li className="d-flex align-items-center"><CIcon icon={cilCheckCircle} className="text-success me-2" size="sm" /> Información de contacto de emergencia y datos de vivienda.</li>
                </ul>
              </div>
            </CCol>
          </div>

          <div className="text-center mt-5 pt-4 border-top">
            <small className="text-muted opacity-50">
              SECRETARÍA ACADÉMICA ENDANZA &copy; {new Date().getFullYear()}
            </small>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default InscripcionPrincipal;