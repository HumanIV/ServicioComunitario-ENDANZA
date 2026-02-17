import React, { useState, useEffect } from "react";
import { CForm, CFormInput, CFormSelect, CRow, CCol } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser, cilCalendar, cilHome, cilSchool } from "@coreui/icons";

const DatosEstudiante = ({ formData, onChange, errores = {}, mode = "completo" }) => {
  const esModoBasico = mode === "basico";
  
  // Estado local para controlar el tipo de estudio externo
  const [tipoEstudioExterno, setTipoEstudioExterno] = useState("escuela");
  
  // Efecto para inicializar tipoEstudioExterno si hay valor previo
  useEffect(() => {
    if (formData.Grado_Escuela) {
      const gradoStr = String(formData.Grado_Escuela).toLowerCase();
      if (gradoStr.includes('año') || gradoStr.includes('1er año') || gradoStr.includes('5to año')) {
        setTipoEstudioExterno('bachillerato');
      }
    }
  }, [formData.Grado_Escuela]);

  // Función para manejar el cambio de tipo de estudio externo
  const handleTipoEstudioChange = (e) => {
    const nuevoTipo = e.target.value;
    setTipoEstudioExterno(nuevoTipo);
    onChange({ target: { name: 'Grado_Escuela', value: '' } });
  };

  // Función para determinar si el grado es avanzado (6to a 8vo)
  const esGradoAvanzado = () => {
    const grado = formData.grado;
    return grado === "6to_grado" || grado === "7mo_grado" || grado === "8vo_grado";
  };

  // Opciones para grados de danza (1er grado a 8vo grado)
  const gradosDanza = [
    { value: "1er_grado", label: "1er Grado" },
    { value: "2do_grado", label: "2do Grado" },
    { value: "3er_grado", label: "3er Grado" },
    { value: "4to_grado", label: "4to Grado" },
    { value: "5to_grado", label: "5to Grado" },
    { value: "6to_grado", label: "6to Grado" },
    { value: "7mo_grado", label: "7mo Grado" },
    { value: "8vo_grado", label: "8vo Grado" }
  ];

  // Opciones para especialidades (solo para grados avanzados)
  const opcionesEspecialidades = [
    { value: "ballet_clasico", label: "Ballet Clásico" },
    { value: "danza_contemporanea", label: "Danza Contemporánea" },
    { value: "danza_tradicional", label: "Danza Tradicional" }
  ];

  // Opciones para grados escolares externos (Escuela)
  const gradosEscuela = [
    { value: "1er_grado", label: "1er Grado" },
    { value: "2do_grado", label: "2do Grado" },
    { value: "3er_grado", label: "3er Grado" },
    { value: "4to_grado", label: "4to Grado" },
    { value: "5to_grado", label: "5to Grado" },
    { value: "6to_grado", label: "6to Grado" },
    { value: "7mo_grado", label: "7mo Grado" },
    { value: "8vo_grado", label: "8vo Grado" }
  ];

  // Opciones para años de bachillerato
  const añosBachillerato = [
    { value: "1er_año", label: "1er Año" },
    { value: "2do_año", label: "2do Año" },
    { value: "3er_año", label: "3er Año" },
    { value: "4to_año", label: "4to Año" },
    { value: "5to_año", label: "5to Año" }
  ];

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
              readOnly
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
              readOnly
            />
          </CCol>
        </CRow>

        <CRow className="g-4 mt-1">
          <CCol md={esModoBasico ? 6 : 4}>
            <CFormInput
              type="date"
              label={
                <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                  Fecha de nacimiento <span className="text-danger">*</span>
                </span>
              }
              name="fecha_nac"
              value={formData.fecha_nac}
              onChange={onChange}
              className={`input-premium py-2 ${errores.fecha_nac ? 'is-invalid' : ''}`}
              feedbackInvalid="Seleccione una fecha válida"
              required
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
                readOnly
              />
            </CCol>
          )}
        </CRow>

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
                      Grado Académico (Danza) <span className="text-danger">*</span>
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
                  <option value="">Seleccione grado de danza...</option>
                  {gradosDanza.map(grado => (
                    <option key={grado.value} value={grado.value}>
                      {grado.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            {/* Campo de Especialidad - SOLO para grados 6to, 7mo y 8vo */}
            {esGradoAvanzado() && (
              <CRow className="g-4 mt-1">
                <CCol md={6}>
                  <CFormSelect
                    label={
                      <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                        Especialidad de Interés <span className="text-danger">*</span>
                      </span>
                    }
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={onChange}
                    className={`input-premium py-2 ${errores.especialidad ? 'is-invalid' : ''}`}
                    feedback={errores.especialidad}
                    invalid={!!errores.especialidad}
                    required
                  >
                    <option value="">Seleccione especialidad...</option>
                    {opcionesEspecialidades.map(opcion => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </CFormSelect>
                  <small className="text-muted mt-1 d-block">
                    <CIcon icon={cilSchool} className="me-1" size="sm" />
                    Para niveles avanzados, debe seleccionar una especialidad
                  </small>
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
            )}

            {/* Solo mostrar Régimen de Convivencia si NO es grado avanzado */}
            {!esGradoAvanzado() && (
              <CRow className="g-4 mt-1">
                <CCol md={12}>
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
            )}

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
                <CFormSelect
                  label={
                    <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                      Tipo de Estudio
                    </span>
                  }
                  value={tipoEstudioExterno}
                  onChange={handleTipoEstudioChange}
                  className="input-premium py-2"
                >
                  <option value="escuela">Escuela (1° a 8° grado)</option>
                  <option value="bachillerato">Bachillerato (1° a 5° año)</option>
                </CFormSelect>
              </CCol>
              
              <CCol md={3}>
                {tipoEstudioExterno === 'escuela' ? (
                  <CFormSelect
                    label={
                      <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                        Grado Escolar
                      </span>
                    }
                    name="Grado_Escuela"
                    value={formData.Grado_Escuela}
                    onChange={onChange}
                    className="input-premium py-2"
                  >
                    <option value="">Seleccione grado...</option>
                    {gradosEscuela.map(grado => (
                      <option key={grado.value} value={grado.value}>
                        {grado.label}
                      </option>
                    ))}
                  </CFormSelect>
                ) : (
                  <CFormSelect
                    label={
                      <span className="fw-bold step-label text-uppercase ls-1 small mb-1">
                        Año de Bachillerato
                      </span>
                    }
                    name="Grado_Escuela"
                    value={formData.Grado_Escuela}
                    onChange={onChange}
                    className="input-premium py-2"
                  >
                    <option value="">Seleccione año...</option>
                    {añosBachillerato.map(año => (
                      <option key={año.value} value={año.value}>
                        {año.label}
                      </option>
                    ))}
                  </CFormSelect>
                )}
              </CCol>
            </CRow>

            <CRow className="g-4 mt-2">
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
              <CRow className="mt-3 animate__animated animate__fadeIn">
                <CCol md={6}>
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
      </CForm>
    </div>
  );
};

export default DatosEstudiante;