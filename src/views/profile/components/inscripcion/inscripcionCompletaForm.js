import React, { useState, useEffect } from "react";
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

const InscripcionCompletaForm = ({ onVolver, student }) => {
  const [step, setStep] = useState(1);
  const [inscripcionEnviada, setInscripcionEnviada] = useState(false);
  const [codigoInscripcion, setCodigoInscripcion] = useState("");
  const [errores, setErrores] = useState({});

  const [formData, setFormData] = useState({
    // Datos del estudiante
    nombres: student?.name || "",
    apellidos: student?.lastName || "",
    fecha_nac: "",
    direccion_Habitacion: "",
    Telefono_Celular: "",
    grado: student?.gradeLevel || "",
    especialidad: "",
    convivencia: "",
    escuela: "",
    Grado_Escuela: "",
    Seguro_Escolar: "",
    nombre_Seguro: "",

    // Datos de los Padres
    nombre_Madre: "",
    apellido_Madre: "",
    cedula_Madre: "",
    ocupacion_Madre: "",
    trabajo_Madre: "",
    direccion_Trabajo_Madre: "",
    telefono_Madre: "",
    nombre_Padre: "",
    apellido_Padre: "",
    cedula_Padre: "",
    ocupacion_Padre: "",
    trabajo_Padre: "",
    direccion_Trabajo_Padre: "",
    telefono_Padre: "",

    // Elección del representante
    quien_es_representante: "Madre", // Madre, Padre, Otro
    parentesco_Otro: "",

    // Datos del representante (Solo si no es Madre o Padre)
    nombres_Representante: "",
    apellidos_Representante: "",
    telefono_Rep: "",
    telefonofijo_Rep: "",
    profesion_Rep: "",
    trabajo_Rep: "",
    direccion_Trabajo_Rep: "",

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

  useEffect(() => {
    if (student) {
      setFormData(prev => ({
        ...prev,
        nombres: student.name || "",
        apellidos: student.lastName || "",
        grado: student.gradeLevel || ""
      }));
    }
  }, [student]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? age : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si cambia la fecha de nacimiento, calcular la edad automáticamente
    if (name === "fecha_nac") {
      const calculatedAge = calculateAge(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        edad: calculatedAge
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

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
                  <h4 className="mb-0 fw-bold inscripcion-header-title text-uppercase ls-1">
                    {step === 4 ? 'CONFIRMACIÓN EXITOSA' : 'REGISTRO DE ASPIRANTE'}
                  </h4>
                  <p className="mb-0 inscripcion-header-subtitle small fw-bold text-uppercase ls-1">
                    {step === 4 ? 'Proceso finalizado correctamente' : 'CICLO ACADÉMICO 2024-2025'}
                  </p>
                </div>
              </div>
            </CCol>
            <CCol md={4} className="text-end">
              <CBadge className="rounded-pill px-4 py-2 inscripcion-id-badge fw-bold shadow-sm border border-light">
                PASO {step} / 4
              </CBadge>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody className="p-4 p-md-5">
          {/* Barra de progreso Premium */}
          <div className="mb-5">
            <div className="d-flex justify-content-between mb-2">
              <small className="inscripcion-header-subtitle fw-bold text-uppercase ls-1" style={{ fontSize: '0.65rem' }}>AVANCE DEL FORMULARIO</small>
              <small className="text-primary fw-bold">{progressPercentage.toFixed(0)}%</small>
            </div>
            <CProgress className="rounded-pill bg-progress-track" height={8}>
              <CProgressBar
                value={progressPercentage}
                className="rounded-pill"
                style={{ backgroundColor: 'var(--primary-600)' }}
              />
            </CProgress>
          </div>

          {/* Navegación por Tabs tipo Pills */}
          {step !== 4 && (
            <CNav variant="pills" className="mb-5 bg-nav-pill p-2 rounded-pill d-inline-flex w-100 justify-content-between">
              <CNavItem className="flex-fill text-center">
                <CNavLink
                  active={step === 1}
                  className={`rounded-pill fw-bold py-2 ${step === 1 ? 'nav-pill-active shadow-sm' : 'nav-pill-inactive'}`}
                  disabled
                >
                  <CIcon icon={cilUser} className="me-2" />
                  ESTUDIANTE
                </CNavLink>
              </CNavItem>
              <CNavItem className="flex-fill text-center">
                <CNavLink
                  active={step === 2}
                  className={`rounded-pill fw-bold py-2 ${step === 2 ? 'nav-pill-active shadow-sm' : 'nav-pill-inactive'}`}
                  disabled
                >
                  <CIcon icon={cilBriefcase} className="me-2" />
                  REPRESENTANTE
                </CNavLink>
              </CNavItem>
              <CNavItem className="flex-fill text-center">
                <CNavLink
                  active={step === 3}
                  className={`rounded-pill fw-bold py-2 ${step === 3 ? 'nav-pill-active shadow-sm' : 'nav-pill-inactive'}`}
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

          <div className="d-flex justify-content-between align-items-center pt-4 border-top border-light-custom">
            <div>
              {step > 1 && step < 4 ? (
                <CButton
                  onClick={handlePrevStep}
                  className="rounded-pill px-4 border-2 fw-bold inscripcion-back-btn hover-orange"
                >
                  <CIcon icon={cilArrowLeft} className="me-2" /> ATRÁS
                </CButton>
              ) : step === 1 ? (
                <CButton
                  onClick={onVolver}
                  className="rounded-pill px-4 border-2 fw-bold inscripcion-cancel-btn hover-danger transition-all"
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

        <CCardFooter className="text-center inscripcion-footer border-0 py-3">
          <small className="inscripcion-footer-text fw-bold text-uppercase ls-1" style={{ fontSize: '0.65rem' }}>
            {step === 4
              ? `REGISTRO OFICIAL ID: ${codigoInscripcion} • ${new Date().toLocaleDateString('es-ES')}`
              : 'TODOS LOS CAMPOS MARCADOS CON (*) SON OBLIGATORIOS'}
          </small>
        </CCardFooter>
      </CCard>

    </CContainer>
  );
};

export default InscripcionCompletaForm;