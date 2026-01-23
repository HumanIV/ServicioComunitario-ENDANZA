import React from "react";
import { CForm, CFormInput, CFormSelect, CRow, CCol, CFormTextarea } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBriefcase, cilPhone, cilBuilding, cilAddressBook } from "@coreui/icons";

const DatosRepresentante = ({ formData, onChange, errores = {} }) => {
  return (
    <div>
      <h5 className="mb-4">
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
              onChange={onChange}
              placeholder="Carlos Antonio"
              required
              className={errores.nombres_Representante ? 'is-invalid' : ''}
              feedback={errores.nombres_Representante}
              invalid={!!errores.nombres_Representante}
            />
          </CCol>
          <CCol md={6} className="mb-3">
            <CFormInput
              label="Apellidos"
              name="apellidos_Representante"
              value={formData.apellidos_Representante}
              onChange={onChange}
              placeholder="López Martínez"
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol md={4} className="mb-3">
            <CFormInput
              label="Teléfono móvil *"
              name="telefono_Rep"
              value={formData.telefono_Rep}
              onChange={onChange}
              placeholder="0414-7654321"
              required
              className={errores.telefono_Rep ? 'is-invalid' : ''}
              feedback={errores.telefono_Rep}
              invalid={!!errores.telefono_Rep}
            />
          </CCol>
          <CCol md={4} className="mb-3">
            <CFormInput
              label="Teléfono fijo"
              name="telefonofijo_Rep"
              value={formData.telefonofijo_Rep}
              onChange={onChange}
              placeholder="0212-1234567"
            />
          </CCol>
          <CCol md={4} className="mb-3">
            <CFormSelect
              label="Parentesco *"
              name="relacion"
              value={formData.relacion || ""}
              onChange={onChange}
              required
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

        <CRow>
          <CCol md={6} className="mb-3">
            <CFormInput
              label="Profesión/Ocupación"
              name="profesion"
              value={formData.profesion}
              onChange={onChange}
              placeholder="Ej: Ingeniero, Docente, Comerciante"
            />
          </CCol>
          <CCol md={6} className="mb-3">
            <CFormInput
              label="Lugar de trabajo"
              name="trabajo"
              value={formData.trabajo}
              onChange={onChange}
              placeholder="Empresa o institución"
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol md={12} className="mb-3">
            <CFormTextarea
              label="Dirección del trabajo"
              name="direccion_Trabajo"
              value={formData.direccion_Trabajo}
              onChange={onChange}
              rows={2}
              placeholder="Dirección completa del lugar de trabajo"
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol md={6} className="mb-3">
            <CFormInput
              label="Correo electrónico"
              name="email_representante"
              type="email"
              value={formData.email_representante || ""}
              onChange={onChange}
              placeholder="correo@ejemplo.com"
              feedbackInvalid="Ingrese un correo válido"
            />
          </CCol>
          <CCol md={6} className="mb-3">
            <CFormSelect
              label="Nivel de estudios"
              name="nivel_estudios"
              value={formData.nivel_estudios || ""}
              onChange={onChange}
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

        <CRow>
          <CCol md={12} className="mb-3">
            <CFormTextarea
              label="Observaciones adicionales"
              name="observaciones_representante"
              value={formData.observaciones_representante || ""}
              onChange={onChange}
              rows={2}
              placeholder="Alguna observación importante sobre el representante"
            />
          </CCol>
        </CRow>
      </CForm>
    </div>
  );
};

export default DatosRepresentante;