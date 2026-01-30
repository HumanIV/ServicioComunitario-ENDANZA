import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CButton,
  CRow,
  CCol,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendarCheck, cilClock, cilSave, cilWarning, cilCheckCircle, cilCalendar } from '@coreui/icons'

const PeriodoInscripcionModal = ({
  visible,
  onClose,
  periodoInscripcion,
  setPeriodoInscripcion,
  onSave
}) => {
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '---'
    const parts = dateStr.split('-')
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }

  const getEnrollmentStatus = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startDate = new Date(periodoInscripcion.fechaInicio)
    const endDate = new Date(periodoInscripcion.fechaFin)

    if (!periodoInscripcion.activo) {
      return { type: 'closed', message: 'Sistema Cerrado', detail: 'El portal de inscripciones no aceptará nuevos registros', icon: cilWarning, color: 'muted' }
    }

    if (today > endDate) {
      return { type: 'expired', message: 'Periodo Vencido', detail: `Las inscripciones finalizaron el ${formatDateDisplay(periodoInscripcion.fechaFin)}`, icon: cilWarning, color: 'danger' }
    }

    if (today < startDate) {
      return { type: 'pending', message: 'Próximamente', detail: `Las inscripciones abrirán el ${formatDateDisplay(periodoInscripcion.fechaInicio)}`, icon: cilClock, color: 'warning' }
    }

    return { type: 'active', message: 'Inscripciones Activas', detail: `Válidas desde ${formatDateDisplay(periodoInscripcion.fechaInicio)} hasta ${formatDateDisplay(periodoInscripcion.fechaFin)}`, icon: cilCheckCircle, color: 'success' }
  }

  const status = getEnrollmentStatus()

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static" className="animate-fade-in premium-modal">
      <div className="bg-primary" style={{ height: '8px', borderTopLeftRadius: 'var(--cui-modal-border-radius)', borderTopRightRadius: 'var(--cui-modal-border-radius)' }}></div>
      <CModalHeader className="bg-light-custom border-0 py-4 px-4">
        <CModalTitle className="fw-bold d-flex align-items-center header-title-custom">
          <div className="bg-orange-soft p-2 rounded-3 me-3">
            <CIcon icon={cilCalendarCheck} className="text-primary" size="xl" />
          </div>
          <div>
            <div className="h4 mb-0 fw-bold header-title-custom">Periodo de Inscripción</div>
            <div className="small text-muted-custom fw-normal">Control de apertura y cierre del sistema académico</div>
          </div>
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="p-4 bg-light-custom">
        <CForm>
          <div className="p-4 rounded-4 bg-light-custom bg-opacity-25 border border-light-custom border-opacity-50 shadow-sm mb-4">
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-light-custom border-opacity-10">
              <div>
                <h5 className="fw-bold header-title-custom mb-1">Estatus del Proceso</h5>
                <p className="small text-muted-custom mb-0">Habilitar o deshabilitar inscripciones globales</p>
              </div>
              <CFormCheck
                id="inscripcionesActivas"
                switch
                checked={periodoInscripcion.activo}
                onChange={(e) => setPeriodoInscripcion({ ...periodoInscripcion, activo: e.target.checked })}
                className="switch-premium"
                style={{ scale: '1.5' }}
              />
            </div>

            <CRow className="g-4">
              <CCol xs={12} md={6}>
                <div className="p-3 bg-light-custom rounded-3 border border-light-custom border-opacity-50">
                  <CFormLabel className="small fw-bold text-uppercase text-muted-custom ls-1 mb-2">
                    <CIcon icon={cilCalendar} className="me-2 text-primary" />
                    Fecha de Apertura
                  </CFormLabel>
                  <CFormInput
                    type="date"
                    value={periodoInscripcion.fechaInicio}
                    onChange={(e) => setPeriodoInscripcion({ ...periodoInscripcion, fechaInicio: e.target.value })}
                    className="input-premium border-0 shadow-none bg-transparent p-2 text-contrast"
                    style={{ fontSize: '1.1rem', fontWeight: '600' }}
                  />
                </div>
              </CCol>
              <CCol xs={12} md={6}>
                <div className="p-3 bg-light-custom rounded-3 border border-light-custom border-opacity-50">
                  <CFormLabel className="small fw-bold text-uppercase text-muted-custom ls-1 mb-2">
                    <CIcon icon={cilWarning} className="me-2 text-danger" />
                    Fecha de Cierre
                  </CFormLabel>
                  <CFormInput
                    type="date"
                    value={periodoInscripcion.fechaFin}
                    onChange={(e) => setPeriodoInscripcion({ ...periodoInscripcion, fechaFin: e.target.value })}
                    className="input-premium border-0 shadow-none bg-transparent p-2 text-contrast"
                    style={{ fontSize: '1.1rem', fontWeight: '600' }}
                  />
                </div>
              </CCol>
            </CRow>
          </div>

          <div className={`p-4 rounded-4 text-center border-2 transition-all border-${status.color} bg-${status.color === 'muted' ? 'light' : status.color}-soft text-${status.color}`}>
            <div className="d-flex align-items-center justify-content-center gap-3">
              <CIcon icon={status.icon} size="3xl" />
              <div className="text-start">
                <h6 className="fw-bold mb-0 text-uppercase ls-1">{status.message}</h6>
                <div className="small opacity-75">{status.detail}</div>
              </div>
            </div>
          </div>
        </CForm>
      </CModalBody>

      <CModalFooter className="border-0 p-4 pt-0 bg-light-custom">
        <CButton color="light" onClick={onClose} className="px-4 fw-bold text-muted-custom bg-transparent border-0 hover-lift">
          CANCELAR
        </CButton>
        <CButton onClick={onSave} className="btn-premium px-5 py-2 fw-bold ms-auto shadow-sm">
          <CIcon icon={cilSave} className="me-2" />
          GUARDAR AJUSTES
        </CButton>
      </CModalFooter>

      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .bg-orange-soft { background-color: rgba(242, 140, 15, 0.1); }
        .bg-success-soft { background-color: rgba(46, 143, 33, 0.08); }
        .bg-warning-soft { background-color: rgba(255, 193, 7, 0.08); }
        .bg-danger-soft { background-color: rgba(220, 53, 69, 0.08); }
        .transition-all { transition: all 0.3s ease; }
        
        .switch-premium .form-check-input:checked {
          background-color: #E07B00;
          border-color: #E07B00;
          box-shadow: 0 0 10px rgba(224, 123, 0, 0.3);
        }

        .input-premium:focus {
          background-color: transparent !important;
          color: inherit !important;
          box-shadow: 0 0 0 3px rgba(242, 140, 15, 0.2) !important;
        }
        
        /* Date input icon color fix for dark mode */
        [data-coreui-theme="dark"] .input-premium::-webkit-calendar-picker-indicator {
            filter: invert(1);
        }

        .border-dashed { border-style: dashed !important; }
      `}</style>
    </CModal>
  )
}

export default PeriodoInscripcionModal