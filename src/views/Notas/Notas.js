import React, { useState, useEffect } from "react"
import { CContainer, CToaster, CToast, CToastBody } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilNotes } from "@coreui/icons"

// Componentes extraídos
import GradeCards from "./components/GradeCards"
import SubjectCards from "./components/SubjectCards"
import EvaluationTable from "./components/EvaluationTable"
import EvaluationSummary from "./components/EvaluationSummary"
import SendConfirmationModal from "./components/SendConfirmationModal"

const SistemaEvaluacionDanza = () => {
    // ---------------------- DATOS (Simulación mejorada) ---------------------- //
    const data = [
        { grado: "1er Grado", materias: [{ id: "DAN-101", nombre: "Ballet Básico I", horario: "Lunes y Miércoles 8:00-10:00", estudiantes: [{ id: 1, nombre: "Ana López", codigo: "END-101", edad: 6, asistencia: 95 }, { id: 2, nombre: "Carlos Pérez", codigo: "END-102", edad: 7, asistencia: 92 }, { id: 3, nombre: "María González", codigo: "END-103", edad: 6, asistencia: 88 }] }, { id: "DAN-102", nombre: "Ritmo y Movimiento", horario: "Martes y Jueves 8:00-10:00", estudiantes: [{ id: 4, nombre: "Juan Rodríguez", codigo: "END-104", edad: 7, asistencia: 90 }, { id: 5, nombre: "Laura Martínez", codigo: "END-105", edad: 6, asistencia: 85 }] }] },
        { grado: "2do Grado", materias: [{ id: "DAN-201", nombre: "Ballet Básico II", horario: "Lunes y Miércoles 10:00-12:00", estudiantes: [{ id: 6, nombre: "Pedro Sánchez", codigo: "END-201", edad: 8, asistencia: 98 }, { id: 7, nombre: "Sofía Ramírez", codigo: "END-202", edad: 7, asistencia: 94 }] }, { id: "DAN-202", nombre: "Expresión Corporal I", horario: "Martes y Jueves 10:00-12:00", estudiantes: [{ id: 8, nombre: "Diego Herrera", codigo: "END-203", edad: 8, asistencia: 89 }, { id: 9, nombre: "Valeria Castro", codigo: "END-204", edad: 9, asistencia: 91 }] }] },
        { grado: "3er Grado", materias: [{ id: "DAN-301", nombre: "Ballet Intermedio I", horario: "Lunes y Miércoles 14:00-16:00", estudiantes: [{ id: 10, nombre: "Elena Vargas", codigo: "END-301", edad: 9, asistencia: 99 }, { id: 11, nombre: "Fernando Castro", codigo: "END-302", edad: 10, asistencia: 97 }, { id: 12, nombre: "Gabriela Ortiz", codigo: "END-303", edad: 9, asistencia: 93 }] }, { id: "DAN-302", nombre: "Danza Folklórica", horario: "Martes y Jueves 14:00-16:00", estudiantes: [{ id: 13, nombre: "Ricardo Méndez", codigo: "END-304", edad: 10, asistencia: 96 }, { id: 14, nombre: "Carmen Ruiz", codigo: "END-305", edad: 9, asistencia: 92 }] }] }
    ]

    // ---------------------- ESTADOS PRINCIPALES ---------------------- //
    const [gradoSeleccionado, setGradoSeleccionado] = useState(null)
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null)
    const [notas, setNotas] = useState({})
    const [modalVisible, setModalVisible] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [toasts, setToasts] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [currentCompetencies, setCurrentCompetencies] = useState([])
    const [academicYear, setAcademicYear] = useState('2025-2026') // Default or from context

    useEffect(() => {
        const notasGuardadas = localStorage.getItem('notasEndanza')
        if (notasGuardadas) setNotas(JSON.parse(notasGuardadas))

        const userStr = localStorage.getItem('user')
        if (userStr) setCurrentUser(JSON.parse(userStr))
    }, [])

    // Cargar competencias cuando se selecciona una materia
    useEffect(() => {
        if (materiaSeleccionada) {
            const competenciesKey = 'competencies_config_v1'
            const stored = localStorage.getItem(competenciesKey)
            if (stored) {
                const configData = JSON.parse(stored)
                // Usamos el academicYear actual (podría venir de un selector o configuración global)
                const yearConfig = configData[academicYear] || {}
                const subjectConfig = yearConfig[materiaSeleccionada.id] || yearConfig[materiaSeleccionada.nombre]

                if (subjectConfig && subjectConfig.lapsos) {
                    // Por simplicidad, tomamos el lapso 1 o el actualmente activo si hubiera un selector
                    // En este prototipo usamos el lapso 1 por defecto
                    setCurrentCompetencies(subjectConfig.lapsos[1]?.evaluations || [])
                } else {
                    setCurrentCompetencies([])
                }
            } else {
                setCurrentCompetencies([])
            }
        }
    }, [materiaSeleccionada, academicYear])

    const isAdmin = currentUser?.rol === 'admin'
    const isDocente = currentUser?.rol === 'docente'
    const canEdit = isDocente // Según requerimiento: solo profesores montan notas

    // ---------------------- FUNCIONES DE LOGICA ---------------------- //
    const manejarNotaChange = (estudianteId, numeroNota, valor) => {
        const valorNumerico = parseFloat(valor)
        if ((valor === "" || (valorNumerico >= 0 && valorNumerico <= 20)) && valor.length <= 4) {
            const nuevoValor = valor === "" ? "" : Math.min(20, Math.max(0, valorNumerico)).toString()
            setNotas(prev => {
                const nuevasNotas = { ...prev, [estudianteId]: { ...(prev[estudianteId] || { n1: "", n2: "", n3: "", n4: "" }), [`n${numeroNota}`]: nuevoValor } }
                localStorage.setItem('notasEndanza', JSON.stringify(nuevasNotas))
                return nuevasNotas
            })
        }
    }

    const calcularPromedio = (estudianteId) => {
        const notasEstudiante = notas[estudianteId]
        if (!notasEstudiante || currentCompetencies.length === 0) return null

        let totalPonderado = 0
        let totalPeso = 0

        currentCompetencies.forEach((comp, idx) => {
            const nota = notasEstudiante[`n${idx + 1}`]
            if (nota !== "" && !isNaN(parseFloat(nota))) {
                const peso = parseFloat(comp.weight) / 100
                totalPonderado += parseFloat(nota) * peso
                totalPeso += comp.weight
            }
        })

        if (totalPeso === 0) return null
        // Si no se han llenado todas, podemos promediar lo que hay o esperar al 100%
        // Aquí promediamos según el peso relativo de lo completado
        return (totalPonderado / (totalPeso / 100)).toFixed(1)
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
        if (!materiaSeleccionada) return
        const estudiantesSinNotas = materiaSeleccionada.estudiantes.filter(est => !notas[est.id] || Object.values(notas[est.id]).every(n => n === ""))
        if (estudiantesSinNotas.length > 0) return showToast("warning", `Hay ${estudiantesSinNotas.length} estudiantes sin notas`)
        setModalVisible(true)
    }

    const enviarNotasSecretaria = () => {
        setEnviando(true)
        setTimeout(() => {
            setEnviando(false); setModalVisible(false)
            setNotas(prev => {
                const nuevas = { ...prev }; materiaSeleccionada.estudiantes.forEach(est => delete nuevas[est.id])
                localStorage.setItem('notasEndanza', JSON.stringify(nuevas)); return nuevas
            })
            showToast("success", "✅ Notas enviadas a la secretaría correctamente")
        }, 1500)
    }

    const limpiarNotasMateria = () => {
        if (window.confirm("¿Está seguro de limpiar todas las notas de esta materia?")) {
            setNotas(prev => {
                const nuevas = { ...prev }; materiaSeleccionada.estudiantes.forEach(est => delete nuevas[est.id])
                localStorage.setItem('notasEndanza', JSON.stringify(nuevas)); return nuevas
            })
            showToast("info", "Notas limpiadas correctamente")
        }
    }

    return (
        <CContainer fluid className="py-4 profile-container pb-5">
            <header className="mb-5 no-print">
                <div className="d-flex align-items-center gap-3">
                    <div className="p-3 bg-primary rounded-circle shadow-sm">
                        <CIcon icon={cilNotes} size="xl" className="text-white" />
                    </div>
                    <div>
                        <h2 className="mb-0 fw-bold header-title-custom text-uppercase ls-1">Centro de Calificaciones</h2>
                        <p className="text-muted-custom small mb-0 text-uppercase ls-1">Gestión académica de la Escuela Nacional de Danza</p>
                    </div>
                </div>
            </header>

            {!gradoSeleccionado && <GradeCards data={data} onSelectGrade={setGradoSeleccionado} />}

            {gradoSeleccionado && !materiaSeleccionada && (
                <SubjectCards
                    grade={gradoSeleccionado}
                    onBack={() => setGradoSeleccionado(null)}
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
                            onClear={limpiarNotasMateria}
                            onPrepareSend={prepararEnvio}
                            notas={notas}
                            onNotaChange={manejarNotaChange}
                            calculatePromedio={calcularPromedio}
                            determinarEstado={determinarEstado}
                            getColorNota={getColorNota}
                            getColorEstado={getColorEstado}
                            competencies={currentCompetencies}
                            canEdit={canEdit}
                        />
                    </div>
                </>
            )}

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
        </CContainer>
    )
}

export default SistemaEvaluacionDanza