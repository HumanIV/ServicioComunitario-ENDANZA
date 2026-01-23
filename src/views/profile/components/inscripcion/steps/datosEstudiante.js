import React from "react";
import { CForm, CFormInput, CFormSelect, CRow, CCol, CFormTextarea } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser, cilCalendar, cilPhone, cilHome } from "@coreui/icons";

const DatosEstudiante = ({ formData, onChange, errores = {}, mode = "completo" }) => {
  const esModoBasico = mode === "basico";
  
  return (
    <div>
      <h5 className="mb-4">
        <CIcon icon={cilUser} className="me-2" />
        Datos del Estudiante
      </h5>
      
      <CForm>
        <CRow>
          <CCol md={6} className="mb-3">
            <CFormInput
              label="Nombres *"
              name="nombres"
              value={formData.nombres}
              onChange={onChange}
              placeholder="María José"
              required
              className={errores.nombres ? 'is-invalid' : ''}
              feedback={errores.nombres}
              invalid={!!errores.nombres}
            />
          </CCol>
          <CCol md={6} className="mb-3">
            <CFormInput
              label="Apellidos *"
              name="apellidos"
              value={formData.apellidos}
              onChange={onChange}
              placeholder="Rodríguez Pérez"
              required
              className={errores.apellidos ? 'is-invalid' : ''}
              feedback={errores.apellidos}
              invalid={!!errores.apellidos}
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol md={esModoBasico ? 6 : 4} className="mb-3">
            <CFormInput
              type="date"
              label="Fecha de nacimiento"
              name="fecha_nac"
              value={formData.fecha_nac}
              onChange={onChange}
              feedbackInvalid="Seleccione una fecha válida"
            />
          </CCol>
          
          {!esModoBasico && (
            <CCol md={4} className="mb-3">
              <CFormInput
                label="Edad"
                name="edad"
                value={formData.edad}
                onChange={onChange}
                placeholder="Ej: 12"
                type="number"
                min="4"
                max="30"
              />
            </CCol>
          )}
          
          <CCol md={esModoBasico ? 6 : 4} className="mb-3">
            <CFormInput
              label={`Teléfono celular ${esModoBasico ? '*' : ''}`}
              name="Telefono_Celular"
              value={formData.Telefono_Celular}
              onChange={onChange}
              placeholder="0412-1234567"
              required={esModoBasico}
              className={errores.Telefono_Celular ? 'is-invalid' : ''}
              feedback={errores.Telefono_Celular}
              invalid={!!errores.Telefono_Celular}
            />
          </CCol>
        </CRow>

        {/* Campos específicos para modo completo */}
        {!esModoBasico && (
          <>
            <CRow>
              <CCol md={8} className="mb-3">
                <CFormInput
                  label="Dirección"
                  name="direccion_Habitacion"
                  value={formData.direccion_Habitacion}
                  onChange={onChange}
                  placeholder="Av. Principal #123, Urb. Las Acacias"
                />
              </CCol>
              <CCol md={4} className="mb-3">
                <CFormSelect
                  label="Grado *"
                  name="grado"
                  value={formData.grado}
                  onChange={onChange}
                  required
                  className={errores.grado ? 'is-invalid' : ''}
                  feedback={errores.grado}
                  invalid={!!errores.grado}
                >
                  <option value="">Seleccione…</option>
                  <option value="iniciacion">Iniciación</option>
                  <option value="1ro">1ro - Básico</option>
                  <option value="2do">2do - Intermedio I</option>
                  <option value="3ro">3ro - Intermedio II</option>
                  <option value="4to">4to - Avanzado</option>
                  <option value="preparatorio">Preparatorio</option>
                  <option value="profesional">Profesional</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6} className="mb-3">
                <CFormInput
                  label="Especialidad"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={onChange}
                  placeholder="Ej: Ballet Clásico, Danza Contemporánea"
                />
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormInput
                  label="Convivencia"
                  name="convivencia"
                  value={formData.convivencia}
                  onChange={onChange}
                  placeholder="Ej: Con padres, con abuelos"
                />
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6} className="mb-3">
                <CFormInput
                  label="Escuela/Institución"
                  name="escuela"
                  value={formData.escuela}
                  onChange={onChange}
                  placeholder="Colegio o institución actual"
                />
              </CCol>
              <CCol md={3} className="mb-3">
                <CFormInput
                  label="Grado escolar"
                  name="Grado_Escuela"
                  value={formData.Grado_Escuela}
                  onChange={onChange}
                  placeholder="Ej: 7mo grado"
                />
              </CCol>
              <CCol md={3} className="mb-3">
                <CFormSelect
                  label="Seguro escolar"
                  name="Seguro_Escolar"
                  value={formData.Seguro_Escolar}
                  onChange={onChange}
                >
                  <option value="">Seleccione</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </CFormSelect>
              </CCol>
            </CRow>

            {formData.Seguro_Escolar === "si" && (
              <CRow>
                <CCol md={12} className="mb-3">
                  <CFormInput
                    label="Nombre del seguro"
                    name="nombre_Seguro"
                    value={formData.nombre_Seguro}
                    onChange={onChange}
                    placeholder="Nombre de la aseguradora"
                  />
                </CCol>
              </CRow>
            )}
          </>
        )}

        {/* Solo para modo básico */}
        {esModoBasico && (
          <CRow>
            <CCol md={12} className="mb-3">
              <CFormSelect
                label="Grado de interés *"
                name="grado_interes"
                value={formData.grado_interes}
                onChange={onChange}
                required
                className={errores.grado_interes ? 'is-invalid' : ''}
                feedback={errores.grado_interes}
                invalid={!!errores.grado_interes}
              >
                <option value="">Seleccione el nivel...</option>
                <option value="iniciacion">Iniciación (4-6 años)</option>
                <option value="basico">Básico (7-9 años)</option>
                <option value="intermedio">Intermedio (10-12 años)</option>
                <option value="avanzado">Avanzado (13+ años)</option>
                <option value="adultos">Clases para adultos</option>
              </CFormSelect>
            </CCol>
          </CRow>
        )}
      </CForm>
    </div>
  );
};

export default DatosEstudiante;