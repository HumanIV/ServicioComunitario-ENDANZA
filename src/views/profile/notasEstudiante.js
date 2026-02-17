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
    CToastBody,
    CSpinner,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem
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
    cilNotes,
    cilPeople
} from "@coreui/icons"
import { getStudentGrades } from "../../services/gradeService"
import { getRepresentanteConEstudiantes } from "../../services/representanteService"

const NotasView = () => {
    const [activeKey, setActiveKey] = useState(1)
    const [toasts, setToasts] = useState([])
    const [notasData, setNotasData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [myStudents, setMyStudents] = useState([])
    const [selectedStudentId, setSelectedStudentId] = useState(null)
    const [userRole, setUserRole] = useState(null)

    const showToast = useCallback((type, message) => {
        const id = Date.now()
        const newToast = { id, type, message }
        setToasts(prev => [...prev, newToast])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 4000)
    }, [])

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                // Obtener usuario del localStorage
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    showToast('warning', 'No se encontró sesión activa');
                    setLoading(false);
                    return;
                }
                const user = JSON.parse(userStr);
                setUserRole(user.role);

                let studentIdToFetch = null;

                if (user.role === 'representante') {
                    // Buscar representante y sus estudiantes
                    // Asumimos que user.id es el ID del usuario representante, necesitamos su ID de representante
                    // O el endpoint /api/representantes/me o similar. 
                    // Por ahora usamos getRepresentanteConEstudiantes asumiendo que tenemos el ID del representante en el token o user
                    // Si user tiene associatedId (id_representante)

                    if (user.associatedId) {
                        const response = await getRepresentanteConEstudiantes(user.associatedId);
                        if (response && response.ok && response.estudiantes) {
                            setMyStudents(response.estudiantes);
                            if (response.estudiantes.length > 0) {
                                // Si ya había seleccionado uno, mantenerlo, si no, seleccionar el primero
                                if (!selectedStudentId) {
                                    studentIdToFetch = response.estudiantes[0].id;
                                    setSelectedStudentId(studentIdToFetch);
                                } else {
                                    studentIdToFetch = selectedStudentId; // Refetch del actual
                                }
                            }
                        }
                    } else {
                        // Fallback o error ? 
                        // Intentar buscar por userID si el associatedId no está
                        // Por ahora simulamos que no hay estudiantes si no hay associatedId
                    }

                } else if (user.role === 'estudiante') {
                    studentIdToFetch = user.associatedId;
                    setSelectedStudentId(studentIdToFetch);
                }

                if (studentIdToFetch) {
                    await loadGrades(studentIdToFetch);
                } else {
                    setLoading(false);
                }

            } catch (error) {
                console.error("Error cargando datos de usuario:", error);
                showToast('error', 'Error al cargar perfil');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [selectedStudentId, showToast]); // Re-run if selectedStudentId changes manually (dropdown)

    const loadGrades = async (studentId) => {
        setLoading(true);
        try {
            const grades = await getStudentGrades(studentId);
            const transformedData = transformGradesData(grades, studentId);
            setNotasData(transformedData);
        } catch (error) {
            console.error("Error cargando notas:", error);
            showToast('error', 'Error al cargar calificaciones');
        } finally {
            setLoading(false);
        }
    };

    const transformGradesData = (grades, studentId) => {
        // Encontrar estudiante en myStudents si es rep, o construirlo básico
        let estudianteInfo = {
            nombre: "Estudiante",
            codigo: `EST-${studentId}`,
            grado: "N/A",
            seccion: "N/A"
        };

        if (myStudents.length > 0) {
            const found = myStudents.find(s => s.id === studentId);
            if (found) {
                estudianteInfo = {
                    nombre: `${found.first_name} ${found.last_name}`,
                    codigo: found.dni,
                    grado: found.gradeLevel || "N/A", // Si viene del back
                    seccion: "A" // TODO: Esto debería venir del endpoint de estudiantes de repre
                }
            }
        }

        // Agrupar por corte (1, 2, 3)
        // La estructura de evaluaciones son cortes 1, 2, 3, 4
        // PeriodoTab espera: { 1: { nombre: "Primer Período", notas: [...] } }
        const periodos = {};

        // Inicializar periodos por defecto
        [1, 2, 3].forEach(p => {
            periodos[p] = {
                nombre: `${p}° Corte`,
                notas: [],
                estadoSecretaria: 'pendiente', // Default
                fechaAprobacion: null,
                aprobadoPor: null
            };
        });

        grades.forEach(g => {
            const corte = g.evaluation_number;
            if (periodos[corte]) {
                periodos[corte].notas.push({
                    materia: g.subject_name || "Materia desconocida",
                    codigo: g.subject_name?.substring(0, 3).toUpperCase() + '-101' || 'COD', // Mock code
                    nota: g.score,
                    creditos: 3, // Mock
                    observacion: g.score >= 10 ? "Aprobado" : "Reprobado",
                    docente: "Docente" // Falta en endpoint
                });
            }
        });

        return {
            estudiante: estudianteInfo,
            periodos
        };
    };

    const handleStudentChange = (id) => {
        setSelectedStudentId(id);
    };

    const handleDescargarNotas = useCallback((periodo) => {
        showToast('info', `📥 Descargando reporte de notas del ${periodo}° corte...`)
        setTimeout(() => {
            showToast('success', `✅ Reporte descargado`)
        }, 2000)
    }, [showToast])

    if (loading) {
        return (
            <div className="text-center py-5">
                <CSpinner color="warning" />
                <div className="mt-3 text-muted">Cargando boletín de notas...</div>
            </div>
        );
    }

    if (!notasData && !loading) {
        return (
            <div className="text-center py-5">
                <h4 className="text-muted">No se encontró información académica.</h4>
                <p className="text-muted small">Si es representante, asegúrese de tener estudiantes vinculados.</p>
            </div>
        )
    }

    const { estudiante } = notasData
    const periodosKeys = Object.keys(notasData.periodos);

    return (
        <CContainer className="py-4 animate__animated animate__fadeIn">
            <CCard className="premium-card border-0 overflow-hidden shadow-lg pb-4">

                <div className="d-flex justify-content-between align-items-center pe-4">
                    <AcademicHeader
                        title="Registro de Calificaciones"
                        subtitle="Consulta de Notas Parciales"
                        studentCode={estudiante.codigo}
                        icon={cilNotes}
                        colorClass="warning"
                    />

                    {/* Selector de estudiante para representantes */}
                    {userRole === 'representante' && myStudents.length > 1 && (
                        <div className="mb-3">
                            <CDropdown>
                                <CDropdownToggle color="warning" className="text-white">
                                    <CIcon icon={cilPeople} className="me-2" />
                                    Cambiar Estudiante
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    {myStudents.map(student => (
                                        <CDropdownItem
                                            key={student.id}
                                            active={selectedStudentId === student.id}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleStudentChange(student.id)}
                                        >
                                            {student.first_name} {student.last_name}
                                        </CDropdownItem>
                                    ))}
                                </CDropdownMenu>
                            </CDropdown>
                        </div>
                    )}
                </div>

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
                                    <h2 className="mb-0 fw-bold notas-value">3 / 3</h2>
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
