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
          <h1 className="fw-bold mb-1 ls-1 inscripcion-header-title">SISTEMA DE INSCRIPCIONES</h1>
          <h5 className="inscripcion-header-subtitle fw-normal">Escuela Nacional de Danza (Período 2024-2025)</h5>
        </CCardHeader>

        <CCardBody className="p-4 p-md-5">
          <div className="row justify-content-center">
            <CCol lg={12}>
              <div className="text-center mb-5">
                <p className="inscripcion-header-subtitle lead mb-5">
                  Bienvenido al portal de ingreso. A través de este sistema podrá registrar de forma oficial
                  a los nuevos talentos de nuestra institución.
                </p>

                <div className="d-grid gap-3 d-sm-flex justify-content-center mb-5">
                  <div className="px-4 py-3 inscripcion-info-pill rounded-4 border-2 border border-info border-opacity-10 d-flex align-items-center">
                    <CIcon icon={cilInfo} className="text-info me-3" size="lg" />
                    <div className="text-start">
                      <div className="fw-bold small inscripcion-pill-text">Proceso Digital</div>
                      <div className="inscripcion-pill-subtext" style={{ fontSize: '0.75rem' }}>100% en línea</div>
                    </div>
                  </div>
                  <div className="px-4 py-3 inscripcion-info-pill rounded-4 border-2 border border-success border-opacity-10 d-flex align-items-center">
                    <CIcon icon={cilCheckCircle} className="text-success me-3" size="lg" />
                    <div className="text-start">
                      <div className="fw-bold small inscripcion-pill-text">Validación</div>
                      <div className="inscripcion-pill-subtext" style={{ fontSize: '0.75rem' }}>Inmediata</div>
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
                <h6 className="fw-bold mb-3 d-flex align-items-center-custom">
                  <CIcon icon={cilInfo} className="me-2 text-primary" />
                  <span className="text-primary">Requisitos Previos</span>
                </h6>
                <ul className="text-start list-unstyled small inscripcion-pill-subtext mb-0">
                  <li className="mb-2 d-flex align-items-center"><CIcon icon={cilCheckCircle} className="text-success me-2" size="sm" /> Cédula de identidad del representante y acta de nacimiento del alumno.</li>
                  <li className="mb-2 d-flex align-items-center"><CIcon icon={cilCheckCircle} className="text-success me-2" size="sm" /> Datos de salud (alergias, tipo de sangre, peso y altura actual).</li>
                  <li className="d-flex align-items-center"><CIcon icon={cilCheckCircle} className="text-success me-2" size="sm" /> Información de contacto de emergencia y datos de vivienda.</li>
                </ul>
              </div>
            </CCol>
          </div>

          <div className="text-center mt-5 pt-4 border-top">
            <small className="inscripcion-pill-subtext opacity-50">
              SECRETARÍA ACADÉMICA ENDANZA &copy; {new Date().getFullYear()}
            </small>
          </div>
        </CCardBody>
      </CCard>
      <style>{`
        .inscripcion-header-title { color: var(--neutral-900); }
        .inscripcion-header-subtitle { color: var(--neutral-600); }
        .inscripcion-info-pill { background-color: var(--neutral-50); }
        .inscripcion-pill-text { color: var(--neutral-800); }
        .inscripcion-pill-subtext { color: var(--neutral-500); }
        .align-items-center-custom { display: flex; align-items: center; }

        [data-coreui-theme="dark"] .inscripcion-header-title { color: white; }
        [data-coreui-theme="dark"] .inscripcion-header-subtitle { color: rgba(255,255,255,0.6); }
        [data-coreui-theme="dark"] .inscripcion-info-pill { background-color: rgba(255,255,255,0.05); }
        [data-coreui-theme="dark"] .inscripcion-pill-text { color: white; }
        [data-coreui-theme="dark"] .inscripcion-pill-subtext { color: rgba(255,255,255,0.4); }
      `}</style>
    </CContainer>
  );
};

export default InscripcionPrincipal;