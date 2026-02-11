import React from "react";
import { CForm, CFormInput, CRow, CCol, CButton, CFormTextarea } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBriefcase, cilUser, cilPhone, cilAddressBook, cilHeart, cilGroup } from "@coreui/icons";

const SectionHeader = ({ icon, title, color = "primary" }) => (
  <div className={`p-4 rounded-4 step-section-bg border mb-4 text-start border-${color} border-opacity-10`}>
    <h5 className={`mb-0 text-${color} d-flex align-items-center fw-bold text-uppercase ls-1`} style={{ fontSize: '0.9rem' }}>
      <span className={`p-2 bg-${color} bg-opacity-10 text-${color} rounded-circle me-3`}>
        <CIcon icon={icon} size="sm" />
      </span>
      {title}
    </h5>
  </div>
);

const DatosRepresentante = ({ formData, onChange, errores = {} }) => {

  const handleRepChange = (val) => {
    onChange({ target: { name: 'quien_es_representante', value: val } });
  };

  return (
    <div className="animate__animated animate__fadeIn">

      {/* SECCIÓN MADRE */}
      <SectionHeader icon={cilHeart} title="Información de la Madre" color="danger" />
      <CRow className="g-4 mb-5">
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Nombres de la Madre *</span>}
            name="nombre_Madre"
            value={formData.nombre_Madre}
            onChange={onChange}
            placeholder="Ej: María Elena"
            required
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Apellidos de la Madre *</span>}
            name="apellido_Madre"
            value={formData.apellido_Madre}
            onChange={onChange}
            placeholder="Ej: Rodríguez Pérez"
            required
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Cédula *</span>}
            name="cedula_Madre"
            value={formData.cedula_Madre}
            onChange={onChange}
            placeholder="V-12345678"
            required
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Ocupación / Profesión</span>}
            name="ocupacion_Madre"
            value={formData.ocupacion_Madre}
            onChange={onChange}
            placeholder="Ej: Abogada"
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Teléfono Móvil</span>}
            name="telefono_Madre"
            value={formData.telefono_Madre}
            onChange={onChange}
            placeholder="04XX-XXXXXXX"
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Lugar de Trabajo</span>}
            name="trabajo_Madre"
            value={formData.trabajo_Madre}
            onChange={onChange}
            placeholder="Empresa o Institución"
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Dirección del Trabajo</span>}
            name="direccion_Trabajo_Madre"
            value={formData.direccion_Trabajo_Madre}
            onChange={onChange}
            placeholder="Dirección laboral detallada"
            className="input-premium py-2"
          />
        </CCol>
      </CRow>

      {/* SECCIÓN PADRE */}
      <SectionHeader icon={cilUser} title="Información del Padre" color="info" />
      <CRow className="g-4 mb-5">
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Nombres del Padre *</span>}
            name="nombre_Padre"
            value={formData.nombre_Padre}
            onChange={onChange}
            placeholder="Ej: Juan Carlos"
            required
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Apellidos del Padre *</span>}
            name="apellido_Padre"
            value={formData.apellido_Padre}
            onChange={onChange}
            placeholder="Ej: López García"
            required
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Cédula *</span>}
            name="cedula_Padre"
            value={formData.cedula_Padre}
            onChange={onChange}
            placeholder="V-12345678"
            required
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Ocupación / Profesión</span>}
            name="ocupacion_Padre"
            value={formData.ocupacion_Padre}
            onChange={onChange}
            placeholder="Ej: Ingeniero"
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Teléfono Móvil</span>}
            name="telefono_Padre"
            value={formData.telefono_Padre}
            onChange={onChange}
            placeholder="04XX-XXXXXXX"
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Lugar de Trabajo</span>}
            name="trabajo_Padre"
            value={formData.trabajo_Padre}
            onChange={onChange}
            placeholder="Empresa o Institución"
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Dirección del Trabajo</span>}
            name="direccion_Trabajo_Padre"
            value={formData.direccion_Trabajo_Padre}
            onChange={onChange}
            placeholder="Dirección laboral detallada"
            className="input-premium py-2"
          />
        </CCol>
      </CRow>

      {/* ELECCIÓN DEL REPRESENTANTE */}
      <SectionHeader icon={cilGroup} title="Designación del Representante Legal" color="warning" />
      <div className="p-4 rounded-4 bg-light-custom bg-opacity-10 border border-light mb-4">
        <label className="fw-bold step-label text-uppercase ls-1 small mb-3 d-block text-center">
          ¿Quién ejercerá como representante legal ante la institución?
        </label>
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
          {['Madre', 'Padre', 'Otro'].map((option) => (
            <button
              key={option}
              type="button"
              className={`flex-fill py-3 fw-bold border-2 rep-choice-btn ${formData.quien_es_representante === option ? 'active' : ''}`}
              onClick={() => handleRepChange(option)}
            >
              <CIcon icon={option === 'Madre' ? cilHeart : option === 'Padre' ? cilUser : cilGroup} className="me-2" />
              {option.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* CAMPOS CONDICIONALES PARA 'OTRO' */}
      {formData.quien_es_representante === 'Otro' && (
        <div className="animate__animated animate__fadeInUp">
          <CRow className="g-4 mb-4">
            <CCol md={6}>
              <CFormInput
                label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Nombres del Representante *</span>}
                name="nombres_Representante"
                value={formData.nombres_Representante}
                onChange={onChange}
                placeholder="Nombre Representante"
                required
                className="input-premium py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Apellidos del Representante *</span>}
                name="apellidos_Representante"
                value={formData.apellidos_Representante}
                onChange={onChange}
                placeholder="Apellido del Representante"
                required
                className="input-premium py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Parentesco / Relación *</span>}
                name="parentesco_Otro"
                value={formData.parentesco_Otro}
                onChange={onChange}
                placeholder="Ej: Abuelo, Tío, Hermano mayor..."
                required
                className="input-premium py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Teléfono Móvil *</span>}
                name="telefono_Rep"
                value={formData.telefono_Rep}
                onChange={onChange}
                placeholder="04XX-XXXXXXX"
                required
                className="input-premium py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Lugar de Trabajo</span>}
                name="trabajo_Rep"
                value={formData.trabajo_Rep}
                onChange={onChange}
                placeholder="Empresa o Institución"
                className="input-premium py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Dirección del Trabajo</span>}
                name="direccion_Trabajo_Rep"
                value={formData.direccion_Trabajo_Rep}
                onChange={onChange}
                placeholder="Dirección laboral detallada"
                className="input-premium py-2"
              />
            </CCol>
          </CRow>
        </div>
      )}

    </div>
  );
};

export default DatosRepresentante;