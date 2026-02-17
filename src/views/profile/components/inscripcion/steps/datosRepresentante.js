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

const DatosRepresentante = ({ formData, onChange, errores = {}, setErrores }) => {

  const handleRepChange = (val) => {
    // Si cambia a Madre o Padre, limpiar los campos de "Otro"
    if (val === 'Madre' || val === 'Padre') {
      onChange({ target: { name: 'quien_es_representante', value: val } });
      // Limpiar campos de "Otro"
      onChange({ target: { name: 'nombres_Representante', value: '' } });
      onChange({ target: { name: 'apellidos_Representante', value: '' } });
      onChange({ target: { name: 'parentesco_Otro', value: '' } });
      
      // LIMPIAR ERRORES RELACIONADOS
      if (setErrores) {
        const nuevosErrores = { ...errores };
        delete nuevosErrores.nombres_Representante;
        delete nuevosErrores.apellidos_Representante;
        delete nuevosErrores.parentesco_Otro;
        delete nuevosErrores.telefono_Rep;
        setErrores(nuevosErrores);
      }
    } else {
      onChange({ target: { name: 'quien_es_representante', value: val } });
    }
  };

  return (
    <div className="animate__animated animate__fadeIn">

      {/* SECCIÓN MADRE */}
      <SectionHeader icon={cilHeart} title="Información de la Madre" color="danger" />
      <CRow className="g-4 mb-5">
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Nombres de la Madre</span>}
            name="nombre_Madre"
            value={formData.nombre_Madre || ""}
            onChange={onChange}
            placeholder="Ej: María Elena"
            className={`input-premium py-2 ${errores.nombre_Madre ? 'is-invalid' : ''}`}
            feedback={errores.nombre_Madre}
            invalid={!!errores.nombre_Madre}
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Apellidos de la Madre</span>}
            name="apellido_Madre"
            value={formData.apellido_Madre || ""}
            onChange={onChange}
            placeholder="Ej: Rodríguez Pérez"
            className={`input-premium py-2 ${errores.apellido_Madre ? 'is-invalid' : ''}`}
            feedback={errores.apellido_Madre}
            invalid={!!errores.apellido_Madre}
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Cédula</span>}
            name="cedula_Madre"
            value={formData.cedula_Madre || ""}
            onChange={onChange}
            placeholder="V-12345678"
            className={`input-premium py-2 ${errores.cedula_Madre ? 'is-invalid' : ''}`}
            feedback={errores.cedula_Madre}
            invalid={!!errores.cedula_Madre}
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Ocupación / Profesión</span>}
            name="ocupacion_Madre"
            value={formData.ocupacion_Madre || ""}
            onChange={onChange}
            placeholder="Ej: Abogada"
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Teléfono Móvil</span>}
            name="telefono_Madre"
            value={formData.telefono_Madre || ""}
            onChange={onChange}
            placeholder="0412-1234567"
            className={`input-premium py-2 ${errores.telefono_Madre ? 'is-invalid' : ''}`}
            feedback={errores.telefono_Madre}
            invalid={!!errores.telefono_Madre}
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Lugar de Trabajo</span>}
            name="trabajo_Madre"
            value={formData.trabajo_Madre || ""}
            onChange={onChange}
            placeholder="Empresa o Institución"
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Dirección del Trabajo</span>}
            name="direccion_Trabajo_Madre"
            value={formData.direccion_Trabajo_Madre || ""}
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
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Nombres del Padre</span>}
            name="nombre_Padre"
            value={formData.nombre_Padre || ""}
            onChange={onChange}
            placeholder="Ej: Juan Carlos"
            className={`input-premium py-2 ${errores.nombre_Padre ? 'is-invalid' : ''}`}
            feedback={errores.nombre_Padre}
            invalid={!!errores.nombre_Padre}
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Apellidos del Padre</span>}
            name="apellido_Padre"
            value={formData.apellido_Padre || ""}
            onChange={onChange}
            placeholder="Ej: López García"
            className={`input-premium py-2 ${errores.apellido_Padre ? 'is-invalid' : ''}`}
            feedback={errores.apellido_Padre}
            invalid={!!errores.apellido_Padre}
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Cédula</span>}
            name="cedula_Padre"
            value={formData.cedula_Padre || ""}
            onChange={onChange}
            placeholder="V-12345678"
            className={`input-premium py-2 ${errores.cedula_Padre ? 'is-invalid' : ''}`}
            feedback={errores.cedula_Padre}
            invalid={!!errores.cedula_Padre}
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Ocupación / Profesión</span>}
            name="ocupacion_Padre"
            value={formData.ocupacion_Padre || ""}
            onChange={onChange}
            placeholder="Ej: Ingeniero"
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Teléfono Móvil</span>}
            name="telefono_Padre"
            value={formData.telefono_Padre || ""}
            onChange={onChange}
            placeholder="0412-1234567"
            className={`input-premium py-2 ${errores.telefono_Padre ? 'is-invalid' : ''}`}
            feedback={errores.telefono_Padre}
            invalid={!!errores.telefono_Padre}
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Lugar de Trabajo</span>}
            name="trabajo_Padre"
            value={formData.trabajo_Padre || ""}
            onChange={onChange}
            placeholder="Empresa o Institución"
            className="input-premium py-2"
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Dirección del Trabajo</span>}
            name="direccion_Trabajo_Padre"
            value={formData.direccion_Trabajo_Padre || ""}
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
          ¿Quién ejercerá como representante legal ante la institución? <span className="text-danger">*</span>
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
        {errores.quien_es_representante && (
          <div className="text-danger small text-center mt-2">{errores.quien_es_representante}</div>
        )}
      </div>

      {/* CAMPOS CONDICIONALES PARA 'OTRO' */}
      {formData.quien_es_representante === 'Otro' && (
        <div className="animate__animated animate__fadeInUp">
          <CRow className="g-4 mb-4">
            <CCol md={6}>
              <CFormInput
                label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Nombres del Representante <span className="text-danger">*</span></span>}
                name="nombres_Representante"
                value={formData.nombres_Representante || ""}
                onChange={onChange}
                placeholder="Nombre Representante"
                className={`input-premium py-2 ${errores.nombres_Representante ? 'is-invalid' : ''}`}
                feedback={errores.nombres_Representante}
                invalid={!!errores.nombres_Representante}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Apellidos del Representante <span className="text-danger">*</span></span>}
                name="apellidos_Representante"
                value={formData.apellidos_Representante || ""}
                onChange={onChange}
                placeholder="Apellido del Representante"
                className={`input-premium py-2 ${errores.apellidos_Representante ? 'is-invalid' : ''}`}
                feedback={errores.apellidos_Representante}
                invalid={!!errores.apellidos_Representante}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Parentesco / Relación <span className="text-danger">*</span></span>}
                name="parentesco_Otro"
                value={formData.parentesco_Otro || ""}
                onChange={onChange}
                placeholder="Ej: Abuelo, Tío, Hermano mayor..."
                className={`input-premium py-2 ${errores.parentesco_Otro ? 'is-invalid' : ''}`}
                feedback={errores.parentesco_Otro}
                invalid={!!errores.parentesco_Otro}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Teléfono Móvil <span className="text-danger">*</span></span>}
                name="telefono_Rep"
                value={formData.telefono_Rep || ""}
                onChange={onChange}
                placeholder="0412-1234567"
                className={`input-premium py-2 ${errores.telefono_Rep ? 'is-invalid' : ''}`}
                feedback={errores.telefono_Rep}
                invalid={!!errores.telefono_Rep}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Lugar de Trabajo</span>}
                name="trabajo_Rep"
                value={formData.trabajo_Rep || ""}
                onChange={onChange}
                placeholder="Empresa o Institución"
                className="input-premium py-2"
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label={<span className="fw-bold step-label text-uppercase ls-1 small mb-1">Dirección del Trabajo</span>}
                name="direccion_Trabajo_Rep"
                value={formData.direccion_Trabajo_Rep || ""}
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