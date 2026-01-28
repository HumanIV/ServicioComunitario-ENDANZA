import React, { useState, useEffect } from "react"
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CAlert,
  CSpinner,
  CBadge
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import {
  cilUser,
  cilSave,
  cilX,
  cilPhone,
  cilPeople,
  cilContact
} from "@coreui/icons"
import StudentForm from "./editForm"

const editModal = ({
  visible,
  onClose,
  studentData,
  onSave,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState(0)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  // Inicializar formData cuando se abre el modal
  useEffect(() => {
    if (visible && studentData) {
      setFormData({ ...studentData })
      setActiveTab(0)
      setErrors({})
    }
  }, [visible, studentData])

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    if (!formData.NombreEstudiante?.trim()) {
      newErrors.NombreEstudiante = "El nombre es requerido"
    }

    if (!formData.ApellidoEstudiante?.trim()) {
      newErrors.ApellidoEstudiante = "El apellido es requerido"
    }

    if (!formData.FechaNacimiento) {
      newErrors.FechaNacimiento = "La fecha de nacimiento es requerida"
    }

    if (!formData.Estatus) {
      newErrors.Estatus = "El estatus es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar guardar con bloqueo
  const handleSave = () => {
    if (loading) return // Evitar múltiples clics

    if (validateForm()) {
      if (onSave) {
        onSave(formData)
      }
    } else {
      // Si hay errores, volver a la primera pestaña
      setActiveTab(0)
    }
  }

  // Tabs mejorados
  const tabs = [
    { key: 0, title: "Personal", icon: cilUser },
    { key: 1, title: "Contacto", icon: cilPhone },
    { key: 2, title: "Padre", icon: cilPeople },
    { key: 3, title: "Madre", icon: cilContact },
  ]

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size="xl"
      backdrop="static"
      className="premium-modal"
    >
      <CModalHeader className="bg-orange-soft border-0 py-3">
        <CModalTitle className="fw-bold text-dark d-flex align-items-center">
          <div className="p-2 bg-primary rounded-circle me-3 shadow-sm">
            <CIcon icon={cilUser} className="text-white" size="sm" />
          </div>
          Edición de Expediente Estudiantil
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="p-4">
        {loading && activeTab === -1 ? ( // Solo si estamos recargando todo el modal
          <div className="text-center py-5">
            <CSpinner color="primary" variant="grow" />
            <p className="mt-3 fw-bold text-primary">Actualizando registros...</p>
          </div>
        ) : (
          <>
            {/* Mostrar errores generales */}
            {Object.keys(errors).length > 0 && (
              <CAlert color="danger" className="mb-4 border-0 shadow-sm rounded-4 animate__animated animate__shakeX">
                <div className="d-flex align-items-center">
                  <CIcon icon={cilX} className="me-3" size="lg" />
                  <strong>Verifica los datos obligatorios en la pestaña Personal.</strong>
                </div>
              </CAlert>
            )}

            <div className="mb-4 p-4 rounded-4 bg-light border border-light d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted text-uppercase ls-1 fw-bold" style={{ fontSize: '0.65rem' }}>Editando Perfil de:</small>
                <h4 className="mb-0 fw-bold text-dark">
                  {studentData?.NombreEstudiante} {studentData?.ApellidoEstudiante}
                </h4>
              </div>
              <div className="text-end">
                <CBadge className="bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-2 rounded-pill shadow-sm fw-bold">
                  MATRÍCULA #{studentData?.id}
                </CBadge>
              </div>
            </div>

            {/* Navegación por Tabs Personalizada */}
            <CTabs activeTabKey={activeTab} onActiveTabKeyChange={setActiveTab}>
              <CNav variant="tabs" className="border-0 gap-2 mb-4">
                {tabs.map((tab) => (
                  <CNavItem key={tab.key}>
                    <CNavLink
                      onClick={() => setActiveTab(tab.key)}
                      active={activeTab === tab.key}
                      className={`rounded-pill border-0 px-4 py-2 fw-bold transition-all cursor-pointer ${activeTab === tab.key
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-light text-muted hover-orange'
                        }`}
                    >
                      <CIcon icon={tab.icon} className="me-2" />
                      {tab.title}
                    </CNavLink>
                  </CNavItem>
                ))}
              </CNav>

              <CTabContent className="px-1">
                <CTabPane visible={true} className="animate__animated animate__fadeIn">
                  <StudentForm
                    formData={formData}
                    onInputChange={handleInputChange}
                    activeTab={activeTab}
                  />
                </CTabPane>
              </CTabContent>
            </CTabs>
          </>
        )}
      </CModalBody>

      <CModalFooter className="border-0 p-4 pt-0">
        <CButton
          color="light"
          onClick={onClose}
          className="rounded-pill px-4 py-2 border-2 fw-bold text-muted hover-orange shadow-sm me-2"
          disabled={loading}
        >
          <CIcon icon={cilX} className="me-2" />
          CANCELAR
        </CButton>
        <CButton
          className="btn-premium rounded-pill px-5 py-2 shadow-sm d-flex align-items-center"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              GUARDANDO...
            </>
          ) : (
            <>
              <CIcon icon={cilSave} className="me-2" />
              GUARDAR CAMBIOS
            </>
          )}
        </CButton>
      </CModalFooter>
      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .hover-orange:hover {
            background: var(--primary-50) !important;
            color: var(--primary-600) !important;
            border-color: var(--primary-200) !important;
        }
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.2s ease; }
      `}</style>
    </CModal>
  )
}

export default editModal