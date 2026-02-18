import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CAlert,
  CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSchool, cilWarning, cilCheckCircle, cilPlus } from '@coreui/icons'

const CrearAnioModal = ({
  visible,
  onClose,
  onConfirm,
  currentYear,
  existingYears
}) => {
  const [nuevoAnio, setNuevoAnio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Generar sugerencia de próximo año
  const getSugerenciaAnio = () => {
    if (!currentYear) return ''
    const [start, end] = currentYear.name.split('-').map(Number)
    return `${start + 1}-${end + 1}`
  }

  const sugerencia = getSugerenciaAnio()

  const validarFormato = (anio) => {
    const pattern = /^\d{4}-\d{4}$/
    if (!pattern.test(anio)) {
      return 'Formato inválido. Debe ser YYYY-YYYY (ej: 2025-2026)'
    }

    const [start, end] = anio.split('-').map(Number)
    if (start >= end) {
      return 'El año de inicio debe ser menor que el año de fin'
    }

    if (end - start !== 1) {
      return 'Los años deben ser consecutivos (ej: 2025-2026)'
    }

    return null
  }

  const verificarExistente = (anio) => {
    const existe = existingYears.some(y => y.name === anio)
    if (existe) {
      return `El año académico ${anio} ya existe`
    }
    return null
  }

  const handleSubmit = async () => {
    setError('')

    // Validar formato
    const errorFormato = validarFormato(nuevoAnio)
    if (errorFormato) {
      setError(errorFormato)
      return
    }

    // Verificar si ya existe
    const errorExistente = verificarExistente(nuevoAnio)
    if (errorExistente) {
      setError(errorExistente)
      return
    }

    setLoading(true)
    try {
      await onConfirm(nuevoAnio)
      setNuevoAnio('')
      onClose()
    } catch (error) {
      setError(error.message || 'Error al crear el año académico')
    } finally {
      setLoading(false)
    }
  }

  const usarSugerencia = () => {
    setNuevoAnio(sugerencia)
    setError('')
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static">
      <div className="bg-primary" style={{ height: '6px', borderTopLeftRadius: 'var(--cui-modal-border-radius)', borderTopRightRadius: 'var(--cui-modal-border-radius)' }}></div>

      <CModalHeader className="border-0 py-4 px-4">
        <CModalTitle className="fw-bold d-flex align-items-center w-100">
          <div className="bg-orange-soft p-3 rounded-4 me-3">
            <CIcon icon={cilSchool} className="text-warning" size="xl" />
          </div>
          <div>
            <h4 className="mb-0 fw-black text-contrast">Crear Nueva Gestión</h4>
            <div className="small text-muted-custom">
              Aperturar un nuevo ciclo académico
            </div>
          </div>
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="px-4 py-2">
        <CForm>
          {error && (
            <CAlert color="danger" className="d-flex align-items-center">
              <CIcon icon={cilWarning} className="me-2 flex-shrink-0" />
              <span>{error}</span>
            </CAlert>
          )}

          <div className="mb-4">
            <CFormLabel className="fw-bold text-muted-custom small text-uppercase ls-1">Año académico actual</CFormLabel>
            <div className="p-3 bg-glass-premium rounded-3 border-light-custom">
              <strong className="text-warning fs-5">{currentYear?.name || 'No seleccionado'}</strong>
              <div className="small text-muted-custom mt-1">
                {currentYear?.active ? '(Activo)' : '(Inactivo)'}
              </div>
            </div>
          </div>

          {sugerencia && (
            <div className="mb-4">
              <CFormLabel className="fw-bold text-muted-custom small text-uppercase ls-1">Sugerencia</CFormLabel>
              <div className="d-flex align-items-center gap-2">
                <div className="p-3 bg-info bg-opacity-10 rounded-3 flex-grow-1 border border-info border-opacity-25">
                  <strong className="text-info">{sugerencia}</strong>
                  <div className="small text-muted-custom opacity-75">Próximo año consecutivo</div>
                </div>
                <CButton
                  color="info"
                  variant="outline"
                  onClick={usarSugerencia}
                  className="rounded-pill px-3 fw-bold border-2"
                  style={{ fontSize: '0.8rem' }}
                >
                  Usar sugerencia
                </CButton>
              </div>
            </div>
          )}

          <div className="mb-3">
            <CFormLabel className="fw-bold text-muted-custom small text-uppercase ls-1">
              Nuevo año académico <span className="text-danger">*</span>
            </CFormLabel>
            <CFormInput
              type="text"
              placeholder="Ej: 2025-2026"
              value={nuevoAnio}
              onChange={(e) => {
                setNuevoAnio(e.target.value)
                setError('')
              }}
              className="py-3 input-premium fw-bold fs-5"
            />
            <div className="small text-muted-custom opacity-75 mt-2">
              Formato: AAAA-AAAA (ej: 2025-2026)
            </div>
          </div>

          <div className="bg-glass-premium p-3 rounded-4 mt-4 border-light-custom">
            <h6 className="fw-bold mb-2 text-contrast">
              <CIcon icon={cilCheckCircle} className="text-success me-2" />
              Al crear un nuevo año:
            </h6>
            <ul className="small mb-0 ps-3 text-muted-custom fw-medium">
              <li className="mb-1">Se desactivará automáticamente el año actual</li>
              <li className="mb-1">Se crearán configuraciones por defecto para inscripciones y notas</li>
              <li className="mb-1">Podrás comenzar a cargar secciones y estudiantes</li>
            </ul>
          </div>
        </CForm>
      </CModalBody>

      <CModalFooter className="border-0 p-4">
        <CButton
          color="secondary"
          variant="ghost"
          onClick={onClose}
          className="fw-bold px-4"
        >
          CANCELAR
        </CButton>
        <CButton
          color="primary"
          onClick={handleSubmit}
          disabled={!nuevoAnio || loading}
          className="btn-premium px-5 py-2 fw-bold"
        >
          {loading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              CREANDO...
            </>
          ) : (
            <>
              <CIcon icon={cilPlus} className="me-2" />
              CREAR GESTIÓN
            </>
          )}
        </CButton>
      </CModalFooter>

      <style>{`
        .btn-premium {
          background: linear-gradient(135deg, #F28C0F 0%, #E07B00 100%);
          border: none;
          color: white;
          border-radius: 50px;
          transition: all 0.3s ease;
        }
        .btn-premium:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-1px);
          color: white;
        }
        .bg-orange-soft {
          background-color: rgba(242, 140, 15, 0.1);
        }
        [data-coreui-theme="dark"] .bg-orange-soft {
          background-color: rgba(242, 140, 15, 0.15) !important;
          border: 1px solid rgba(242, 140, 15, 0.2);
        }
        .text-contrast {
          color: var(--neutral-900, #1e293b);
        }
        [data-coreui-theme="dark"] .text-contrast {
          color: white !important;
        }
        .ls-1 { letter-spacing: 0.5px; }
      `}</style>
    </CModal>
  )
}

export default CrearAnioModal