import React, { useState } from "react";
import {
  CCard, CCardBody, CCardHeader, CCardFooter,
  CContainer, CButton, CRow, CCol,
  CAlert, CBadge, CProgress,
  CNav, CNavItem, CNavLink, CTabContent, CTabPane
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { 
  cilArrowLeft, cilCheckCircle, cilWarning,
  cilUser, cilBriefcase, cilMedicalCross,
  cilFile, cilCloudDownload
} from "@coreui/icons";

// Importar componentes de pasos
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
        // Validaciones opcionales para salud
        if (formData.alergias === "Si" && !formData.textAlergia.trim()) {
          nuevosErrores.textAlergia = "Describa las alergias";
        }
        break;
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleNextStep = () => {
    if (!validarPaso(step)) {
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    const valido = validarFormularioCompleto(formData);
    
    if (!valido.esValido) {
      setErrores(valido.errores);
      alert('Complete los campos requeridos');
      return;
    }
    
    try {
      // Generar código único
      const codigo = generarCodigoInscripcion();
      setCodigoInscripcion(codigo);
      
      // Simular envío a backend
      console.log("Enviando datos completos:", formData);
      
      // Aquí iría tu llamada API real
      // await api.inscripcion.completar({ ...formData, codigo });
      
      // Mostrar confirmación
      setInscripcionEnviada(true);
      setStep(4);
      
    } catch (error) {
      console.error("Error al enviar inscripción:", error);
      alert('Error al procesar la inscripción. Intente nuevamente.');
    }
  };

  const handleDescargarPlanilla = () => {
    generarPlanillaHTML(formData, codigoInscripcion);
  };

  const handleFinalizar = () => {
    // Resetear formulario
    Object.keys(formData).forEach(key => {
      formData[key] = "";
    });
    setStep(1);
    setInscripcionEnviada(false);
    onVolver();
  };

  const progressPercentage = (step / 4) * 100;

  return (
    <CContainer className="py-4">
      <CCard className="shadow-sm inscripcion-card">
        <CCardHeader className="bg-success text-white">
          <CRow className="align-items-center">
            <CCol md={8}>
              <h4 className="mb-1">
                <CIcon icon={step === 4 ? cilCheckCircle : cilFile} className="me-2" />
                {step === 4 ? 'CONFIRMACIÓN DE INSCRIPCIÓN' : 'INSCRIPCIÓN COMPLETA'}
              </h4>
              <p className="mb-0">
                {step === 4 ? 'Revisión y descarga de planilla' : 'Período Académico 2024'}
              </p>
            </CCol>
            <CCol md={4} className="text-end">
              <CBadge color="light" className="text-dark fs-6">
                Paso {step} de 4
              </CBadge>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody>
          {/* Barra de progreso */}
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-2">
              <small>Progreso</small>
              <small>{progressPercentage.toFixed(0)}%</small>
            </div>
            <CProgress 
              value={progressPercentage} 
              color={step === 4 ? "success" : "primary"} 
              className="inscripcion-progress" 
            />
          </div>

          {/* Navegación por pasos */}
          {step !== 4 && (
            <CNav variant="tabs" className="mb-4 inscripcion-tabs">
              <CNavItem>
                <CNavLink active={step === 1} className="inscripcion-tab">
                  <CIcon icon={cilUser} className="me-1" />
                  Estudiante
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={step === 2} className="inscripcion-tab">
                  <CIcon icon={cilBriefcase} className="me-1" />
                  Representante
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={step === 3} className="inscripcion-tab">
                  <CIcon icon={cilMedicalCross} className="me-1" />
                  Salud
                </CNavLink>
              </CNavItem>
            </CNav>
          )}

          {Object.keys(errores).length > 0 && step !== 4 && (
            <CAlert color="danger" className="mb-4">
              <h6>Corrija los siguientes errores:</h6>
              <ul className="mb-0">
                {Object.entries(errores).map(([campo, mensaje]) => (
                  <li key={campo}>{mensaje}</li>
                ))}
              </ul>
            </CAlert>
          )}

          <CTabContent className="inscripcion-content">
            {/* PASO 1: Datos del estudiante */}
            <CTabPane visible={step === 1}>
              <DatosEstudiante 
                formData={formData} 
                onChange={handleChange}
                errores={errores}
                mode="completo"
              />
            </CTabPane>

            {/* PASO 2: Datos del representante */}
            <CTabPane visible={step === 2}>
              <DatosRepresentante 
                formData={formData} 
                onChange={handleChange}
                errores={errores}
              />
            </CTabPane>

            {/* PASO 3: Datos de salud */}
            <CTabPane visible={step === 3}>
              <DatosSalud 
                formData={formData} 
                onChange={handleChange}
                errores={errores}
              />
            </CTabPane>

            {/* PASO 4: Confirmación */}
            <CTabPane visible={step === 4}>
              <ConfirmacionInscripcion 
                formData={formData}
                codigoInscripcion={codigoInscripcion}
                onDescargar={handleDescargarPlanilla}
              />
            </CTabPane>
          </CTabContent>

          {/* Botones de navegación */}
          <div className="d-flex justify-content-between mt-4 inscripcion-buttons">
            <div>
              {step > 1 && step < 4 ? (
                <CButton color="secondary" onClick={handlePrevStep} className="inscripcion-btn">
                  <CIcon icon={cilArrowLeft} className="me-1" />
                  Atrás
                </CButton>
              ) : step === 1 ? (
                <CButton color="secondary" onClick={onVolver} className="inscripcion-btn">
                  <CIcon icon={cilArrowLeft} className="me-1" />
                  Cancelar
                </CButton>
              ) : null}
            </div>
            
            <div>
              {step < 3 ? (
                <CButton color="primary" onClick={handleNextStep} className="inscripcion-btn">
                  Continuar
                </CButton>
              ) : step === 3 ? (
                <CButton color="success" onClick={handleSubmit} className="inscripcion-btn">
                  <CIcon icon={cilCheckCircle} className="me-1" />
                  Enviar Inscripción
                </CButton>
              ) : step === 4 ? (
                <CButton color="success" onClick={handleFinalizar} className="inscripcion-btn">
                  <CIcon icon={cilCheckCircle} className="me-1" />
                  Finalizar
                </CButton>
              ) : null}
            </div>
          </div>
        </CCardBody>

        <CCardFooter className="text-center inscripcion-footer">
          <small className="text-muted">
            <CIcon icon={cilWarning} className="me-1" />
            {step === 4 
              ? `Código de inscripción: ${codigoInscripcion} - ${new Date().toLocaleDateString('es-ES')}`
              : 'Complete todos los campos obligatorios (*)'}
          </small>
        </CCardFooter>
      </CCard>
    </CContainer>
  );
};

export default InscripcionCompletaForm;