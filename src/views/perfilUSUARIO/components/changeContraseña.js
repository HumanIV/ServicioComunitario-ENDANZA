// components/profile/ChangePasswordModal.jsx - VERSIÓN CORREGIDA
import React, { useState } from "react"
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CSpinner
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import {
  cilLockLocked,
  cilCheckCircle,
  cilWarning
} from "@coreui/icons"

const ChangePasswordModal = ({ visible, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Limpiar error del campo cuando el usuario escribe
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = "La contraseña actual es requerida"
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = "La nueva contraseña es requerida"
    } else if (formData.newPassword.length < 6) { // ✅ Cambiado a 6 como en el backend
      newErrors.newPassword = "La contraseña debe tener al menos 6 caracteres"
    }
    // ✅ Eliminada validación estricta de caracteres especiales
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu nueva contraseña"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }
    
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })
      // Reset form después de submit exitoso
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      setErrors({})
    } else {
      setErrors(validationErrors)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    })
  }

  const getPasswordStrength = (password) => {
    if (!password) return { text: "No ingresada", color: "secondary" }
    let strength = 0
    if (password.length >= 6) strength++ // ✅ Cambiado a 6
    if (/(?=.*[a-z])/.test(password)) strength++
    if (/(?=.*[A-Z])/.test(password)) strength++
    if (/(?=.*\d)/.test(password)) strength++
    
    if (strength <= 1) return { text: "Débil", color: "danger" }
    if (strength <= 2) return { text: "Media", color: "warning" }
    if (strength <= 3) return { text: "Buena", color: "info" }
    return { text: "Fuerte", color: "success" }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  return (
    <CModal 
      visible={visible} 
      onClose={onClose} 
      size="lg"
      className="premium-modal"
    >
      <CModalHeader className="border-0 pb-0">
        <CModalTitle className="fw-bold d-flex align-items-center">
          <div className="p-2 bg-warning bg-opacity-10 rounded-circle me-2">
            <CIcon icon={cilLockLocked} className="text-warning" />
          </div>
          Cambiar Contraseña
        </CModalTitle>
      </CModalHeader>
      
      <CForm onSubmit={handleSubmit}>
        <CModalBody className="py-4">
          <CAlert color="info" className="d-flex align-items-center border-0 bg-info bg-opacity-10">
            <div className="small">
              Te recomendamos usar una contraseña segura que no hayas utilizado anteriormente.
            </div>
          </CAlert>
          
          <div className="mb-4">
            {/* Contraseña actual */}
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                placeholder="Contraseña actual"
                value={formData.currentPassword}
                onChange={handleChange}
                invalid={!!errors.currentPassword}
                feedback={errors.currentPassword}
              />
            </CInputGroup>
            
            {/* Nueva contraseña */}
            <CInputGroup className="mb-2">
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                placeholder="Nueva contraseña"
                value={formData.newPassword}
                onChange={handleChange}
                invalid={!!errors.newPassword}
                feedback={errors.newPassword}
              />
            </CInputGroup>
            
            {formData.newPassword && (
              <div className="mb-3 small">
                <span className="text-muted me-2">Fortaleza:</span>
                <span className={`text-${passwordStrength.color} fw-bold`}>
                  {passwordStrength.text}
                </span>
              </div>
            )}
            
            {/* Confirmar contraseña */}
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirmar nueva contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                invalid={!!errors.confirmPassword}
                feedback={errors.confirmPassword}
              />
            </CInputGroup>
          </div>
          
          <div className="bg-light p-3 rounded-3">
            <p className="mb-2 fw-bold small">Requisitos de seguridad:</p>
            <ul className="list-unstyled mb-0">
              <li className="mb-1 d-flex align-items-center small">
                <CIcon 
                  icon={formData.newPassword.length >= 6 ? cilCheckCircle : cilWarning} 
                  className={formData.newPassword.length >= 6 ? "text-success me-2" : "text-warning me-2"} 
                  size="sm" 
                />
                Mínimo 6 caracteres
              </li>
              <li className="mb-1 d-flex align-items-center small">
                <CIcon 
                  icon={/(?=.*[a-z])/.test(formData.newPassword) ? cilCheckCircle : cilWarning} 
                  className={/(?=.*[a-z])/.test(formData.newPassword) ? "text-success me-2" : "text-warning me-2"} 
                  size="sm" 
                />
                Al menos 1 letra minúscula
              </li>
              <li className="mb-1 d-flex align-items-center small">
                <CIcon 
                  icon={/(?=.*[A-Z])/.test(formData.newPassword) ? cilCheckCircle : cilWarning} 
                  className={/(?=.*[A-Z])/.test(formData.newPassword) ? "text-success me-2" : "text-warning me-2"} 
                  size="sm" 
                />
                Al menos 1 letra mayúscula
              </li>
              <li className="mb-1 d-flex align-items-center small">
                <CIcon 
                  icon={/(?=.*\d)/.test(formData.newPassword) ? cilCheckCircle : cilWarning} 
                  className={/(?=.*\d)/.test(formData.newPassword) ? "text-success me-2" : "text-warning me-2"} 
                  size="sm" 
                />
                Al menos 1 número
              </li>
            </ul>
          </div>
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
                Actualizando...
              </>
            ) : (
              <>
                <CIcon icon={cilLockLocked} className="me-2" />
                Cambiar Contraseña
              </>
            )}
          </CButton>
        </CModalFooter>
      </CForm>

      <style>{`
        .premium-modal .modal-content {
          border: none;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .premium-modal .input-group {
          border-radius: 12px;
          overflow: hidden;
        }
        .premium-modal .input-group-text {
          background-color: var(--neutral-100);
          border: 2px solid var(--neutral-200);
          border-right: none;
          color: var(--neutral-600);
        }
        .premium-modal .form-control {
          border: 2px solid var(--neutral-200);
          border-left: none;
          padding: 0.6rem 1rem;
        }
        .premium-modal .form-control:focus {
          border-color: #F28C0F;
          box-shadow: none;
        }
        .premium-modal .input-group:focus-within .input-group-text {
          border-color: #F28C0F;
          color: #F28C0F;
        }
        [data-coreui-theme="dark"] .premium-modal .modal-content {
          background-color: #1e293b;
        }
        [data-coreui-theme="dark"] .premium-modal .input-group-text {
          background-color: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
        }
        [data-coreui-theme="dark"] .premium-modal .form-control {
          background-color: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.1);
          color: white;
        }
        [data-coreui-theme="dark"] .premium-modal .bg-light {
          background-color: rgba(255,255,255,0.05) !important;
        }
      `}</style>
    </CModal>
  )
}

export default ChangePasswordModal