"use client"

import { useState } from "react"
import TipoInscripcion from "./registro-estudiantil/tipo-inscripcion"
import BuscarEstudiante from "./registro-estudiantil/buscar-estudiante"
import CrearAlumno from "./registro-estudiantil/crear-alumno"
import ValidacionGrados from "./registro-estudiantil/validacion-grados"
import InscripcionPeriodo from "./registro-estudiantil/inscripcion-periodo"
import { CAlert, CContainer, CSpinner } from "@coreui/react"

export default function RegistroEstudiantilMain() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  return (
    <div className="min-vh-100 bg-dark">
      {loading && (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <CSpinner color="primary" />
        </div>
      )}

      {error && (
        <CContainer className="py-4">
          <CAlert color="danger" dismissible onClose={() => setError(null)}>
            {error}
          </CAlert>
        </CContainer>
      )}

      {!loading && !error && (
        <>
          {/* Paso 1: Selección de tipo de inscripción */}
          <TipoInscripcion onSelectTipo={() => {}} />

          {/* Paso 2: Buscar estudiante (para reintegro y regular) */}
          <BuscarEstudiante
            tipoInscripcion="regular"
            onStudentFound={() => {}}
            onBack={() => {}}
          />

          {/* Paso alternativo 2: Crear alumno (para nuevo ingreso) */}
          <CrearAlumno
            tipoInscripcion="nuevo"
            onStudentCreated={() => {}}
            onBack={() => {}}
          />

          {/* Paso 3: Validación de grados (para nuevo y reintegro) */}
          <ValidacionGrados
            student={{ name: "Ejemplo", lastName: "Estudiante" }}
            tipoInscripcion="nuevo"
            onHistoryCompleted={() => {}}
            onBack={() => {}}
          />

          {/* Paso 4: Inscripción en período */}
          <InscripcionPeriodo
            student={{ name: "Ejemplo", lastName: "Estudiante" }}
            tipoInscripcion="regular"
            hasAcademicHistory={true}
            onInscriptionCompleted={() => {}}
            onBack={() => {}}
          />

          {/* Paso 5: Completado */}
          <div className="min-vh-100 bg-dark py-4">
            <CContainer>
              <div className="text-center py-5">
                <CAlert color="success" className="mb-4">
                  <h2 className="alert-heading text-white">¡Inscripción Completada Exitosamente!</h2>
                  <hr />
                  <p className="mb-0 text-white">
                    El estudiante{" "}
                    <strong>
                      Ejemplo Estudiante
                    </strong>{" "}
                    ha sido inscrito correctamente en el período académico actual.
                  </p>
                </CAlert>

                <div className="mt-4">
                  <button className="btn btn-primary btn-lg me-3" onClick={() => {}}>
                    Inscribir Otro Estudiante
                  </button>
                  <button
                    className="btn btn-outline-light btn-lg"
                    onClick={() => (window.location.href = "/matricula")}
                  >
                    Ver Matrícula
                  </button>
                </div>
              </div>
            </CContainer>
          </div>
        </>
      )}
    </div>
  )
}