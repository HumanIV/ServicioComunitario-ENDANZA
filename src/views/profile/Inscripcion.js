import React, { useState, useEffect } from "react";
import {
  CContainer, CRow, CCol, CSpinner
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilEducation, cilPeople, cilSchool } from "@coreui/icons";
import { listStudents } from 'src/services/students';
import WelcomeBanner from '../Inicio/components/WelcomeBanner';
import StudentSelectionCard from '../Inicio/components/StudentSelectionCard';
import InscripcionCompletaForm from "./components/inscripcion/inscripcionCompletaForm";

const InscripcionPrincipal = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const data = await listStudents();
      setChildren(data);
    } catch (error) {
      console.error("Error loading children:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInscripcion = (studentId) => {
    const student = children.find(c => c.id === studentId);
    setSelectedStudent(student);
  };

  if (selectedStudent) {
    return (
      <InscripcionCompletaForm
        onVolver={() => setSelectedStudent(null)}
        student={selectedStudent}
      />
    );
  }

  return (
    <CContainer fluid className="mt-4 pb-5 animate__animated animate__fadeIn">
      <CRow>
        <CCol>
          <WelcomeBanner
            title="Proceso de Inscripción"
            subtitle="Seleccione al estudiante que desea inscribir para el próximo ciclo escolar."
            icon={cilPeople}
            bgIcon={cilSchool}
            colorClass="warning"
          />

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