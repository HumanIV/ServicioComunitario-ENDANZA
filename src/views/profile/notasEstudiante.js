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
    CRow,
    CCol,
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
    cilNotes
} from "@coreui/icons"

// Simulación de datos (Reutilizamos la estructura de notas)
const notasData = {
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
            estadoSecretaria: 'pendiente', // En notas, quizás mostramos todo? Depende de la lógica. Asumo igual que boletín por ahora.
            fechaAprobacion: null,
            aprobadoPor: null
        }
    }
}

const NotasView = () => {
    const [activeKey, setActiveKey] = useState(null)
    const [toasts, setToasts] = useState([])

    useEffect(() => {
        // Seleccionar el primer periodo por defecto
        const primerPeriodo = Object.keys(notasData.periodos)[0];
        if (primerPeriodo) setActiveKey(parseInt(primerPeriodo));
    }, [])

    const showToast = useCallback((type, message) => {
        const id = Date.now()
        const newToast = { id, type, message }
        setToasts(prev => [...prev, newToast])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 4000)
    }, [])

    const handleDescargarNotas = useCallback((periodo) => {
        showToast('info', `📥 Descargando reporte de notas del ${periodo}° período...`)
        setTimeout(() => {
            showToast('success', `✅ Reporte del ${periodo}° período descargado`)
        }, 2000)
    }, [showToast])

    const { estudiante } = notasData
    const periodosKeys = Object.keys(notasData.periodos);

    return (
        <CContainer className="py-4 animate__animated animate__fadeIn">
            <CCard className="premium-card border-0 overflow-hidden shadow-lg pb-4">

                <AcademicHeader
                    title="Registro de Calificaciones"
                    subtitle="Consulta de Notas Parciales"
                    studentCode={estudiante.codigo}
                    icon={cilNotes}
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
                            <div className="p-3 p-md-4 rounded-4 bg-orange-soft h-100 border border-warning border-opacity-10 shadow-sm stats-card-notas">
                                <div className="d-flex align-items-center mb-3 mb-md-4">
                                    <span className="p-2 bg-warning text-white rounded-circle me-3 shadow-sm flex-shrink-0">
                                        <CIcon icon={cilNotes} size="sm" />
                                    </span>
                                    <h6 className="text-warning mb-0 label-micro fw-bold text-uppercase ls-1">Resumen Parcial</h6>
                                </div>
                                <div className="text-center py-2">
                                    <div className="notas-label small text-uppercase fw-bold ls-1 mb-1">Cortes Registrados</div>
                                    <h2 className="mb-0 fw-bold notas-value">{periodosKeys.length} / 3</h2>
                                </div>
                            </div>
                        </CCol>
                    </CRow>

                    {periodosKeys.length > 0 ? (
                        <div className="px-md-2 overflow-hidden w-100">
                            <CNav variant="pills" className="bg-nav-pills p-2 rounded-pill mb-4 d-flex flex-nowrap overflow-auto gap-2 w-100 w-md-auto shadow-sm">
                                {periodosKeys.map(periodoKey => {
                                    const periodo = parseInt(periodoKey)
                                    return (
                                        <CNavItem key={periodo} className="flex-shrink-0">
                                            <CNavLink
                                                className={`rounded-pill px-4 fw-bold py-2 transition-all ${activeKey === periodo ? 'bg-warning text-white shadow-sm' : 'nav-pill-link hover-bg-orange-soft'}`}
                                                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                                onClick={() => setActiveKey(periodo)}
                                            >
                                                {periodo}° Corte
                                            </CNavLink>
                                        </CNavItem>
                                    )
                                })}
                            </CNav>

                            <CTabContent className="mt-2">
                                {periodosKeys.map(periodoKey => {
                                    const periodo = parseInt(periodoKey)
                                    const periodoData = notasData.periodos[periodo]

                                    return (
                                        <CTabPane key={periodo} visible={activeKey === periodo} className="animate__animated animate__fadeIn">
                                            <PeriodoTab
                                                notas={periodoData.notas}
                                                periodoNumero={periodo}
                                                periodoNombre={periodoData.nombre}
                                                estadoSecretaria={periodoData.estadoSecretaria}
                                                fechaAprobacion={periodoData.fechaAprobacion}
                                                aprobadoPor={periodoData.aprobadoPor}
                                                onDescargar={handleDescargarNotas}
                                                isNotasView={true}
                                            />
                                        </CTabPane>
                                    )
                                })}
                            </CTabContent>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <div className="p-4 bg-orange-soft rounded-circle d-inline-flex mb-4 shadow-sm">
                                <CIcon icon={cilNotes} size="4xl" className="text-warning" />
                            </div>
                            <h3 className="fw-bold mb-3 notas-value">Sin Registros</h3>
                            <p className="footer-text mx-auto mb-4" style={{ maxWidth: '500px' }}>
                                No hay calificaciones parciales cargadas para el ciclo escolar actual.
                            </p>
                        </div>
                    )}
                </CCardBody>

                <CCardFooter className="border-0 py-4 text-center bg-transparent">
                    <small className="footer-text fw-bold text-uppercase ls-1 opacity-75" style={{ fontSize: '0.7rem' }}>
                        <CIcon icon={cilLockLocked} className="me-2" size="sm" />
                        Registro Académico Oficial | ENDANZA {new Date().getFullYear()}
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
                
                .notas-label { color: var(--neutral-500); }
                .notas-value { color: var(--neutral-800); }
                .footer-text { color: var(--neutral-500); }

                [data-coreui-theme="dark"] .stats-card-notas { background-color: rgba(242, 140, 15, 0.05); border-color: rgba(242, 140, 15, 0.1) !important; }
                [data-coreui-theme="dark"] .bg-nav-pills { background-color: rgba(255, 255, 255, 0.05); }
                [data-coreui-theme="dark"] .nav-pill-link { color: rgba(255, 255, 255, 0.6); }
                [data-coreui-theme="dark"] .nav-pill-link:hover { background-color: rgba(242, 140, 15, 0.1); color: #F28C0F; }
                [data-coreui-theme="dark"] .notas-label { color: rgba(255, 255, 255, 0.5); }
                [data-coreui-theme="dark"] .notas-value { color: white; }
                [data-coreui-theme="dark"] .footer-text { color: rgba(255, 255, 255, 0.4); }
            `}</style>
        </CContainer>
    )
}

export default NotasView
