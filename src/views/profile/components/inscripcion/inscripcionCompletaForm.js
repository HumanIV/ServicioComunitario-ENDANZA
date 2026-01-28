import React, { useState } from "react";
import {
  CCard, CCardBody, CCardHeader, CCardFooter,
  CContainer, CButton, CRow, CCol,
  CAlert, CBadge, CProgress, CProgressBar,
  CNav, CNavItem, CNavLink, CTabContent, CTabPane
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilArrowLeft, cilCheckCircle, cilWarning,
  cilUser, cilBriefcase, cilMedicalCross,
  cilFile, cilArrowRight
} from "@coreui/icons";

import DatosEstudiante from "./steps/datosEstudiante";
import DatosRepresentante from "./steps/datosRepresentante";
import DatosSalud from "./steps/datosSalud";
import ConfirmacionInscripcion from "./steps/confirmacionInscripcion";
import { generarCodigoInscripcion, validarFormularioCompleto } from "./utils/validators";
import { generarPlanillaHTML } from "./utils/pdfGenerator";
import "./styles/inscripcion.css";

const InscripcionCompletaForm = ({ onVolver }) => {
  const [step, setStep] = useState(1);
  const [inscripcionEnviada, setInscripcionEnviada] = useState(false);
  const [codigoInscripcion, setCodigoInscripcion] = useState("");
  const [errores, setErrores] = useState({});

  const [formData, setFormData] = useState({
    // Datos del estudiante
    nombres: "",
    apellidos: "",
    fecha_nac: "",
    direccion_Habitacion: "",
    Telefono_Celular: "",
    grado: "",
    especialidad: "",
    convivencia: "",
    escuela: "",
    Grado_Escuela: "",
    Seguro_Escolar: "",
    nombre_Seguro: "",

    // Datos del representante
    nombres_Representante: "",
    apellidos_Representante: "",
    telefono_Rep: "",
    telefonofijo_Rep: "",
    profesion: "",
    trabajo: "",
    direccion_Trabajo: "",

    // Datos de salud
    peso: "",
    talla: "",
    edad: "",
    intolerancia: "",
    textIntolerancia: "",
    sintomasFrecuentes: "",
    operaciones: "",
    textOperaciones: "",
    medicacion: "",
    textMedicacion: "",
    control_Hormonal: "",
    textcontrolHormonal: "",
    alergias: "",
    textAlergia: "",
    nacimiento: "",
    antecedentesFamiliares: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Limpiar error del campo al editar
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: null }));
    }
  };

  const validarPaso = (pasoActual) => {
    const nuevosErrores = {};

    switch (pasoActual) {
      case 1:
        if (!formData.nombres.trim()) nuevosErrores.nombres = "Nombres requeridos";
        if (!formData.apellidos.trim()) nuevosErrores.apellidos = "Apellidos requeridos";
        if (!formData.grado) nuevosErrores.grado = "Seleccione un grado";
        if (!formData.Telefono_Celular.trim()) nuevosErrores.Telefono_Celular = "Teléfono requerido";
        break;

      case 2:
        if (!formData.nombres_Representante.trim()) nuevosErrores.nombres_Representante = "Nombre del representante requerido";
        if (!formData.telefono_Rep.trim()) nuevosErrores.telefono_Rep = "Teléfono del representante requerido";
        break;

      case 3:
        // Validaciones opcionales
        if (formData.alergias === "Si" && !formData.textAlergia.trim()) {
          nuevosErrores.textAlergia = "Describa las alergias";
        }
        break;
      default:
        break;
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleNextStep = () => {
    if (!validarPaso(step)) {
      window.scrollTo(0, 0); // Ir al inicio para ver los errores
      return;
    }
    setStep(step + 1);
    window.scrollTo(0, 0); // Ir al inicio del siguiente paso
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    const valido = validarFormularioCompleto(formData);

    if (!valido.esValido) {
      setErrores(valido.errores);
      return;
    }

    try {
      const codigo = generarCodigoInscripcion();
      setCodigoInscripcion(codigo);
      setInscripcionEnviada(true);
      setStep(4);

    } catch (error) {
      console.error("Error al enviar inscripción:", error);
    }
  };

  const handleDescargarPlanilla = () => {
    generarPlanillaHTML(formData, codigoInscripcion);
  };

  const handleFinalizar = () => {
    Object.keys(formData).forEach(key => {
      formData[key] = "";
    });
    setStep(1);
    setInscripcionEnviada(false);
    onVolver();
  };

  const progressPercentage = step * 25;

  return (
    <CContainer className="py-4 animate__animated animate__fadeIn">
      <CCard className="premium-card border-0 shadow-lg overflow-hidden">
        <CCardHeader className="bg-orange-soft border-0 py-4 px-4 px-md-5">
          <CRow className="align-items-center">
            <CCol md={8}>
              <div className="d-flex align-items-center">
                <div className="p-3 bg-primary rounded-circle me-3 shadow-sm d-none d-md-block">
                  <CIcon icon={step === 4 ? cilCheckCircle : cilFile} size="xl" className="text-white" />
                </div>
                <div>
                  <h4 className="mb-0 fw-bold text-dark text-uppercase ls-1">
                    {step === 4 ? 'CONFIRMACIÓN EXITOSA' : 'REGISTRO DE ASPIRANTE'}
                  </h4>
                  <p className="mb-0 text-muted small fw-bold text-uppercase ls-1">
                    {step === 4 ? 'Proceso finalizado correctamente' : 'CICLO ACADÉMICO 2024-2025'}
                  </p>
                </div>
              </div>
            </CCol>
            <CCol md={4} className="text-end">
              <CBadge className="rounded-pill px-4 py-2 bg-white text-primary fw-bold shadow-sm border border-light">
                PASO {step} / 4
              </CBadge>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody className="p-4 p-md-5">
          {/* Barra de progreso Premium */}
          <div className="mb-5">
            <div className="d-flex justify-content-between mb-2">
              <small className="text-muted fw-bold text-uppercase ls-1" style={{ fontSize: '0.65rem' }}>AVANCE DEL FORMULARIO</small>
              <small className="text-primary fw-bold">{progressPercentage.toFixed(0)}%</small>
            </div>
            <CProgress className="rounded-pill bg-light" height={8}>
              <CProgressBar
                value={progressPercentage}
                className="rounded-pill"
                style={{ backgroundColor: 'var(--primary-600)' }}
              />
            </CProgress>
          </div>

          {/* Navegación por Tabs tipo Pills */}
          {step !== 4 && (
            <CNav variant="pills" className="mb-5 bg-light p-2 rounded-pill d-inline-flex w-100 justify-content-between">
              <CNavItem className="flex-fill text-center">
                <CNavLink
                  active={step === 1}
                  className={`rounded-pill fw-bold py-2 ${step === 1 ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                  disabled
                >
                  <CIcon icon={cilUser} className="me-2" />
                  ESTUDIANTE
                </CNavLink>
              </CNavItem>
              <CNavItem className="flex-fill text-center">
                <CNavLink
                  active={step === 2}
                  className={`rounded-pill fw-bold py-2 ${step === 2 ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                  disabled
                >
                  <CIcon icon={cilBriefcase} className="me-2" />
                  REPRESENTANTE
                </CNavLink>
              </CNavItem>
              <CNavItem className="flex-fill text-center">
                <CNavLink
                  active={step === 3}
                  className={`rounded-pill fw-bold py-2 ${step === 3 ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                  disabled
                >
                  <CIcon icon={cilMedicalCross} className="me-2" />
                  SALUD
                </CNavLink>
              </CNavItem>
            </CNav>
          )}

          {Object.keys(errores).length > 0 && step !== 4 && (
            <CAlert color="danger" className="mb-4 border-0 shadow-sm rounded-4 animate__animated animate__shakeX">
              <div className="d-flex align-items-center mb-2">
                <CIcon icon={cilWarning} className="me-2" size="lg" />
                <h6 className="mb-0 fw-bold">Atención Requerida</h6>
              </div>
              <ul className="mb-0 ps-3 small">
                {Object.entries(errores).map(([campo, mensaje]) => (
                  <li key={campo}>{mensaje}</li>
                ))}
              </ul>
            </CAlert>
          )}

          <div className="step-content mb-5">
            <CTabContent>
              <CTabPane visible={step === 1}><DatosEstudiante formData={formData} onChange={handleChange} errores={errores} mode="completo" /></CTabPane>
              <CTabPane visible={step === 2}><DatosRepresentante formData={formData} onChange={handleChange} errores={errores} /></CTabPane>
              <CTabPane visible={step === 3}><DatosSalud formData={formData} onChange={handleChange} errores={errores} /></CTabPane>
              <CTabPane visible={step === 4}><ConfirmacionInscripcion formData={formData} codigoInscripcion={codigoInscripcion} onDescargar={handleDescargarPlanilla} /></CTabPane>
            </CTabContent>
          </div>

          <div className="d-flex justify-content-between align-items-center pt-4 border-top border-light">
            <div>
              {step > 1 && step < 4 ? (
                <CButton
                  color="light"
                  onClick={handlePrevStep}
                  className="rounded-pill px-4 border-2 fw-bold text-muted hover-orange"
                >
                  <CIcon icon={cilArrowLeft} className="me-2" /> ATRÁS
                </CButton>
              ) : step === 1 ? (
                <CButton
                  color="light"
                  onClick={onVolver}
                  className="rounded-pill px-4 border-2 fw-bold text-dark hover-danger"
                >
                  CANCELAR PROCESO
                </CButton>
              ) : null}
            </div>

            <div>
              {step < 3 ? (
                <CButton
                  className="btn-premium rounded-pill px-5 shadow-sm"
                  onClick={handleNextStep}
                >
                  SIGUIENTE PASO <CIcon icon={cilArrowRight} className="ms-2" />
                </CButton>
              ) : step === 3 ? (
                <CButton
                  color="success"
                  className="rounded-pill px-5 text-white fw-bold shadow-sm bg-success border-0"
                  onClick={handleSubmit}
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  <CIcon icon={cilCheckCircle} className="me-2" /> FINALIZAR INSCRIPCIÓN
                </CButton>
              ) : step === 4 ? (
                <CButton
                  className="btn-premium rounded-pill px-5 shadow-sm"
                  onClick={handleFinalizar}
                >
                  VOLVER AL INICIO
                </CButton>
              ) : null}
            </div>
          </div>
        </CCardBody>

        <CCardFooter className="text-center bg-light border-0 py-3">
          <small className="text-muted fw-bold text-uppercase ls-1" style={{ fontSize: '0.65rem' }}>
            {step === 4
              ? `REGISTRO OFICIAL ID: ${codigoInscripcion} • ${new Date().toLocaleDateString('es-ES')}`
              : 'TODOS LOS CAMPOS MARCADOS CON (*) SON OBLIGATORIOS'}
          </small>
        </CCardFooter>
      </CCard>

      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .hover-orange:hover {
            color: var(--primary-600) !important;
            background: var(--primary-50) !important;
            border-color: var(--primary-200) !important;
        }
        .hover-danger:hover {
            color: var(--danger) !important;
            background: #fff5f5 !important;
            border-color: var(--danger) !important;
        }
      `}</style>
    </CContainer>
  );
};

export default InscripcionCompletaForm;