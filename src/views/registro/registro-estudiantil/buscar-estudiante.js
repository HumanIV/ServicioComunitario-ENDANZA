"use client"

import { useState } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CContainer,
  CAlert,
  CSpinner,
  CBadge,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilSearch, cilUser, cilPhone, cilHome, cilWarning, cilCheckCircle } from "@coreui/icons"

export default function BuscarEstudianteEnhanced({ tipoInscripcion, onStudentFound, onBack }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [studentCi, setStudentCi] = useState("")
  const [studentFound, setStudentFound] = useState(null)

  const getStatusColor = (statusId) => {
    switch (statusId) {
      case "1":
        return "success"
      case "2":
        return "info"
      case "3":
        return "warning"
      case "4":
        return "secondary"
      case "5":
        return "danger"
      case "6":
        return "dark"
      case "7":
        return "danger"
      default:
        return "secondary"
    }
  }

  const getTipoTitle = () => {
    switch (tipoInscripcion) {
      case "reintegro":
        return "Reintegro"
      case "regular":
        return "Estudiante Regular"
      default:
        return ""
    }
  }

  const getStatusMessage = () => {
    return "Este es un mensaje de estado de ejemplo para mostrar la UI."
  }

  const canContinue = () => {
    return true // Siempre habilitado para ver la UI
  }

  return (
    <div className="min-vh-100 bg-body-tertiary py-4">
      <CContainer>
        <div className="mb-4">
          <h2 className="text-center text-body-emphasis">Buscar Estudiante - {getTipoTitle()}</h2>
          <p className="text-center text-body-secondary">
            {tipoInscripcion === "reintegro"
              ? "Busque al estudiante que desea reintegrar al sistema"
              : "Busque al estudiante regular para su inscripción"}
          </p>
        </div>

        {success && (
          <CAlert color="success" dismissible onClose={() => setSuccess(null)}>
            <CIcon icon={cilCheckCircle} className="me-2" />
            {success}
          </CAlert>
        )}

        <CCard className="shadow">
          <CCardHeader className="bg-primary text-white">
            <h4 className="mb-0">
              <CIcon icon={cilSearch} className="me-2" />
              Búsqueda de Estudiante
            </h4>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-4">
              <CCol md={8}>
                <CFormLabel className="fw-semibold">Cédula del Estudiante</CFormLabel>
                <CedulaInput value={studentCi} onChange={setStudentCi} placeholder="12345678" />
              </CCol>
              <CCol md={4} className="d-flex align-items-end">
                <CButton color="info" size="lg" onClick={() => { }} disabled={loading} className="w-100">
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilSearch} className="me-2" />
                      Buscar
                    </>
                  )}
                </CButton>
              </CCol>
            </CRow>

            {/* Tarjeta de estudiante encontrado (siempre visible para ver la UI) */}
            <CCard className="mt-4 border-success">
              <CCardHeader className="bg-success text-white">
                <h5 className="mb-0">
                  <CIcon icon={cilUser} className="me-2" />
                  Estudiante Encontrado (Ejemplo)
                </h5>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol md={6}>
                    <h6 className="text-primary mb-3">Datos Personales</h6>
                    <div className="mb-2">
                      <strong>Nombre Completo:</strong> Juan Pérez
                    </div>
                    <div className="mb-2">
                      <strong>Cédula:</strong> 12345678
                    </div>
                    <div className="mb-2">
                      <strong>Sexo:</strong> Masculino
                    </div>
                    <div className="mb-2">
                      <strong>Fecha de Nacimiento:</strong> 15/03/2010
                    </div>
                    <div className="mb-2">
                      <strong>Lugar de Nacimiento:</strong> Caracas, Venezuela
                    </div>
                    <div className="mb-2">
                      <strong>Estado:</strong>{" "}
                      <CBadge color="success" className="ms-1">
                        Activo
                      </CBadge>
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <h6 className="text-primary mb-3">Información Familiar</h6>
                    <div className="mb-2">
                      <strong>Representante:</strong> María Pérez
                    </div>
                    <div className="mb-2">
                      <strong>Teléfono Representante:</strong>
                      <CIcon icon={cilPhone} size="sm" className="ms-2 me-1" />
                      0412-1234567
                    </div>
                    <div className="mb-2">
                      <strong>Email Representante:</strong> maria.perez@email.com
                    </div>
                    <div className="mb-2">
                      <strong>Madre:</strong> Ana Rodríguez
                    </div>
                    <div className="mb-2">
                      <strong>Padre:</strong> Carlos Pérez
                    </div>
                    <div className="mb-2">
                      <strong>Cantidad de Hermanos:</strong> 2
                    </div>
                  </CCol>
                </CRow>

                <CRow className="mt-3">
                  <CCol md={12}>
                    <h6 className="text-primary">Dirección</h6>
                    <div>
                      <CIcon icon={cilHome} size="sm" className="me-2" />
                      Av. Principal, Edificio Ejemplo, Piso 3, Apartamento 3-A, Caracas
                    </div>
                  </CCol>
                </CRow>

                <CAlert color="success" className="mt-4">
                  <CIcon icon={cilCheckCircle} className="me-2" />
                  <strong>Disponible:</strong> Este estudiante está disponible para inscripción regular.
                </CAlert>

                <div className="mt-4 d-flex justify-content-between">
                  <CButton color="secondary" onClick={() => { }}>
                    Volver
                  </CButton>
                  <CButton color="success" size="lg" onClick={() => { }}>
                    {tipoInscripcion === "reintegro" ? "Continuar con Reintegro" : "Continuar con Inscripción"}
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}