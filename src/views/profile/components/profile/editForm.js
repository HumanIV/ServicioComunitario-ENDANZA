import React from "react"
import {
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormLabel,
} from "@coreui/react"

const editForm = ({ formData, onInputChange, activeTab }) => {
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
    <CForm className="animate__animated animate__fadeIn">
      {/* SECCIÓN 0: DATOS PERSONALES */}
      {activeTab === 0 && (
        <>
          <h5 className="mb-3 text-primary form-section-border pb-2">Información de Identidad</h5>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel className="fw-bold">Nombre</CFormLabel>
              <CFormInput
                type="text"
                name="NombreEstudiante"
                value={formData.NombreEstudiante || ""}
                onChange={onInputChange}
                placeholder="Nombre del estudiante"
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel className="fw-bold">Apellido</CFormLabel>
              <CFormInput
                type="text"
                name="ApellidoEstudiante"
                value={formData.ApellidoEstudiante || ""}
                onChange={onInputChange}
                placeholder="Apellido del estudiante"
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={4}>
              <CFormLabel className="fw-bold">Fecha de Nacimiento</CFormLabel>
              <CFormInput
                type="date"
                name="FechaNacimiento"
                value={formData.FechaNacimiento || ""}
                onChange={onInputChange}
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel className="fw-bold">Sexo</CFormLabel>
              <CFormSelect
                name="Sexo"
                value={formData.Sexo || ""}
                onChange={onInputChange}
                options={sexoOptions}
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel className="fw-bold">Tipo de Sangre</CFormLabel>
              <CFormSelect
                name="TipoSangre"
                value={formData.TipoSangre || ""}
                onChange={onInputChange}
                options={tipoSangreOptions}
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel className="fw-bold">Estatus Académico</CFormLabel>
              <CFormSelect
                name="Estatus"
                value={formData.Estatus || ""}
                onChange={onInputChange}
                options={estatusOptions}
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel className="fw-bold">Grado</CFormLabel>
              <CFormInput
                type="text"
                name="Grado"
                value={formData.Grado || ""}
                onChange={onInputChange}
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel className="fw-bold">Sección</CFormLabel>
              <CFormInput
                type="text"
                name="Seccion"
                value={formData.Seccion || ""}
                onChange={onInputChange}
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>
        </>
      )}

      {/* SECCIÓN 1: CONTACTO */}
      {activeTab === 1 && (
        <>
          <h5 className="mb-3 text-primary form-section-border pb-2">Datos de Ubicación y Contacto</h5>
          <CRow className="mb-3">
            <CCol md={12}>
              <CFormLabel className="fw-bold">Dirección de Habitación</CFormLabel>
              <CFormInput
                type="text"
                name="Direccion"
                value={formData.Direccion || ""}
                onChange={onInputChange}
                placeholder="Dirección completa"
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={4}>
              <CFormLabel className="fw-bold">Ciudad</CFormLabel>
              <CFormInput
                type="text"
                name="Ciudad"
                value={formData.Ciudad || ""}
                onChange={onInputChange}
                placeholder="Ciudad"
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel className="fw-bold">Estado</CFormLabel>
              <CFormInput
                type="text"
                name="Estado"
                value={formData.Estado || ""}
                onChange={onInputChange}
                placeholder="Estado"
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel className="fw-bold">Teléfono Principal</CFormLabel>
              <CFormInput
                type="tel"
                name="Telefono"
                value={formData.Telefono || ""}
                onChange={onInputChange}
                placeholder="Ej: 0412-1234567"
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={8}>
              <CFormLabel className="fw-bold">Correo Electrónico</CFormLabel>
              <CFormInput
                type="email"
                name="Email"
                value={formData.Email || ""}
                onChange={onInputChange}
                placeholder="correo@ejemplo.com"
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>
        </>
      )}

      {/* SECCIÓN 2: PADRE */}
      {activeTab === 2 && (
        <>
          <h5 className="mb-3 text-primary form-section-border pb-2">Información del Padre / Representante</h5>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel className="fw-bold">Nombre del Padre</CFormLabel>
              <CFormInput
                type="text"
                name="PadreNombre"
                value={formData.PadreNombre || ""}
                onChange={onInputChange}
                placeholder="Nombre del padre"
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel className="fw-bold">Apellido del Padre</CFormLabel>
              <CFormInput
                type="text"
                name="PadreApellido"
                value={formData.PadreApellido || ""}
                onChange={onInputChange}
                placeholder="Apellido del padre"
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel className="fw-bold">Cédula del Padre</CFormLabel>
              <CFormInput
                type="text"
                name="PadreCedula"
                value={formData.PadreCedula || ""}
                onChange={onInputChange}
                placeholder="V-XXXXXXXX"
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel className="fw-bold">Teléfono del Padre</CFormLabel>
              <CFormInput
                type="tel"
                name="PadreTelefono"
                value={formData.PadreTelefono || ""}
                onChange={onInputChange}
                placeholder="Teléfono de contacto"
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel className="fw-bold">Email del Padre</CFormLabel>
              <CFormInput
                type="email"
                name="PadreEmail"
                value={formData.PadreEmail || ""}
                onChange={onInputChange}
                placeholder="correo@ejemplo.com"
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel className="fw-bold">Ocupación</CFormLabel>
              <CFormInput
                type="text"
                name="PadreOcupacion"
                value={formData.PadreOcupacion || ""}
                onChange={onInputChange}
                placeholder="Ocupación o profesión"
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>
        </>
      )}

      {/* SECCIÓN 3: MADRE */}
      {activeTab === 3 && (
        <>
          <h5 className="mb-3 text-primary form-section-border pb-2">Información de la Madre / Representante</h5>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel className="fw-bold">Nombre de la Madre</CFormLabel>
              <CFormInput
                type="text"
                name="MadreNombre"
                value={formData.MadreNombre || ""}
                onChange={onInputChange}
                placeholder="Nombre de la madre"
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel className="fw-bold">Apellido de la Madre</CFormLabel>
              <CFormInput
                type="text"
                name="MadreApellido"
                value={formData.MadreApellido || ""}
                onChange={onInputChange}
                placeholder="Apellido de la madre"
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel className="fw-bold">Cédula de la Madre</CFormLabel>
              <CFormInput
                type="text"
                name="MadreCedula"
                value={formData.MadreCedula || ""}
                onChange={onInputChange}
                placeholder="V-XXXXXXXX"
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel className="fw-bold">Teléfono de la Madre</CFormLabel>
              <CFormInput
                type="tel"
                name="MadreTelefono"
                value={formData.MadreTelefono || ""}
                onChange={onInputChange}
                placeholder="Teléfono de contacto"
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel className="fw-bold">Email de la Madre</CFormLabel>
              <CFormInput
                type="email"
                name="MadreEmail"
                value={formData.MadreEmail || ""}
                onChange={onInputChange}
                placeholder="correo@ejemplo.com"
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel className="fw-bold">Ocupación</CFormLabel>
              <CFormInput
                type="text"
                name="MadreOcupacion"
                value={formData.MadreOcupacion || ""}
                onChange={onInputChange}
                placeholder="Ocupación o profesión"
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>
        </>
      )}

      {/* SECCIÓN 4: REPRESENTANTE LEGAL */}
      {activeTab === 4 && (
        <>
          <h5 className="mb-3 text-primary form-section-border pb-2">Asignación de Representante Legal</h5>
          <CRow className="mb-4">
            <CCol md={(!["Madre", "Padre", "Tío", "Abuelo", "Hermano", ""].includes(formData.RepresentanteParentesco)) ? 6 : 12}>
              <CFormLabel className="fw-bold">¿Quién es el Representante Legal?</CFormLabel>
              <CFormSelect
                name="RepresentanteSelection"
                value={
                  ["Madre", "Padre", "Tío", "Abuelo", "Hermano", ""].includes(formData.RepresentanteParentesco)
                    ? (formData.RepresentanteParentesco || "")
                    : "Otro"
                }
                onChange={(e) => {
                  const selection = e.target.value;
                  const updatedData = { ...formData };

                  if (selection === "Madre") {
                    updatedData.RepresentanteParentesco = "Madre";
                    updatedData.RepresentanteNombre = formData.MadreNombre || "";
                    updatedData.RepresentanteApellido = formData.MadreApellido || "";
                    updatedData.RepresentanteCedula = formData.MadreCedula || "";
                    updatedData.RepresentanteTelefono = formData.MadreTelefono || "";
                    updatedData.RepresentanteOcupacion = formData.MadreOcupacion || "";
                    updatedData.RepresentanteEmail = formData.MadreEmail || "";
                  } else if (selection === "Padre") {
                    updatedData.RepresentanteParentesco = "Padre";
                    updatedData.RepresentanteNombre = formData.PadreNombre || "";
                    updatedData.RepresentanteApellido = formData.PadreApellido || "";
                    updatedData.RepresentanteCedula = formData.PadreCedula || "";
                    updatedData.RepresentanteTelefono = formData.PadreTelefono || "";
                    updatedData.RepresentanteOcupacion = formData.PadreOcupacion || "";
                    updatedData.RepresentanteEmail = formData.PadreEmail || "";
                  } else if (selection === "Otro") {
                    updatedData.RepresentanteParentesco = "OTRO_VALOR"; // Flag para mostrar input
                  } else {
                    updatedData.RepresentanteParentesco = selection;
                  }

                  onInputChange({ target: { name: 'multiple', value: updatedData } });
                }}
                className="input-premium h-auto py-2"
                options={[
                  { value: "", label: "Seleccionar parentesco" },
                  { value: "Madre", label: "Madre" },
                  { value: "Padre", label: "Padre" },
                  { value: "Tío", label: "Tío(a)" },
                  { value: "Abuelo", label: "Abuelo(a)" },
                  { value: "Hermano", label: "Hermano(a) Mayor" },
                  { value: "Otro", label: "Otro" }
                ]}
              />
            </CCol>

            {/* Campo dinámico para 'Otro' parentesco */}
            {(!["Madre", "Padre", "Tío", "Abuelo", "Hermano", ""].includes(formData.RepresentanteParentesco)) && (
              <CCol md={6} className="animate__animated animate__fadeIn">
                <CFormLabel className="fw-bold">Especifique el Parentesco</CFormLabel>
                <CFormInput
                  type="text"
                  name="RepresentanteParentesco"
                  value={formData.RepresentanteParentesco === "OTRO_VALOR" ? "" : formData.RepresentanteParentesco}
                  onChange={onInputChange}
                  placeholder="Ej: Primo, Padrino..."
                  className="input-premium h-auto py-2"
                />
              </CCol>
            )}
          </CRow>

          <h5 className="mb-3 text-primary form-section-border pb-2">Información del Representante</h5>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel className="fw-bold">Nombres</CFormLabel>
              <CFormInput
                type="text"
                name="RepresentanteNombre"
                value={formData.RepresentanteNombre || ""}
                onChange={onInputChange}
                placeholder="Nombres del representante"
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel className="fw-bold">Apellidos</CFormLabel>
              <CFormInput
                type="text"
                name="RepresentanteApellido"
                value={formData.RepresentanteApellido || ""}
                onChange={onInputChange}
                placeholder="Apellidos del representante"
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel className="fw-bold">Cédula de Identidad</CFormLabel>
              <CFormInput
                type="text"
                name="RepresentanteCedula"
                value={formData.RepresentanteCedula || ""}
                onChange={onInputChange}
                placeholder="V-XXXXXXXX"
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel className="fw-bold">Teléfono de Contacto</CFormLabel>
              <CFormInput
                type="tel"
                name="RepresentanteTelefono"
                value={formData.RepresentanteTelefono || ""}
                onChange={onInputChange}
                placeholder="Ej: 04XX-XXXXXXX"
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel className="fw-bold">Ocupación / Profesión</CFormLabel>
              <CFormInput
                type="text"
                name="RepresentanteOcupacion"
                value={formData.RepresentanteOcupacion || ""}
                onChange={onInputChange}
                placeholder="Ej: Docente, Comerciante..."
                className="input-premium h-auto py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel className="fw-bold">Correo Electrónico</CFormLabel>
              <CFormInput
                type="email"
                name="RepresentanteEmail"
                value={formData.RepresentanteEmail || ""}
                onChange={onInputChange}
                placeholder="correo@ejemplo.com"
                className="input-premium h-auto py-2"
              />
            </CCol>
          </CRow>
        </>
      )}
      <style>{`
        .form-section-border { border-bottom: 2px solid var(--neutral-100) !important; }
        [data-coreui-theme="dark"] .form-section-border { border-bottom-color: rgba(255,255,255,0.05) !important; }
      `}</style>
    </CForm>
  )
}

export default editForm