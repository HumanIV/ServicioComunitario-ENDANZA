import React, { useState, useEffect } from "react";
import {
  CCard, CCardBody, CCardHeader, CCardFooter,
  CContainer, CButton, CRow, CCol,
  CAlert, CBadge, CProgress, CProgressBar,
  CNav, CNavItem, CNavLink, CTabContent, CTabPane, CSpinner
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
import { inscribirEstudiante } from "../../../../services/inscripcionService";
import "./styles/inscripcion.css";

const InscripcionCompletaForm = ({ onVolver, student, studentsList, activeYear }) => {
  const [step, setStep] = useState(1);
  const [inscripcionEnviada, setInscripcionEnviada] = useState(false);
  const [codigoInscripcion, setCodigoInscripcion] = useState("");
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Estado inicial LIMPIO - sin teléfono de estudiante
  const [formData, setFormData] = useState({
    // Datos del estudiante
    id_estudiante: student?.id || null,
    nombres: student?.first_name || student?.name || "",
    apellidos: student?.last_name || student?.lastName || "",
    fecha_nac: student?.birth_date || "",
    direccion_Habitacion: "",
    // 👇 TELÉFONO DEL ESTUDIANTE ELIMINADO COMPLETAMENTE
    grado: student?.grade_level || student?.gradeLevel || "",
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
    quien_es_representante: "Madre",
    parentesco_Otro: "",

    // Datos del representante - INICIALMENTE VACÍOS
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
    antecedentesFamiliares: "",

    // Metadatos
    id_ano_academico: activeYear?.id || null
  });

  // Limpiar errores cuando cambias de paso
  useEffect(() => {
    setErrores({});
  }, [step]);

  // Cargar datos del estudiante
  useEffect(() => {
    if (student) {
      setFormData(prev => ({
        ...prev,
        id_estudiante: student.id,
        nombres: student.first_name || student.name || "",
        apellidos: student.last_name || student.lastName || "",
        fecha_nac: student.birth_date || "",
        grado: student.grade_level || student.gradeLevel || "",
        // NO cargamos datos del representante aquí
      }));
    }
  }, [student]);

  useEffect(() => {
    // Actualizar año académico si cambia
    if (activeYear) {
      setFormData(prev => ({ ...prev, id_ano_academico: activeYear.id }));
    }
  }, [activeYear]);

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

    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: null }));
    }
  };

  const validarPaso = (pasoActual) => {
    const nuevosErrores = {};

    switch (pasoActual) {
      case 1:
        if (!formData.nombres?.trim()) nuevosErrores.nombres = "Nombres requeridos";
        if (!formData.apellidos?.trim()) nuevosErrores.apellidos = "Apellidos requeridos";
        if (!formData.fecha_nac) nuevosErrores.fecha_nac = "Fecha de nacimiento requerida";
        if (!formData.grado) nuevosErrores.grado = "Seleccione un grado";
        // 👇 TELÉFONO DEL ESTUDIANTE ELIMINADO DE VALIDACIÓN
        break;

      case 2:
        if (!formData.quien_es_representante) {
          nuevosErrores.quien_es_representante = "Debe seleccionar quién será el representante";
        } else {
          // Validar según la selección
          if (formData.quien_es_representante === 'Madre') {
            // Solo validamos que tenga al menos un teléfono de contacto
            if (!formData.telefono_Madre?.trim()) {
              nuevosErrores.telefono_Madre = "Debe proporcionar un teléfono de contacto para la madre";
            }
            // NO validamos campos de representante (son opcionales)
          }
          else if (formData.quien_es_representante === 'Padre') {
            // Solo validamos que tenga al menos un teléfono de contacto
            if (!formData.telefono_Padre?.trim()) {
              nuevosErrores.telefono_Padre = "Debe proporcionar un teléfono de contacto para el padre";
            }
            // NO validamos campos de representante (son opcionales)
          }
          else if (formData.quien_es_representante === 'Otro') {
            // Validar TODOS los campos del representante (son obligatorios)
            if (!formData.nombres_Representante?.trim()) nuevosErrores.nombres_Representante = "Nombre del representante requerido";
            if (!formData.apellidos_Representante?.trim()) nuevosErrores.apellidos_Representante = "Apellidos del representante requerido";
            if (!formData.parentesco_Otro?.trim()) nuevosErrores.parentesco_Otro = "Parentesco requerido";
            if (!formData.telefono_Rep?.trim()) nuevosErrores.telefono_Rep = "Teléfono del representante requerido";
          }
        }
        break;

      case 3:
        if (formData.alergias === "Si" && !formData.textAlergia?.trim()) {
          nuevosErrores.textAlergia = "Describa las alergias";
        }
        if (formData.intolerancia === "Si" && !formData.textIntolerancia?.trim()) {
          nuevosErrores.textIntolerancia = "Describa las intolerancias";
        }
        if (formData.medicacion === "Si" && !formData.textMedicacion?.trim()) {
          nuevosErrores.textMedicacion = "Describa la medicación";
        }
        if (formData.operaciones === "Si" && !formData.textOperaciones?.trim()) {
          nuevosErrores.textOperaciones = "Describa las operaciones";
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
      window.scrollTo(0, 0);
      return;
    }
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    // Crear una copia del formData sin el campo Telefono_Celular (por si acaso)
    const { Telefono_Celular, ...datosParaEnviar } = formData;
    
    const valido = validarFormularioCompleto(datosParaEnviar);

    if (!valido.esValido) {
      setErrores(valido.errores);
      window.scrollTo(0, 0);
      return;
    }

    // Verificar que tenemos el ID del estudiante
    if (!formData.id_estudiante) {
      alert("Error: No se ha identificado al estudiante.");
      return;
    }

    // Limpiar formato de teléfonos (quitar guiones, espacios, etc.)
    const datosLimpios = {
      ...datosParaEnviar,
      telefono_Madre: formData.telefono_Madre?.replace(/[^\d]/g, '').slice(0, 11) || null,
      telefono_Padre: formData.telefono_Padre?.replace(/[^\d]/g, '').slice(0, 11) || null,
      telefono_Rep: formData.telefono_Rep?.replace(/[^\d]/g, '').slice(0, 11) || null,
      telefonofijo_Rep: formData.telefonofijo_Rep?.replace(/[^\d]/g, '').slice(0, 11) || null,
    };

    setEnviando(true);
    
    try {
      const resultado = await inscribirEstudiante({
        id_estudiante: formData.id_estudiante,
        id_ano_academico: formData.id_ano_academico,
        datos_completos: datosLimpios
      });
      
      const codigo = resultado.codigo || generarCodigoInscripcion();
      setCodigoInscripcion(codigo);
      setInscripcionEnviada(true);
      setStep(4);

    } catch (error) {
      console.error("Error al enviar inscripción:", error);
      alert("Ocurrió un error al procesar la inscripción. Por favor, intente nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  const handleDescargarPlanilla = () => {
    generarPlanillaHTML(formData, codigoInscripcion);
  };

  const handleFinalizar = () => {
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
                    {step === 4 
                      ? 'Proceso finalizado correctamente' 
                      : `ESTUDIANTE: ${formData.nombres} ${formData.apellidos}`}
                  </p>
                  {activeYear && step !== 4 && (
                    <small className="d-block mt-1 text-white-50">
                      Año Académico: {activeYear.name}
                    </small>
                  )}
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
          {/* Barra de progreso */}
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

          {/* Navegación por Tabs */}
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
              <CTabPane visible={step === 1}>
                <DatosEstudiante 
                  formData={formData} 
                  onChange={handleChange} 
                  errores={errores} 
                  mode="completo"
                />
              </CTabPane>
              <CTabPane visible={step === 2}>
                <DatosRepresentante 
                  formData={formData} 
                  onChange={handleChange} 
                  errores={errores} 
                  setErrores={setErrores}
                />
              </CTabPane>
              <CTabPane visible={step === 3}>
                <DatosSalud 
                  formData={formData} 
                  onChange={handleChange} 
                  errores={errores} 
                />
              </CTabPane>
              <CTabPane visible={step === 4}>
                <ConfirmacionInscripcion 
                  formData={formData} 
                  codigoInscripcion={codigoInscripcion} 
                  onDescargar={handleDescargarPlanilla} 
                />
              </CTabPane>
            </CTabContent>
          </div>

          <div className="d-flex justify-content-between align-items-center pt-4 border-top border-light-custom">
            <div>
              {step > 1 && step < 4 ? (
                <CButton
                  onClick={handlePrevStep}
                  className="rounded-pill px-4 border-2 fw-bold inscripcion-back-btn hover-orange"
                  disabled={enviando}
                >
                  <CIcon icon={cilArrowLeft} className="me-2" /> ATRÁS
                </CButton>
              ) : step === 1 ? (
                <CButton
                  onClick={onVolver}
                  className="rounded-pill px-4 border-2 fw-bold inscripcion-cancel-btn hover-danger transition-all"
                  disabled={enviando}
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
                  disabled={enviando}
                >
                  SIGUIENTE PASO <CIcon icon={cilArrowRight} className="ms-2" />
                </CButton>
              ) : step === 3 ? (
                <CButton
                  color="success"
                  className="rounded-pill px-5 text-white fw-bold shadow-sm bg-success border-0"
                  onClick={handleSubmit}
                  disabled={enviando}
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  {enviando ? (
                    <>
                      <CSpinner component="span" size="sm" className="me-2" />
                      PROCESANDO...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilCheckCircle} className="me-2" /> FINALIZAR INSCRIPCIÓN
                    </>
                  )}
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
              : `INSCRIPCIÓN PARA: ${formData.nombres} ${formData.apellidos} • TODOS LOS CAMPOS MARCADOS CON (*) SON OBLIGATORIOS`}
          </small>
        </CCardFooter>
      </CCard>
    </CContainer>
  );
};

export default InscripcionCompletaForm;