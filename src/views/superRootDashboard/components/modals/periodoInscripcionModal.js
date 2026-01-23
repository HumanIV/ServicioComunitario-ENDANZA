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
  CCol
} from '@coreui/react'

const PeriodoInscripcionModal = ({
  visible,
  onClose,
  periodoInscripcion,
  setPeriodoInscripcion,
  onSave
}) => {
  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Configurar Período de Inscripciones</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div className="mb-3">
            <CFormCheck
              id="inscripcionesActivas"
              label="Período de inscripciones activo"
              checked={periodoInscripcion.activo}
              onChange={(e) => setPeriodoInscripcion({...periodoInscripcion, activo: e.target.checked})}
            />
          </div>
          <CRow className="g-3">
            <CCol xs={12} md={6}>
              <CFormLabel>Fecha de inicio</CFormLabel>
              <CFormInput
                type="date"
                value={periodoInscripcion.fechaInicio}
                onChange={(e) => setPeriodoInscripcion({...periodoInscripcion, fechaInicio: e.target.value})}
              />
            </CCol>
            <CCol xs={12} md={6}>
              <CFormLabel>Fecha de fin</CFormLabel>
              <CFormInput
                type="date"
                value={periodoInscripcion.fechaFin}
                onChange={(e) => setPeriodoInscripcion({...periodoInscripcion, fechaFin: e.target.value})}
              />
            </CCol>
          </CRow>
          <div className="mt-4 p-3 bg-light rounded">
            <h6>Estado actual:</h6>
            <p className={periodoInscripcion.activo ? "text-success" : "text-secondary"}>
              {periodoInscripcion.activo 
                ? `✓ Las inscripciones están ABIERTAS desde ${periodoInscripcion.fechaInicio} hasta ${periodoInscripcion.fechaFin}`
                : "✗ Las inscripciones están CERRADAS"}
            </p>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={onSave}>
          Guardar Configuración
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default PeriodoInscripcionModal