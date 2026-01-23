import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CContainer,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CButton,
  CRow,
  CCol,
  CAlert,
  CBadge,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { 
  useState, 
  useEffect,
  useCallback 
} from "react"
import PeriodoTab from "./components/boletin/periodoTab"
import { 
  cilUser, 
  cilCalendar, 
  cilLockLocked, 
  cilCheckCircle,
  cilEducation,
  cilEyedropper,
  cilBan
} from "@coreui/icons"

// Simulación de datos
const boletinData = {
  estudiante: {
    nombre: "Ana López Rodríguez",
    codigo: "END-2024-001",
    grado: "4to Grado",
    seccion: "A",
    representante: "María Rodríguez Pérez",
    dni: "87654321",
    fechaNacimiento: "15/03/2015",
    direccion: "Av. Principal #123"
  },
  periodos: {
    1: {
      nombre: "Primer Período",
      notas: [
        { materia: "Ballet Clásico I", codigo: "DAN-101", nota: 18, creditos: 4, observacion: "Excelente técnica", docente: "Prof. García" },
        { materia: "Ritmo y Movimiento", codigo: "DAN-102", nota: 16, creditos: 3, observacion: "Buen desempeño", docente: "Prof. Martínez" },
        { materia: "Expresión Corporal", codigo: "DAN-103", nota: 14, creditos: 3, observacion: "Participación activa", docente: "Prof. López" }
      ],
      estadoSecretaria: 'aprobado',
      fechaAprobacion: '15/04/2024',
      aprobadoPor: 'Secretaría Académica'
    },
    2: {
      nombre: "Segundo Período",
      notas: [
        { materia: "Ballet Clásico I", codigo: "DAN-101", nota: 17, creditos: 4, observacion: "Muy buen progreso", docente: "Prof. García" },
        { materia: "Ritmo y Movimiento", codigo: "DAN-102", nota: 15, creditos: 3, observacion: "Aplica correcciones", docente: "Prof. Martínez" },
        { materia: "Expresión Corporal", codigo: "DAN-103", nota: 13, creditos: 3, observacion: "Participación regular", docente: "Prof. López" }
      ],
      estadoSecretaria: 'pendiente',
      fechaAprobacion: null,
      aprobadoPor: null
    },
    3: {
      nombre: "Tercer Período",
      notas: [
        { materia: "Ballet Clásico I", codigo: "DAN-101", nota: null, creditos: 4, observacion: "Pendiente evaluación", docente: "Prof. García" },
        { materia: "Ritmo y Movimiento", codigo: "DAN-102", nota: null, creditos: 3, observacion: "Pendiente evaluación", docente: "Prof. Martínez" },
        { materia: "Expresión Corporal", codigo: "DAN-103", nota: null, creditos: 3, observacion: "Pendiente evaluación", docente: "Prof. López" }
      ],
      estadoSecretaria: 'pendiente',
      fechaAprobacion: null,
      aprobadoPor: null
    }
  }
}

