import {
  CCard,
  CCardBody,
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
import AcademicHeader from "./components/common/AcademicHeader"
import StudentInfoCard from "./components/common/StudentInfoCard"
import {
  cilLockLocked,
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

        <AcademicHeader
          title="Expediente Académico"
          subtitle="Consulta de Boletines"
          studentCode={estudiante.codigo}
          icon={cilFolderOpen}
          colorClass="warning"
        />

        <CCardBody className="p-3 p-md-5">
          <CRow className="mb-4 mb-md-5 g-3 g-md-4">
            <CCol md={8}>
              <StudentInfoCard
                student={estudiante}
                colorClass="warning"
              />
            </CCol>
            <CCol md={4}>
              <div className="p-3 p-md-4 rounded-4 bg-orange-soft h-100 border border-warning border-opacity-10 shadow-sm availability-card">
                <div className="d-flex align-items-center mb-3 mb-md-4">
                  <span className="p-2 bg-warning text-white rounded-circle me-3 shadow-sm flex-shrink-0">
                    <CIcon icon={cilFolderOpen} size="sm" />
                  </span>
                  <h6 className="text-warning mb-0 label-micro fw-bold text-uppercase ls-1">Disponibilidad</h6>
                </div>
                <div className="d-flex flex-column gap-2 gap-md-3">
                  {Object.entries(periodosEstado).map(([periodo, data]) => (
                    <div key={periodo} className="d-flex justify-content-between align-items-center p-2 p-md-3 rounded-3 bg-availability-item shadow-sm border border-availability-item transition-all">
                      <span className="fw-bold small availability-text">Lapso {periodo}</span>
                      {data.estadoSecretaria === 'aprobado' ? (
                        <div className="d-flex align-items-center text-success small fw-bold" style={{ fontSize: '0.65rem' }}>
                          <div className="bg-success rounded-circle me-1 me-md-2" style={{ width: '6px', height: '6px' }}></div>
                          ACCESIBLE
                        </div>
                      ) : (
                        <div className="d-flex align-items-center text-muted-custom small fw-bold opacity-50" style={{ fontSize: '0.65rem' }}>
                          <div className="bg-secondary rounded-circle me-1 me-md-2" style={{ width: '6px', height: '6px' }}></div>
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
            <div className="px-md-2 overflow-hidden w-100">
              <CNav variant="pills" className="bg-nav-pills p-2 rounded-pill mb-4 d-flex flex-nowrap overflow-auto gap-2 w-100 w-md-auto shadow-sm">
                {Object.keys(boletinData.periodos).map(periodoKey => {
                  const periodo = parseInt(periodoKey)
                  const estado = periodosEstado[periodo]?.estadoSecretaria
                  if (estado !== 'aprobado') return null

                  return (
                    <CNavItem key={periodo} className="flex-shrink-0">
                      <CNavLink
                        className={`rounded-pill px-4 fw-bold py-2 transition-all ${activeKey === periodo ? 'bg-warning text-white shadow-sm' : 'nav-pill-link hover-bg-orange-soft'}`}
                        style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
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
                <CIcon icon={cilBan} size="4xl" className="text-warning" />
              </div>
              <h3 className="fw-bold mb-3 empty-title">Información No Disponible</h3>
              <p className="empty-subtitle mx-auto mb-4" style={{ maxWidth: '500px' }}>
                Los boletines académicos correspondientes al período actual aún se encuentran en proceso de validación administrativa.
              </p>
              <CButton className="btn-premium px-5 py-3 rounded-pill shadow-sm hover-lift bg-warning text-white border-0">
                <CIcon icon={cilCloudDownload} className="me-2" />
                SOLICITAR NOTIFICACIÓN
              </CButton>
            </div>
          )}
        </CCardBody>

        <CCardFooter className="boletin-footer border-0 py-4 text-center bg-transparent">
          <small className="footer-text fw-bold text-uppercase ls-1 opacity-75" style={{ fontSize: '0.7rem' }}>
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
        .ls-1 { letter-spacing: 1px; }
        .label-micro { font-size: 0.75rem; }
        .transition-all { transition: all 0.2s ease; }
        .bg-nav-pills { background-color: var(--neutral-100); }
        .nav-pill-link { color: var(--neutral-600); }
        .nav-pill-link:hover { background-color: rgba(242, 140, 15, 0.05); color: #F28C0F; }
        
        .bg-availability-item { background-color: white; }
        .border-availability-item { border-color: var(--neutral-100) !important; }
        .availability-text { color: var(--neutral-800); }
        .empty-title { color: var(--neutral-800); }
        .empty-subtitle { color: var(--neutral-500); }
        .footer-text { color: var(--neutral-500); }

        [data-coreui-theme="dark"] .availability-card { background-color: rgba(242, 140, 15, 0.05); border-color: rgba(242, 140, 15, 0.1) !important; }
        [data-coreui-theme="dark"] .bg-availability-item { background-color: rgba(255, 255, 255, 0.05); }
        [data-coreui-theme="dark"] .border-availability-item { border-color: rgba(255, 255, 255, 0.05) !important; }
        [data-coreui-theme="dark"] .availability-text { color: white; }
        [data-coreui-theme="dark"] .bg-nav-pills { background-color: rgba(255, 255, 255, 0.05); }
        [data-coreui-theme="dark"] .nav-pill-link { color: rgba(255, 255, 255, 0.6); }
        [data-coreui-theme="dark"] .nav-pill-link:hover { background-color: rgba(242, 140, 15, 0.1); color: #F28C0F; }
        [data-coreui-theme="dark"] .empty-title { color: white; }
        [data-coreui-theme="dark"] .empty-subtitle { color: rgba(255, 255, 255, 0.5); }
        [data-coreui-theme="dark"] .boletin-empty-icon-border { border: 1px solid rgba(255, 255, 255, 0.05); }
        [data-coreui-theme="dark"] .footer-text { color: rgba(255, 255, 255, 0.4); }

        @media print { .no-print { display: none !important; } }
      `}</style>
    </CContainer>
  )
}

export default BoletinView