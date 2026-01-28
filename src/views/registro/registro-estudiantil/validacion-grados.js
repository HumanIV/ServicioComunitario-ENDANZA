"use client"

import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CContainer,
  CAlert,
  CSpinner,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilEducation, cilPlus, cilCheckCircle, cilInfo, cilWarning } from "@coreui/icons"

export default function ValidacionGradosEnhanced({ student, tipoInscripcion, onHistoryCompleted, onBack }) {
  const [loading, setLoading] = useState(false)
  const [hasPreviousStudies, setHasPreviousStudies] = useState(null)

  const handleContinue = () => {
    console.log("Continuando con el proceso de inscripción")
    onHistoryCompleted(false)
  }

  const getTitle = () => {
    switch (tipoInscripcion) {
      case "nuevo":
        return "Validación de Estudios Previos - Nuevo Ingreso"
      case "reintegro":
        return "Historial Académico - Reintegro"
      default:
        return "Validación de Estudios Previos"
    }
  }

  const getDescription = () => {
    switch (tipoInscripcion) {
      case "nuevo":
        return "¿El estudiante ha cursado años escolares anteriormente en otra institución?"
      case "reintegro":
        return "Registre los años escolares que cursó el estudiante fuera de la institución"
      default:
        return "Información sobre estudios previos"
    }
  }

  return (
    <div className="min-vh-100 bg-body-tertiary py-4">
      <CContainer>
        <div className="mb-4">
          <h2 className="text-center text-body-emphasis">{getTitle()}</h2>
          <p className="text-center text-body-secondary">{getDescription()}</p>
        </div>

        <CCard className="shadow">
          <CCardHeader className="bg-primary text-white">
            <h4 className="mb-0">
              <CIcon icon={cilEducation} className="me-2" />
              Estudiante: {student.name} {student.lastName}
            </h4>
          </CCardHeader>
          <CCardBody>
            {/* Para nuevo ingreso: pregunta si tiene estudios previos */}
            {tipoInscripcion === "nuevo" && hasPreviousStudies === null && (
              <div className="text-center">
                <h5 className="mb-4">{getDescription()}</h5>
                <div className="d-flex justify-content-center gap-3">
                  <CButton color="success" size="lg" onClick={() => setHasPreviousStudies(true)}>
                    <CIcon icon={cilCheckCircle} className="me-2" />
                    Sí, tiene estudios previos
                  </CButton>
                  <CButton color="info" size="lg" onClick={() => setHasPreviousStudies(false)}>
                    <CIcon icon={cilInfo} className="me-2" />
                    No, no tiene estudios previos
                  </CButton>
                </div>
              </div>
            )}

            {/* Sin estudios previos */}
            {tipoInscripcion === "nuevo" && hasPreviousStudies === false && (
              <div className="text-center">
                <CAlert color="info">
                  <CIcon icon={cilInfo} className="me-2" />
                  <h5>Sin Estudios Previos</h5>
                  <p>El estudiante no tiene estudios previos registrados. Puede continuar con la inscripción.</p>
                </CAlert>
                <div className="d-flex justify-content-between">
                  <CButton color="secondary" onClick={onBack}>
                    Volver
                  </CButton>
                  <CButton color="primary" onClick={handleContinue}>
                    Continuar con la Inscripción
                  </CButton>
                </div>
              </div>
            )}

            {/* Con estudios previos */}
            {((tipoInscripcion === "nuevo" && hasPreviousStudies === true) || tipoInscripcion === "reintegro") && (
              <>
                <CAlert color="warning">
                  <CIcon icon={cilWarning} className="me-2" />
                  <h5>Registro de Historial Académico</h5>
                  <p>
                    {tipoInscripcion === "reintegro"
                      ? "Esta funcionalidad estará disponible próximamente para registrar el historial académico completo."
                      : "Esta funcionalidad estará disponible próximamente para registrar los estudios previos."}
                  </p>
                </CAlert>

                <div className="d-flex justify-content-between">
                  <CButton color="secondary" onClick={onBack}>
                    Volver
                  </CButton>
                  <div>
                    {tipoInscripcion === "nuevo" && (
                      <CButton color="warning" className="me-2" onClick={() => setHasPreviousStudies(null)}>
                        Cambiar Respuesta
                      </CButton>
                    )}
                    <CButton color="primary" onClick={handleContinue}>
                      {loading ? (
                        <>
                          <CSpinner size="sm" className="me-2" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <CIcon icon={cilCheckCircle} className="me-2" />
                          Continuar con la Inscripción
                        </>
                      )}
                    </CButton>
                  </div>
                </div>
              </>
            )}
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}
