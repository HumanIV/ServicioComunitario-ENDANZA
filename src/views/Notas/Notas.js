// SistemaEvaluacionDanza.jsx - Versión corregida con configService
import React, { useState, useEffect } from "react"
import { CContainer, CToaster, CToast, CToastBody, CSpinner, CAlert, CBadge } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilNotes } from "@coreui/icons"
import useUserRole from '../../hooks/useUserRole'

// Servicios
import { getSectionsForGrades, getGradesForSection, saveGrades, getTeacherSections } from '../../services/gradeService'

import { getAvailableYears, getActiveYear, getGradesPeriod, getLapsosByYear } from '../../services/configService' // ← CORREGIDO

// Componentes
import GradeCards from "./components/GradeCards"
import SubjectCards from "./components/SubjectCards"
import EvaluationTable from "./components/EvaluationTable"
import EvaluationSummary from "./components/EvaluationSummary"
import SendConfirmationModal from "./components/SendConfirmationModal"

const SistemaEvaluacionDanza = () => {
    const { userRole, isAdmin, isDocente } = useUserRole()

    // Estados
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [years, setYears] = useState([])
    const [selectedYear, setSelectedYear] = useState(null)
    const [loadingYears, setLoadingYears] = useState(true)

    const [lapsos, setLapsos] = useState([])
    const [selectedLapso, setSelectedLapso] = useState(null)

    const [gradoSeleccionado, setGradoSeleccionado] = useState(null)
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null)
    const [notas, setNotas] = useState({})
    const [notasOriginales, setNotasOriginales] = useState({})

    const [modalVisible, setModalVisible] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [toasts, setToasts] = useState([])

    // Configuración del periodo
    const [gradesPeriod, setGradesPeriod] = useState(null)

    // Cargar años académicos disponibles al montar el componente
    useEffect(() => {
        cargarAniosAcademicos()
    }, [])

    // Cargar datos cuando cambie el año seleccionado
    useEffect(() => {
        if (selectedYear) {
            cargarLapsos(selectedYear.id)
            cargarDatos(selectedYear.id)
            cargarPeriodoNotas(selectedYear.id)
        }
    }, [selectedYear])

    const cargarLapsos = async (yearId) => {
        try {
            const lapsosData = await getLapsosByYear(yearId)
            setLapsos(lapsosData)
            if (lapsosData.length > 0) {
                // Seleccionar el lapso activo o el primero
                // Por ahora seleccionamos el primero si no hay lógica de activo
                setSelectedLapso(lapsosData[0])
            } else {
                setSelectedLapso(null)
            }
        } catch (error) {
            console.error("Error cargando lapsos:", error)
        }
    }

    const cargarPeriodoNotas = async (yearId) => {
        try {
            console.log(`🔍 Verificando periodo de notas para año: ${yearId}`);
            const period = await getGradesPeriod(yearId);
            console.log("📥 Datos del periodo recibidos:", period);

            if (!period) {
                setGradesPeriod({ abierto: isAdmin, mensaje: "Sin configuración", realmenteAbierto: false });
                return;
            }

            const obtenerFechaLocalStr = (d) => {
                if (!d) return null;
                const date = new Date(d);
                if (isNaN(date.getTime())) return null;
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}`;
            };

            const fechaInicioStr = obtenerFechaLocalStr(period.fechaInicio);
            const fechaFinStr = obtenerFechaLocalStr(period.fechaFin);
            const today = new Date();
            const hoyStr = obtenerFechaLocalStr(today);

            let abierto = false;
            let mensaje = "";

            // Convertir activo a boolean real por si viene como 0/1 o string
            const isActivo = period.activo === true || period.activo === 1 || period.activo === "true";

            if (!isActivo) {
                mensaje = "Periodo inhabilitado por administración";
            } else if (!fechaInicioStr || !fechaFinStr) {
                mensaje = "Fechas no configuradas correctamente";
            } else if (hoyStr < fechaInicioStr) {
                const dParts = fechaInicioStr.split('-');
                mensaje = `Inicia el ${dParts[2]}/${dParts[1]}/${dParts[0]}`;
            } else if (hoyStr > fechaFinStr) {
                const dParts = fechaFinStr.split('-');
                mensaje = `Finalizó el ${dParts[2]}/${dParts[1]}/${dParts[0]}`;
            } else {
                abierto = true;
            }

            setGradesPeriod({
                ...period,
                activo: isActivo,
                fechaFin: fechaFinStr,
                abierto: isAdmin ? true : abierto,
                realmenteAbierto: abierto,
                mensaje: mensaje || "Carga Habilitada"
            });
        } catch (error) {
            console.error("❌ Error cargando periodo de notas:", error);
            setGradesPeriod({ abierto: isAdmin, mensaje: "Error de verificación", realmenteAbierto: false });
        }
    }

    const validarPeriodoNotas = () => {
        if (isAdmin) return true; // Admin siempre puede

        // Validar fechas del Lapso
        if (selectedLapso) {
            const today = new Date().toISOString().split('T')[0];
            const start = selectedLapso.start_date ? new Date(selectedLapso.start_date).toISOString().split('T')[0] : null;

            if (start && today < start) {
                showToast("warning", `El lapso "${selectedLapso.name}" aún no ha iniciado (${start})`);
                return false;
            }
        }

        if (!gradesPeriod) return false;

        if (!gradesPeriod.abierto) {
            showToast("warning", `Periodo cerrado: ${gradesPeriod.mensaje}`);
            return false;
        }
        return true;
    }

    const cargarAniosAcademicos = async () => {
        setLoadingYears(true)
        try {
            console.log('📅 Cargando años académicos...')
            const yearsData = await getAvailableYears()
            console.log('📊 Años disponibles:', yearsData)
            setYears(yearsData)

            // Intentar obtener año activo primero
            const activeYear = await getActiveYear()
            if (activeYear) {
                console.log('✅ Año activo encontrado:', activeYear)
                // Restricción: Solo mostrar el año activo
                setYears([activeYear])
                setSelectedYear(activeYear)
            } else if (yearsData.length > 0) {
                // Si no hay activo, seleccionar el primero (fallback)
                console.log('📌 Seleccionando primer año disponible:', yearsData[0])
                setYears([yearsData[0]])
                setSelectedYear(yearsData[0])
            }
        } catch (error) {
            console.error('❌ Error cargando años:', error)
            showToast('danger', 'Error al cargar años académicos')
        } finally {
            setLoadingYears(false)
        }
    }

    const cargarDatos = async (yearId) => {
        setLoading(true)
        try {
            console.log(`📅 Cargando secciones para año: ${yearId}`)
            let sections

            if (isDocente) {
                console.log('👨‍🏫 Modo DOCENTE: Cargando carga académica')
                sections = await getTeacherSections(yearId)

                // Unificar todas las materias en un solo grupo para vista directa
                const todasLasMaterias = sections.flatMap(g => g.materias || []);
                if (todasLasMaterias.length > 0) {
                    const gradoUnificado = {
                        grado: 'Mis Materias Asignadas',
                        materias: todasLasMaterias
                    };
                    setGradoSeleccionado(gradoUnificado);
                    setData([]); // Evitar renderizado de GradeCards
                } else {
                    setGradoSeleccionado(null);
                    setData([]);
                    showToast('info', 'No tienes carga académica asignada para este periodo.');
                }
            } else {
                console.log('👨‍💼 Modo ADMIN: Cargando todas las secciones')
                sections = await getSectionsForGrades(yearId)
                setData(sections)
                // Limpiar selecciones al cambiar de año (solo para admin)
                setGradoSeleccionado(null)
            }

            console.log('📊 Datos cargados:', sections)
            if (!isDocente) setData(sections)

            setMateriaSeleccionada(null)
        } catch (err) {
            console.error('❌ Error:', err)
            setError('Error al cargar los datos')
            showToast('danger', 'Error al cargar los datos')
        } finally {
            setLoading(false)
        }
    }

    // Cargar notas cuando se selecciona una materia
    useEffect(() => {
        if (materiaSeleccionada && selectedLapso) {
            cargarNotasMateria(materiaSeleccionada.sectionId, selectedLapso.id)
        }
    }, [materiaSeleccionada, selectedLapso])

    const cargarNotasMateria = async (sectionId, lapsoId) => {
        try {
            const notasGuardadas = await getGradesForSection(sectionId, lapsoId)
            setNotas(notasGuardadas)
            setNotasOriginales(JSON.parse(JSON.stringify(notasGuardadas)))
        } catch (err) {
            showToast('warning', 'No se pudieron cargar notas guardadas')
        }
    }

    // Funciones de lógica de notas
    const manejarNotaChange = (estudianteId, numeroNota, valor) => {
        // Solo docentes pueden editar
        if (!isDocente) return

        // Validar si estamos en periodo de carga de notas
        if (!validarPeriodoNotas()) {
            return; // No permitir cambios
        }

        const valorNumerico = parseFloat(valor)
        if ((valor === "" || (valorNumerico >= 0 && valorNumerico <= 20)) && valor.length <= 4) {
            const nuevoValor = valor === "" ? "" : Math.min(20, Math.max(0, valorNumerico)).toString()
            setNotas(prev => {
                const nuevasNotas = {
                    ...prev,
                    [estudianteId]: {
                        ...(prev[estudianteId] || { n1: "", n2: "", n3: "", n4: "" }),
                        [`n${numeroNota}`]: nuevoValor
                    }
                }
                return nuevasNotas
            })
        }
    }

    const calcularPromedio = (estudianteId) => {
        const notasEstudiante = notas[estudianteId]
        if (!notasEstudiante) return null
        const valores = [notasEstudiante.n1, notasEstudiante.n2, notasEstudiante.n3, notasEstudiante.n4]
            .filter(n => n !== "" && !isNaN(parseFloat(n)))
        if (valores.length === 0) return null
        return (valores.reduce((acc, n) => acc + parseFloat(n), 0) / valores.length).toFixed(1)
    }

    const determinarEstado = (promedio) =>
        promedio === null ? "Pendiente" : (parseFloat(promedio) >= 10 ? "Aprobado" : "Reprobado")

    const getColorNota = (nota) => {
        if (nota === "" || nota === null) return "secondary"
        const num = parseFloat(nota)
        if (num >= 16) return "success"
        if (num >= 13) return "info"
        if (num >= 10) return "warning"
        return "danger"
    }

    const getColorEstado = (estado) => {
        switch (estado) {
            case "Aprobado": return "success"
            case "Reprobado": return "danger"
            default: return "secondary"
        }
    }

    const showToast = (type, message) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, type, message }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
    }

    const hayCambios = () => {
        return JSON.stringify(notas) !== JSON.stringify(notasOriginales)
    }

    const prepararEnvio = () => {
        if (!materiaSeleccionada) return

        if (!validarPeriodoNotas()) return;

        const estudiantesSinNotas = materiaSeleccionada.estudiantes.filter(est =>
            !notas[est.id] || Object.values(notas[est.id]).every(n => n === "")
        )

        if (estudiantesSinNotas.length > 0) {
            return showToast("warning", `Hay ${estudiantesSinNotas.length} estudiantes sin notas`)
        }

        if (!hayCambios()) {
            return showToast("info", "No hay cambios para guardar")
        }

        setModalVisible(true)
    }

    const enviarNotasSecretaria = async () => {
        setEnviando(true)
        try {
            const response = await saveGrades({
                sectionId: materiaSeleccionada.sectionId,
                grades: notas,
                academicYearId: materiaSeleccionada.academicYearId || selectedYear?.id,
                lapsoId: selectedLapso?.id
            })

            setNotasOriginales(JSON.parse(JSON.stringify(notas)))
            setModalVisible(false)

            if (isDocente) {
                showToast("success", "✅ Notas enviadas correctamente. Pendientes de aprobación por administración.")
            } else {
                showToast("success", "✅ Notas guardadas y formalizadas correctamente")
            }

        } catch (error) {
            console.error('❌ Error al guardar:', error)
            showToast("danger", "Error al guardar las notas")
        } finally {
            setEnviando(false)
        }
    }

    const limpiarNotasMateria = () => {
        if (!isDocente) return
        if (!validarPeriodoNotas()) return;

        if (window.confirm("¿Está seguro de limpiar todas las notas de esta materia?")) {
            setNotas(prev => {
                const nuevas = { ...prev }
                Object.keys(nuevas).forEach(estId => {
                    // Solo limpiamos notas que no estén formalizadas si quisiéramos ser estrictos
                    // Pero aquí reseteamos el estado local
                    nuevas[estId] = { n1: "", n2: "", n3: "", n4: "" };
                })
                // No eliminamos la key para no perder la referencia del estudiante en el objeto
                return nuevas
            })
            showToast("info", "Notas limpiadas localmente")
        }
    }

    // Renderizado condicional para carga de años
    if (loadingYears) {
        return (
            <CContainer className="py-5 text-center">
                <CSpinner color="primary" />
                <p className="mt-2">Cargando años académicos...</p>
            </CContainer>
        )
    }

    if (years.length === 0) {
        return (
            <CContainer className="py-5">
                <CAlert color="warning">
                    No hay años académicos configurados. Contacte al administrador.
                </CAlert>
            </CContainer>
        )
    }

    if (loading) {
        return (
            <CContainer className="py-5 text-center">
                <CSpinner color="primary" />
                <p className="mt-2">Cargando datos académicos...</p>
            </CContainer>
        )
    }

    if (error) {
        return (
            <CContainer className="py-5">
                <CAlert color="danger">{error}</CAlert>
            </CContainer>
        )
    }

    return (
        <CContainer fluid className="py-4 profile-container pb-5">
            <header className="mb-5 no-print">
                <div className="d-flex align-items-center gap-3">
                    <div className="p-3 bg-primary rounded-circle shadow-sm">
                        <CIcon icon={cilNotes} size="xl" className="text-white" />
                    </div>
                    <div>
                        <h2 className="mb-0 fw-bold header-title-custom text-uppercase ls-1">
                            {isAdmin ? 'Consulta de Calificaciones' : 'Centro de Calificaciones'}
                        </h2>
                        <p className="text-muted-custom small mb-0 text-uppercase ls-1">
                            {isAdmin
                                ? 'Visualización de rendimiento académico'
                                : 'Gestión académica de la Escuela Nacional de Danza'}
                        </p>
                    </div>
                </div>

                {/* Barra de Herramientas Unificada: Año y Lapso */}
                {years.length > 0 && (
                    <div className="d-flex flex-column flex-md-row bg-dark bg-opacity-25 p-3 rounded-2 border border-secondary border-opacity-25 mt-4 gap-3 align-items-md-center shadow-sm">

                        {/* Grupo Año */}
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-secondary fw-bold text-uppercase small ls-1">Año Académico:</span>
                            <select
                                className="form-select form-select-sm w-auto bg-dark text-white border-secondary fw-bold shadow-sm"
                                value={selectedYear?.id || ''}
                                onChange={(e) => {
                                    const year = years.find(y => y.id === parseInt(e.target.value))
                                    setSelectedYear(year)
                                }}
                                disabled={years.length <= 1}
                                style={{ minWidth: '140px' }}
                            >
                                {years.map(year => (
                                    <option key={year.id} value={year.id}>
                                        {year.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Separador vertical para desktop */}
                        <div className="vr text-secondary mx-2 d-none d-md-block opacity-25"></div>

                        {/* Grupo Lapso */}
                        {lapsos.length > 0 && (
                            <div className="d-flex align-items-center gap-2">
                                <span className="text-secondary fw-bold text-uppercase small ls-1">Lapso:</span>
                                <select
                                    className="form-select form-select-sm w-auto bg-dark text-white border-secondary fw-bold shadow-sm"
                                    value={selectedLapso?.id || ''}
                                    onChange={(e) => {
                                        const lapso = lapsos.find(l => l.id === parseInt(e.target.value))
                                        setSelectedLapso(lapso)
                                    }}
                                    style={{ minWidth: '150px' }}
                                >
                                    {lapsos.map(lapso => (
                                        <option key={lapso.id} value={lapso.id}>
                                            {lapso.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Estado a la derecha */}
                        {gradesPeriod && (
                            <div className="ms-md-auto mt-2 mt-md-0">
                                {(() => {
                                    const formatDate = (dateStr) => {
                                        if (!dateStr) return 'indefinida';
                                        const parts = dateStr.split('T')[0].split('-');
                                        return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr;
                                    };

                                    const esVerde = isAdmin ? gradesPeriod.realmenteAbierto : gradesPeriod.abierto;

                                    return (
                                        <CAlert color={esVerde ? "success" : "danger"} className="mb-0 py-1 px-3 small d-flex align-items-center rounded-pill border-0 shadow-sm" style={{ backgroundColor: esVerde ? 'rgba(25, 135, 84, 0.15)' : 'rgba(220, 53, 69, 0.15)', color: esVerde ? '#75b798' : '#ea868f' }}>
                                            <div className={`rounded-circle me-2 ${esVerde ? 'bg-success' : 'bg-danger'}`} style={{ width: 8, height: 8, boxShadow: `0 0 8px ${esVerde ? 'rgba(25, 135, 84, 0.6)' : 'rgba(220, 53, 69, 0.6)'}` }}></div>
                                            <strong className="me-2 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Estado:</strong>
                                            <span style={{ fontSize: '0.8rem' }}>
                                                {gradesPeriod.realmenteAbierto
                                                    ? `Habilitado hasta ${formatDate(gradesPeriod.fechaFin)}`
                                                    : `Cerrado (${gradesPeriod.mensaje})`
                                                }
                                                {isAdmin && <CBadge color="info" className="ms-2 py-0 px-2" style={{ fontSize: '0.65rem' }}>ADMIN</CBadge>}
                                            </span>
                                        </CAlert>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                )}
            </header>

            {
                data.length === 0 && !loading && !gradoSeleccionado ? (
                    <CAlert color="warning">
                        No hay secciones disponibles para el año académico seleccionado.
                    </CAlert>
                ) : (
                    <>
                        {!gradoSeleccionado && (
                            <GradeCards
                                data={data}
                                onSelectGrade={setGradoSeleccionado}
                            />
                        )}

                        {gradoSeleccionado && !materiaSeleccionada && (
                            <SubjectCards
                                grade={gradoSeleccionado}
                                onBack={() => setGradoSeleccionado(null)}
                                showBackButton={!isDocente}
                                onSelectSubject={setMateriaSeleccionada}
                                calculatePromedio={calcularPromedio}
                                getColorEstado={getColorEstado}
                                determinarEstado={determinarEstado}
                            />
                        )}

                        {gradoSeleccionado && materiaSeleccionada && (
                            <>
                                <EvaluationSummary
                                    subject={materiaSeleccionada}
                                    notas={notas}
                                    calculatePromedio={calcularPromedio}
                                />
                                <div className="mt-4">
                                    <EvaluationTable
                                        grade={gradoSeleccionado}
                                        subject={materiaSeleccionada}
                                        onBack={() => setMateriaSeleccionada(null)}
                                        onClear={isDocente ? limpiarNotasMateria : null}
                                        onPrepareSend={isDocente ? prepararEnvio : null}
                                        notas={notas}
                                        onNotaChange={isDocente ? manejarNotaChange : null}
                                        calculatePromedio={calcularPromedio}
                                        determinarEstado={determinarEstado}
                                        getColorNota={getColorNota}
                                        getColorEstado={getColorEstado}
                                        modoLectura={isAdmin || (isDocente && gradesPeriod && !gradesPeriod.abierto)}
                                        hayCambios={hayCambios()}
                                    />
                                </div>
                            </>
                        )}
                    </>
                )
            }

            <SendConfirmationModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                enviando={enviando}
                subject={materiaSeleccionada}
                grade={gradoSeleccionado}
                calculatePromedio={calcularPromedio}
                determinarEstado={determinarEstado}
                getColorEstado={getColorEstado}
                onConfirm={enviarNotasSecretaria}
            />

            <CToaster placement="top-end">
                {toasts.map((t) => (
                    <CToast key={t.id} visible={true} color={t.type} className="text-white align-items-center border-0 shadow">
                        <div className="d-flex">
                            <CToastBody>{t.message}</CToastBody>
                        </div>
                    </CToast>
                ))}
            </CToaster>
        </CContainer >
    )
}

export default SistemaEvaluacionDanza