import React from "react";
import { CForm, CFormInput, CFormSelect, CRow, CCol, CFormTextarea } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBriefcase, cilPhone, cilBuilding, cilAddressBook } from "@coreui/icons";

const DatosRepresentante = ({ formData, onChange, errores = {} }) => {
  return (
    <div className="animate__animated animate__fadeIn">
      <div className="p-4 rounded-4 step-section-bg step-section-border mb-4 text-start">
        <h5 className="mb-0 text-primary d-flex align-items-center fw-bold text-uppercase ls-1" style={{ fontSize: '0.9rem' }}>
          <span className="p-2 bg-primary bg-opacity-10 text-primary rounded-circle me-3">
            <CIcon icon={cilBriefcase} size="sm" />
          </span>
          Información del Representante Legal
        </h5>
      </div>

      <CForm>
        <CRow className="g-4">
          <CCol md={6}>
            <CFormInput
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Nombres del Representante <span className="text-danger">*</span>
                </span>
              }
              name="nombres_Representante"
              value={formData.nombres_Representante}
              onChange={onChange}
              placeholder="Carlos Antonio"
              required
              className={`input-premium py-2 ${errores.nombres_Representante ? 'is-invalid' : ''}`}
              feedback={errores.nombres_Representante}
              invalid={!!errores.nombres_Representante}
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Apellidos del Representante
                </span>
              }
              name="apellidos_Representante"
              value={formData.apellidos_Representante}
              onChange={onChange}
              placeholder="López Martínez"
              className="input-premium py-2"
            />
          </CCol>
        </CRow>

        <CRow className="g-4 mt-1">
          <CCol md={4}>
            <CFormInput
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Teléfono Móvil <span className="text-danger">*</span>
                </span>
              }
              name="telefono_Rep"
              value={formData.telefono_Rep}
              onChange={onChange}
              placeholder="0414-7654321"
              required
              className={`input-premium py-2 ${errores.telefono_Rep ? 'is-invalid' : ''}`}
              feedback={errores.telefono_Rep}
              invalid={!!errores.telefono_Rep}
            />
          </CCol>
          <CCol md={4}>
            <CFormInput
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Teléfono de Habitación
                </span>
              }
              name="telefonofijo_Rep"
              value={formData.telefonofijo_Rep}
              onChange={onChange}
              placeholder="0212-1234567"
              className="input-premium py-2"
            />
          </CCol>
          <CCol md={4}>
            <CFormSelect
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Parentesco con el Alumno <span className="text-danger">*</span>
                </span>
              }
              name="relacion"
              value={formData.relacion || ""}
              onChange={onChange}
              required
              className="input-premium py-2"
            >
              <option value="">Seleccione...</option>
              <option value="madre">Madre</option>
              <option value="padre">Padre</option>
              <option value="abuelo">Abuelo/a</option>
              <option value="tio">Tío/a</option>
              <option value="hermano">Hermano/a mayor</option>
              <option value="tutor">Tutor legal</option>
              <option value="otro">Otro</option>
            </CFormSelect>
          </CCol>
        </CRow>

        <div className="p-4 rounded-4 step-section-bg border border-light mb-4 mt-5 text-start">
          <h5 className="mb-0 text-primary d-flex align-items-center fw-bold text-uppercase ls-1" style={{ fontSize: '0.9rem' }}>
            <span className="p-2 bg-primary bg-opacity-10 text-primary rounded-circle me-3">
              <CIcon icon={cilBuilding} size="sm" />
            </span>
            Información Laboral
          </h5>
        </div>

        <CRow className="g-4">
          <CCol md={6}>
            <CFormInput
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Profesión u Ocupación
                </span>
              }
              name="profesion"
              value={formData.profesion}
              onChange={onChange}
              placeholder="Ej: Ingeniero, Docente, Comerciante"
              className="input-premium py-2"
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Empresa / Lugar de Trabajo
                </span>
              }
              name="trabajo"
              value={formData.trabajo}
              onChange={onChange}
              placeholder="Empresa o institución"
              className="input-premium py-2"
            />
          </CCol>
        </CRow>

        <CRow className="mt-2 text-start">
          <CCol md={12}>
            <CFormTextarea
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Dirección Detallada del Trabajo
                </span>
              }
              name="direccion_Trabajo"
              value={formData.direccion_Trabajo}
              onChange={onChange}
              rows={2}
              placeholder="Dirección completa del lugar de trabajo"
              className="input-premium py-2"
            />
          </CCol>
        </CRow>

        <CRow className="g-4 mt-1">
          <CCol md={6}>
            <CFormInput
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Correo Electrónico Personal
                </span>
              }
              name="email_representante"
              type="email"
              value={formData.email_representante || ""}
              onChange={onChange}
              placeholder="correo@ejemplo.com"
              feedbackInvalid="Ingrese un correo válido"
              className="input-premium py-2"
            />
          </CCol>
          <CCol md={6}>
            <CFormSelect
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Nivel de Instrucción
                </span>
              }
              name="nivel_estudios"
              value={formData.nivel_estudios || ""}
              onChange={onChange}
              className="input-premium py-2"
            >
              <option value="">Seleccione...</option>
              <option value="primaria">Primaria</option>
              <option value="secundaria">Secundaria</option>
              <option value="tecnico">Técnico medio</option>
              <option value="universitario">Universitario</option>
              <option value="postgrado">Postgrado</option>
            </CFormSelect>
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <CCol md={12}>
            <CFormTextarea
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Notas u Observaciones Adicionales
                </span>
              }
              name="observaciones_representante"
              value={formData.observaciones_representante || ""}
              onChange={onChange}
              rows={3}
              placeholder="Alguna observación importante sobre el representante"
              className="input-premium py-2"
            />
          </CCol>
        </CRow>
      </CForm>
      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .step-section-bg { background-color: var(--neutral-50); }
        .step-label { color: var(--neutral-600); }

        [data-coreui-theme="dark"] .step-section-bg { background-color: rgba(255,255,255,0.02); }
        [data-coreui-theme="dark"] .step-label { color: rgba(255,255,255,0.7); }
        .step-section-border { border: 1px solid var(--neutral-200) !important; }
        [data-coreui-theme="dark"] .step-section-border { border: 1px solid rgba(255,255,255,0.05) !important; }
        
        /* Forzar alineación de inputs mediante altura mínima de etiquetas */
        span.step-label { min-height: 2.2rem; display: block; }
      `}</style>
    </div>
  );
};

export default DatosRepresentante;