"use client"

import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormCheck,
  CButton,
  CRow,
  CCol,
  CContainer,
  CAlert,
  CSpinner,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilSchool, cilCheckCircle, cilWarning, cilInfo } from "@coreui/icons"

export default function InscripcionPeriodo({
  student,
  tipoInscripcion,
  hasAcademicHistory,
  onInscriptionCompleted,
  onBack,
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedSection, setSelectedSection] = useState("")

  // Mock data
  const mockGrades = [
    { id: 1, name: "1er Grado" },
    { id: 2, name: "2do Grado" },
    { id: 3, name: "3er Grado" },
    { id: 4, name: "4to Grado" },
    { id: 5, name: "5to Grado" },
    { id: 6, name: "6to Grado" },
  ]

  const mockSections = [
    { id: 1, name: "Sección A" },
    { id: 2, name: "Sección B" },
    { id: 3, name: "Sección C" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setSuccess("Inscripción procesada exitosamente")
      setTimeout(() => {
        onInscriptionCompleted()
      }, 1500)
    }, 2000)
  }

  return (
    <div className="min-vh-100 bg-body-tertiary py-4">
      <CContainer>
        <div className="mb-4">
          <h2 className="text-center text-body-emphasis">Inscripción al Período Académico</h2>
          <p className="text-center text-body-secondary">
            Complete los datos para inscribir al estudiante en el período actual
          </p>
        </div>

        {success && (
          <CAlert color="success" dismissible onClose={() => setSuccess(null)}>
            <CIcon icon={cilCheckCircle} className="me-2" />
            {success}
          </CAlert>
        )}

        {error && (
          <CAlert color="danger" dismissible onClose={() => setError(null)}>
            <CIcon icon={cilWarning} className="me-2" />
            {error}
          </CAlert>
        )}

        <CCard className="shadow">
          <CCardHeader className="bg-primary text-white">
            <h4 className="mb-0">
              <CIcon icon={cilSchool} className="me-2" />
              Estudiante: {student.name} {student.lastName}
            </h4>
          </CCardHeader>
          <CCardBody>
            <CAlert color="info" className="mb-4">
              <CIcon icon={cilInfo} className="me-2" />
              <strong>Tipo de Inscripción:</strong> {tipoInscripcion}
              {hasAcademicHistory && " - Con historial académico registrado"}
            </CAlert>

            <form onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel className="fw-semibold">Grado a Inscribir</CFormLabel>
                  <CFormSelect
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar grado...</option>
                    {mockGrades.map((grade) => (
                      <option key={grade.id} value={grade.id}>
                        {grade.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel className="fw-semibold">Sección</CFormLabel>
                  <CFormSelect
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    required
                    disabled={!selectedGrade}
                  >
                    <option value="">Seleccionar sección...</option>
                    {mockSections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>

              <CAlert color="warning">
                <CIcon icon={cilWarning} className="me-2" />
                <p className="mb-0">
                  <strong>Nota:</strong> Esta es una versión simplificada del formulario de inscripción.
                  Los campos adicionales estarán disponibles próximamente.
                </p>
              </CAlert>

              <div className="d-flex justify-content-between mt-4">
                <CButton color="secondary" onClick={onBack} disabled={loading}>
                  Volver
                </CButton>
                <CButton
                  type="submit"
                  color="primary"
                  disabled={loading || !selectedGrade || !selectedSection}
                >
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Procesando inscripción...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilCheckCircle} className="me-2" />
                      Completar Inscripción
                    </>
                  )}
                </CButton>
              </div>
            </form>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}
