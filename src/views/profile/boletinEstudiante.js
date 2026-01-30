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
  cilLockLocked,
  cilEducation,
  cilBan,
  cilCloudDownload,
  cilFolderOpen
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

      const primerPeriodoAprobado = Object.keys(estados).find(
        periodo => estados[periodo].estadoSecretaria === 'aprobado'
      )

      if (primerPeriodoAprobado) {
        setActiveKey(parseInt(primerPeriodoAprobado))
      }
    } else {
      const estadoInicial = {}
      Object.keys(boletinData.periodos).forEach(key => {
        estadoInicial[key] = {
          estadoSecretaria: boletinData.periodos[key].estadoSecretaria,
          fechaAprobacion: boletinData.periodos[key].fechaAprobacion,
          aprobadoPor: boletinData.periodos[key].aprobadoPor
        }
      })
      setPeriodosEstado(estadoInicial)

      const primerAprobado = Object.keys(estadoInicial).find(
        key => estadoInicial[key].estadoSecretaria === 'aprobado'
      )
      if (primerAprobado) {
        setActiveKey(parseInt(primerAprobado))
      }
    }
  }, [])

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
    setTimeout(() => {
      showToast('success', `✅ Boletin del ${periodo}° período descargado`)
    }, 2000)
  }, [periodosEstado, showToast])

  const { estudiante } = boletinData

  const periodosVisibles = Object.keys(boletinData.periodos).filter(periodoKey => {
    const periodo = parseInt(periodoKey)
    const estado = periodosEstado[periodo]?.estadoSecretaria
    return estado === 'aprobado'
  })

  const noHayPeriodosDisponibles = periodosVisibles.length === 0

  return (
    <CContainer className="py-4 animate__animated animate__fadeIn">
      <CCard className="premium-card border-0 overflow-hidden shadow-lg pb-4">
        <CCardHeader className="bg-orange-soft border-0 py-4 px-4 px-md-5">
          <CRow className="align-items-center">
            <CCol md={8}>
              <div className="d-flex align-items-center">
                <div className="p-3 bg-primary rounded-circle me-3 shadow-sm d-none d-md-block">
                  <CIcon icon={cilFolderOpen} size="xl" className="text-white" />
                </div>
                <div>
                  <h3 className="mb-0 fw-bold ls-1 boletin-header-title text-uppercase">Expediente Académico</h3>
                  <p className="mb-0 boletin-header-subtitle small text-uppercase ls-1 fw-bold">Consulta de Boletines • Período 2024</p>
                </div>
              </div>
            </CCol>
            <CCol md={4} className="text-md-end mt-3 mt-md-0">
              <CBadge className="boletin-id-badge border border-primary border-opacity-10 px-4 py-2 rounded-pill fs-6 shadow-sm">
                ID ESTUDIANTE: <span className="font-monospace">{estudiante.codigo}</span>
              </CBadge>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody className="p-4 p-md-5">
          <CRow className="mb-5 g-4">
            <CCol md={8}>
              <div className="p-4 rounded-4 boletin-info-card h-100 boletin-border">
                <div className="d-flex align-items-center mb-4">
                  <span className="p-2 bg-primary bg-opacity-10 text-primary rounded-circle me-3">
                    <CIcon icon={cilEducation} size="sm" />
                  </span>
                  <h6 className="text-primary mb-0 fw-bold text-uppercase ls-1">Información Institucional</h6>
                </div>

                <CRow className="g-4">
                  <CCol sm={6}>
                    <label className="form-label small boletin-info-label fw-bold text-uppercase mb-1 ls-1" style={{ fontSize: '0.65rem' }}>Estudiante Registrado</label>
                    <div className="fw-bold fs-5 boletin-info-value">{estudiante.nombre}</div>
                  </CCol>
                  <CCol sm={6}>
                    <label className="form-label small boletin-info-label fw-bold text-uppercase mb-1 ls-1" style={{ fontSize: '0.65rem' }}>Nivel Académico</label>
                    <div className="fw-bold fs-5 text-primary">{estudiante.grado} <span className="boletin-info-subtext fw-normal ms-1">– Secc {estudiante.seccion}</span></div>
                  </CCol>
                  <CCol sm={6}>
                    <label className="form-label small boletin-info-label fw-bold text-uppercase mb-1 ls-1" style={{ fontSize: '0.65rem' }}>Documento de Identidad</label>
                    <div className="fw-bold fs-5 boletin-info-value font-monospace">{estudiante.dni}</div>
                  </CCol>
                  <CCol sm={6}>
                    <label className="form-label small boletin-info-label fw-bold text-uppercase mb-1 ls-1" style={{ fontSize: '0.65rem' }}>Representante Legal</label>
                    <div className="fw-bold fs-5 boletin-info-value">{estudiante.representante}</div>
                  </CCol>
                </CRow>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="p-4 rounded-4 bg-orange-soft h-100 border border-primary border-opacity-10">
                <div className="d-flex align-items-center mb-4">
                  <span className="p-2 bg-avatar-frame text-primary rounded-circle me-3 shadow-sm">
                    <CIcon icon={cilFolderOpen} size="sm" />
                  </span>
                  <h6 className="text-primary mb-0 fw-bold text-uppercase ls-1">Disponibilidad</h6>
                </div>
                <div className="d-flex flex-column gap-3">
                  {Object.entries(periodosEstado).map(([periodo, data]) => (
                    <div key={periodo} className="d-flex justify-content-between align-items-center p-3 rounded-3 boletin-period-row shadow-sm boletin-border">
                      <span className="fw-bold small boletin-info-value">Período Académico {periodo}</span>
                      {data.estadoSecretaria === 'aprobado' ? (
                        <div className="d-flex align-items-center text-success small fw-bold">
                          <div className="bg-success rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div>
                          ACCESIBLE
                        </div>
                      ) : (
                        <div className="d-flex align-items-center text-muted small fw-bold opacity-50">
                          <div className="bg-secondary rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div>
                          BLOQUEADO
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CCol>
          </CRow>

          {!noHayPeriodosDisponibles ? (
            <div className="px-md-2">
              <CNav variant="pills" className="boletin-nav-bg p-2 rounded-pill mb-4 d-inline-flex gap-2">
                {Object.keys(boletinData.periodos).map(periodoKey => {
                  const periodo = parseInt(periodoKey)
                  const estado = periodosEstado[periodo]?.estadoSecretaria
                  if (estado !== 'aprobado') return null

                  return (
                    <CNavItem key={periodo}>
                      <CNavLink
                        className={`rounded-pill px-4 fw-bold py-2 transition-all ${activeKey === periodo ? 'boletin-nav-active shadow-sm' : 'boletin-nav-inactive hover-bg-gray'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setActiveKey(periodo)}
                      >
                        {periodo}° Lapso
                      </CNavLink>
                    </CNavItem>
                  )
                })}
              </CNav>

              <CTabContent className="mt-2">
                {Object.keys(boletinData.periodos).map(periodoKey => {
                  const periodo = parseInt(periodoKey)
                  const periodoData = boletinData.periodos[periodo]
                  const estado = periodosEstado[periodo]
                  if (estado?.estadoSecretaria !== 'aprobado') return null

                  return (
                    <CTabPane key={periodo} visible={activeKey === periodo} className="animate__animated animate__fadeIn">
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
          ) : (
            <div className="text-center py-5">
              <div className="p-4 bg-orange-soft rounded-circle d-inline-flex mb-4 boletin-empty-icon-border shadow-sm">
                <CIcon icon={cilBan} size="4xl" className="text-primary" />
              </div>
              <h3 className="fw-bold mb-3 boletin-info-value">Información No Disponible</h3>
              <p className="boletin-info-label mx-auto mb-4" style={{ maxWidth: '500px' }}>
                Los boletines académicos correspondientes al período actual aún se encuentran en proceso de validación administrativa.
              </p>
              <CButton className="btn-premium px-5 py-3 rounded-pill shadow-sm hover-lift">
                <CIcon icon={cilCloudDownload} className="me-2" />
                SOLICITAR NOTIFICACIÓN
              </CButton>
            </div>
          )}
        </CCardBody>

        <CCardFooter className="boletin-footer border-0 py-4 text-center">
          <small className="boletin-info-label fw-bold text-uppercase ls-1 opacity-75" style={{ fontSize: '0.7rem' }}>
            <CIcon icon={cilLockLocked} className="me-2" size="sm" />
            Documento Oficial Validado por la Coordinación Académica | ENDANZA {new Date().getFullYear()}
          </small>
        </CCardFooter>
      </CCard>

      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast key={t.id} visible color={t.type === 'success' ? 'success' : 'warning'} className="border-0 shadow-lg text-white">
            <CToastHeader closeButton className="bg-transparent border-0 text-white">
              <strong className="me-auto">Sistema Académico</strong>
            </CToastHeader>
            <CToastBody className="fw-medium">{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      <style>{`
        @media print { .no-print { display: none !important; } }
      `}</style>
    </CContainer>
  )
}

export default BoletinView