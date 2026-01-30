import React from "react";
import {
  CForm, CFormInput, CFormSelect,
  CRow, CCol, CFormTextarea, CAlert
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMedicalCross, cilWarning, cilHeart, cilInfo } from "@coreui/icons";

const DatosSalud = ({ formData, onChange, errores = {} }) => {
  return (
    <div className="animate__animated animate__fadeIn">
      <div className="p-4 rounded-4 step-section-bg step-section-border mb-4 text-start">
        <h5 className="mb-0 text-primary d-flex align-items-center fw-bold text-uppercase ls-1" style={{ fontSize: '0.9rem' }}>
          <span className="p-2 bg-primary bg-opacity-10 text-primary rounded-circle me-3">
            <CIcon icon={cilMedicalCross} size="sm" />
          </span>
          Perfil Médico y Biométrico
        </h5>
      </div>



      <CForm>
        <CRow className="g-4">
          <CCol md={12}>
            <h6 className="fw-bold step-label text-uppercase small ls-1 border-bottom pb-2 mb-3">Antropometría Básica</h6>
          </CCol>
          <CCol md={3}>
            <CFormInput
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Peso (kg)
                </span>
              }
              name="peso"
              value={formData.peso}
              onChange={onChange}
              placeholder="Ej: 45"
              type="number"
              min="10"
              max="200"
              className="input-premium py-2"
            />
          </CCol>
          <CCol md={3}>
            <CFormInput
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Estatura (cm)
                </span>
              }
              name="talla"
              value={formData.talla}
              onChange={onChange}
              placeholder="Ej: 150"
              type="number"
              min="50"
              max="250"
              className="input-premium py-2"
            />
          </CCol>
          <CCol md={3}>
            <CFormInput
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Tipo de Sangre
                </span>
              }
              name="tipo_sangre"
              value={formData.tipo_sangre || ""}
              onChange={onChange}
              placeholder="Ej: O+"
              className="input-premium py-2"
            />
          </CCol>
          <CCol md={3}>
            <CFormSelect
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Uso de Lentes Correctivos
                </span>
              }
              name="usa_lentes"
              value={formData.usa_lentes || ""}
              onChange={onChange}
              className="input-premium py-2"
            >
              <option value="">Seleccione</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
              <option value="a_veces">A veces</option>
            </CFormSelect>
          </CCol>
        </CRow>

        <div className="p-4 rounded-4 step-section-bg step-section-border mb-4 mt-5 text-start">
          <h5 className="mb-0 text-primary d-flex align-items-center fw-bold text-uppercase ls-1" style={{ fontSize: '0.9rem' }}>
            <span className="p-2 bg-primary bg-opacity-10 text-primary rounded-circle me-3">
              <CIcon icon={cilHeart} size="sm" />
            </span>
            Antecedentes y Condiciones
          </h5>
        </div>

        <CRow className="g-4">
          <CCol md={6}>
            <CFormSelect
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  ¿Presenta Alergias?
                </span>
              }
              name="alergias"
              value={formData.alergias}
              onChange={onChange}
              className="input-premium py-2"
            >
              <option value="">Seleccione</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
              <option value="no_se">No sé</option>
            </CFormSelect>
          </CCol>
          <CCol md={6}>
            <CFormSelect
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  ¿Intolerancias Alimenticias?
                </span>
              }
              name="intolerancia"
              value={formData.intolerancia}
              onChange={onChange}
              className="input-premium py-2"
            >
              <option value="">Seleccione</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </CFormSelect>
          </CCol>
        </CRow>

        {formData.alergias === "Si" && (
          <CRow className="mt-3 animate__animated animate__fadeIn">
            <CCol md={12}>
              <CFormTextarea
                label={
                  <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                    Descripción de Alergias <span className="text-danger">*</span>
                  </span>
                }
                name="textAlergia"
                value={formData.textAlergia}
                onChange={onChange}
                rows={2}
                placeholder="Ej: Alergia al polen, a los mariscos, al látex..."
                required={formData.alergias === "Si"}
                className={`input-premium py-2 ${errores.textAlergia ? 'is-invalid' : ''}`}
                feedback={errores.textAlergia}
                invalid={!!errores.textAlergia}
              />
            </CCol>
          </CRow>
        )}

        {formData.intolerancia === "Si" && (
          <CRow className="mt-3 animate__animated animate__fadeIn">
            <CCol md={12}>
              <CFormTextarea
                label={
                  <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                    Descripción de Intolerancias <span className="text-danger">*</span>
                  </span>
                }
                name="textIntolerancia"
                value={formData.textIntolerancia}
                onChange={onChange}
                rows={2}
                placeholder="Ej: Intolerancia a la lactosa, al gluten..."
                required={formData.intolerancia === "Si"}
                className="input-premium py-2"
              />
            </CCol>
          </CRow>
        )}

        <CRow className="g-4 mt-1">
          <CCol md={6}>
            <CFormSelect
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  ¿Toma Medicación Regular?
                </span>
              }
              name="medicacion"
              value={formData.medicacion}
              onChange={onChange}
              className="input-premium py-2"
            >
              <option value="">Seleccione</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </CFormSelect>
          </CCol>
          <CCol md={6}>
            <CFormSelect
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  ¿Ha tenidos Intervenciones Quirúrgicas?
                </span>
              }
              name="operaciones"
              value={formData.operaciones}
              onChange={onChange}
              className="input-premium py-2"
            >
              <option value="">Seleccione</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </CFormSelect>
          </CCol>
        </CRow>

        {formData.medicacion === "Si" && (
          <CRow className="mt-3 animate__animated animate__fadeIn">
            <CCol md={12}>
              <CFormTextarea
                label={
                  <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                    Detalle de Medicación / Tratamiento
                  </span>
                }
                name="textMedicacion"
                value={formData.textMedicacion}
                onChange={onChange}
                rows={2}
                placeholder="Nombre de medicamentos, dosis y frecuencia"
                className="input-premium py-2"
              />
            </CCol>
          </CRow>
        )}

        {formData.operaciones === "Si" && (
          <CRow className="mt-3 animate__animated animate__fadeIn">
            <CCol md={12}>
              <CFormTextarea
                label={
                  <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                    Historial Quirúrgico
                  </span>
                }
                name="textOperaciones"
                value={formData.textOperaciones}
                onChange={onChange}
                rows={2}
                placeholder="Tipo de operación, fecha y observaciones"
                className="input-premium py-2"
              />
            </CCol>
          </CRow>
        )}

        <CRow className="mt-4">
          <CCol md={12} className="mb-4">
            <CFormTextarea
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Antecedentes Familiares Relevantes
                </span>
              }
              name="antecedentesFamiliares"
              value={formData.antecedentesFamiliares}
              onChange={onChange}
              rows={3}
              placeholder="Enfermedades hereditarias, condiciones crónicas en la familia..."
              className="input-premium py-2"
            />
          </CCol>
        </CRow>

        <CRow className="g-4">
          <CCol md={6}>
            <CFormSelect
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Aptitud para Actividad Física Intensa
                </span>
              }
              name="actividad_fisica"
              value={formData.actividad_fisica || ""}
              onChange={onChange}
              className="input-premium py-2"
            >
              <option value="">Seleccione</option>
              <option value="si_totalmente">Sí, totalmente</option>
              <option value="si_con_limitaciones">Sí, con limitaciones</option>
              <option value="no">No</option>
              <option value="consulta_medica">Requiere consulta médica</option>
            </CFormSelect>
          </CCol>
          <CCol md={6}>
            <CFormInput
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Médico Tratante / Cabecera
                </span>
              }
              name="medico_tratante"
              value={formData.medico_tratante || ""}
              onChange={onChange}
              placeholder="Nombre del médico de cabecera"
              className="input-premium py-2"
            />
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <CCol md={12}>
            <CFormTextarea
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Otras Observaciones Médicas
                </span>
              }
              name="sintomasFrecuentes"
              value={formData.sintomasFrecuentes}
              onChange={onChange}
              rows={3}
              placeholder="Otra información médica relevante: asma, diabetes, condiciones cardíacas, etc."
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

export default DatosSalud;