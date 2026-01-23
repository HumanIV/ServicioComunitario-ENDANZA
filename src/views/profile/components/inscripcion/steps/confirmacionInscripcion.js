import React from "react";
import {
  CAlert, CButton, CRow, CCol,
  CBadge, CCard, CCardBody
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilCheckCircle, cilWarning, cilCloudDownload,
  cilPrint, cilEnvelopeClosed, cilCopy,
  cilCalendar, cilBadge, cilFile
} from "@coreui/icons";

const ConfirmacionInscripcion = ({ formData, codigoInscripcion, onDescargar }) => {
  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoInscripcion)
      .then(() => alert('Código copiado al portapapeles'))
      .catch(err => console.error('Error al copiar:', err));
  };

  const imprimirPlanilla = () => {
    window.print();
  };

  return (
    <div>
      <div className="text-center mb-4">
        <CIcon icon={cilCheckCircle} size="3xl" className="text-success mb-3 confirmacion-icon" />
        <h3 className="text-success mb-3">¡INSCRIPCIÓN COMPLETADA!</h3>
        <CBadge color="success" className="fs-5 px-4 py-2 mb-3 codigo-badge">
          <CIcon icon={cilBadge} className="me-2" />
          CÓDIGO: {codigoInscripcion}
          <CButton 
            color="light" 
            size="sm" 
            className="ms-2 py-0" 
            onClick={copiarCodigo}
            title="Copiar código"
          >
            <CIcon icon={cilCopy} size="sm" />
          </CButton>
        </CBadge>
        <p className="text-muted">
          Su inscripción ha sido registrada exitosamente en el sistema
        </p>
      </div>

      <CAlert color="success" className="mb-4">
        <h5 className="alert-heading">
          <CIcon icon={cilWarning} className="me-2" />
          ¡Felicidades! Su inscripción está completa
        </h5>
        <p className="mb-0">
          Descargue la planilla de inscripción y consérvela como comprobante oficial.
          También puede imprimirla o enviarla por correo electrónico.
        </p>
      </CAlert>

      <CCard className="mb-4">
        <CCardBody>
          <h5 className="mb-3">
            <CIcon icon={cilFile} className="me-2" />
            📋 Resumen de la inscripción
          </h5>
          
          <CRow>
            <CCol md={6}>
              <h6 className="text-primary mb-3">📝 Datos del Estudiante:</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <strong>Nombre completo:</strong><br />
                  {formData.nombres} {formData.apellidos}
                </li>
                <li className="mb-2">
                  <strong>Grado/Nivel:</strong> {formData.grado || 'No especificado'}
                </li>
                <li className="mb-2">
                  <strong>Especialidad:</strong> {formData.especialidad || 'No especificado'}
                </li>
                <li>
                  <strong>Teléfono:</strong> {formData.Telefono_Celular || 'No especificado'}
                </li>
              </ul>
            </CCol>
            
            <CCol md={6}>
              <h6 className="text-primary mb-3">👨‍👩‍👧‍👦 Datos del Representante:</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <strong>Nombre:</strong><br />
                  {formData.nombres_Representante} {formData.apellidos_Representante}
                </li>
                <li className="mb-2">
                  <strong>Teléfono:</strong> {formData.telefono_Rep || 'No especificado'}
                </li>
                <li className="mb-2">
                  <strong>Profesión:</strong> {formData.profesion || 'No especificado'}
                </li>
                <li>
                  <strong>Relación:</strong> {formData.relacion || 'No especificado'}
                </li>
              </ul>
            </CCol>
          </CRow>
          
          <hr className="my-4" />
          
          <div>
            <h6 className="text-primary mb-3">📅 Información de registro:</h6>
            <CRow>
              <CCol md={4}>
                <p className="mb-2">
                  <strong><CIcon icon={cilCalendar} className="me-2" />Fecha:</strong><br />
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </CCol>
              <CCol md={4}>
                <p className="mb-2">
                  <strong><CIcon icon={cilBadge} className="me-2" />Código:</strong><br />
                  {codigoInscripcion}
                </p>
              </CCol>
              <CCol md={4}>
                <p className="mb-2">
                  <strong>Estado:</strong><br />
                  <CBadge color="success" className="fs-6">REGISTRADO</CBadge>
                </p>
              </CCol>
            </CRow>
          </div>
        </CCardBody>
      </CCard>

      <div className="text-center py-3">
        <div className="mb-4">
          <CButton 
            color="primary" 
            size="lg"
            onClick={onDescargar}
            className="px-5 py-3 mb-2 me-3 accion-btn"
          >
            <CIcon icon={cilCloudDownload} className="me-2" />
            DESCARGAR PLANILLA
          </CButton>
          
          <CButton 
            color="secondary" 
            size="lg"
            onClick={imprimirPlanilla}
            className="px-5 py-3 mb-2 me-3 accion-btn"
          >
            <CIcon icon={cilPrint} className="me-2" />
            IMPRIMIR
          </CButton>
          
          <CButton 
            color="info" 
            size="lg"
            onClick={() => alert('Función de email por implementar')}
            className="px-5 py-3 mb-2 accion-btn"
          >
            <CIcon icon={cilEnvelopeClosed} className="me-2" />
            ENVIAR POR EMAIL
          </CButton>
        </div>
        
        <div className="mt-2">
          <small className="text-muted">
            <CIcon icon={cilWarning} className="me-1" />
            Descargue un archivo HTML con todos los datos para imprimir o guardar como respaldo.
          </small>
        </div>
      </div>

      <CAlert color="info" className="mb-0">
        <small>
          <strong>📝 Importante:</strong> Conserve este código y la planilla para futuras consultas.
          Puede presentar la planilla impresa en secretaría para completar cualquier trámite adicional.
          Para consultas o modificaciones, presente su código de inscripción: <strong>{codigoInscripcion}</strong>
        </small>
      </CAlert>
    </div>
  );
};

export default ConfirmacionInscripcion;