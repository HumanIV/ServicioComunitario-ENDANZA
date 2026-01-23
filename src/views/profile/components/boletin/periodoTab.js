import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CRow,
  CCol,
  CButton,
  CAlert,
  CBadge
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { 
  cilCheckCircle, 
  cilCloudDownload,
  cilCalendar,
  cilEducation,
  cilUser,
  cilFile
} from "@coreui/icons"

const PeriodoTab = ({ 
  notas, 
  periodoNumero,
  periodoNombre,
  estadoSecretaria = 'aprobado', // Siempre será 'aprobado' para este componente
  fechaAprobacion = null,
  aprobadoPor = null,
  onDescargar
}) => {
  // Calcular estadísticas básicas
  const notasValidas = notas.filter(n => n.nota !== null)
  const promedio = notasValidas.length > 0 
    ? notasValidas.reduce((acc, item) => acc + item.nota, 0) / notasValidas.length
    : 0
  
  const notasAprobadas = notasValidas.filter(n => n.nota >= 10).length
  const porcentajeAprobacion = (notasAprobadas / notasValidas.length) * 100 || 0

  // Determinar estado académico
  const estadoAcademico = promedio >= 10 ? 'APROBADO' : 'REPROBADO'
  const colorEstado = promedio >= 10 ? 'success' : 'danger'

  return (
    <CCard className="periodo-card">
      <CCardHeader className="text-center">
        <h5 className="mb-0">
          <CIcon icon={cilCalendar} className="me-2" />
          {periodoNombre}
        </h5>
        <div className="mt-2">
          <CBadge color="success" className="fs-6">
            <CIcon icon={cilCheckCircle} className="me-1" />
            PERÍODO HABILITADO
          </CBadge>
          {fechaAprobacion && (
            <div className="mt-1">
              <small className="text-muted">
                Aprobado el {fechaAprobacion} por {aprobadoPor}
              </small>
            </div>
          )}
        </div>
      </CCardHeader>

      <CCardBody className="text-center">
        <div className="mb-4">
          <CIcon icon={cilEducation} size="3xl" className="text-success mb-3" />
          <h4 className="text-success mb-3">
            Boletin Disponible para Descarga
          </h4>
          <p className="text-muted mb-4">
            El boletín del {periodoNombre} ha sido aprobado por secretaría y está listo para ser descargado.
          </p>
        </div>
        
        {/* Botón principal de descarga */}
        <div className="mb-4 py-3">
          <CButton 
            color="primary" 
            size="lg"
            onClick={() => onDescargar && onDescargar(periodoNumero)}
            className="px-5 py-3 shadow"
          >
            <CIcon icon={cilCloudDownload} className="me-2" size="lg" />
            DESCARGAR BOLETÍN COMPLETO (PDF)
          </CButton>
          
          <div className="mt-2">
            <small className="text-muted">
              <CIcon icon={cilFile} className="me-1" />
              Documento oficial en formato PDF
            </small>
          </div>
        </div>
        
        {/* Información del boletín */}
        <div className="border rounded p-3">
          <h6 className="mb-3">
            <CIcon icon={cilUser} className="me-1" />
            Detalles del boletín:
          </h6>
          <div className="row text-start">
            <div className="col-md-6">
              <ul className="mb-0 small">
                <li><strong>Período:</strong> {periodoNombre}</li>
                <li><strong>Fecha de aprobación:</strong> {fechaAprobacion || 'No disponible'}</li>
                <li><strong>Aprobado por:</strong> {aprobadoPor || 'Secretaría Académica'}</li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="mb-0 small">
                <li><strong>Total de materias:</strong> {notas.length}</li>
                <li><strong>Materias evaluadas:</strong> {notasValidas.length}</li>
                <li><strong>Estado:</strong> <CBadge color={colorEstado}>{estadoAcademico}</CBadge></li>
              </ul>
            </div>
          </div>
        </div>
      </CCardBody>

      <CCardFooter className="text-center">
        <small className="text-muted">
          <CIcon icon={cilCheckCircle} className="me-1 text-success" />
          Este boletín ha sido aprobado y es un documento oficial de la institución. Conserve una copia para sus registros.
        </small>
      </CCardFooter>
    </CCard>
  )
}

export default PeriodoTab