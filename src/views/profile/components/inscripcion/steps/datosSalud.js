import React from "react";
import { 
  CForm, CFormInput, CFormSelect, 
  CRow, CCol, CFormTextarea, CAlert 
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMedicalCross, cilWarning, cilHeart,  } from "@coreui/icons";

const DatosSalud = ({ formData, onChange, errores = {} }) => {
  return (
    <div>
      <h5 className="mb-4">
        <CIcon icon={cilMedicalCross} className="me-2" />
        Datos de Salud
      </h5>
      
      <CAlert color="info" className="mb-4">
        <CIcon icon={cilWarning} className="me-2" />
        <strong>Información confidencial:</strong> Estos datos son estrictamente confidenciales 
        y se utilizarán únicamente para garantizar la seguridad y bienestar del estudiante.
      </CAlert>
      
      <CForm>
        <h6 className="mb-3 text-primary">
          Medidas físicas
        </h6>
        <CRow>
          <CCol md={3} className="mb-3">
            <CFormInput
              label="Peso (kg)"
              name="peso"
              value={formData.peso}
              onChange={onChange}
              placeholder="Ej: 45"
              type="number"
              min="10"
              max="200"
            />
          </CCol>
          <CCol md={3} className="mb-3">
            <CFormInput
              label="Talla (cm)"
              name="talla"
              value={formData.talla}
              onChange={onChange}
              placeholder="Ej: 150"
              type="number"
              min="50"
              max="250"
            />
          </CCol>
          <CCol md={3} className="mb-3">
            <CFormInput
              label="Tipo de sangre"
              name="tipo_sangre"
              value={formData.tipo_sangre || ""}
              onChange={onChange}
              placeholder="Ej: O+"
            />
          </CCol>
          <CCol md={3} className="mb-3">
            <CFormSelect
              label="Uso de lentes"
              name="usa_lentes"
              value={formData.usa_lentes || ""}
              onChange={onChange}
            >
              <option value="">Seleccione</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
              <option value="a_veces">A veces</option>
            </CFormSelect>
          </CCol>
        </CRow>

        <h6 className="mb-3 mt-4 text-primary">
          <CIcon icon={cilHeart} className="me-2" />
          Condiciones médicas
        </h6>
        
        <CRow>
          <CCol md={6} className="mb-3">
            <CFormSelect
              label="¿Tiene alergias?"
              name="alergias"
              value={formData.alergias}
              onChange={onChange}
            >
              <option value="">Seleccione</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
              <option value="no_se">No sé</option>
            </CFormSelect>
          </CCol>
          <CCol md={6} className="mb-3">
            <CFormSelect
              label="¿Tiene intolerancias alimenticias?"
              name="intolerancia"
              value={formData.intolerancia}
              onChange={onChange}
            >
              <option value="">Seleccione</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </CFormSelect>
          </CCol>
        </CRow>

        {formData.alergias === "Si" && (
          <CRow>
            <CCol md={12} className="mb-3">
              <CFormTextarea
                label="Describa las alergias *"
                name="textAlergia"
                value={formData.textAlergia}
                onChange={onChange}
                rows={2}
                placeholder="Ej: Alergia al polen, a los mariscos, al látex..."
                required={formData.alergias === "Si"}
                className={errores.textAlergia ? 'is-invalid' : ''}
                feedback={errores.textAlergia}
                invalid={!!errores.textAlergia}
              />
            </CCol>
          </CRow>
        )}

        {formData.intolerancia === "Si" && (
          <CRow>
            <CCol md={12} className="mb-3">
              <CFormTextarea
                label="Describa las intolerancias *"
                name="textIntolerancia"
                value={formData.textIntolerancia}
                onChange={onChange}
                rows={2}
                placeholder="Ej: Intolerancia a la lactosa, al gluten..."
                required={formData.intolerancia === "Si"}
              />
            </CCol>
          </CRow>
        )}

        <CRow>
          <CCol md={6} className="mb-3">
            <CFormSelect
              label="¿Toma medicación regular?"
              name="medicacion"
              value={formData.medicacion}
              onChange={onChange}
            >
              <option value="">Seleccione</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </CFormSelect>
          </CCol>
          <CCol md={6} className="mb-3">
            <CFormSelect
              label="¿Ha tenido operaciones?"
              name="operaciones"
              value={formData.operaciones}
              onChange={onChange}
            >
              <option value="">Seleccione</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </CFormSelect>
          </CCol>
        </CRow>

        {formData.medicacion === "Si" && (
          <CRow>
            <CCol md={12} className="mb-3">
              <CFormTextarea
                label="Describa la medicación"
                name="textMedicacion"
                value={formData.textMedicacion}
                onChange={onChange}
                rows={2}
                placeholder="Nombre de medicamentos, dosis y frecuencia"
              />
            </CCol>
          </CRow>
        )}

        {formData.operaciones === "Si" && (
          <CRow>
            <CCol md={12} className="mb-3">
              <CFormTextarea
                label="Describa las operaciones"
                name="textOperaciones"
                value={formData.textOperaciones}
                onChange={onChange}
                rows={2}
                placeholder="Tipo de operación, fecha y observaciones"
              />
            </CCol>
          </CRow>
        )}

        <CRow>
          <CCol md={12} className="mb-3">
            <CFormTextarea
              label="Antecedentes familiares importantes"
              name="antecedentesFamiliares"
              value={formData.antecedentesFamiliares}
              onChange={onChange}
              rows={3}
              placeholder="Enfermedades hereditarias, condiciones crónicas en la familia..."
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol md={12} className="mb-3">
            <CFormTextarea
              label="Observaciones médicas adicionales"
              name="sintomasFrecuentes"
              value={formData.sintomasFrecuentes}
              onChange={onChange}
              rows={3}
              placeholder="Otra información médica relevante: asma, diabetes, condiciones cardíacas, etc."
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol md={6} className="mb-3">
            <CFormSelect
              label="¿Puede participar en actividad física intensa?"
              name="actividad_fisica"
              value={formData.actividad_fisica || ""}
              onChange={onChange}
            >
              <option value="">Seleccione</option>
              <option value="si_totalmente">Sí, totalmente</option>
              <option value="si_con_limitaciones">Sí, con limitaciones</option>
              <option value="no">No</option>
              <option value="consulta_medica">Requiere consulta médica</option>
            </CFormSelect>
          </CCol>
          <CCol md={6} className="mb-3">
            <CFormInput
              label="Médico tratante"
              name="medico_tratante"
              value={formData.medico_tratante || ""}
              onChange={onChange}
              placeholder="Nombre del médico de cabecera"
            />
          </CCol>
        </CRow>
      </CForm>
    </div>
  );
};

export default DatosSalud;