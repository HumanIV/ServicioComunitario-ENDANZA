// InscripcionPrincipal.js - Versión simplificada SIN cupos
import React, { useState } from "react";
import { 
  CCard, CCardBody, CCardHeader, CButton, 
  CContainer, CAlert 
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilFile, cilEducation, cilWarning } from "@coreui/icons";
import InscripcionCompletaForm from "./components/inscripcion/inscripcionCompletaForm";
import "./components/inscripcion/styles/inscripcion.css";

const InscripcionPrincipal = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const inscripcionesAbiertas = true; // Puedes cambiar esto según necesidad

  if (mostrarFormulario) {
    return <InscripcionCompletaForm onVolver={() => setMostrarFormulario(false)} />;
  }

  return (
    <CContainer className="py-5 inscripcion-system">
      <CCard className="shadow-lg border-0">
        <CCardHeader className="bg-gradient-primary text-white text-center py-4">
          <CIcon icon={cilEducation} size="xxl" className="mb-3" />
          <h3 className="mb-1">SISTEMA DE INSCRIPCIONES ENDANZA</h3>
          <h5 className="mb-0">Escuela de Danza - Período Académico 2024</h5>
        </CCardHeader>

        <CCardBody className="p-4 p-md-5 text-center">
          <div className="mb-5">
            <CIcon 
              icon={cilFile} 
              size="3xl" 
              className={`mb-3 ${inscripcionesAbiertas ? 'text-success' : 'text-warning'}`} 
            />
            
            <h4 className="mb-3">INSCRIPCIÓN DE ALUMNOS</h4>
            <p className="text-muted mb-4">
              Complete el formulario para registrar un nuevo alumno en nuestra escuela
            </p>
          </div>

          <div className="mb-4">
            <div className="text-start mb-4">
              <div className="d-flex align-items-start mb-2">
                <CIcon icon={cilWarning} className="text-success me-2 mt-1" />
                <span>Formulario completo paso a paso</span>
              </div>
              <div className="d-flex align-items-start mb-2">
                <CIcon icon={cilWarning} className="text-success me-2 mt-1" />
                <span>Datos médicos y académicos detallados</span>
              </div>
              <div className="d-flex align-items-start mb-2">
                <CIcon icon={cilWarning} className="text-success me-2 mt-1" />
                <span>Generación de planilla oficial</span>
              </div>
              <div className="d-flex align-items-start">
                <CIcon icon={cilWarning} className="text-success me-2 mt-1" />
                <span>Confirmación inmediata con código único</span>
              </div>
            </div>

            <p className="text-muted small mb-4">
              <strong>Tiempo estimado:</strong> 10-15 minutos
            </p>
          </div>

          <div className="mt-4">
            <CButton 
              color={inscripcionesAbiertas ? "success" : "secondary"}
              size="lg"
              disabled={!inscripcionesAbiertas}
              onClick={() => setMostrarFormulario(true)}
              className="px-5 py-3"
              style={{ minWidth: '200px' }}
            >
              {inscripcionesAbiertas ? (
                <>
                  <CIcon icon={cilFile} className="me-2" />
                  INICIAR INSCRIPCIÓN
                </>
              ) : (
                "INSCRIPCIONES CERRADAS"
              )}
            </CButton>
          </div>

          <CAlert color="info" className="mt-5">
            <div className="d-flex">
              <CIcon icon={cilWarning} className="me-3 mt-1 flex-shrink-0" />
              <div>
                <h5 className="alert-heading">Información importante</h5>
                <p className="mb-0">
                  Proceso formal que incluye todos los datos necesarios. 
                  Recibirás una planilla oficial descargable inmediatamente.
                </p>
              </div>
            </div>
          </CAlert>

          <div className="text-center mt-4 pt-4 border-top">
            <small className="text-muted">
              Para asistencia o consultas, contacte a secretaría académica: 
              <strong> secretaria@endanza.edu | Tel: (0212) 123-4567</strong>
            </small>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default InscripcionPrincipal;