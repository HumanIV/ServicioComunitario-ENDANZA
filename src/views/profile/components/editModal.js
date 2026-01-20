import React, { useState } from "react"
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
  CSpinner
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { 
  cilUser,
  cilBadge,
  cilBook,
  cilMedicalCross,
  cilSave,
  cilX
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

  // Manejar cambios en el formulario
  const handleFormChange = (data) => {
    setFormData(data)
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}
    
    // Validaciones básicas
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

  // Manejar guardar
  const handleSave = () => {
    if (validateForm()) {
      if (onSave) {
        onSave(formData)
      }
    }
  }

  // Tabs disponibles
  const tabs = [
    {
      key: 0,
      title: "Datos Personales",
      icon: cilUser,
      component: (
        <StudentForm 
          studentData={studentData} 
          onFormChange={handleFormChange}
        />
      )
    },
    // Puedes agregar más tabs aquí para otras secciones
  ]

  return (
    <CModal 
      visible={visible} 
      onClose={onClose}
      size="xl"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>
          <CIcon icon={cilUser} className="me-2" />
          Editar Información del Estudiante
        </CModalTitle>
      </CModalHeader>
      
      <CModalBody>
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="mt-3">Cargando datos...</p>
          </div>
        ) : (
          <>
            {/* Mostrar errores generales */}
            {Object.keys(errors).length > 0 && (
              <CAlert color="danger" className="mb-3">
                <strong>Por favor corrige los siguientes errores:</strong>
                <ul className="mb-0 mt-2">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </CAlert>
            )}

            {/* Información del estudiante actual */}
            <div className="mb-4 p-3  rounded">
              <small className="text-muted">Estudiante actual:</small>
              <h5 className="mb-0">
                {studentData?.NombreEstudiante} {studentData?.ApellidoEstudiante}
              </h5>
              <small className="text-muted">
                Matrícula: #{studentData?.id} | {studentData?.Grado} - {studentData?.Seccion}
              </small>
            </div>

            {/* Tabs para diferentes secciones */}
            <CTabs activeTabKey={activeTab} onActiveTabKeyChange={setActiveTab}>
              <CNav variant="tabs">
                {tabs.map((tab) => (
                  <CNavItem key={tab.key}>
                    <CNavLink onClick={() => setActiveTab(tab.key)}>
                      <CIcon icon={tab.icon} className="me-2" />
                      {tab.title}
                    </CNavLink>
                  </CNavItem>
                ))}
              </CNav>
              
              <CTabContent>
                {tabs.map((tab) => (
                  <CTabPane key={tab.key} visible={activeTab === tab.key}>
                    <div className="mt-3">
                      {tab.component}
                    </div>
                  </CTabPane>
                ))}
              </CTabContent>
            </CTabs>
          </>
        )}
      </CModalBody>
      
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          <CIcon icon={cilX} className="me-2" />
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave} disabled={loading}>
          <CIcon icon={cilSave} className="me-2" />
          {loading ? "Guardando..." : "Guardar Cambios"}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default editModal