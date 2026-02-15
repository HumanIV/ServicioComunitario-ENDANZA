// SistemaEvaluacionDanza.jsx - Versión corregida con configService
import React, { useState, useEffect } from "react"
import { CContainer, CToaster, CToast, CToastBody, CSpinner, CAlert, CBadge } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilNotes } from "@coreui/icons"
import useUserRole from '../../hooks/useUserRole'

// Servicios
import { getSectionsForGrades, getGradesForSection, saveGrades } from '../../services/gradeService'
import { getAvailableYears, getActiveYear } from '../../services/configService' // ← CORREGIDO

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
    
    const [gradoSeleccionado, setGradoSeleccionado] = useState(null)
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null)
    const [notas, setNotas] = useState({})
    const [notasOriginales, setNotasOriginales] = useState({})
    
    const [modalVisible, setModalVisible] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [toasts, setToasts] = useState([])

    // Cargar años académicos disponibles al montar el componente
    useEffect(() => {
        cargarAniosAcademicos()
    }, [])

    // Cargar datos cuando cambie el año seleccionado
    useEffect(() => {
        if (selectedYear) {
            cargarDatos(selectedYear.id)
        }
    }, [selectedYear])

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
                setSelectedYear(activeYear)
            } else if (yearsData.length > 0) {
                // Si no hay activo, seleccionar el primero
                console.log('📌 Seleccionando primer año disponible:', yearsData[0])
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
            const sections = await getSectionsForGrades(yearId)
            console.log('📊 Datos cargados:', sections)
            setData(sections)
            // Limpiar selecciones al cambiar de año
            setGradoSeleccionado(null)
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
        if (materiaSeleccionada) {
            cargarNotasMateria(materiaSeleccionada.id)
        }
    }, [materiaSeleccionada])

    const cargarNotasMateria = async (sectionId) => {
        try {
            const notasGuardadas = await getGradesForSection(sectionId)
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
            await saveGrades({
                sectionId: materiaSeleccionada.id,
                grades: notas,
                academicYearId: materiaSeleccionada.academicYearId || selectedYear?.id
            })
            
            setNotasOriginales(JSON.parse(JSON.stringify(notas)))
            setModalVisible(false)
            showToast("success", "✅ Notas guardadas correctamente")
            
        } catch (error) {
            console.error('❌ Error al guardar:', error)
            showToast("danger", "Error al guardar las notas")
        } finally {
            setEnviando(false)
        }
    }

    const limpiarNotasMateria = () => {
        if (!isDocente) return
        
        if (window.confirm("¿Está seguro de limpiar todas las notas de esta materia?")) {
            setNotas(prev => {
                const nuevas = { ...prev }
                materiaSeleccionada.estudiantes.forEach(est => delete nuevas[est.id])
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
                
                {/* Selector de año académico */}
                {years.length > 0 && (
                    <div className="d-flex align-items-center mt-3 gap-3">
                        <span className="text-muted-custom small fw-bold">Año Académico:</span>
                        <select 
                            className="form-select form-select-sm w-auto"
                            value={selectedYear?.id || ''}
                            onChange={(e) => {
                                const year = years.find(y => y.id === parseInt(e.target.value))
                                setSelectedYear(year)
                            }}
                        >
                            {years.map(year => (
                                <option key={year.id} value={year.id}>
                                    {year.name} {year.active ? '(Activo)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </header>

            {data.length === 0 && !loading ? (
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
                                    modoLectura={isAdmin}
                                    hayCambios={hayCambios()}
                                />
                            </div>
                        </>
                    )}
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