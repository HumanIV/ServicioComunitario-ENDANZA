    import React, { useState, useEffect } from "react"
    import {
    CContainer,
    CCard,
    CCardBody,
    CCardHeader,
    CCardFooter,
    CButton,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CFormInput,
    CAlert,
    CBadge,
    CProgress,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CRow,
    CCol,
    CSpinner
    } from "@coreui/react"
    import CIcon from "@coreui/icons-react"
    import { cilSend, cilSave, cilCheckCircle, cilUser, cilNotes, cilTrash, cilWarning } from "@coreui/icons"

    const SistemaEvaluacionDanza = () => {
    // ---------------------- DATOS DE LA ESCUELA DE DANZA POR GRADOS ---------------------- //
    const data = [
        {
        grado: "1er Grado",
        materias: [
            {
            id: "DAN-101",
            nombre: "Ballet Básico I",
            horario: "Lunes y Miércoles 8:00-10:00",
            estudiantes: [
                { id: 1, nombre: "Ana López", codigo: "END-101", edad: 6, asistencia: 95 },
                { id: 2, nombre: "Carlos Pérez", codigo: "END-102", edad: 7, asistencia: 92 },
                { id: 3, nombre: "María González", codigo: "END-103", edad: 6, asistencia: 88 }
            ]
            },
            {
            id: "DAN-102",
            nombre: "Ritmo y Movimiento",
            horario: "Martes y Jueves 8:00-10:00",
            estudiantes: [
                { id: 4, nombre: "Juan Rodríguez", codigo: "END-104", edad: 7, asistencia: 90 },
                { id: 5, nombre: "Laura Martínez", codigo: "END-105", edad: 6, asistencia: 85 }
            ]
            }
        ]
        },
        {
        grado: "2do Grado",
        materias: [
            {
            id: "DAN-201",
            nombre: "Ballet Básico II",
            horario: "Lunes y Miércoles 10:00-12:00",
            estudiantes: [
                { id: 6, nombre: "Pedro Sánchez", codigo: "END-201", edad: 8, asistencia: 98 },
                { id: 7, nombre: "Sofía Ramírez", codigo: "END-202", edad: 7, asistencia: 94 }
            ]
            },
            {
            id: "DAN-202",
            nombre: "Expresión Corporal I",
            horario: "Martes y Jueves 10:00-12:00",
            estudiantes: [
                { id: 8, nombre: "Diego Herrera", codigo: "END-203", edad: 8, asistencia: 89 },
                { id: 9, nombre: "Valeria Castro", codigo: "END-204", edad: 9, asistencia: 91 }
            ]
            }
        ]
        },
        {
        grado: "3er Grado",
        materias: [
            {
            id: "DAN-301",
            nombre: "Ballet Intermedio I",
            horario: "Lunes y Miércoles 14:00-16:00",
            estudiantes: [
                { id: 10, nombre: "Elena Vargas", codigo: "END-301", edad: 9, asistencia: 99 },
                { id: 11, nombre: "Fernando Castro", codigo: "END-302", edad: 10, asistencia: 97 },
                { id: 12, nombre: "Gabriela Ortiz", codigo: "END-303", edad: 9, asistencia: 93 }
            ]
            },
            {
            id: "DAN-302",
            nombre: "Danza Folklórica",
            horario: "Martes y Jueves 14:00-16:00",
            estudiantes: [
                { id: 13, nombre: "Ricardo Méndez", codigo: "END-304", edad: 10, asistencia: 96 },
                { id: 14, nombre: "Carmen Ruiz", codigo: "END-305", edad: 9, asistencia: 92 }
            ]
            }
        ]
        },
        {
        grado: "4to Grado",
        materias: [
            {
            id: "DAN-401",
            nombre: "Ballet Intermedio II",
            horario: "Lunes y Miércoles 16:00-18:00",
            estudiantes: [
                { id: 15, nombre: "Martina López", codigo: "END-401", edad: 11, asistencia: 98 },
                { id: 16, nombre: "Antonio Díaz", codigo: "END-402", edad: 10, asistencia: 95 }
            ]
            },
            {
            id: "DAN-402",
            nombre: "Jazz Dance Básico",
            horario: "Martes y Jueves 16:00-18:00",
            estudiantes: [
                { id: 17, nombre: "Isabel Torres", codigo: "END-403", edad: 11, asistencia: 94 },
                { id: 18, nombre: "Samuel Rojas", codigo: "END-404", edad: 12, asistencia: 90 }
            ]
            }
        ]
        },
        {
        grado: "5to Grado",
        materias: [
            {
            id: "DAN-501",
            nombre: "Ballet Avanzado I",
            horario: "Lunes y Miércoles 18:00-20:00",
            estudiantes: [
                { id: 19, nombre: "Andrea Silva", codigo: "END-501", edad: 13, asistencia: 99 },
                { id: 20, nombre: "Javier Morales", codigo: "END-502", edad: 12, asistencia: 97 }
            ]
            },
            {
            id: "DAN-502",
            nombre: "Danza Contemporánea I",
            horario: "Martes y Jueves 18:00-20:00",
            estudiantes: [
                { id: 21, nombre: "Patricia Vega", codigo: "END-503", edad: 13, asistencia: 96 },
                { id: 22, nombre: "Roberto Campos", codigo: "END-504", edad: 14, asistencia: 94 }
            ]
            }
        ]
        },
        {
        grado: "6to Grado",
        materias: [
            {
            id: "DAN-601",
            nombre: "Ballet Avanzado II",
            horario: "Lunes y Miércoles 8:00-10:00",
            estudiantes: [
                { id: 23, nombre: "Daniela Flores", codigo: "END-601", edad: 15, asistencia: 98 },
                { id: 24, nombre: "Miguel Ángel", codigo: "END-602", edad: 14, asistencia: 96 }
            ]
            },
            {
            id: "DAN-602",
            nombre: "Hip Hop I",
            horario: "Martes y Jueves 8:00-10:00",
            estudiantes: [
                { id: 25, nombre: "Camila Ríos", codigo: "END-603", edad: 15, asistencia: 95 },
                { id: 26, nombre: "Alejandro Paz", codigo: "END-604", edad: 16, asistencia: 93 }
            ]
            }
        ]
        },
        {
        grado: "7mo Grado",
        materias: [
            {
            id: "DAN-701",
            nombre: "Ballet Profesional I",
            horario: "Lunes y Miércoles 10:00-12:00",
            estudiantes: [
                { id: 27, nombre: "Valentina Muñoz", codigo: "END-701", edad: 16, asistencia: 99 },
                { id: 28, nombre: "Sebastián León", codigo: "END-702", edad: 17, asistencia: 97 }
            ]
            },
            {
            id: "DAN-702",
            nombre: "Danza Contemporánea II",
            horario: "Martes y Jueves 10:00-12:00",
            estudiantes: [
                { id: 29, nombre: "Natalia Bravo", codigo: "END-703", edad: 16, asistencia: 98 },
                { id: 30, nombre: "Andrés Fuentes", codigo: "END-704", edad: 17, asistencia: 96 }
            ]
            }
        ]
        },
        {
        grado: "8vo Grado",
        materias: [
            {
            id: "DAN-801",
            nombre: "Ballet Profesional II",
            horario: "Lunes y Miércoles 14:00-16:00",
            estudiantes: [
                { id: 31, nombre: "Carolina Soto", codigo: "END-801", edad: 18, asistencia: 100 },
                { id: 32, nombre: "Rodrigo Vargas", codigo: "END-802", edad: 17, asistencia: 98 }
            ]
            },
            {
            id: "DAN-802",
            nombre: "Coreografía Avanzada",
            horario: "Martes y Jueves 14:00-16:00",
            estudiantes: [
                { id: 33, nombre: "Paola Mendoza", codigo: "END-803", edad: 18, asistencia: 99 },
                { id: 34, nombre: "Mauricio Ortega", codigo: "END-804", edad: 17, asistencia: 97 }
            ]
            }
        ]
        }
    ]

    // ---------------------- ESTADOS PRINCIPALES ---------------------- //
    const [gradoSeleccionado, setGradoSeleccionado] = useState(null)
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null)
    const [notas, setNotas] = useState({})
    const [modalVisible, setModalVisible] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [toasts, setToasts] = useState([])

    // Cargar notas guardadas del localStorage al iniciar
    useEffect(() => {
        const notasGuardadas = localStorage.getItem('notasEndanza')
        if (notasGuardadas) {
        setNotas(JSON.parse(notasGuardadas))
        }
    }, [])

    // ---------------------- FUNCIONES DE NOTAS ---------------------- //
    const manejarNotaChange = (estudianteId, numeroNota, valor) => {
        // Validar que sea un número entre 0 y 20
        const valorNumerico = parseFloat(valor)
        if ((valor === "" || (valorNumerico >= 0 && valorNumerico <= 20)) && valor.length <= 4) {
        const nuevoValor = valor === "" ? "" : Math.min(20, Math.max(0, valorNumerico)).toString()
        
        setNotas(prev => {
            const nuevasNotas = { ...prev }
            if (!nuevasNotas[estudianteId]) {
            nuevasNotas[estudianteId] = { n1: "", n2: "", n3: "", n4: "" }
            }
            nuevasNotas[estudianteId][`n${numeroNota}`] = nuevoValor
            
            // Guardar en localStorage
            localStorage.setItem('notasEndanza', JSON.stringify(nuevasNotas))
            
            return nuevasNotas
        })
        }
    }

    // Calcular promedio de 4 notas
    const calcularPromedio = (estudianteId) => {
        const notasEstudiante = notas[estudianteId]
        if (!notasEstudiante) return null

        const valores = [notasEstudiante.n1, notasEstudiante.n2, notasEstudiante.n3, notasEstudiante.n4]
        const notasValidas = valores.filter(n => n !== "" && !isNaN(parseFloat(n)))
        
        if (notasValidas.length === 0) return null
        
        const suma = notasValidas.reduce((acc, n) => acc + parseFloat(n), 0)
        return (suma / notasValidas.length).toFixed(1)
    }

    // Determinar estado (Aprobado/Reprobado)
    const determinarEstado = (promedio) => {
        if (promedio === null) return "Pendiente"
        const num = parseFloat(promedio)
        return num >= 10 ? "Aprobado" : "Reprobado"
    }

    // Obtener color según nota
    const getColorNota = (nota) => {
        if (nota === "" || nota === null) return "secondary"
        const num = parseFloat(nota)
        if (num >= 16) return "success"
        if (num >= 13) return "info"
        if (num >= 10) return "warning"
        return "danger"
    }

    // Obtener color de estado
    const getColorEstado = (estado) => {
        switch(estado) {
        case "Aprobado": return "success"
        case "Reprobado": return "danger"
        default: return "secondary"
        }
    }

    // ---------------------- FUNCIONES DE ENVÍO ---------------------- //
    const prepararEnvio = () => {
        if (!materiaSeleccionada) return false

        // Verificar que todos los estudiantes tengan al menos una nota
        const estudiantesSinNotas = materiaSeleccionada.estudiantes.filter(est => {
        const notasEst = notas[est.id]
        return !notasEst || Object.values(notasEst).every(n => n === "")
        })

        if (estudiantesSinNotas.length > 0) {
        showToast("warning", `Hay ${estudiantesSinNotas.length} estudiantes sin notas`)
        return false
        }

        setModalVisible(true)
        return true
    }

    const enviarNotasSecretaria = () => {
        setEnviando(true)

        // Simular envío a servidor
        setTimeout(() => {
        // Aquí iría la lógica real de envío a la secretaría
        console.log("Enviando notas a secretaría:", {
            materia: materiaSeleccionada.nombre,
            grado: gradoSeleccionado.grado,
            notas: materiaSeleccionada.estudiantes.map(est => ({
            estudiante: est.nombre,
            codigo: est.codigo,
            notas: notas[est.id] || {},
            promedio: calcularPromedio(est.id),
            estado: determinarEstado(calcularPromedio(est.id))
            }))
        })

        setEnviando(false)
        setModalVisible(false)
        
        // Limpiar notas después de enviar
        setNotas(prev => {
            const nuevasNotas = { ...prev }
            materiaSeleccionada.estudiantes.forEach(est => {
            delete nuevasNotas[est.id]
            })
            localStorage.setItem('notasEndanza', JSON.stringify(nuevasNotas))
            return nuevasNotas
        })

        showToast("success", "✅ Notas enviadas a la secretaría correctamente")
        }, 1500)
    }

    // ---------------------- FUNCIONES AUXILIARES ---------------------- //
    const showToast = (type, message) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, type, message }])
        
        setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
        }, 4000)
    }

    const limpiarNotasMateria = () => {
        if (!materiaSeleccionada) return

        const confirmar = window.confirm("¿Está seguro de limpiar todas las notas de esta materia?")
        if (confirmar) {
        setNotas(prev => {
            const nuevasNotas = { ...prev }
            materiaSeleccionada.estudiantes.forEach(est => {
            delete nuevasNotas[est.id]
            })
            localStorage.setItem('notasEndanza', JSON.stringify(nuevasNotas))
            return nuevasNotas
        })
        showToast("info", "Notas limpiadas correctamente")
        }
    }

    // ---------------------- RENDER ---------------------- //
    return (
        <CContainer className="py-4">
        <header className="mb-4 text-center">
            <h1 className="text-primary fw-bold mb-2">
            <CIcon icon={cilNotes} className="me-2" />
            Sistema de Evaluación - Endanza
            </h1>
            <p className="text-muted">
            </p>


        </header>

        {/* PASO 1: SELECCIONAR GRADO */}
        {!gradoSeleccionado && (
            <>
            <h3 className="mb-4">
                <CIcon icon={cilUser} className="me-2" />
                Seleccionar Grado de Danza
            </h3>
            <CRow>
                {data.map((grado, i) => (
                <CCol md={6} lg={4} xl={3} key={i} className="mb-3">
                    <CCard className="h-100 shadow-sm border-primary">
                    <CCardHeader className="bg-primary text-white text-center">
                        <strong className="fs-5">{grado.grado}</strong>
                    </CCardHeader>
                    <CCardBody className="text-center">
                        <div className="mb-3">
                        <CBadge color="info" className="fs-6 py-2 px-3">
                            {grado.materias.length} Materia{grado.materias.length !== 1 ? 's' : ''}
                        </CBadge>
                        </div>
                        <div className="text-start">
                        <small className="text-muted d-block mb-1">Disciplinas:</small>
                        <ul className="list-unstyled ps-3">
                            {grado.materias.map((materia, j) => (
                            <li key={j} className="mb-1">
                                <small>• {materia.nombre}</small>
                            </li>
                            ))}
                        </ul>
                        </div>
                        <div className="mt-3">
                        <small className="text-muted">
                            Total estudiantes: {grado.materias.reduce((total, materia) => total + materia.estudiantes.length, 0)}
                        </small>
                        </div>
                    </CCardBody>
                    <CCardFooter className="text-center">
                        <CButton 
                        color="primary" 
                        className="w-100"
                        onClick={() => setGradoSeleccionado(grado)}
                        >
                        Ver Materias
                        </CButton>
                    </CCardFooter>
                    </CCard>
                </CCol>
                ))}
            </CRow>
            </>
        )}

        {/* PASO 2: SELECCIONAR MATERIA */}
        {gradoSeleccionado && !materiaSeleccionada && (
            <>
            <div className="d-flex align-items-center mb-4">
                <CButton
                color="secondary"
                className="me-3"
                onClick={() => setGradoSeleccionado(null)}
                >
                ← Volver
                </CButton>
                <div>
                <h3 className="mb-0">{gradoSeleccionado.grado}</h3>
                <small className="text-muted">Selecciona una materia para cargar notas</small>
                </div>
            </div>

            <CRow>
                {gradoSeleccionado.materias.map((materia, i) => (
                <CCol md={6} key={i} className="mb-3">
                    <CCard className="h-100 shadow-sm hover-shadow">
                    <CCardHeader className=" d-flex justify-content-between align-items-center">
                        <strong>{materia.nombre}</strong>
                        <CBadge color="info">{materia.estudiantes.length}</CBadge>
                    </CCardHeader>
                    <CCardBody>
                        <div className="mb-3">
                        <small className="text-muted">Horario:</small>
                        <div className="fw-semibold">{materia.horario}</div>
                        </div>
                        
                        <div className="mb-3">
                        <small className="text-muted">Código:</small>
                        <div className="fw-semibold">{materia.id}</div>
                        </div>
                        
                        <div className="mb-3">
                        <small className="text-muted">Progreso de notas:</small>
                        <div className="mt-2">
                            {materia.estudiantes.slice(0, 3).map(est => {
                            const promedio = calcularPromedio(est.id)
                            const estado = determinarEstado(promedio)
                            return (
                                <div key={est.id} className="d-flex justify-content-between align-items-center mb-2">
                                <small className="text-truncate" style={{maxWidth: '70%'}}>
                                    {est.nombre.split(' ')[0]}
                                </small>
                                <CBadge color={getColorEstado(estado)}>
                                    {promedio ? `${promedio}` : "Sin notas"}
                                </CBadge>
                                </div>
                            )
                            })}
                        </div>
                        {materia.estudiantes.length > 3 && (
                            <small className="text-muted">
                            ...y {materia.estudiantes.length - 3} más
                            </small>
                        )}
                        </div>
                    </CCardBody>
                    <CCardFooter>
                        <CButton 
                        color="primary" 
                        className="w-100"
                        onClick={() => setMateriaSeleccionada(materia)}
                        >
                        Cargar Notas
                        </CButton>
                    </CCardFooter>
                    </CCard>
                </CCol>
                ))}
            </CRow>
            </>
        )}

        {/* PASO 3: CARGA DE NOTAS */}
        {gradoSeleccionado && materiaSeleccionada && (
            <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                <CButton
                    color="secondary"
                    className="me-3"
                    onClick={() => setMateriaSeleccionada(null)}
                >
                    ← Volver
                </CButton>
                <h3 className="d-inline-block mb-0">
                    {materiaSeleccionada.nombre}
                </h3>
                </div>
                <div>
                <CButton
                    color="danger"
                    variant="outline"
                    className="me-2"
                    onClick={limpiarNotasMateria}
                >
                    <CIcon icon={cilTrash} /> Limpiar
                </CButton>
                <CButton
                    color="success"
                    onClick={prepararEnvio}
                >
                    <CIcon icon={cilSend} className="me-1" />
                    Enviar a Secretaría
                </CButton>
                </div>
            </div>

            <CCard>
                <CCardHeader className=" ">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                    <strong>{gradoSeleccionado.grado}</strong> | {materiaSeleccionada.horario}
                    <div className="small text-muted mt-1">
                        Código: {materiaSeleccionada.id} | Estudiantes: {materiaSeleccionada.estudiantes.length}
                    </div>
                    </div>
                    <CBadge color="info" className="fs-6">
                    {materiaSeleccionada.estudiantes.length} estudiantes
                    </CBadge>
                </div>
                </CCardHeader>
                <CCardBody className="p-0">
                <CTable bordered hover responsive>
                    <CTableHead className=" ">
                    <CTableRow>
                        <CTableHeaderCell width="25%">Bailarín</CTableHeaderCell>
                        <CTableHeaderCell width="8%" className="text-center">Código</CTableHeaderCell>
                        <CTableHeaderCell width="12%" className="text-center">Nota 1</CTableHeaderCell>
                        <CTableHeaderCell width="12%" className="text-center">Nota 2</CTableHeaderCell>
                        <CTableHeaderCell width="12%" className="text-center">Nota 3</CTableHeaderCell>
                        <CTableHeaderCell width="12%" className="text-center">Nota 4</CTableHeaderCell>
                        <CTableHeaderCell width="14%" className="text-center">Promedio / Estado</CTableHeaderCell>
                    </CTableRow>
                    </CTableHead>
                    <CTableBody>
                    {materiaSeleccionada.estudiantes.map((estudiante) => {
                        const notasEst = notas[estudiante.id] || { n1: "", n2: "", n3: "", n4: "" }
                        const promedio = calcularPromedio(estudiante.id)
                        const estado = determinarEstado(promedio)
                        
                        return (
                        <CTableRow key={estudiante.id}>
                            <CTableDataCell>
                            <div>
                                <strong>{estudiante.nombre}</strong>
                                <div>
                                <small className="text-muted">{estudiante.edad} años</small>
                                </div>
                            </div>
                            </CTableDataCell>
                            
                            <CTableDataCell className="text-center align-middle">
                            <CBadge color="dark">{estudiante.codigo}</CBadge>
                            </CTableDataCell>
                            
                            
                            {/* NOTAS */}
                            {[1, 2, 3, 4].map(num => (
                            <CTableDataCell key={num} className="text-center">
                                <CFormInput
                                type="number"
                                min="0"
                                max="20"
                                step="0.1"
                                value={notasEst[`n${num}`] || ""}
                                onChange={(e) => manejarNotaChange(estudiante.id, num, e.target.value)}
                                placeholder="0-20"
                                className="text-center"
                                style={{
                                    borderColor: getColorNota(notasEst[`n${num}`]) !== 'secondary' ? 
                                    getColorNota(notasEst[`n${num}`]) : undefined
                                }}
                                />
                                <small className="text-muted">N{num}</small>
                            </CTableDataCell>
                            ))}
                            
                            <CTableDataCell className="text-center align-middle">
                            {promedio ? (
                                <>
                                <CBadge 
                                    color={getColorEstado(estado)}
                                    className="fs-6 px-3 py-2 mb-1 d-block"
                                >
                                    {promedio}
                                </CBadge>
                                <small className={`text-${getColorEstado(estado)}`}>
                                    {estado}
                                </small>
                                </>
                            ) : (
                                <CBadge color="secondary" className="fs-6 px-3 py-2">
                                Sin notas
                                </CBadge>
                            )}
                            </CTableDataCell>
                        </CTableRow>
                        )
                    })}
                    </CTableBody>
                </CTable>
                </CCardBody>
                <CCardFooter className=" ">
                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                    <CIcon icon={cilWarning} className="me-1" />
                    Ingrese valores entre 0 y 20 (Aprobado: 10/20)
                    </small>
                    <div>
                    <CButton
                        color="danger"
                        variant="outline"
                        className="me-2"
                        onClick={limpiarNotasMateria}
                    >
                        <CIcon icon={cilTrash} /> Limpiar
                    </CButton>
                    <CButton
                        color="success"
                        onClick={prepararEnvio}
                    >
                        <CIcon icon={cilSend} className="me-1" />
                        Enviar a Secretaría
                    </CButton>
                    </div>
                </div>
                </CCardFooter>
            </CCard>

            {/* RESUMEN */}
            <CRow className="mt-4">
                <CCol md={3}>
                <CCard className="text-center border-primary">
                    <CCardBody>
                    <h5>Estudiantes</h5>
                    <h2 className="text-primary">{materiaSeleccionada.estudiantes.length}</h2>
                    </CCardBody>
                </CCard>
                </CCol>
                <CCol md={3}>
                <CCard className="text-center border-success">
                    <CCardBody>
                    <h5>Con notas</h5>
                    <h2 className="text-success">
                        {materiaSeleccionada.estudiantes.filter(est => {
                        const notasEst = notas[est.id]
                        return notasEst && Object.values(notasEst).some(n => n !== "")
                        }).length}
                    </h2>
                    </CCardBody>
                </CCard>
                </CCol>
                <CCol md={3}>
                <CCard className="text-center border-warning">
                    <CCardBody>
                    <h5>Aprobados</h5>
                    <h2 className="text-warning">
                        {materiaSeleccionada.estudiantes.filter(est => {
                        const promedio = calcularPromedio(est.id)
                        return promedio && parseFloat(promedio) >= 10
                        }).length}
                    </h2>
                    </CCardBody>
                </CCard>
                </CCol>
                <CCol md={3}>
                <CCard className="text-center border-danger">
                    <CCardBody>
                    <h5>Reprobados</h5>
                    <h2 className="text-danger">
                        {materiaSeleccionada.estudiantes.filter(est => {
                        const promedio = calcularPromedio(est.id)
                        return promedio && parseFloat(promedio) < 10
                        }).length}
                    </h2>
                    </CCardBody>
                </CCard>
                </CCol>
            </CRow>
            </>
        )}

        {/* MODAL DE CONFIRMACIÓN DE ENVÍO */}
        <CModal visible={modalVisible} onClose={() => !enviando && setModalVisible(false)}>
            <CModalHeader closeButton={!enviando}>
            <div className="d-flex align-items-center">
                <CIcon icon={cilSend} className="me-2 text-primary" />
                <h5 className="mb-0">Enviar notas a Secretaría</h5>
            </div>
            </CModalHeader>
            <CModalBody>
            {enviando ? (
                <div className="text-center py-4">
                <CSpinner color="primary" className="mb-3" />
                <h5>Enviando notas a la secretaría...</h5>
                <p className="text-muted">Por favor espere</p>
                </div>
            ) : (
                <>
                <CAlert color="info">
                    <strong>Confirmar envío de notas</strong>
                    <p className="mb-0 mt-2">
                    Está a punto de enviar las notas de <strong>{materiaSeleccionada?.nombre}</strong> 
                    a la secretaría académica.
                    </p>
                </CAlert>
                
                <h6 className="mt-3">Resumen del envío:</h6>
                <ul className="list-unstyled">
                    <li><strong>Materia:</strong> {materiaSeleccionada?.nombre}</li>
                    <li><strong>Grado:</strong> {gradoSeleccionado?.grado}</li>
                    <li><strong>Código:</strong> {materiaSeleccionada?.id}</li>
                    <li><strong>Horario:</strong> {materiaSeleccionada?.horario}</li>
                    <li><strong>Estudiantes:</strong> {materiaSeleccionada?.estudiantes.length}</li>
                </ul>

                <div className="mt-3 p-3  rounded">
                    <h6>Notas a enviar:</h6>
                    {materiaSeleccionada?.estudiantes.slice(0, 3).map(est => {
                    const promedio = calcularPromedio(est.id)
                    const estado = determinarEstado(promedio)
                    return (
                        <div key={est.id} className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-truncate" style={{maxWidth: '60%'}}>{est.nombre}</small>
                        <div className="d-flex flex-column align-items-end">
                            <CBadge color={getColorEstado(estado)}>
                            {promedio ? `Prom: ${promedio}` : "Sin notas"}
                            </CBadge>
                            <small className="text-muted">{est.codigo}</small>
                        </div>
                        </div>
                    )
                    })}
                    {materiaSeleccionada?.estudiantes.length > 3 && (
                    <small className="text-muted">
                        ...y {materiaSeleccionada.estudiantes.length - 3} más
                    </small>
                    )}
                </div>

                <CAlert color="warning" className="mt-3">
                    <small>
                    <CIcon icon={cilWarning} className="me-1" />
                    Una vez enviadas, las notas serán revisadas por la secretaría y no podrán modificarse desde esta interfaz.
                    </small>
                </CAlert>
                </>
            )}
            </CModalBody>
            <CModalFooter>
            <CButton
                color="secondary"
                onClick={() => setModalVisible(false)}
                disabled={enviando}
            >
                Cancelar
            </CButton>
            <CButton
                color="success"
                onClick={enviarNotasSecretaria}
                disabled={enviando}
            >
                {enviando ? (
                <>
                    <CSpinner size="sm" className="me-2" />
                    Enviando...
                </>
                ) : (
                <>
                    <CIcon icon={cilCheckCircle} className="me-1" />
                    Confirmar Envío
                </>
                )}
            </CButton>
            </CModalFooter>
        </CModal>

        {/* TOASTS */}
        <CToaster placement="top-end">
            {toasts.map((t) => (
            <CToast key={t.id} visible color={t.type} className="text-white">
                <CToastHeader closeButton className="text-white">
                <strong className="me-auto">
                    {t.type === "success" ? "✅ Éxito" : 
                    t.type === "warning" ? "⚠ Advertencia" : 
                    "ℹ Información"}
                </strong>
                </CToastHeader>
                <CToastBody>{t.message}</CToastBody>
            </CToast>
            ))}
        </CToaster>
        </CContainer>
    )
    }

    export default SistemaEvaluacionDanza