import React from "react";
import {
  CAlert, CButton, CRow, CCol,
  CBadge, CCard, CCardBody
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilCheckCircle, cilWarning, cilCloudDownload,
  cilPrint, cilEnvelopeClosed, cilCopy,
  cilCalendar, cilBadge, cilFile, cilUser, cilBriefcase
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
    <div className="animate__animated animate__fadeIn">
      <div className="text-center mb-5">
        <div className="d-inline-flex align-items-center justify-content-center p-4 bg-success bg-opacity-10 rounded-circle mb-4 shadow-sm" style={{ width: '100px', height: '100px' }}>
          <CIcon icon={cilCheckCircle} size="4xl" className="text-success" />
        </div>
        <h2 className="confirm-title fw-bold mb-2">¡Inscripción Exitosa!</h2>
        <p className="confirm-subtitle mb-4">El proceso de registro ha finalizado correctamente.</p>

        <div className="d-inline-flex align-items-center confirm-code-box border border-light shadow-sm rounded-pill px-4 py-2 mb-3">
          <span className="confirm-subtitle small fw-bold text-uppercase ls-1 me-3">CÓDIGO DE VALIDACIÓN:</span>
          <span className="text-success fs-4 fw-bold font-monospace me-3">{codigoInscripcion}</span>
          <CButton
            color="light"
            size="sm"
            className="rounded-circle p-2 d-flex align-items-center justify-content-center confirm-copy-btn hover-bg-gray border-0"
            onClick={copiarCodigo}
            title="Copiar código"
            style={{ width: '32px', height: '32px' }}
          >
            <CIcon icon={cilCopy} size="sm" />
          </CButton>
        </div>
      </div>

      <CAlert color="success" className="mb-5 border-0 shadow-sm rounded-4 d-flex align-items-center p-4">
        <CIcon icon={cilCheckCircle} className="me-3 text-success" size="xl" />
        <div>
          <h5 className="alert-heading fw-bold mb-1">Registro Confirmado</h5>
          <p className="mb-0 small opacity-75">
            Los datos han sido guardados en el sistema seguro de ENDANZA. Descargue su planilla ahora.
          </p>
        </div>
      </CAlert>

      <CCard className="mb-5 border-0 confirm-summary-card rounded-4 overflow-hidden">
        <CCardBody className="p-4">
          <h6 className="mb-4 text-primary fw-bold text-uppercase ls-1 border-bottom pb-3">
            Resumen del Expediente Generado
          </h6>

          <CRow className="g-4">
            <CCol md={6}>
              <div className="d-flex align-items-start mb-2">
                <span className="p-1 bg-primary bg-opacity-10 text-primary rounded me-2">
                  <CIcon icon={cilUser} size="sm" />
                </span>
                <span className="confirm-subtitle fw-bold small text-uppercase ls-1">Estudiante</span>
              </div>
              <div className="ps-4 ms-1">
                <h5 className="fw-bold confirm-title mb-1">{formData.nombres} {formData.apellidos}</h5>
                <p className="mb-0 confirm-subtitle small">
                  <span className="fw-bold">Nivel:</span> {formData.grado} • <span className="fw-bold">Especialidad:</span> {formData.especialidad || 'General'}
                </p>
              </div>
            </CCol>

            <CCol md={6} className="border-start border-light ps-md-4">
              <div className="d-flex align-items-start mb-2">
                <span className="p-1 bg-success bg-opacity-10 text-success rounded me-2">
                  <CIcon icon={cilBriefcase} size="sm" />
                </span>
                <span className="confirm-subtitle fw-bold small text-uppercase ls-1">Representante</span>
              </div>
              <div className="ps-4 ms-1">
                <h5 className="fw-bold confirm-title mb-1">{formData.nombres_Representante} {formData.apellidos_Representante}</h5>
                <p className="mb-0 confirm-subtitle small">
                  <span className="fw-bold">Parentesco:</span> {formData.relacion?.toUpperCase()} • <span className="fw-bold">Contacto:</span> {formData.telefono_Rep}
                </p>
              </div>
            </CCol>
          </CRow>

          <div className="mt-4 pt-4 border-top border-white">
            <CRow className="text-center text-md-start">
              <CCol md={4} className="mb-3 mb-md-0">
                <small className="confirm-subtitle d-block text-uppercase fw-bold ls-1" style={{ fontSize: '0.65rem' }}>FECHA DE REGISTRO</small>
                <strong className="confirm-title">
                  {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </strong>
              </CCol>
              <CCol md={4} className="mb-3 mb-md-0">
                <small className="confirm-subtitle d-block text-uppercase fw-bold ls-1" style={{ fontSize: '0.65rem' }}>ID DE OPERACIÓN</small>
                <strong className="confirm-title font-monospace">{codigoInscripcion}</strong>
              </CCol>
              <CCol md={4}>
                <small className="confirm-subtitle d-block text-uppercase fw-bold ls-1" style={{ fontSize: '0.65rem' }}>ESTADO ACTUAL</small>
                <CBadge color="success" className="rounded-pill px-3 py-1 mt-1 bg-opacity-25 text-success border border-success border-opacity-25">COMPLETADO</CBadge>
              </CCol>
            </CRow>
          </div>
        </CCardBody>
      </CCard>

      <div className="text-center py-2">
        <h6 className="confirm-subtitle mb-4 fw-bold small text-uppercase ls-1">Acciones Disponibles</h6>
        <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mb-4">
          <CButton
            className="btn-premium px-5 py-3 shadow-lg d-flex align-items-center justify-content-center"
            onClick={onDescargar}
          >
            <CIcon icon={cilCloudDownload} className="me-2" size="lg" />
            <div>
              <div className="fw-bold">DESCARGAR PLANILLA</div>
              <small className="d-block opacity-75" style={{ fontSize: '0.65rem', fontWeight: 'normal' }}>Formato PDF Oficial</small>
            </div>
          </CButton>

          <CButton
            onClick={imprimirPlanilla}
            className="px-5 py-3 confirm-print-btn fw-bold border-0 shadow-sm hover-lift d-flex align-items-center justify-content-center"
          >
            <CIcon icon={cilPrint} className="me-2" size="lg" />
            IMPRIMIR COPIA
          </CButton>
        </div>

        <p className="confirm-subtitle small w-75 mx-auto">
          <strong className="text-primary">Nota:</strong> Se ha enviado una copia de confirmación al correo electrónico registrado. Si no lo recibe en 5 minutos, verifique su bandeja de spam o descargue la planilla manualmente.
        </p>
      </div>

      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .hover-bg-gray:hover { background-color: #e5e7eb !important; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important; transition: all 0.2s; }
        
        .confirm-title { color: var(--neutral-800); }
        .confirm-subtitle { color: var(--neutral-600); }
        .confirm-code-box { background-color: white; }
        .confirm-summary-card { background-color: var(--neutral-100); }
        .confirm-copy-btn { background-color: var(--neutral-100); color: var(--neutral-500); }
        .confirm-print-btn { background-color: white; color: var(--neutral-800); }

        [data-coreui-theme="dark"] .confirm-title { color: white; }
        [data-coreui-theme="dark"] .confirm-subtitle { color: rgba(255,255,255,0.5); }
        [data-coreui-theme="dark"] .confirm-code-box { background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1) !important; }
        [data-coreui-theme="dark"] .confirm-summary-card { background-color: #1e293b; }
        [data-coreui-theme="dark"] .confirm-copy-btn { background-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); }
        [data-coreui-theme="dark"] .confirm-print-btn { background-color: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1) !important; }
        [data-coreui-theme="dark"] .hover-bg-gray:hover { background-color: rgba(255,255,255,0.1) !important; }
      `}</style>
    </div>
  );
};

export default ConfirmacionInscripcion;