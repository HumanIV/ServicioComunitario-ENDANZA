import React, { useState, useEffect } from "react";
import {
  CContainer, CRow, CCol, CSpinner, CAlert
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilEducation, cilPeople, cilSchool, cilWarning } from "@coreui/icons";
import { getMyStudents } from 'src/services/studentsService';
// 👇 IMPORTAR DESDE TU SERVICIO EXISTENTE
// Cambiar la importación
import { getActiveYearPublic, getEnrollmentPeriodPublic } from 'src/services/configService'; // 👈 CAMBIADO



import WelcomeBanner from '../Inicio/components/WelcomeBanner';
import StudentSelectionCard from '../Inicio/components/StudentSelectionCard';
import InscripcionCompletaForm from "./components/inscripcion/inscripcionCompletaForm";

// Función helper para verificar el período (puede estar aquí o en un utils)
const checkEnrollmentAllowed = (period, activeYear) => {
  if (!period) {
    return {
      allowed: false,
      message: "No hay configuración de período de inscripción."
    };
  }
  
  // Si no está activo según la BD
  if (!period.activo) {
    return {
      allowed: false,
      message: "El período de inscripciones no está habilitado actualmente."
    };
  }
  
  // Verificar fechas (si existen)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (period.fechaInicio && period.fechaFin) {
    const startDate = new Date(period.fechaInicio);
    const endDate = new Date(period.fechaFin);
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    if (today < startDate) {
      return {
        allowed: false,
        message: `Las inscripciones iniciarán el ${startDate.toLocaleDateString('es-ES')}.`
      };
    }
    
    if (today > endDate) {
      return {
        allowed: false,
        message: `El período de inscripciones finalizó el ${endDate.toLocaleDateString('es-ES')}.`
      };
    }
  }
  
  // Todo OK
  return {
    allowed: true,
    message: "Período de inscripción habilitado."
  };
};

const InscripcionPrincipal = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Estados para control de período
  const [enrollmentAllowed, setEnrollmentAllowed] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState("");
  const [checkingPeriod, setCheckingPeriod] = useState(true);
  const [activeYear, setActiveYear] = useState(null);
  const [enrollmentPeriod, setEnrollmentPeriod] = useState(null);

  useEffect(() => {
    checkEnrollmentPeriod();
  }, []);

 
