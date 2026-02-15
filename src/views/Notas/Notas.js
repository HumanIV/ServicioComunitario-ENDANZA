import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { CContainer, CToaster, CToast, CToastBody, CFormSelect } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilNotes, cilWarning } from "@coreui/icons"

// Componentes extraídos
import DocenteGradeCards from "./components/DocenteGradeCards"
import AdminGradeCards from "./components/AdminGradeCards"
import DocenteSubjectCards from "./components/DocenteSubjectCards"
import AdminSubjectCards from "./components/AdminSubjectCards"
import DocenteEvaluationTable from "./components/DocenteEvaluationTable"
import AdminEvaluationTable from "./components/AdminEvaluationTable"
import EvaluationSummary from "./components/EvaluationSummary"
import SendConfirmationModal from "./components/SendConfirmationModal"

import useUserRole from "../../Hooks/useUserRole"
import { SUBJECTS, getAvailableYears, listSections } from '../../services/schedules'

const COMPETENCIES_KEY = 'competencies_config_v1'

const SistemaEvaluacionDanza = () => {
    const { isAdmin, isDocente } = useUserRole()
    const isReadOnly = isAdmin && !isDocente // El admin solo ve, el docente carga

    // ---------------------- ESTADOS PRINCIPALES ---------------------- //
    const [gradoSeleccionado, setGradoSeleccionado] = useState(null)
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null)
    const [selectedLapso, setSelectedLapso] = useState(1)
    const [selectedYear, setSelectedYear] = useState('2025-2026')
    const [notas, setNotas] = useState({})
    const [modalVisible, setModalVisible] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [toasts, setToasts] = useState([])
    const [availableYears, setAvailableYears] = useState([])
    const [competencies, setCompetencies] = useState([])
    const [sectionsData, setSectionsData] = useState([])

    // Cargar datos iniciales
    useEffect(() => {
        const fetchInitialData = async () => {
            const years = await getAvailableYears()
            setAvailableYears(years)
            if (years.length > 0) setSelectedYear(years[0])

            const allSections = await listSections()
            const grouped = {}

            allSections.forEach(s => {
                if (!grouped[s.gradeLevel]) {
                    grouped[s.gradeLevel] = { grado: s.gradeLevel, materias: [] }
                }
                s.schedules.forEach(sch => {
                    grouped[s.gradeLevel].materias.push({
                        id: `${s.id}-${sch.id}`,
                        nombre: sch.subject,
                        horario: `${sch.dayOfWeek} ${sch.startTime}-${sch.endTime}`,
                        sectionId: s.id,
                        subjectName: sch.subject,
                        estudiantes: []
                    })
                })
            })
            const sectionsList = Object.values(grouped)
            setSectionsData(sectionsList)

            // Auto-selección si viene del dashboard
            if (location.state?.autoSelect) {
                const auto = location.state.autoSelect
                const gradeMatch = sectionsList.find(g => g.grado === auto.gradeLevel)
                if (gradeMatch) {
                    setGradoSeleccionado(gradeMatch)
                    const subjectMatch = gradeMatch.materias.find(m =>
                        auto.schedules.some(s => s.subject === m.subjectName)
                    )
                    if (subjectMatch) setMateriaSeleccionada(subjectMatch)
                }
            }

            const notasGuardadas = localStorage.getItem('notasEndanza')
            if (notasGuardadas) setNotas(JSON.parse(notasGuardadas))
        }
        fetchInitialData()
    }, [location.state])

    // Cargar Competencias cuando cambia la materia o lapso
    useEffect(() => {
        if (materiaSeleccionada && selectedYear) {
            const stored = localStorage.getItem(COMPETENCIES_KEY)
            let loadedCompetencies = []

            if (stored) {
                const config = JSON.parse(stored)
                const subjectConfig = config[selectedYear]?.[materiaSeleccionada.subjectName]
                if (subjectConfig && subjectConfig.lapsos[selectedLapso]) {
                    loadedCompetencies = subjectConfig.lapsos[selectedLapso].evaluations || []
                }
            }

            // Si no hay competencias configuradas, cargamos las "tradicionales" por defecto
            if (loadedCompetencies.length === 0) {
                loadedCompetencies = [
                    { id: 'c1', name: 'Evaluación 1', weight: 25 },
                    { id: 'c2', name: 'Evaluación 2', weight: 25 },
                    { id: 'c3', name: 'Evaluación 3', weight: 25 },
                    { id: 'c4', name: 'Evaluación 4', weight: 25 }
                ]
            }

            setCompetencies(loadedCompetencies)
        }
    }, [materiaSeleccionada, selectedLapso, selectedYear])

    // ---------------------- FUNCIONES DE LOGICA ---------------------- //
    const manejarNotaChange = (estudianteId, compId, valor) => {
        if (isReadOnly) return

        const valorNumerico = parseFloat(valor)
        if ((valor === "" || (valorNumerico >= 0 && valorNumerico <= 20)) && valor.length <= 4) {
            const nuevoValor = valor === "" ? "" : Math.min(20, Math.max(0, valorNumerico)).toString()
            setNotas(prev => {
                const studentGrades = prev[estudianteId] || {}
                const nuevasNotas = {
                    ...prev,
                    [estudianteId]: {
                        ...studentGrades,
                        [`lapso${selectedLapso}_comp${compId}`]: nuevoValor
                    }
                }
                localStorage.setItem('notasEndanza', JSON.stringify(nuevasNotas))
                return nuevasNotas
            })
        }
    }

    const calcularPromedio = (estudianteId) => {
        const notasEstudiante = notas[estudianteId] || {}
        if (competencies.length === 0) return null

        let totalPoints = 0
        let totalWeight = 0

        competencies.forEach(comp => {
            const nota = notasEstudiante[`lapso${selectedLapso}_comp${comp.id}`]
            if (nota !== "" && !isNaN(parseFloat(nota))) {
                totalPoints += parseFloat(nota) * (comp.weight / 100)
                totalWeight += comp.weight
            }
        })

        if (totalWeight === 0) return null
        // Si no se han llenado todas las notas, el promedio es parcial o sobre el total?
        // Usualmente es acumulativo. Pero si queremos el promedio real:
        return (totalPoints * (100 / totalWeight)).toFixed(1)
    }

    const determinarEstado = (promedio) => promedio === null ? "Pendiente" : (parseFloat(promedio) >= 10 ? "Aprobado" : "Reprobado")

    const getColorNota = (nota) => {
        if (nota === "" || nota === null) return "secondary"
        const num = parseFloat(nota)
        if (num >= 16) return "success"; if (num >= 13) return "info"; if (num >= 10) return "warning"; return "danger"
    }

    const getColorEstado = (estado) => {
        switch (estado) { case "Aprobado": return "success"; case "Reprobado": return "danger"; default: return "secondary" }
    }

    const showToast = (type, message) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, type, message }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
    }

    // ---------------------- ACCIONES ---------------------- //
    const prepararEnvio = () => {
        if (isReadOnly) return
        if (!materiaSeleccionada) return
        const estudiantesSinNotas = materiaSeleccionada.estudiantes.filter(est => {
            const notasEst = notas[est.id] || {}
            return !competencies.some(c => notasEst[`lapso${selectedLapso}_comp${c.id}`])
        })
        if (estudiantesSinNotas.length > 0) return showToast("warning", `Hay ${estudiantesSinNotas.length} estudiantes sin notas en este lapso`)
        setModalVisible(true)
    }

    const enviarNotasSecretaria = () => {
        if (isReadOnly) return
        setEnviando(true)
        setTimeout(() => {
            setEnviando(false); setModalVisible(false)
            showToast("success", "✅ Notas enviadas a la secretaría correctamente")
            // Aquí podríamos marcar como "Enviado" en una DB real
        }, 1500)
    }

    const limpiarNotasMateria = () => {
        if (isReadOnly) return
        if (window.confirm("¿Está seguro de limpiar las notas de este lapso para esta materia?")) {
            setNotas(prev => {
                const nuevas = { ...prev };
                materiaSeleccionada.estudiantes.forEach(est => {
                    const studentGrades = { ...nuevas[est.id] || {} }
                    competencies.forEach(c => delete studentGrades[`lapso${selectedLapso}_comp${c.id}`])
                    nuevas[est.id] = studentGrades
                })
                localStorage.setItem('notasEndanza', JSON.stringify(nuevas)); return nuevas
            })
            showToast("info", "Notas del lapso limpiadas")
        }
    }

    // Mock de estudiantes por materia si no hay reales vinculados
    const currentMateria = materiaSeleccionada ? {
        ...materiaSeleccionada,
        estudiantes: materiaSeleccionada.estudiantes.length > 0 ? materiaSeleccionada.estudiantes : [
            { id: 1, nombre: "Ana López", codigo: "END-101" },
            { id: 2, nombre: "Carlos Pérez", codigo: "END-102" },
            { id: 3, nombre: "María González", codigo: "END-103" }
        ]
    } : null

    return (
        <CContainer fluid className="py-2 py-md-4 profile-container pb-5">
            <header className="mb-3 mb-md-4 no-print">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 bg-glass-premium p-3 p-md-4 rounded-4 border border-light-custom border-opacity-10 shadow-sm">
                    <div className="d-flex align-items-center gap-2 gap-md-3">
                        <div className="p-2 p-md-3 bg-primary rounded-circle shadow-premium-sm">
                            <CIcon icon={cilNotes} size="xl" className="text-white" />
                        </div>
                        <div>
                            <h2 className="mb-0 fw-black header-title-custom text-uppercase ls-tight fs-5 fs-md-2">Centro de Calificaciones</h2>
                            <p className="text-muted-custom small mb-0 text-uppercase ls-1 d-none d-sm-block">
                                {isReadOnly ? 'Panel de Visualización Académica' : 'Gestión y Carga de Notas por Competencias'}
                            </p>
                        </div>
                    </div>

                    {/* Selector de Lapso y Año (Control Bar) */}
                    <div className="d-flex gap-3 align-items-center bg-light-custom p-2 rounded-pill border border-light-custom grades-header-actions">
                        <div className="px-3 border-end border-light-custom d-none d-md-block">
                            <span className="small fw-bold text-muted-custom text-uppercase ls-1">Configuración:</span>
                        </div>
                        <CFormSelect
                            size="sm"
                            value={selectedLapso}
                            onChange={(e) => setSelectedLapso(parseInt(e.target.value))}
                            className="border-0 bg-transparent fw-bold text-primary rounded-pill"
                        >
                            <option value={1}>I LAPSO</option>
                            <option value={2}>II LAPSO</option>
                            <option value={3}>III LAPSO</option>
                        </CFormSelect>
                        <CFormSelect
                            size="sm"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="border-0 bg-transparent fw-bold text-muted-custom rounded-pill"
                        >
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </CFormSelect>
                    </div>
                </div>
            </header>

            {!gradoSeleccionado && (
                <div className="animate__animated animate__fadeIn">
                    {sectionsData.length > 0 ? (
                        isReadOnly ? (
                            <AdminGradeCards data={sectionsData} onSelectGrade={setGradoSeleccionado} />
                        ) : (
                            <DocenteGradeCards data={sectionsData} onSelectGrade={setGradoSeleccionado} />
                        )
                    ) : (
                        <div className="text-center py-5 bg-glass-premium rounded-4 border border-light-custom border-opacity-10">
                            <CIcon icon={cilWarning} size="3xl" className="text-warning mb-3 opacity-50" />
                            <h4 className="text-muted-custom fw-bold">No hay secciones registradas</h4>
                            <p className="text-muted-custom small mt-2">Por favor, registre secciones en el módulo de Aulas o Estudiantes.</p>
                        </div>
                    )}
                </div>
            )}

            {gradoSeleccionado && !materiaSeleccionada && (
                isReadOnly ? (
                    <AdminSubjectCards
                        grade={gradoSeleccionado}
                        onBack={() => setGradoSeleccionado(null)}
                        onSelectSubject={setMateriaSeleccionada}
                        calculatePromedio={calcularPromedio}
                        getColorEstado={getColorEstado}
                        determinarEstado={determinarEstado}
                    />
                ) : (
                    <DocenteSubjectCards
                        grade={gradoSeleccionado}
                        onBack={() => setGradoSeleccionado(null)}
                        onSelectSubject={setMateriaSeleccionada}
                        calculatePromedio={calcularPromedio}
                        getColorEstado={getColorEstado}
                        determinarEstado={determinarEstado}
                    />
                )
            )}

            {gradoSeleccionado && materiaSeleccionada && (
                <>
                    <EvaluationSummary
                        subject={currentMateria}
                        notas={notas}
                        calculatePromedio={calcularPromedio}
                    />
                    <div className="mt-4">
                        {isReadOnly ? (
                            <AdminEvaluationTable
                                grade={gradoSeleccionado}
                                subject={currentMateria}
                                onBack={() => setMateriaSeleccionada(null)}
                                notas={notas}
                                calculatePromedio={calcularPromedio}
                                determinarEstado={determinarEstado}
                                getColorNota={getColorNota}
                                getColorEstado={getColorEstado}
                                competencies={competencies}
                                selectedLapso={selectedLapso}
                            />
                        ) : (
                            <DocenteEvaluationTable
                                grade={gradoSeleccionado}
                                subject={currentMateria}
                                onBack={() => setMateriaSeleccionada(null)}
                                onClear={limpiarNotasMateria}
                                onPrepareSend={prepararEnvio}
                                notas={notas}
                                onNotaChange={manejarNotaChange}
                                calculatePromedio={calcularPromedio}
                                determinarEstado={determinarEstado}
                                getColorEstado={getColorEstado}
                                competencies={competencies}
                                selectedLapso={selectedLapso}
                            />
                        )}
                    </div>
                </>
            )}

            <SendConfirmationModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                enviando={enviando}
                subject={currentMateria}
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
        </CContainer>
    )
}

export default SistemaEvaluacionDanza