const BoletinView = () => {
  const [activeKey, setActiveKey] = useState(null)
  const [periodosEstado, setPeriodosEstado] = useState({})
  const [toasts, setToasts] = useState([])
  
  // Cargar estado de períodos
  useEffect(() => {
    const estadosGuardados = localStorage.getItem('periodosEstadoEndanza')
    if (estadosGuardados) {
      const estados = JSON.parse(estadosGuardados)
      setPeriodosEstado(estados)
      
      // Encontrar primer período aprobado para activar
      const primerPeriodoAprobado = Object.keys(estados).find(
        periodo => estados[periodo].estadoSecretaria === 'aprobado'
      )
      
      if (primerPeriodoAprobado) {
        setActiveKey(parseInt(primerPeriodoAprobado))
      }
    } else {
      // Inicializar con datos por defecto
      const estadoInicial = {}
      Object.keys(boletinData.periodos).forEach(key => {
        estadoInicial[key] = {
          estadoSecretaria: boletinData.periodos[key].estadoSecretaria,
          fechaAprobacion: boletinData.periodos[key].fechaAprobacion,
          aprobadoPor: boletinData.periodos[key].aprobadoPor
        }
      })
      setPeriodosEstado(estadoInicial)
      
      // Mostrar solo períodos aprobados
      const primerAprobado = Object.keys(estadoInicial).find(
        key => estadoInicial[key].estadoSecretaria === 'aprobado'
      )
      if (primerAprobado) {
        setActiveKey(parseInt(primerAprobado))
      }
    }
  }, [])

  // Guardar estado cuando cambia
  useEffect(() => {
    localStorage.setItem('periodosEstadoEndanza', JSON.stringify(periodosEstado))
  }, [periodosEstado])

  const showToast = useCallback((type, message) => {
    const id = Date.now()
    const newToast = { id, type, message }
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const handleDescargarBoletin = useCallback((periodo) => {
    const estado = periodosEstado[periodo]?.estadoSecretaria
    if (estado !== 'aprobado') {
      showToast('warning', `El ${periodo}° período no está disponible para descarga`)
      return
    }
    
    showToast('info', `📥 Descargando boletín del ${periodo}° período...`)
    // Simular descarga
    setTimeout(() => {
      showToast('success', `✅ Boletin del ${periodo}° período descargado`)
    }, 2000)
  }, [periodosEstado, showToast])

  const { estudiante } = boletinData

  // Determinar qué períodos puede ver (solo los aprobados)
  const periodosVisibles = Object.keys(boletinData.periodos).filter(periodoKey => {
    const periodo = parseInt(periodoKey)
    const estado = periodosEstado[periodo]?.estadoSecretaria
    return estado === 'aprobado'
  })

  const noHayPeriodosDisponibles = periodosVisibles.length === 0

  return (
    <CContainer className="py-4">
      <CCard className="shadow-sm">
        <CCardHeader className="bg-primary text-white">
          <CRow className="align-items-center">
            <CCol md={8}>
              <h4 className="mb-1">
                <CIcon icon={cilEducation} className="me-2" />
                BOLETÍN ACADÉMICO
              </h4>
              <p className="mb-0">
                Escuela de Danza Endanza • Año Académico 2024
              </p>
            </CCol>
            <CCol md={4} className="text-end">
              <CBadge color="light" className="text-dark fs-6">
                Código: {estudiante.codigo}
              </CBadge>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody>
          {/* Información del estudiante */}
          <CRow className="mb-4">
            <CCol md={8}>
              <h5>
                <CIcon icon={cilUser} className="me-2" />
                INFORMACIÓN DEL ESTUDIANTE
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Nombre:</strong> {estudiante.nombre}</p>
                  <p className="mb-1"><strong>Grado y Sección:</strong> {estudiante.grado} – {estudiante.seccion}</p>
                  <p className="mb-1"><strong>DNI:</strong> {estudiante.dni}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Representante:</strong> {estudiante.representante}</p>
                  <p className="mb-1"><strong>Fecha Nacimiento:</strong> {estudiante.fechaNacimiento}</p>
                  <p className="mb-1"><strong>Dirección:</strong> {estudiante.direccion}</p>
                </div>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="border rounded p-3">
                <h6 className="text-center mb-3">
                  <CIcon icon={cilCalendar} className="me-2" />
                  PERÍODOS DISPONIBLES
                </h6>
                {Object.entries(periodosEstado).map(([periodo, data]) => (
                  <div key={periodo} className="d-flex justify-content-between align-items-center mb-2">
                    <span>Período {periodo}:</span>
                    {data.estadoSecretaria === 'aprobado' ? (
                      <CBadge color="success">
                        ✓ Disponible
                      </CBadge>
                    ) : (
                      <CBadge color="secondary">
                        <CIcon icon={cilLockLocked} className="me-1" />
                        No disponible
                      </CBadge>
                    )}
                  </div>
                ))}
              </div>
            </CCol>
          </CRow>

          {/* Navegación de períodos */}
          {!noHayPeriodosDisponibles && (
            <div className="mb-4">
              <h5>
                <CIcon icon={cilEyedropper} className="me-2" />
                PERÍODOS ACADÉMICOS
              </h5>
              
              <CAlert color="success" className="mb-3">
                <CIcon icon={cilCheckCircle} className="me-2" />
                <strong>Períodos Disponibles:</strong> Solo puede ver los períodos que han sido habilitados por secretaría.
              </CAlert>

              <CNav variant="tabs" role="tablist">
                {Object.keys(boletinData.periodos).map(periodoKey => {
                  const periodo = parseInt(periodoKey)
                  const estado = periodosEstado[periodo]?.estadoSecretaria
                  
                  // Solo mostrar pestaña si está aprobado
                  if (estado !== 'aprobado') return null
                  
                  return (
                    <CNavItem key={periodo}>
                      <CNavLink
                        active={activeKey === periodo}
                        onClick={() => setActiveKey(periodo)}
                      >
                        {periodo}° Período
                        <CIcon icon={cilCheckCircle} className="ms-1 text-success" />
                      </CNavLink>
                    </CNavItem>
                  )
                })}
              </CNav>

              <CTabContent className="mt-3">
                {Object.keys(boletinData.periodos).map(periodoKey => {
                  const periodo = parseInt(periodoKey)
                  const periodoData = boletinData.periodos[periodo]
                  const estado = periodosEstado[periodo]
                  
                  // Solo renderizar contenido si está aprobado
                  if (estado?.estadoSecretaria !== 'aprobado') return null
                  
                  return (
                    <CTabPane key={periodo} visible={activeKey === periodo}>
                      <PeriodoTab 
                        notas={periodoData.notas}
                        periodoNumero={periodo}
                        periodoNombre={periodoData.nombre}
                        estadoSecretaria={estado?.estadoSecretaria}
                        fechaAprobacion={estado?.fechaAprobacion}
                        aprobadoPor={estado?.aprobadoPor}
                        onDescargar={handleDescargarBoletin}
                      />
                    </CTabPane>
                  )
                })}
              </CTabContent>
            </div>
          )}

          {/* Mensaje cuando no hay períodos disponibles */}
          {noHayPeriodosDisponibles && (
            <div className="text-center py-5">
              <CIcon icon={cilBan} size="xxl" className="text-warning mb-3" />
              <h4 className="text-warning mb-3">
                No hay períodos disponibles
              </h4>
              <CAlert color="warning" className="mx-auto" style={{ maxWidth: '600px' }}>
                <p className="mb-2">
                  <strong>Los períodos académicos aún no han sido habilitados por secretaría.</strong>
                </p>
                <p className="mb-0">
                  Los boletines se habilitan una vez que secretaría/dirección revise y apruebe las calificaciones de cada período.
                  Será notificado cuando estén disponibles.
                </p>
              </CAlert>
              
              <div className="mt-4">
                <CButton 
                  color="primary"
                  onClick={() => showToast('info', 'Se ha enviado una solicitud a secretaría')}
                >
                  <CIcon icon={cilLockLocked} className="me-2" />
                  Solicitar información a secretaría
                </CButton>
              </div>
            </div>
          )}
        </CCardBody>

        <CCardFooter className="text-center">
          <small className="text-muted">
            <CIcon icon={cilLockLocked} className="me-1" />
            Este documento es oficial de la Escuela de Danza Endanza. Los boletines solo están disponibles una vez aprobados por secretaría.
          </small>
        </CCardFooter>
      </CCard>

      {/* Toasts */}
      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast key={t.id} visible color={t.type} className="text-white">
            <CToastHeader closeButton className="text-white">
              <strong className="me-auto">
                {t.type === 'success' ? '✅ Éxito' : 
                 t.type === 'warning' ? '⚠ Advertencia' : 
                 t.type === 'danger' ? '❌ Error' : 'ℹ Información'}
              </strong>
            </CToastHeader>
            <CToastBody>{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </CContainer>
  )
}

export default BoletinView