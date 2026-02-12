// components/editPerfil.jsx - VERSIÓN CORREGIDA CON API
import React, { useState, useEffect } from "react"
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CSpinner,
  CTab,
  CTabContent,
  CTabPane,
  CNav,
  CNavItem,
  CNavLink,
  CAlert
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import {
  cilUser,
  cilEnvelopeClosed,
  cilPhone,
  cilBadge,
  cilCalendar,
  cilCheckCircle,
  cilWarning
} from "@coreui/icons"

const EditProfileModal = ({ visible, onClose, userData, onSave, loading }) => {
  const [activeTab, setActiveTab] = useState(1)
  const [formData, setFormData] = useState({
    // Datos personales (mapeados del backend)
    nombre: "",
    apellido: "",
    cedula: "",
    fechaNacimiento: "",
    genero: "",
    
    // Contacto
    email: "",
    telefono: "",
  })
  
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (userData && visible) {
      console.log('📝 Cargando datos en modal:', userData)
      
      // Formatear fecha para input type="date" (YYYY-MM-DD)
      let fechaFormateada = userData.fechaNacimiento || ""
      if (fechaFormateada && fechaFormateada.includes('/')) {
        const partes = fechaFormateada.split('/')
        if (partes.length === 3) {
          // Convertir de DD/MM/YYYY a YYYY-MM-DD
          fechaFormateada = `${partes[2]}-${partes[1]}-${partes[0]}`
        }
      }

      setFormData({
        // Datos personales
        nombre: userData.nombre || "",
        apellido: userData.apellido || "",
        cedula: userData.cedula || "",
        fechaNacimiento: fechaFormateada,
        genero: userData.genero || userData.sexo || "",
        
        // Contacto
        email: userData.email || "",
        telefono: userData.telefono || "",
      })
    }
  }, [userData, visible])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validar datos personales
    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es requerido"
    if (!formData.apellido?.trim()) newErrors.apellido = "El apellido es requerido"
    if (!formData.cedula?.trim()) newErrors.cedula = "La cédula es requerida"
    if (!formData.email?.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido"
    }
    
    // Validar teléfono (opcional pero con formato)
    if (formData.telefono && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.telefono)) {
      newErrors.telefono = "Formato de teléfono inválido"
    }
    
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    
    if (Object.keys(validationErrors).length === 0) {
      // Preparar datos para enviar al backend
      const datosActualizados = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        cedula: formData.cedula,
        email: formData.email,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        genero: formData.genero
      }
      
      console.log('📤 Enviando datos actualizados:', datosActualizados)
      onSave(datosActualizados)
    } else {
      setErrors(validationErrors)
      // Marcar todos los campos como tocados para mostrar errores
      const allTouched = Object.keys(formData).reduce((acc, key) => {
        acc[key] = true
        return acc
      }, {})
      setTouched(allTouched)
      
      // Cambiar a la pestaña de Datos Personales si hay errores allí
      if (validationErrors.nombre || validationErrors.apellido || validationErrors.cedula) {
        setActiveTab(1)
      }
    }
  }

  const isFieldInvalid = (fieldName) => {
    return touched[fieldName] && errors[fieldName]
  }

  return (
    <CModal 
      visible={visible} 
      onClose={onClose} 
      size="lg"
      className="edit-profile-modal"
      backdrop="static"
    >
      <CModalHeader className="border-0 pb-0">
        <CModalTitle className="fw-bold d-flex align-items-center">
          <div className="p-2 bg-warning bg-opacity-10 rounded-circle me-2">
            <CIcon icon={cilUser} className="text-warning" />
          </div>
          Editar Perfil
        </CModalTitle>
      </CModalHeader>
      
      <CForm onSubmit={handleSubmit}>
        <CModalBody className="py-3">
          {/* Tabs de navegación */}
          <CNav variant="tabs" className="mb-4 border-0 gap-2">
            <CNavItem>
              <CNavLink
                active={activeTab === 1}
                onClick={() => setActiveTab(1)}
                className={`rounded-pill px-4 py-2 border-0 fw-bold transition-all cursor-pointer ${
                  activeTab === 1 ? 'bg-warning text-white shadow-sm' : 'bg-light text-dark'
                }`}
              >
                <CIcon icon={cilUser} className="me-2" />
                Datos Personales
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 2}
                onClick={() => setActiveTab(2)}
                className={`rounded-pill px-4 py-2 border-0 fw-bold transition-all cursor-pointer ${
                  activeTab === 2 ? 'bg-warning text-white shadow-sm' : 'bg-light text-dark'
                }`}
              >
                <CIcon icon={cilPhone} className="me-2" />
                Contacto
              </CNavLink>
            </CNavItem>
          </CNav>

          <CTabContent>
            {/* Tab 1: Datos Personales */}
            <CTabPane visible={activeTab === 1}>
              <CRow className="g-4">
                <CCol md={6}>
                  <CFormLabel className="fw-semibold">
                    Nombres <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={isFieldInvalid('nombre')}
                    feedback={errors.nombre}
                    placeholder="Ingresa tus nombres"
                  />
                </CCol>
                
                <CCol md={6}>
                  <CFormLabel className="fw-semibold">
                    Apellidos <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={isFieldInvalid('apellido')}
                    feedback={errors.apellido}
                    placeholder="Ingresa tus apellidos"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel className="fw-semibold">
                    Cédula de Identidad <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={isFieldInvalid('cedula')}
                    feedback={errors.cedula}
                    placeholder="V-12345678"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel className="fw-semibold">Fecha de Nacimiento</CFormLabel>
                  <CFormInput
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel className="fw-semibold">Género</CFormLabel>
                  <CFormInput
                    type="text"
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Masculino / Femenino / Otro"
                  />
                </CCol>
              </CRow>
            </CTabPane>

            {/* Tab 2: Contacto */}
            <CTabPane visible={activeTab === 2}>
              <CRow className="g-4">
                <CCol md={6}>
                  <CFormLabel className="fw-semibold">
                    Correo Electrónico <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={isFieldInvalid('email')}
                    feedback={errors.email}
                    placeholder="correo@ejemplo.com"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel className="fw-semibold">Teléfono Principal</CFormLabel>
                  <CFormInput
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={isFieldInvalid('telefono')}
                    feedback={errors.telefono}
                    placeholder="+58 414-1234567"
                  />
                </CCol>
              </CRow>
            </CTabPane>
          </CTabContent>

          {/* Campos requeridos hint */}
          <CAlert color="light" className="mt-4 mb-0 small">
            <CIcon icon={cilCheckCircle} className="text-success me-2" />
            Los campos marcados con <span className="text-danger">*</span> son obligatorios
          </CAlert>
        </CModalBody>
        
        <CModalFooter className="border-0 pt-0">
          <CButton 
            color="secondary" 
            variant="outline" 
            onClick={onClose}
            className="rounded-pill px-4"
            disabled={loading}
          >
            Cancelar
          </CButton>
          <CButton 
            type="submit" 
            color="warning" 
            className="text-white rounded-pill px-4 d-flex align-items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Guardando...
              </>
            ) : (
              <>
                <CIcon icon={cilCheckCircle} className="me-2" />
                Guardar Cambios
              </>
            )}
          </CButton>
        </CModalFooter>
      </CForm>

      <style>{`
        .edit-profile-modal .modal-content {
          border: none;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        }
        .edit-profile-modal .nav-tabs { border-bottom: none; }
        .edit-profile-modal .nav-link {
          transition: all 0.2s ease;
          border-radius: 50px !important;
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
        }
        .edit-profile-modal .nav-link:hover:not(.active) {
          background-color: var(--neutral-200) !important;
          transform: translateY(-2px);
        }
        .edit-profile-modal .form-label {
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
          color: var(--neutral-700);
        }
        .edit-profile-modal .form-control {
          border-radius: 12px;
          border: 2px solid var(--neutral-200);
          padding: 0.6rem 1rem;
          transition: all 0.2s ease;
        }
        .edit-profile-modal .form-control:focus {
          border-color: #F28C0F;
          box-shadow: 0 0 0 3px rgba(242, 140, 15, 0.1);
        }
        .edit-profile-modal .form-control.is-invalid {
          border-color: #e55353;
          background-image: none;
        }
        [data-coreui-theme="dark"] .edit-profile-modal .modal-content {
          background-color: #1e293b;
        }
        [data-coreui-theme="dark"] .edit-profile-modal .nav-link {
          background-color: rgba(255,255,255,0.05) !important;
          color: rgba(255,255,255,0.8) !important;
        }
        [data-coreui-theme="dark"] .edit-profile-modal .nav-link.active {
          background-color: #F28C0F !important;
          color: white !important;
        }
        [data-coreui-theme="dark"] .edit-profile-modal .nav-link:hover:not(.active) {
          background-color: rgba(255,255,255,0.1) !important;
          color: white !important;
        }
        [data-coreui-theme="dark"] .edit-profile-modal .form-label {
          color: rgba(255,255,255,0.7);
        }
        [data-coreui-theme="dark"] .edit-profile-modal .form-control {
          background-color: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.1);
          color: white;
        }
        [data-coreui-theme="dark"] .edit-profile-modal .form-control:focus {
          border-color: #F28C0F;
          background-color: rgba(255,255,255,0.1);
        }
        [data-coreui-theme="dark"] .edit-profile-modal .bg-light {
          background-color: rgba(255,255,255,0.05) !important;
          color: rgba(255,255,255,0.8);
        }
        .edit-profile-modal .tab-pane {
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </CModal>
  )
}

export default EditProfileModal