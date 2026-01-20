import React, { useState } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CContainer,
  CButton,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CAlert,
  CBadge,
  CProgress,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { 
  cilArrowLeft,
  cilCheckCircle,
  cilWarning,
  cilUser,
  cilBriefcase,
  cilMedicalCross,
  cilFile,
  cilCloudDownload
} from "@coreui/icons"

const InscripcionForm = ({ onCancelar }) => {
  const [step, setStep] = useState(1)
  const [inscripcionEnviada, setInscripcionEnviada] = useState(false)
  const [codigoInscripcion, setCodigoInscripcion] = useState("")
  
  // Estado del formulario
  const [formData, setFormData] = useState({
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

    nombres_Representante: "",
    apellidos_Representante: "",
    telefono_Rep: "",
    telefonofijo_Rep: "",
    profesion: "",
    trabajo: "",
    direccion_Trabajo: "",

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
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleNextStep = () => {
    if (step === 1 && (!formData.nombres || !formData.apellidos)) {
      alert('Complete los datos del estudiante')
      return
    }
    if (step === 2 && (!formData.nombres_Representante || !formData.telefono_Rep)) {
      alert('Complete los datos del representante')
      return
    }
    setStep(step + 1)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    if (!formData.nombres || !formData.nombres_Representante) {
      alert('Complete los datos requeridos')
      return
    }
    
    // Generar código de inscripción único
    const codigo = `END-${Date.now().toString().slice(-6)}`
    setCodigoInscripcion(codigo)
    
    // Aquí iría tu lógica para guardar la inscripción en backend
    console.log("Datos enviados:", formData)
    
    // Mostrar pantalla de confirmación
    setInscripcionEnviada(true)
    setStep(4)
  }

  const handleFinalizar = () => {
    // Limpia el formulario y vuelve
    setFormData({
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
      nombres_Representante: "",
      apellidos_Representante: "",
      telefono_Rep: "",
      telefonofijo_Rep: "",
      profesion: "",
      trabajo: "",
      direccion_Trabajo: "",
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
    })
    setStep(1)
    setInscripcionEnviada(false)
    onCancelar()
  }

  const handleDescargarPlanilla = () => {
    // Crear contenido HTML para la planilla
    const contenido = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Planilla de Inscripción - ${formData.nombres} ${formData.apellidos}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; }
          .section h3 { margin-top: 0; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
          .info-item { margin: 5px 0; }
          .label { font-weight: bold; color: #2c3e50; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
          .codigo { text-align: center; font-size: 18px; font-weight: bold; color: #e74c3c; margin: 20px 0; padding: 10px; background: #f8f9fa; border: 1px dashed #ddd; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ESCUELA DE DANZA ENDANZA</h1>
          <h2>PLANILLA DE INSCRIPCIÓN</h2>
          <p><strong>Período Académico 2024</strong></p>
        </div>
        
        <div class="codigo">
          CÓDIGO DE INSCRIPCIÓN: ${codigoInscripcion}<br>
          Fecha: ${new Date().toLocaleDateString('es-ES')}
        </div>
        
        <div class="section">
          <h3>📋 DATOS DEL ESTUDIANTE</h3>
          <div class="info-item"><span class="label">Nombre completo:</span> ${formData.nombres} ${formData.apellidos}</div>
          <div class="info-item"><span class="label">Fecha de nacimiento:</span> ${formData.fecha_nac || 'No especificado'}</div>
          <div class="info-item"><span class="label">Edad:</span> ${formData.edad || 'No especificado'}</div>
          <div class="info-item"><span class="label">Teléfono:</span> ${formData.Telefono_Celular || 'No especificado'}</div>
          <div class="info-item"><span class="label">Dirección:</span> ${formData.direccion_Habitacion || 'No especificado'}</div>
          <div class="info-item"><span class="label">Grado:</span> ${formData.grado || 'No especificado'}</div>
          <div class="info-item"><span class="label">Especialidad:</span> ${formData.especialidad || 'No especificado'}</div>
          <div class="info-item"><span class="label">Convivencia:</span> ${formData.convivencia || 'No especificado'}</div>
          <div class="info-item"><span class="label">Escuela/Grado:</span> ${formData.escuela || 'No especificado'} / ${formData.Grado_Escuela || 'No especificado'}</div>
        </div>
        
        <div class="section">
          <h3>👨‍👩‍👧‍👦 DATOS DEL REPRESENTANTE</h3>
          <div class="info-item"><span class="label">Nombre completo:</span> ${formData.nombres_Representante} ${formData.apellidos_Representante}</div>
          <div class="info-item"><span class="label">Teléfono móvil:</span> ${formData.telefono_Rep || 'No especificado'}</div>
          <div class="info-item"><span class="label">Teléfono fijo:</span> ${formData.telefonofijo_Rep || 'No especificado'}</div>
          <div class="info-item"><span class="label">Profesión:</span> ${formData.profesion || 'No especificado'}</div>
          <div class="info-item"><span class="label">Trabajo:</span> ${formData.trabajo || 'No especificado'}</div>
          <div class="info-item"><span class="label">Dirección trabajo:</span> ${formData.direccion_Trabajo || 'No especificado'}</div>
        </div>
        
        <div class="section">
          <h3>🏥 DATOS DE SALUD</h3>
          <div class="info-item"><span class="label">Peso/Talla:</span> ${formData.peso || 'No especificado'} kg / ${formData.talla || 'No especificado'} cm</div>
          <div class="info-item"><span class="label">Alergias:</span> ${formData.alergias === 'Si' ? 'Sí' : 'No'} ${formData.textAlergia ? ' - ' + formData.textAlergia : ''}</div>
          <div class="info-item"><span class="label">Antecedentes familiares:</span> ${formData.antecedentesFamiliares || 'No especificados'}</div>
          <div class="info-item"><span class="label">Observaciones médicas:</span> ${formData.sintomasFrecuentes || 'No especificadas'}</div>
        </div>
        
        <div class="footer">
          <p>Documento generado automáticamente el ${new Date().toLocaleString('es-ES')}</p>
          <p>Conserve este documento como comprobante de inscripción</p>
          <p>Escuela de Danza Endanza • contacto@endanza.edu • www.endanza.edu</p>
        </div>
      </body>
      </html>
    `

    // Crear blob y descargar
    const blob = new Blob([contenido], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `planilla-inscripcion-${formData.nombres.toLowerCase().replace(/\s+/g, '-')}-${codigoInscripcion}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    alert('📄 Planilla descargada correctamente')
  }

  // Calcular progreso
  const progressPercentage = (step / 4) * 100

  return (
    <CContainer className="py-4">
      <CCard className="shadow-sm">
        <CCardHeader className="bg-primary text-white">
          <CRow className="align-items-center">
            <CCol md={8}>
              <h4 className="mb-1">
                <CIcon icon={step === 4 ? cilCheckCircle : cilFile} className="me-2" />
                {step === 4 ? 'CONFIRMACIÓN DE INSCRIPCIÓN' : 'FORMULARIO DE INSCRIPCIÓN'}
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
            <CProgress value={progressPercentage} color={step === 4 ? "success" : "primary"} style={{ height: '10px' }} />
          </div>

          {/* Navegación por pasos */}
          {step !== 4 && (
            <CNav variant="tabs" className="mb-4">
              <CNavItem>
                <CNavLink active={step === 1}>
                  <CIcon icon={cilUser} className="me-1" />
                  Estudiante
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={step === 2}>
                  <CIcon icon={cilBriefcase} className="me-1" />
                  Representante
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={step === 3}>
                  <CIcon icon={cilMedicalCross} className="me-1" />
                  Salud
                </CNavLink>
              </CNavItem>
            </CNav>
          )}

          <CTabContent className="mt-3">
            {/* PASO 1: Datos del estudiante */}
            <CTabPane visible={step === 1}>
              <h5 className="mb-3">
                <CIcon icon={cilUser} className="me-2" />
                Datos del Estudiante
              </h5>
              
              <CForm>
                <CRow>
                  <CCol md={6} className="mb-3">
                    <CFormInput 
                      label="Nombres *" 
                      name="nombres" 
                      value={formData.nombres} 
                      onChange={handleChange}
                      placeholder="Ej: María José"
                      required
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormInput 
                      label="Apellidos *" 
                      name="apellidos" 
                      value={formData.apellidos} 
                      onChange={handleChange}
                      placeholder="Ej: Rodríguez Pérez"
                      required
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={4} className="mb-3">
                    <CFormInput 
                      type="date" 
                      label="Fecha de nacimiento" 
                      name="fecha_nac" 
                      value={formData.fecha_nac} 
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md={4} className="mb-3">
                    <CFormInput 
                      label="Edad" 
                      name="edad" 
                      value={formData.edad} 
                      onChange={handleChange}
                      placeholder="Ej: 12"
                    />
                  </CCol>
                  <CCol md={4} className="mb-3">
                    <CFormInput 
                      label="Teléfono celular" 
                      name="Telefono_Celular" 
                      value={formData.Telefono_Celular} 
                      onChange={handleChange}
                      placeholder="Ej: 0412-1234567"
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={8} className="mb-3">
                    <CFormInput 
                      label="Dirección" 
                      name="direccion_Habitacion" 
                      value={formData.direccion_Habitacion} 
                      onChange={handleChange}
                      placeholder="Av. Principal #123"
                    />
                  </CCol>
                  <CCol md={4} className="mb-3">
                    <CFormSelect 
                      label="Grado" 
                      name="grado" 
                      value={formData.grado} 
                      onChange={handleChange}
                    >
                      <option value="">Seleccione…</option>
                      <option value="1ro">1ro - Iniciación</option>
                      <option value="2do">2do - Básico</option>
                      <option value="3ro">3ro - Intermedio</option>
                      <option value="4to">4to - Avanzado</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={6} className="mb-3">
                    <CFormInput 
                      label="Especialidad" 
                      name="especialidad" 
                      value={formData.especialidad} 
                      onChange={handleChange}
                      placeholder="Ej: Ballet Clásico"
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormInput 
                      label="Convivencia" 
                      name="convivencia" 
                      value={formData.convivencia} 
                      onChange={handleChange}
                      placeholder="Ej: Con padres"
                    />
                  </CCol>
                </CRow>
              </CForm>
            </CTabPane>

            {/* PASO 2: Datos del representante */}
            <CTabPane visible={step === 2}>
              <h5 className="mb-3">
                <CIcon icon={cilBriefcase} className="me-2" />
                Datos del Representante
              </h5>

              <CForm>
                <CRow>
                  <CCol md={6} className="mb-3">
                    <CFormInput 
                      label="Nombres *" 
                      name="nombres_Representante" 
                      value={formData.nombres_Representante} 
                      onChange={handleChange}
                      placeholder="Ej: Carlos Antonio"
                      required
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormInput 
                      label="Apellidos" 
                      name="apellidos_Representante" 
                      value={formData.apellidos_Representante} 
                      onChange={handleChange}
                      placeholder="Ej: López Martínez"
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={4} className="mb-3">
                    <CFormInput 
                      label="Teléfono móvil *" 
                      name="telefono_Rep" 
                      value={formData.telefono_Rep} 
                      onChange={handleChange}
                      placeholder="Ej: 0414-7654321"
                      required
                    />
                  </CCol>
                  <CCol md={4} className="mb-3">
                    <CFormInput 
                      label="Teléfono fijo" 
                      name="telefonofijo_Rep" 
                      value={formData.telefonofijo_Rep} 
                      onChange={handleChange}
                      placeholder="Ej: 0212-1234567"
                    />
                  </CCol>
                  <CCol md={4} className="mb-3">
                    <CFormInput 
                      label="Profesión" 
                      name="profesion" 
                      value={formData.profesion} 
                      onChange={handleChange}
                      placeholder="Ej: Ingeniero"
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={6} className="mb-3">
                    <CFormInput 
                      label="Lugar de trabajo" 
                      name="trabajo" 
                      value={formData.trabajo} 
                      onChange={handleChange}
                      placeholder="Ej: Empresa ABC"
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormInput 
                      label="Dirección trabajo" 
                      name="direccion_Trabajo" 
                      value={formData.direccion_Trabajo} 
                      onChange={handleChange}
                      placeholder="Centro Comercial XYZ"
                    />
                  </CCol>
                </CRow>
              </CForm>
            </CTabPane>

            {/* PASO 3: Datos de salud */}
            <CTabPane visible={step === 3}>
              <h5 className="mb-3">
                <CIcon icon={cilMedicalCross} className="me-2" />
                Datos de Salud
              </h5>
              
              <CAlert color="info" className="mb-4">
                <CIcon icon={cilWarning} className="me-2" />
                Complete solo si aplica. Esta información es confidencial.
              </CAlert>

              <CForm>
                <CRow>
                  <CCol md={4} className="mb-3">
                    <CFormInput 
                      label="Peso (kg)" 
                      name="peso" 
                      value={formData.peso} 
                      onChange={handleChange}
                      placeholder="Ej: 45"
                    />
                  </CCol>
                  <CCol md={4} className="mb-3">
                    <CFormInput 
                      label="Talla (cm)" 
                      name="talla" 
                      value={formData.talla} 
                      onChange={handleChange}
                      placeholder="Ej: 150"
                    />
                  </CCol>
                  <CCol md={4} className="mb-3">
                    <CFormSelect 
                      label="¿Tiene alergias?" 
                      name="alergias" 
                      value={formData.alergias} 
                      onChange={handleChange}
                    >
                      <option value="">Seleccione</option>
                      <option value="Si">Sí</option>
                      <option value="No">No</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={6} className="mb-3">
                    <CFormTextarea 
                      label="Describa alergias" 
                      name="textAlergia" 
                      value={formData.textAlergia} 
                      onChange={handleChange}
                      rows={2}
                      placeholder="Si tiene alergias, describa cuáles"
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormTextarea 
                      label="Antecedentes familiares" 
                      name="antecedentesFamiliares" 
                      value={formData.antecedentesFamiliares} 
                      onChange={handleChange}
                      rows={2}
                      placeholder="Enfermedades en la familia"
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={12}>
                    <CFormTextarea 
                      label="Observaciones médicas" 
                      name="sintomasFrecuentes" 
                      value={formData.sintomasFrecuentes} 
                      onChange={handleChange}
                      rows={3}
                      placeholder="Otra información médica relevante"
                    />
                  </CCol>
                </CRow>
              </CForm>
            </CTabPane>

            {/* PASO 4: Confirmación y descarga */}
            <CTabPane visible={step === 4}>
              <div className="text-center mb-4">
                <CIcon icon={cilCheckCircle} size="3xl" className="text-success mb-3" />
                <h3 className="text-success mb-3">¡INSCRIPCIÓN COMPLETADA!</h3>
                <CBadge color="success" className="fs-5 px-4 py-2 mb-3">
                  CÓDIGO: {codigoInscripcion}
                </CBadge>
                <p className="text-muted">
                  Su inscripción ha sido registrada exitosamente
                </p>
              </div>

              <CAlert color="success" className="mb-4">
                <h5 className="alert-heading">
                  <CIcon icon={cilWarning} className="me-2" />
                  Revise sus datos antes de descargar
                </h5>
                <p className="mb-0">
                  Descargue la planilla de inscripción y consérvela como comprobante.
                </p>
              </CAlert>

              <div className="border rounded p-4 mb-4">
                <h5 className="mb-3">📋 Resumen de la inscripción:</h5>
                
                <CRow>
                  <CCol md={6}>
                    <h6 className="text-primary">Estudiante:</h6>
                    <ul className="mb-3">
                      <li><strong>Nombre:</strong> {formData.nombres} {formData.apellidos}</li>
                      <li><strong>Grado:</strong> {formData.grado || 'No especificado'}</li>
                      <li><strong>Especialidad:</strong> {formData.especialidad || 'No especificado'}</li>
                      <li><strong>Teléfono:</strong> {formData.Telefono_Celular || 'No especificado'}</li>
                    </ul>
                  </CCol>
                  
                  <CCol md={6}>
                    <h6 className="text-primary">Representante:</h6>
                    <ul className="mb-3">
                      <li><strong>Nombre:</strong> {formData.nombres_Representante} {formData.apellidos_Representante}</li>
                      <li><strong>Teléfono:</strong> {formData.telefono_Rep || 'No especificado'}</li>
                      <li><strong>Profesión:</strong> {formData.profesion || 'No especificado'}</li>
                    </ul>
                  </CCol>
                </CRow>
                
                <div className="mt-3">
                  <h6 className="text-primary">Información adicional:</h6>
                  <ul className="mb-0">
                    <li><strong>Fecha de registro:</strong> {new Date().toLocaleDateString('es-ES')}</li>
                    <li><strong>Código único:</strong> {codigoInscripcion}</li>
                    <li><strong>Estado:</strong> <CBadge color="success">REGISTRADO</CBadge></li>
                  </ul>
                </div>
              </div>

              <div className="text-center py-3">
                <CButton 
                  color="primary" 
                  size="lg"
                  onClick={handleDescargarPlanilla}
                  className="px-5 py-3 mb-3"
                >
                  <CIcon icon={cilCloudDownload} className="me-2" />
                  DESCARGAR PLANILLA DE INSCRIPCIÓN
                </CButton>
                
                <div className="mt-2">
                  <small className="text-muted">
                    Descargue un archivo HTML con todos los datos para imprimir o guardar
                  </small>
                </div>
              </div>

              <CAlert color="info" className="mb-0">
                <small>
                  <strong>📝 Importante:</strong> Conserve este código y la planilla para futuras consultas.
                  Puede presentar la planilla impresa en secretaría para completar el proceso.
                </small>
              </CAlert>
            </CTabPane>
          </CTabContent>

          {/* Botones de navegación */}
          <div className="d-flex justify-content-between mt-4">
            <div>
              {step > 1 && step < 4 ? (
                <CButton color="secondary" onClick={handlePrevStep}>
                  <CIcon icon={cilArrowLeft} className="me-1" />
                  Atrás
                </CButton>
              ) : step === 1 ? (
                <CButton color="secondary" onClick={onCancelar}>
                  <CIcon icon={cilArrowLeft} className="me-1" />
                  Cancelar
                </CButton>
              ) : null}
            </div>
            
            <div>
              {step < 3 ? (
                <CButton color="primary" onClick={handleNextStep}>
                  Continuar
                </CButton>
              ) : step === 3 ? (
                <CButton color="success" onClick={handleSubmit}>
                  <CIcon icon={cilCheckCircle} className="me-1" />
                  Enviar Inscripción
                </CButton>
              ) : step === 4 ? (
                <CButton color="success" onClick={handleFinalizar}>
                  <CIcon icon={cilCheckCircle} className="me-1" />
                  Finalizar
                </CButton>
              ) : null}
            </div>
          </div>
        </CCardBody>

        <CCardFooter className="text-center">
          <small className="text-muted">
            <CIcon icon={cilWarning} className="me-1" />
            {step === 4 
              ? `Código de inscripción: ${codigoInscripcion} - ${new Date().toLocaleDateString('es-ES')}`
              : 'Complete todos los campos obligatorios (*)'}
          </small>
        </CCardFooter>
      </CCard>
    </CContainer>
  )
}

export default InscripcionForm