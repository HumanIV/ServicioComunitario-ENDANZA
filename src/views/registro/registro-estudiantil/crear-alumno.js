"use client"

import { useState } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
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
  CInputGroup,
  CInputGroupText,
  CFormTextarea,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilUser, cilSearch, cilUserPlus, cilPhone, cilHome, cilCalendar, cilCheckCircle } from "@coreui/icons"
import CedulaInput from "../../../../components/cedula-input"

export default function CrearAlumnoEnhanced({ tipoInscripcion, onStudentCreated, onBack }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  
  // Estados para representante
  const [representanteCi, setRepresentanteCi] = useState("")
  const [representanteFound, setRepresentanteFound] = useState(null)
  const [representanteData, setRepresentanteData] = useState({
    ci: "",
    name: "",
    lastName: "",
    telephoneNumber: "",
    email: "",
    maritalStat: "",
    profesion: "",
    birthday: "",
    telephoneHouse: "",
    roomAdress: "",
    workPlace: "",
    jobNumber: "",
  })

  // Estados para estudiante
  const [studentData, setStudentData] = useState({
    ci: "",
    name: "",
    lastName: "",
    sex: "M",
    birthday: "",
    placeBirth: "",
    parishID: null,
    quantityBrothers: 0,
    representativeID: "",
    motherName: "",
    motherCi: "",
    motherTelephone: "",
    fatherName: "",
    fatherCi: "",
    fatherTelephone: "",
    livesMother: false,
    livesFather: false,
    livesBoth: true,
    livesRepresentative: false,
    rolRopresentative: "",
  })

  return (
    <div className="min-vh-100 bg-dark py-4">
      <CContainer>
        <div className="mb-4">
          <h2 className="text-center text-white">Crear Alumno - Nuevo Ingreso</h2>
        </div>

        {success && (
          <CAlert color="success" dismissible onClose={() => setSuccess(null)}>
            <CIcon icon={cilCheckCircle} className="me-2" />
            {success}
          </CAlert>
        )}

        {step === 1 && (
          <CCard>
            <CCardHeader>
              <h4>
                <CIcon icon={cilUser} className="me-2" />
                Paso 1: Buscar o Crear Representante
              </h4>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-4">
                <CCol md={8}>
                  <CFormLabel>Cédula del Representante</CFormLabel>
                  <CedulaInput value={representanteCi} onChange={setRepresentanteCi} placeholder="12345678" />
                </CCol>
                <CCol md={4} className="d-flex align-items-end">
                  <CButton color="info" onClick={() => {}} disabled={loading} className="w-100">
                    {loading ? <CSpinner size="sm" /> : <CIcon icon={cilSearch} />}
                    {loading ? " Buscando..." : " Buscar"}
                  </CButton>
                </CCol>
              </CRow>

              {/* Sección de representante encontrado - Siempre visible para ver la UI */}
              <CAlert color="success">
                <h5>Representante Encontrado (Ejemplo):</h5>
                <p>
                  <strong>Nombre:</strong> María Rodríguez
                </p>
                <p>
                  <strong>Teléfono:</strong> 0414-1234567
                </p>
                <p>
                  <strong>Email:</strong> maria.rodriguez@email.com
                </p>
                <div className="mt-3">
                  <CButton color="success" onClick={() => setStep(2)}>
                    Continuar con este Representante
                  </CButton>
                </div>
              </CAlert>

              {/* Sección para crear nuevo representante - También visible */}
              <CCard className="mt-4">
                <CCardHeader>
                  <h5>Crear Nuevo Representante</h5>
                </CCardHeader>
                <CCardBody>
                  <CForm>
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel>Nombres *</CFormLabel>
                        <CFormInput
                          type="text"
                          value="Juan"
                          onChange={() => {}}
                          required
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>Apellidos *</CFormLabel>
                        <CFormInput
                          type="text"
                          value="Pérez"
                          onChange={() => {}}
                          required
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel>Teléfono Celular *</CFormLabel>
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilPhone} />
                          </CInputGroupText>
                          <CFormInput
                            type="tel"
                            value="0414-1234567"
                            onChange={() => {}}
                            placeholder="0414-1234567"
                            required
                          />
                        </CInputGroup>
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>Teléfono de Casa</CFormLabel>
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilPhone} />
                          </CInputGroupText>
                          <CFormInput
                            type="tel"
                            value="0212-7654321"
                            onChange={() => {}}
                            placeholder="0212-1234567"
                          />
                        </CInputGroup>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel>Email</CFormLabel>
                        <CFormInput
                          type="email"
                          value="juan.perez@email.com"
                          onChange={() => {}}
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>Fecha de Nacimiento</CFormLabel>
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilCalendar} />
                          </CInputGroupText>
                          <CFormInput
                            type="date"
                            value="1980-05-15"
                            onChange={() => {}}
                          />
                        </CInputGroup>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel>Estado Civil</CFormLabel>
                        <CFormSelect
                          value="casado"
                          onChange={() => {}}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="soltero">Soltero(a)</option>
                          <option value="casado">Casado(a)</option>
                          <option value="divorciado">Divorciado(a)</option>
                          <option value="viudo">Viudo(a)</option>
                          <option value="concubinato">Concubinato</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>Profesión</CFormLabel>
                        <CFormInput
                          type="text"
                          value="Ingeniero"
                          onChange={() => {}}
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel>Lugar de Trabajo</CFormLabel>
                        <CFormInput
                          type="text"
                          value="Empresa XYZ"
                          onChange={() => {}}
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>Teléfono del Trabajo</CFormLabel>
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilPhone} />
                          </CInputGroupText>
                          <CFormInput
                            type="tel"
                            value="0212-1234567"
                            onChange={() => {}}
                            placeholder="0212-1234567"
                          />
                        </CInputGroup>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CFormLabel>Dirección de Habitación</CFormLabel>
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilHome} />
                          </CInputGroupText>
                          <CFormTextarea
                            value="Av. Principal, Edificio Ejemplo, Piso 3, Apartamento 3-A, Caracas"
                            onChange={() => {}}
                            rows={2}
                            placeholder="Dirección completa de residencia"
                          />
                        </CInputGroup>
                      </CCol>
                    </CRow>

                    <div className="d-flex justify-content-between">
                      <CButton color="secondary" onClick={() => {}}>
                        Volver
                      </CButton>
                      <CButton color="success" onClick={() => setStep(2)}>
                        <CIcon icon={cilUserPlus} />
                        Crear Representante
                      </CButton>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardBody>
          </CCard>
        )}

        {step === 2 && (
          <CCard>
            <CCardHeader>
              <h4>
                <CIcon icon={cilUserPlus} className="me-2" />
                Paso 2: Datos del Estudiante
              </h4>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel>Cédula del Estudiante *</CFormLabel>
                    <CedulaInput
                      value="12345678"
                      onChange={() => {}}
                      placeholder="12345678"
                      required
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel>Nombres *</CFormLabel>
                    <CFormInput
                      type="text"
                      value="Carlos"
                      onChange={() => {}}
                      required
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel>Apellidos *</CFormLabel>
                    <CFormInput
                      type="text"
                      value="Pérez Rodríguez"
                      onChange={() => {}}
                      required
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={3}>
                    <CFormLabel>Sexo *</CFormLabel>
                    <CFormSelect
                      value="M"
                      onChange={() => {}}
                      required
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel>Fecha de Nacimiento *</CFormLabel>
                    <CFormInput
                      type="date"
                      value="2010-03-15"
                      onChange={() => {}}
                      required
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel>Lugar de Nacimiento</CFormLabel>
                    <CFormInput
                      type="text"
                      value="Caracas, Venezuela"
                      onChange={() => {}}
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel>Cantidad de Hermanos</CFormLabel>
                    <CFormInput
                      type="number"
                      min="0"
                      value="2"
                      onChange={() => {}}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel>Nombre de la Madre</CFormLabel>
                    <CFormInput
                      type="text"
                      value="María Rodríguez"
                      onChange={() => {}}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel>Cédula de la Madre</CFormLabel>
                    <CedulaInput
                      value="87654321"
                      onChange={() => {}}
                      placeholder="12345678"
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel>Teléfono de la Madre</CFormLabel>
                    <CFormInput
                      type="tel"
                      value="0414-7654321"
                      onChange={() => {}}
                      placeholder="0414-1234567"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel>Nombre del Padre</CFormLabel>
                    <CFormInput
                      type="text"
                      value="Juan Pérez"
                      onChange={() => {}}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel>Cédula del Padre</CFormLabel>
                    <CedulaInput
                      value="12345678"
                      onChange={() => {}}
                      placeholder="12345678"
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel>Teléfono del Padre</CFormLabel>
                    <CFormInput
                      type="tel"
                      value="0412-1234567"
                      onChange={() => {}}
                      placeholder="0414-1234567"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel>Situación de Convivencia</CFormLabel>
                    <div className="d-flex gap-4 mt-2">
                      <CFormCheck
                        type="radio"
                        name="convivencia"
                        id="livesBoth"
                        checked={true}
                        onChange={() => {}}
                        label="Vive con ambos padres"
                      />
                      <CFormCheck
                        type="radio"
                        name="convivencia"
                        id="livesMother"
                        checked={false}
                        onChange={() => {}}
                        label="Vive solo con la madre"
                      />
                      <CFormCheck
                        type="radio"
                        name="convivencia"
                        id="livesFather"
                        checked={false}
                        onChange={() => {}}
                        label="Vive solo con el padre"
                      />
                      <CFormCheck
                        type="radio"
                        name="convivencia"
                        id="livesRepresentative"
                        checked={false}
                        onChange={() => {}}
                        label="Vive con el representante"
                      />
                    </div>
                  </CCol>
                </CRow>

                <div className="d-flex justify-content-between">
                  <CButton color="secondary" onClick={() => setStep(1)}>
                    Volver
                  </CButton>
                  <CButton color="success" onClick={() => {}}>
                    <CIcon icon={cilUserPlus} />
                    Crear Estudiante
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        )}
      </CContainer>
    </div>
  )
}