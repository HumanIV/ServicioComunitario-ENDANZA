import React from "react";
import { CForm, CFormInput, CFormSelect, CRow, CCol, CFormTextarea } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser, cilCalendar, cilPhone, cilHome } from "@coreui/icons";

const DatosEstudiante = ({ formData, onChange, errores = {}, mode = "completo" }) => {
  const esModoBasico = mode === "basico";

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="p-4 rounded-4 step-section-bg step-section-border mb-4 text-start">
        <h5 className="mb-0 text-primary d-flex align-items-center fw-bold text-uppercase ls-1" style={{ fontSize: '0.9rem' }}>
          <span className="p-2 bg-primary bg-opacity-10 text-primary rounded-circle me-3">
            <CIcon icon={cilUser} size="sm" />
          </span>
          Información del Estudiante
        </h5>
      </div>

      <CForm>
        <CRow className="g-4">
          <CCol md={6}>
            <CFormInput
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Nombres <span className="text-danger">*</span>
                </span>
              }
              name="nombres"
              value={formData.nombres}
              onChange={onChange}
              placeholder="María José"
              required
              className={`input-premium py-2 ${errores.nombres ? 'is-invalid' : ''}`}
              feedback={errores.nombres}
              invalid={!!errores.nombres}
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Apellidos <span className="text-danger">*</span>
                </span>
              }
              name="apellidos"
              value={formData.apellidos}
              onChange={onChange}
              placeholder="Rodríguez Pérez"
              required
              className={`input-premium py-2 ${errores.apellidos ? 'is-invalid' : ''}`}
              feedback={errores.apellidos}
              invalid={!!errores.apellidos}
            />
          </CCol>
        </CRow>

        <CRow className="g-4 mt-1">
          <CCol md={esModoBasico ? 6 : 4}>
            <CFormInput
              type="date"
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Fecha de nacimiento
                </span>
              }
              name="fecha_nac"
              value={formData.fecha_nac}
              onChange={onChange}
              className="input-premium py-2"
              feedbackInvalid="Seleccione una fecha válida"
            />
          </CCol>

          {!esModoBasico && (
            <CCol md={4}>
              <CFormInput
                label={
                  <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                    Edad Actual
                  </span>
                }
                name="edad"
                value={formData.edad}
                onChange={onChange}
                placeholder="Ej: 12"
                type="number"
                min="4"
                max="30"
                className="input-premium py-2"
              />
            </CCol>
          )}

          <CCol md={esModoBasico ? 6 : 4}>
            <CFormInput
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Teléfono celular <span className="text-danger">{esModoBasico ? '*' : ''}</span>
                </span>
              }
              name="Telefono_Celular"
              value={formData.Telefono_Celular}
              onChange={onChange}
              placeholder="0412-1234567"
              required={esModoBasico}
              className={`input-premium py-2 ${errores.Telefono_Celular ? 'is-invalid' : ''}`}
              feedback={errores.Telefono_Celular}
              invalid={!!errores.Telefono_Celular}
            />
          </CCol>
        </CRow>

        {/* Campos específicos para modo completo */}
        {!esModoBasico && (
          <>
            <CRow className="g-4 mt-1">
              <CCol md={8}>
                <CFormInput
                  label={
                    <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                      Dirección de Habitación
                    </span>
                  }
                  name="direccion_Habitacion"
                  value={formData.direccion_Habitacion}
                  onChange={onChange}
                  placeholder="Av. Principal #123, Urb. Las Acacias"
                  className="input-premium py-2"
                />
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  label={
                    <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                      Grado Académico <span className="text-danger">*</span>
                    </span>
                  }
                  name="grado"
                  value={formData.grado}
                  onChange={onChange}
                  required
                  className={`input-premium py-2 ${errores.grado ? 'is-invalid' : ''}`}
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

            <CRow className="g-4 mt-1">
              <CCol md={6}>
                <CFormInput
                  label={
                    <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                      Especialidad de Interés
                    </span>
                  }
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={onChange}
                  placeholder="Ej: Ballet Clásico, Danza Contemporánea"
                  className="input-premium py-2"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label={
                    <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                      Régimen de Convivencia
                    </span>
                  }
                  name="convivencia"
                  value={formData.convivencia}
                  onChange={onChange}
                  placeholder="Ej: Con padres, con abuelos"
                  className="input-premium py-2"
                />
              </CCol>
            </CRow>

            <div className="p-4 rounded-4 step-section-bg step-section-border mb-4 mt-5 text-start">
              <h5 className="mb-0 text-primary d-flex align-items-center fw-bold text-uppercase ls-1" style={{ fontSize: '0.9rem' }}>
                <span className="p-2 bg-primary bg-opacity-10 text-primary rounded-circle me-3">
                  <CIcon icon={cilHome} size="sm" />
                </span>
                Información Académica Externa
              </h5>
            </div>

            <CRow className="g-4">
              <CCol md={6}>
                <CFormInput
                  label={
                    <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                      Escuela / Institución Actual
                    </span>
                  }
                  name="escuela"
                  value={formData.escuela}
                  onChange={onChange}
                  placeholder="Colegio o institución actual"
                  className="input-premium py-2"
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  label={
                    <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                      Grado Escolar
                    </span>
                  }
                  name="Grado_Escuela"
                  value={formData.Grado_Escuela}
                  onChange={onChange}
                  placeholder="Ej: 7mo grado"
                  className="input-premium py-2"
                />
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  label={
                    <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                      Posee Seguro Escolar
                    </span>
                  }
                  name="Seguro_Escolar"
                  value={formData.Seguro_Escolar}
                  onChange={onChange}
                  className="input-premium py-2"
                >
                  <option value="">Seleccione</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </CFormSelect>
              </CCol>
            </CRow>

            {formData.Seguro_Escolar === "si" && (
              <CRow className="mt-2 animate__animated animate__fadeIn">
                <CCol md={12}>
                  <CFormInput
                    label={
                      <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                        Nombre de la Aseguradora
                      </span>
                    }
                    name="nombre_Seguro"
                    value={formData.nombre_Seguro}
                    onChange={onChange}
                    placeholder="Nombre de la aseguradora"
                    className="input-premium py-2"
                  />
                </CCol>
              </CRow>
            )}
          </>
        )}

        {/* Solo para modo básico */}
        {esModoBasico && (
          <CRow className="mt-2">
            <CCol md={12}>
              <CFormSelect
                label={
                  <span className="fw-bold text-secondary text-uppercase ls-1 small mb-1">
                    Grado de Interés <span className="text-danger">*</span>
                  </span>
                }
                name="grado_interes"
                value={formData.grado_interes}
                onChange={onChange}
                required
                className={`input-premium py-2 ${errores.grado_interes ? 'is-invalid' : ''}`}
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