// En la función checkEnrollmentPeriod:
const checkEnrollmentPeriod = async () => {
  setCheckingPeriod(true);
  try {
    // 1. Obtener año activo
    const year = await getActiveYearPublic();
    setActiveYear(year);
    
    if (!year) {
      setEnrollmentAllowed(false);
      setEnrollmentMessage("No hay un año académico activo configurado.");
      setCheckingPeriod(false);
      return;
    }
    
    // 2. Obtener período de inscripción para ese año (VERSIÓN PÚBLICA)
    const period = await getEnrollmentPeriodPublic(year.id); // 👈 CAMBIADO
    setEnrollmentPeriod(period);
    
    // 3. Verificar si se permite inscripción
    const result = checkEnrollmentAllowed(period, year);
    
    setEnrollmentAllowed(result.allowed);
    setEnrollmentMessage(result.message);
    
    // 4. Si está permitido, cargar estudiantes
    if (result.allowed) {
      fetchChildren();
    } else {
      setLoading(false);
    }
    
  } catch (error) {
    console.error("Error verificando período:", error);
    setEnrollmentAllowed(false);
    setEnrollmentMessage("Error al verificar el período de inscripción.");
  } finally {
    setCheckingPeriod(false);
  }
};



  const fetchChildren = async () => {
    setLoading(true);
    try {
      const data = await getMyStudents();
      console.log("📥 Estudiantes del representante para inscripción:", data);
      setChildren(data);
    } catch (error) {
      console.error("Error loading children:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInscripcion = (studentId) => {
    // Verificar nuevamente por si acaso
    if (!enrollmentAllowed) {
      alert("El período de inscripciones no está habilitado.");
      return;
    }
    
    const student = children.find(c => c.id === studentId);
    setSelectedStudent(student);
  };

  // Si se seleccionó un estudiante, mostrar el formulario
  if (selectedStudent) {
    return (
      <InscripcionCompletaForm
        onVolver={() => setSelectedStudent(null)}
        student={selectedStudent}
        studentsList={children}
        activeYear={activeYear}
      />
    );
  }

  // Mostrar pantalla de carga mientras verificamos período
  if (checkingPeriod) {
    return (
      <CContainer fluid className="mt-4 pb-5 text-center py-5">
        <CSpinner color="warning" />
        <p className="mt-3 text-muted">Verificando período de inscripción...</p>
      </CContainer>
    );
  }

  return (
    <CContainer fluid className="mt-4 pb-5 animate__animated animate__fadeIn">
      <CRow>
        <CCol>
          <WelcomeBanner
            title="Proceso de Inscripción"
            subtitle={enrollmentAllowed 
              ? "Seleccione al estudiante que desea inscribir para el próximo ciclo escolar."
              : "Las inscripciones no están disponibles actualmente."}
            icon={cilPeople}
            bgIcon={cilSchool}
            colorClass="warning"
          />

          {/* Mensaje sobre el período de inscripción */}
          <CAlert 
            color={enrollmentAllowed ? "success" : "warning"} 
            className="mb-4 border-0 shadow-sm"
          >
            <div className="d-flex align-items-center">
              <CIcon icon={enrollmentAllowed ? cilSchool : cilWarning} className="me-2" size="lg" />
              <div>
                <strong>{enrollmentAllowed ? "✅ Período Activo" : "⏸️ Período No Habilitado"}</strong>
                <p className="mb-0 small">{enrollmentMessage}</p>
                {activeYear && (
                  <small className="d-block mt-1 opacity-75">
                    Año Académico: {activeYear.name}
                  </small>
                )}
                {enrollmentPeriod && enrollmentPeriod.fechaInicio && enrollmentPeriod.fechaFin && (
                  <small className="d-block mt-1 opacity-75">
                    Período: {new Date(enrollmentPeriod.fechaInicio).toLocaleDateString('es-ES')} - {new Date(enrollmentPeriod.fechaFin).toLocaleDateString('es-ES')}
                  </small>
                )}
              </div>
            </div>
          </CAlert>

          {enrollmentAllowed && (
            <>
              <h4 className="mb-4 fw-bold section-title text-uppercase ls-1 d-flex align-items-center">
                <CIcon icon={cilSchool} className="me-2 text-warning" />
                Estudiantes Disponibles
              </h4>

              <CRow className="g-4">
                {loading ? (
                  <CCol className="text-center py-5">
                    <CSpinner color="warning" />
                    <p className="mt-3 text-muted">Cargando estudiantes...</p>
                  </CCol>
                ) : children.length > 0 ? (
                  children.map((child) => (
                    <CCol key={child.id} lg={6}>
                      <StudentSelectionCard
                        child={child}
                        colorClass="warning"
                        buttonText="INICIAR INSCRIPCIÓN"
                        onClick={handleStartInscripcion}
                      />
                    </CCol>
                  ))
                ) : (
                  <CCol className="text-center py-5">
                    <div className="p-4 bg-orange-soft rounded-circle d-inline-flex mb-4">
                      <CIcon icon={cilEducation} size="4xl" className="text-warning" />
                    </div>
                    <h4 className="fw-bold">No se encontraron estudiantes</h4>
                    <p className="text-muted">Por favor, contacte a secretaría si no visualiza a sus representados.</p>
                  </CCol>
                )}
              </CRow>
            </>
          )}

          {!enrollmentAllowed && !loading && (
            <div className="text-center py-5">
              <div className="p-4 bg-warning bg-opacity-10 rounded-circle d-inline-flex mb-4">
                <CIcon icon={cilWarning} size="4xl" className="text-warning" />
              </div>
              <h4 className="fw-bold">Inscripciones Cerradas</h4>
              <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>
                {enrollmentMessage}
                {activeYear && (
                  <br />
                )}
                {activeYear && (
                  <small className="d-block mt-2">
                    Las inscripciones se habilitarán cuando el administrador configure el período.
                  </small>
                )}
              </p>
            </div>
          )}
        </CCol>
      </CRow>

      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .section-title { color: var(--neutral-800); }
        [data-coreui-theme="dark"] .section-title { color: white; }
      `}</style>
    </CContainer>
  );
};

export default InscripcionPrincipal;