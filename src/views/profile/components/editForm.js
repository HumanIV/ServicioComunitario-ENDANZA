import React, { useState, useEffect } from "react"
import {
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CFormLabel,
  CAlert
} from "@coreui/react"

const editForm = ({ studentData, onFormChange }) => {
  const [formData, setFormData] = useState({
    // Datos personales
    NombreEstudiante: "",
    ApellidoEstudiante: "",
    FechaNacimiento: "",
    Sexo: "",
    TipoSangre: "",
    
    // Datos de contacto
    Direccion: "",
    Ciudad: "",
    Estado: "",
    Telefono: "",
    Email: "",
    
    // Datos académicos
    Grado: "",
    Seccion: "",
    Estatus: "",
    
    // Datos del padre
    PadreNombre: "",
    PadreApellido: "",
    PadreCedula: "",
    PadreTelefono: "",
    PadreEmail: "",
    PadreParentesco: "Padre",
    PadreOcupacion: "",
    
    // Datos de la madre
    MadreNombre: "",
    MadreApellido: "",
    MadreCedula: "",
    MadreTelefono: "",
    MadreEmail: "",
    MadreParentesco: "Madre",
    MadreOcupacion: "",
  })

  // Inicializar datos del formulario cuando studentData cambia
  useEffect(() => {
    if (studentData) {
      setFormData({
        NombreEstudiante: studentData.NombreEstudiante || "",
        ApellidoEstudiante: studentData.ApellidoEstudiante || "",
        FechaNacimiento: studentData.FechaNacimiento || "",
        Sexo: studentData.Sexo || "",
        TipoSangre: studentData.TipoSangre || "",
        
        Direccion: studentData.Direccion || "",
        Ciudad: studentData.Ciudad || "",
        Estado: studentData.Estado || "",
        Telefono: studentData.Telefono || "",
        Email: studentData.Email || "",
        
        Grado: studentData.Grado || "",
        Seccion: studentData.Seccion || "",
        Estatus: studentData.Estatus || "",
        
        PadreNombre: studentData.PadreNombre || "",
        PadreApellido: studentData.PadreApellido || "",
        PadreCedula: studentData.PadreCedula || "",
        PadreTelefono: studentData.PadreTelefono || "",
        PadreEmail: studentData.PadreEmail || "",
        PadreParentesco: studentData.PadreParentesco || "Padre",
        PadreOcupacion: studentData.PadreOcupacion || "",
        
        MadreNombre: studentData.MadreNombre || "",
        MadreApellido: studentData.MadreApellido || "",
        MadreCedula: studentData.MadreCedula || "",
        MadreTelefono: studentData.MadreTelefono || "",
        MadreEmail: studentData.MadreEmail || "",
        MadreParentesco: studentData.MadreParentesco || "Madre",
        MadreOcupacion: studentData.MadreOcupacion || "",
      })
    }
  }, [studentData])

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedData = {
      ...formData,
      [name]: value
    }
    setFormData(updatedData)
    
    // Notificar al componente padre del cambio
    if (onFormChange) {
      onFormChange(updatedData)
    }
  }

  // Opciones para selects
  const sexoOptions = [
    { value: "", label: "Seleccionar sexo" },
    { value: "Masculino", label: "Masculino" },
    { value: "Femenino", label: "Femenino" }
  ]

  const tipoSangreOptions = [
    { value: "", label: "Seleccionar tipo" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" }
  ]

  const estatusOptions = [
    { value: "", label: "Seleccionar estatus" },
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
    { value: "Graduado", label: "Graduado" },
    { value: "Retirado", label: "Retirado" }
  ]

  return (
    <CForm>
      {/* Sección: Datos Personales */}
      <h5 className="mb-3 text-primary">Datos Personales</h5>
      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel>Nombre</CFormLabel>
          <CFormInput
            type="text"
            name="NombreEstudiante"
            value={formData.NombreEstudiante}
            onChange={handleChange}
            placeholder="Nombre del estudiante"
          />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Apellido</CFormLabel>
          <CFormInput
            type="text"
            name="ApellidoEstudiante"
            value={formData.ApellidoEstudiante}
            onChange={handleChange}
            placeholder="Apellido del estudiante"
          />
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={4}>
          <CFormLabel>Fecha de Nacimiento</CFormLabel>
          <CFormInput
            type="date"
            name="FechaNacimiento"
            value={formData.FechaNacimiento}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={4}>
          <CFormLabel>Sexo</CFormLabel>
          <CFormSelect
            name="Sexo"
            value={formData.Sexo}
            onChange={handleChange}
            options={sexoOptions}
          />
        </CCol>
        <CCol md={4}>
          <CFormLabel>Tipo de Sangre</CFormLabel>
          <CFormSelect
            name="TipoSangre"
            value={formData.TipoSangre}
            onChange={handleChange}
            options={tipoSangreOptions}
          />
        </CCol>
      </CRow>

      {/* Sección: Datos de Contacto */}
      <h5 className="mb-3 mt-4 text-primary">Datos de Contacto</h5>
      <CRow className="mb-3">
        <CCol md={12}>
          <CFormLabel>Dirección</CFormLabel>
          <CFormInput
            type="text"
            name="Direccion"
            value={formData.Direccion}
            onChange={handleChange}
            placeholder="Dirección completa"
          />
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={4}>
          <CFormLabel>Ciudad</CFormLabel>
          <CFormInput
            type="text"
            name="Ciudad"
            value={formData.Ciudad}
            onChange={handleChange}
            placeholder="Ciudad"
          />
        </CCol>
        <CCol md={4}>
          <CFormLabel>Estado</CFormLabel>
          <CFormInput
            type="text"
            name="Estado"
            value={formData.Estado}
            onChange={handleChange}
            placeholder="Estado"
          />
        </CCol>
        <CCol md={4}>
          <CFormLabel>Teléfono</CFormLabel>
          <CFormInput
            type="tel"
            name="Telefono"
            value={formData.Telefono}
            onChange={handleChange}
            placeholder="Teléfono"
          />
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel>Email</CFormLabel>
          <CFormInput
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel>Estatus</CFormLabel>
          <CFormSelect
            name="Estatus"
            value={formData.Estatus}
            onChange={handleChange}
            options={estatusOptions}
          />
        </CCol>
      </CRow>

      {/* Sección: Datos del Padre */}
      <h5 className="mb-3 mt-4 text-primary">Datos del Padre</h5>
      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel>Nombre del Padre</CFormLabel>
          <CFormInput
            type="text"
            name="PadreNombre"
            value={formData.PadreNombre}
            onChange={handleChange}
            placeholder="Nombre del padre"
          />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Apellido del Padre</CFormLabel>
          <CFormInput
            type="text"
            name="PadreApellido"
            value={formData.PadreApellido}
            onChange={handleChange}
            placeholder="Apellido del padre"
          />
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel>Cédula del Padre</CFormLabel>
          <CFormInput
            type="text"
            name="PadreCedula"
            value={formData.PadreCedula}
            onChange={handleChange}
            placeholder="V-XXXXXXXX"
          />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Teléfono del Padre</CFormLabel>
          <CFormInput
            type="tel"
            name="PadreTelefono"
            value={formData.PadreTelefono}
            onChange={handleChange}
            placeholder="Teléfono del padre"
          />
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel>Email del Padre</CFormLabel>
          <CFormInput
            type="email"
            name="PadreEmail"
            value={formData.PadreEmail}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Ocupación del Padre</CFormLabel>
          <CFormInput
            type="text"
            name="PadreOcupacion"
            value={formData.PadreOcupacion}
            onChange={handleChange}
            placeholder="Ocupación"
          />
        </CCol>
      </CRow>

      {/* Sección: Datos de la Madre */}
      <h5 className="mb-3 mt-4 text-primary">Datos de la Madre</h5>
      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel>Nombre de la Madre</CFormLabel>
          <CFormInput
            type="text"
            name="MadreNombre"
            value={formData.MadreNombre}
            onChange={handleChange}
            placeholder="Nombre de la madre"
          />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Apellido de la Madre</CFormLabel>
          <CFormInput
            type="text"
            name="MadreApellido"
            value={formData.MadreApellido}
            onChange={handleChange}
            placeholder="Apellido de la madre"
          />
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel>Cédula de la Madre</CFormLabel>
          <CFormInput
            type="text"
            name="MadreCedula"
            value={formData.MadreCedula}
            onChange={handleChange}
            placeholder="V-XXXXXXXX"
          />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Teléfono de la Madre</CFormLabel>
          <CFormInput
            type="tel"
            name="MadreTelefono"
            value={formData.MadreTelefono}
            onChange={handleChange}
            placeholder="Teléfono de la madre"
          />
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel>Email de la Madre</CFormLabel>
          <CFormInput
            type="email"
            name="MadreEmail"
            value={formData.MadreEmail}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Ocupación de la Madre</CFormLabel>
          <CFormInput
            type="text"
            name="MadreOcupacion"
            value={formData.MadreOcupacion}
            onChange={handleChange}
            placeholder="Ocupación"
          />
        </CCol>
      </CRow>
    </CForm>
  )
}

export default editForm