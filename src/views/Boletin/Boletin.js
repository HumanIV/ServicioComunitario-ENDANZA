    import React, { useState, useEffect, useMemo, useCallback, useReducer } from "react"
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
    CAlert,
    CBadge,
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
    CSpinner,
    CListGroup,
    CListGroupItem,
    CProgress
    } from "@coreui/react"
    import CIcon from "@coreui/icons-react"
    import { 
    cilSend, 
    cilCheckCircle, 
    cilUser, 
    cilFile,
    cilEducation,
    cilPrint,
    cilWarning,
    cilNotes
    } from "@coreui/icons"

    // ---------------------- REDUCER PARA GESTIÓN DE ESTADO ---------------------- //
    const estadoInicial = {
    gradoSeleccionado: null,
    estudiantesSeleccionados: new Set(),
    notasCargadas: {},
    boletinActual: null,
    vistaActual: 'grados', // 'grados' | 'estudiantes' | 'boletin'
    toasts: [],
    modalVisible: false,
    enviando: false
    }

    function estadoReducer(state, action) {
    switch (action.type) {
        case 'SELECCIONAR_GRADO':
        return {
            ...state,
            gradoSeleccionado: action.payload,
            vistaActual: 'estudiantes',
            estudiantesSeleccionados: new Set()
        }
        
        case 'VOLVER_A_GRADOS':
        return {
            ...state,
            gradoSeleccionado: null,
            vistaActual: 'grados',
            estudiantesSeleccionados: new Set()
        }
        
        case 'MOSTRAR_BOLETIN':
        return {
            ...state,
            boletinActual: action.payload,
            vistaActual: 'boletin'
        }
        
        case 'OCULTAR_BOLETIN':
        return {
            ...state,
            boletinActual: null,
            vistaActual: 'estudiantes'
        }
        
        case 'TOGGLE_SELECCION_ESTUDIANTE':
        const nuevosSeleccionados = new Set(state.estudiantesSeleccionados)
        if (nuevosSeleccionados.has(action.payload)) {
            nuevosSeleccionados.delete(action.payload)
        } else {
            nuevosSeleccionados.add(action.payload)
        }
        return { ...state, estudiantesSeleccionados: nuevosSeleccionados }
        
        case 'TOGGLE_SELECCION_TODOS':
        const estudiantesUnicos = obtenerEstudiantesUnicos(state.gradoSeleccionado)
        const todosIds = estudiantesUnicos.map(e => e.id)
        const todosSeleccionados = state.estudiantesSeleccionados.size === todosIds.length
        
        return {
            ...state,
            estudiantesSeleccionados: todosSeleccionados ? new Set() : new Set(todosIds)
        }
        
        case 'MOSTRAR_MODAL':
        return { ...state, modalVisible: true }
        
        case 'OCULTAR_MODAL':
        return { ...state, modalVisible: false, enviando: false }
        
        case 'INICIAR_ENVIO':
        return { ...state, enviando: true }
        
        case 'FINALIZAR_ENVIO':
        return {
            ...state,
            enviando: false,
            modalVisible: false,
            estudiantesSeleccionados: new Set()
        }
        
        case 'AGREGAR_TOAST':
        return {
            ...state,
            toasts: [...state.toasts, { 
            id: Date.now(), 
            type: action.payload.type, 
            message: action.payload.message 
            }]
        }
        
        case 'REMOVER_TOAST':
        return {
            ...state,
            toasts: state.toasts.filter(t => t.id !== action.payload)
        }
        
        case 'CARGAR_NOTAS':
        return { ...state, notasCargadas: action.payload }
        
        default:
        return state
    }
    }

    // ---------------------- HOOKS PERSONALIZADOS ---------------------- //

    // Hook para manejar toasts
    const useToast = (dispatch) => {
    const showToast = useCallback((type, message) => {
        const id = Date.now()
        dispatch({ type: 'AGREGAR_TOAST', payload: { type, message } })
        
        const timer = setTimeout(() => {
        dispatch({ type: 'REMOVER_TOAST', payload: id })
        }, 4000)
        
        return () => clearTimeout(timer)
    }, [dispatch])
    
    return { showToast }
    }

    // Hook para cálculos optimizados
    const useCalculos = (notasCargadas) => {
    // Memoizar cálculos de promedios
    const calcularPromedioEstudiante = useCallback((estudianteId) => {
        const notasEstudiante = notasCargadas[estudianteId]
        if (!notasEstudiante) return null

        const notasFinales = []
        
        // Usar for...in para mejor performance
        for (const materiaId in notasEstudiante) {
        const materiaNotas = notasEstudiante[materiaId]
        if (materiaNotas?.final && !isNaN(parseFloat(materiaNotas.final))) {
            notasFinales.push(parseFloat(materiaNotas.final))
        }
        }

        return notasFinales.length > 0 
        ? (notasFinales.reduce((acc, nota) => acc + nota, 0) / notasFinales.length).toFixed(1)
        : null
    }, [notasCargadas])

    const determinarPromocion = useCallback((promedio) => {
        if (promedio === null) return "Pendiente"
        const num = parseFloat(promedio)
        if (num >= 16) return "Excelente"
        if (num >= 13) return "Bueno"
        if (num >= 10) return "Aprobado"
        return "Reprobado"
    }, [])

    const getColorEstado = useCallback((estado) => {
        switch(estado) {
        case "Excelente": return "success"
        case "Bueno": return "info"
        case "Aprobado": return "warning"
        case "Reprobado": return "danger"
        default: return "secondary"
        }
    }, [])

    const getColorNota = useCallback((nota) => {
        if (!nota) return "secondary"
        const num = parseFloat(nota)
        if (num >= 16) return "success"
        if (num >= 13) return "info"
        if (num >= 10) return "warning"
        return "danger"
    }, [])

    return {
        calcularPromedioEstudiante,
        determinarPromocion,
        getColorEstado,
        getColorNota
    }
    }

    // ---------------------- FUNCIONES AUXILIARES OPTIMIZADAS ---------------------- //

    // Función optimizada para obtener estudiantes únicos (O(n))
    function obtenerEstudiantesUnicos(grado) {
    if (!grado) return []
    
    const estudiantesMap = new Map()
    
    // Usar loops simples para mejor performance
    for (const materia of grado.materias) {
        for (const estudiante of materia.estudiantes) {
        if (!estudiantesMap.has(estudiante.id)) {
            estudiantesMap.set(estudiante.id, estudiante)
        }
        }
    }
    
    return Array.from(estudiantesMap.values())
    }

    // Normalizar estructura de datos inicial
    const normalizarDatos = (data) => {
    return data.map(grado => {
        const estudiantesUnicos = obtenerEstudiantesUnicos(grado)
        
        return {
        ...grado,
        estudiantes: estudiantesUnicos,
        materias: grado.materias.map(materia => ({
            ...materia,
            estudianteIds: materia.estudiantes.map(e => e.id)
        }))
        }
    })
    }

    // ---------------------- COMPONENTES ---------------------- //

    // Componente para seleccionar grado
    const VistaGrados = ({ data, onSeleccionarGrado }) => {
    return (
        <>
        <h3 className="mb-4">
            <CIcon icon={cilUser} className="me-2" />
            Seleccionar Grado de Danza
        </h3>
        <CRow>
            {data.map((grado) => (
            <CCol md={6} lg={4} xl={3} key={grado.id} className="mb-3">
                <CCard className="h-100 shadow-sm border-primary hover-shadow">
                <CCardHeader className="bg-primary text-white text-center">
                    <strong className="fs-5">{grado.grado}</strong>
                </CCardHeader>
                <CCardBody className="text-center">
                    <div className="mb-3">
                    <CBadge color="info" className="fs-6 py-2 px-3">
                        {grado.materias.length} Materias
                    </CBadge>
                    </div>
                    <div className="mb-3">
                    <CBadge color="success" className="fs-6 py-2 px-3">
                        {grado.estudiantes?.length || 0} Estudiantes
                    </CBadge>
                    </div>
                    <div className="text-start">
                    <small className="text-muted d-block mb-1">Disciplinas:</small>
                    <ul className="list-unstyled ps-3">
                        {grado.materias.slice(0, 2).map((materia, j) => (
                        <li key={j} className="mb-1">
                            <small>• {materia.nombre}</small>
                        </li>
                        ))}
                        {grado.materias.length > 2 && (
                        <li className="mb-1">
                            <small className="text-muted">y {grado.materias.length - 2} más...</small>
                        </li>
                        )}
                    </ul>
                    </div>
                </CCardBody>
                <CCardFooter className="text-center">
                    <CButton 
                    color="primary" 
                    className="w-100"
                    onClick={() => onSeleccionarGrado(grado)}
                    >
                    Ver Estudiantes
                    </CButton>
                </CCardFooter>
                </CCard>
            </CCol>
            ))}
        </CRow>
        </>
    )
    }

    // Componente para lista de estudiantes
    const VistaEstudiantes = ({ 
    gradoSeleccionado, 
    notasCargadas,
    estudiantesSeleccionados,
    calculos,
    estadisticas,
    dispatch,
    showToast,
    onGenerarBoletinIndividual 
    }) => {
    const estudiantesUnicos = useMemo(() => 
        obtenerEstudiantesUnicos(gradoSeleccionado), 
        [gradoSeleccionado]
    )

    // Crear mapa de estudiantes para acceso rápido O(1)
    const mapaEstudiantes = useMemo(() => {
        const mapa = {}
        estudiantesUnicos.forEach(est => {
        mapa[est.id] = est
        })
        return mapa
    }, [estudiantesUnicos])

    // Cache de promedios para evitar recálculos
    const promediosCache = useMemo(() => {
        const cache = {}
        estudiantesUnicos.forEach(est => {
        cache[est.id] = calculos.calcularPromedioEstudiante(est.id)
        })
        return cache
    }, [estudiantesUnicos, calculos.calcularPromedioEstudiante])

    const handleToggleSeleccion = useCallback((estudianteId) => {
        dispatch({ type: 'TOGGLE_SELECCION_ESTUDIANTE', payload: estudianteId })
    }, [dispatch])

    const handleToggleSeleccionTodos = useCallback(() => {
        dispatch({ type: 'TOGGLE_SELECCION_TODOS' })
    }, [dispatch])

    return (
        <>
        <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center">
            <CButton
                color="secondary"
                className="me-3"
                onClick={() => dispatch({ type: 'VOLVER_A_GRADOS' })}
            >
                ← Volver a Grados
            </CButton>
            <div>
                <h3 className="mb-0">{gradoSeleccionado.grado}</h3>
                <small className="text-muted">Seleccione estudiantes para generar boletines</small>
            </div>
            </div>
            
            <div className="d-flex gap-2">
            <CButton
                color="info"
                onClick={handleToggleSeleccionTodos}
            >
                {estudiantesSeleccionados.size === estudiantesUnicos.length 
                ? "Deseleccionar Todos" 
                : "Seleccionar Todos"}
            </CButton>
            
            <CButton
                color="success"
                onClick={() => dispatch({ type: 'MOSTRAR_MODAL' })}
                disabled={estudiantesSeleccionados.size === 0}
            >
                <CIcon icon={cilFile} className="me-1" />
                Generar {estudiantesSeleccionados.size > 0 ? `(${estudiantesSeleccionados.size})` : ''} Boletines
            </CButton>
            </div>
        </div>

        {/* TABLA DE ESTUDIANTES */}
        <CCard>
            <CCardHeader>
            <h5 className="mb-0">Estudiantes - {gradoSeleccionado.grado}</h5>
            </CCardHeader>
            <CCardBody className="p-0">
            <CTable bordered hover responsive striped>
                <CTableHead>
                <CTableRow>
                    <CTableHeaderCell width="50" className="text-center">
                    <input 
                        type="checkbox" 
                        className="form-check-input"
                        checked={estudiantesSeleccionados.size === estudiantesUnicos.length && estudiantesUnicos.length > 0}
                        onChange={handleToggleSeleccionTodos}
                    />
                    </CTableHeaderCell>
                    <CTableHeaderCell>Estudiante</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Código</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Edad</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Promedio</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
                </CTableRow>
                </CTableHead>
                <CTableBody>
                {estudiantesUnicos.map((estudiante) => {
                    const promedio = promediosCache[estudiante.id]
                    const estado = calculos.determinarPromocion(promedio)
                    const estaSeleccionado = estudiantesSeleccionados.has(estudiante.id)
                    
                    return (
                    <CTableRow key={estudiante.id} className={estaSeleccionado ? 'table-primary' : ''}>
                        <CTableDataCell className="text-center">
                        <input 
                            type="checkbox" 
                            className="form-check-input"
                            checked={estaSeleccionado}
                            onChange={() => handleToggleSeleccion(estudiante.id)}
                        />
                        </CTableDataCell>
                        
                        <CTableDataCell>
                        <div>
                            <strong>{estudiante.nombre}</strong>
                        </div>
                        </CTableDataCell>
                        
                        <CTableDataCell className="text-center align-middle">
                        <CBadge color="dark">{estudiante.codigo}</CBadge>
                        </CTableDataCell>
                        
                        <CTableDataCell className="text-center align-middle">
                        {estudiante.edad} años
                        </CTableDataCell>
                        
                        <CTableDataCell className="text-center align-middle">
                        {promedio ? (
                            <CBadge 
                            color={calculos.getColorNota(promedio)}
                            className="fs-6 px-3"
                            >
                            {promedio}
                            </CBadge>
                        ) : (
                            <small className="text-muted">Sin notas</small>
                        )}
                        </CTableDataCell>
                        
                        <CTableDataCell className="text-center align-middle">
                        <CBadge color={calculos.getColorEstado(estado)}>
                            {estado}
                        </CBadge>
                        </CTableDataCell>
                        
                        <CTableDataCell className="text-center align-middle">
                        <div className="d-flex justify-content-center gap-2">
                            <CButton
                            color="info"
                            size="sm"
                            onClick={() => onGenerarBoletinIndividual(estudiante)}
                            title="Ver boletín detallado"
                            >
                            <CIcon icon={cilNotes} /> Ver
                            </CButton>
                            <CButton
                            color="success"
                            size="sm"
                            onClick={() => {
                                handleToggleSeleccion(estudiante.id)
                                showToast("info", `${estudiante.nombre} añadido a la lista de boletines`)
                            }}
                            title="Agregar para generar boletín"
                            >
                            <CIcon icon={cilFile} /> Boletín
                            </CButton>
                        </div>
                        </CTableDataCell>
                    </CTableRow>
                    )
                })}
                </CTableBody>
            </CTable>
            </CCardBody>
            
            <CCardFooter>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                <small className="text-muted">
                    Estudiantes seleccionados: <strong>{estudiantesSeleccionados.size}</strong> de {estudiantesUnicos.length}
                </small>
                <CProgress 
                    value={(estudiantesSeleccionados.size / estudiantesUnicos.length) * 100} 
                    className="mt-1" 
                    color="primary"
                    style={{ height: '5px', width: '200px' }}
                />
                </div>
                <div>
                <CBadge color="info" className="me-2">
                    Con notas: {estadisticas.conNotas}
                </CBadge>
                <CBadge color="warning">
                    Sin notas: {estadisticas.pendientes}
                </CBadge>
                </div>
            </div>
            </CCardFooter>
        </CCard>

        {/* RESUMEN ESTADÍSTICO */}
        <CRow className="mt-4">
            <CCol md={3}>
            <CCard className="text-center border-primary">
                <CCardBody>
                <h5>Total Estudiantes</h5>
                <h2 className="text-primary">{estadisticas.total}</h2>
                </CCardBody>
            </CCard>
            </CCol>
            <CCol md={3}>
            <CCard className="text-center border-success">
                <CCardBody>
                <h5>Aprobados</h5>
                <h2 className="text-success">{estadisticas.aprobados}</h2>
                </CCardBody>
            </CCard>
            </CCol>
            <CCol md={3}>
            <CCard className="text-center border-warning">
                <CCardBody>
                <h5>Pendientes</h5>
                <h2 className="text-warning">{estadisticas.pendientes}</h2>
                </CCardBody>
            </CCard>
            </CCol>
            <CCol md={3}>
            <CCard className="text-center border-info">
                <CCardBody>
                <h5>Seleccionados</h5>
                <h2 className="text-info">{estudiantesSeleccionados.size}</h2>
                </CCardBody>
            </CCard>
            </CCol>
        </CRow>
        </>
    )
    }

    // Componente para vista de boletín
    const VistaBoletin = ({ boletinData, calculos, dispatch }) => {
    return (
        <CCard className="mt-4 printable-area">
        <CCardHeader className="bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
            <div>
                <h4 className="mb-0">BOLETÍN ACADÉMICO</h4>
                <small>Escuela de Danza Endanza - Año Académico 2024</small>
            </div>
            <div className="d-flex gap-2">
                <CButton
                color="light"
                variant="outline"
                className="text-primary"
                onClick={() => dispatch({ type: 'OCULTAR_BOLETIN' })}
                >
                ← Volver
                </CButton>
                <CButton
                color="light"
                className="text-primary"
                onClick={() => window.print()}
                >
                <CIcon icon={cilPrint} /> Imprimir
                </CButton>
            </div>
            </div>
        </CCardHeader>
        
        <CCardBody>
            <CRow className="mb-4">
            <CCol md={8}>
                <h5>INFORMACIÓN DEL ESTUDIANTE</h5>
                <CListGroup>
                <CListGroupItem>
                    <strong>Nombre:</strong> {boletinData.estudiante.nombre}
                </CListGroupItem>
                <CListGroupItem>
                    <strong>Código:</strong> {boletinData.estudiante.codigo}
                </CListGroupItem>
                <CListGroupItem>
                    <strong>Grado:</strong> {boletinData.grado}
                </CListGroupItem>
                <CListGroupItem>
                    <strong>Fecha de Emisión:</strong> {boletinData.fecha}
                </CListGroupItem>
                </CListGroup>
            </CCol>
            <CCol md={4}>
                <CCard className="border-primary">
                <CCardBody className="text-center">
                    <h5>RESUMEN ACADÉMICO</h5>
                    <div className="mb-3">
                    <h1 className={`text-${calculos.getColorNota(boletinData.promedio)}`}>
                        {boletinData.promedio || "N/A"}
                    </h1>
                    <small>Promedio General</small>
                    </div>
                    <CBadge 
                    color={calculos.getColorEstado(boletinData.promocion)}
                    className="fs-5 py-2 px-3"
                    >
                    {boletinData.promocion}
                    </CBadge>
                </CCardBody>
                </CCard>
            </CCol>
            </CRow>

            <h5 className="mb-3">CALIFICACIONES POR MATERIA</h5>
            <CTable bordered responsive>
            <CTableHead>
                <CTableRow>
                <CTableHeaderCell>Materia / Disciplina</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Código</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Horario</CTableHeaderCell>
                <CTableHeaderCell className="text-center">1er Trim.</CTableHeaderCell>
                <CTableHeaderCell className="text-center">2do Trim.</CTableHeaderCell>
                <CTableHeaderCell className="text-center">3er Trim.</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Nota Final</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {boletinData.materias.map((materia) => (
                <CTableRow key={materia.id}>
                    <CTableDataCell>
                    <strong>{materia.nombre}</strong>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                    {materia.id}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                    <small>{materia.horario}</small>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                    <CBadge color={calculos.getColorNota(materia.notas.t1)}>
                        {materia.notas.t1 || "--"}
                    </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                    <CBadge color={calculos.getColorNota(materia.notas.t2)}>
                        {materia.notas.t2 || "--"}
                    </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                    <CBadge color={calculos.getColorNota(materia.notas.t3)}>
                        {materia.notas.t3 || "--"}
                    </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                    <CBadge 
                        color={calculos.getColorNota(materia.notas.final)}
                        className="fs-5 px-3"
                    >
                        {materia.notas.final || "--"}
                    </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                    <CBadge color={calculos.getColorEstado(materia.estado)}>
                        {materia.estado}
                    </CBadge>
                    </CTableDataCell>
                </CTableRow>
                ))}
            </CTableBody>
            </CTable>

            <CRow className="mt-4">
            <CCol md={8}>
                <CCard className="border-warning">
                <CCardHeader className="bg-warning text-dark">
                    <strong>OBSERVACIONES Y RECOMENDACIONES</strong>
                </CCardHeader>
                <CCardBody>
                    <p>{boletinData.observaciones}</p>
                    <div className="mt-4">
                    <small className="text-muted">Este boletín es un documento oficial de la Escuela de Danza Endanza</small>
                    </div>
                </CCardBody>
                </CCard>
            </CCol>
            </CRow>
        </CCardBody>
        </CCard>
    )
    }

    // Modal para generar boletines en lote
    const ModalBoletinesLote = ({ 
    visible, 
    enviando, 
    gradoSeleccionado, 
    estudiantesSeleccionados,
    mapaEstudiantes,
    promediosCache,
    calculos,
    dispatch,
    onGenerarBoletinesLote 
    }) => {
    const estudiantesLista = useMemo(() => 
        Array.from(estudiantesSeleccionados).map(id => ({
        id,
        estudiante: mapaEstudiantes[id],
        promedio: promediosCache[id]
        })), 
        [estudiantesSeleccionados, mapaEstudiantes, promediosCache]
    )

    return (
        <CModal visible={visible} onClose={() => !enviando && dispatch({ type: 'OCULTAR_MODAL' })}>
        <CModalHeader closeButton={!enviando}>
            <div className="d-flex align-items-center">
            <CIcon icon={cilFile} className="me-2 text-primary" />
            <h5 className="mb-0">Generar Boletines en Lote</h5>
            </div>
        </CModalHeader>
        <CModalBody>
            {enviando ? (
            <div className="text-center py-4">
                <CSpinner color="primary" className="mb-3" />
                <h5>Generando boletines...</h5>
                <p className="text-muted">Por favor espere</p>
            </div>
            ) : (
            <>
                <CAlert color="info">
                <strong>Confirmar generación de boletines</strong>
                <p className="mb-0 mt-2">
                    Se generarán boletines para <strong>{estudiantesSeleccionados.size} estudiantes</strong> del {gradoSeleccionado?.grado}.
                </p>
                </CAlert>
                
                <h6 className="mt-3">Estudiantes seleccionados:</h6>
                <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {estudiantesLista.map(({ id, estudiante, promedio }, index) => (
                    <div key={id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                    <div>
                        <small><strong>{index + 1}.</strong> {estudiante?.nombre || 'Estudiante no encontrado'}</small>
                        <div>
                        <small className="text-muted">{estudiante?.codigo}</small>
                        </div>
                    </div>
                    <div>
                        {promedio ? (
                        <CBadge color={calculos.getColorNota(promedio)}>
                            {promedio}
                        </CBadge>
                        ) : (
                        <CBadge color="secondary">Sin notas</CBadge>
                        )}
                    </div>
                    </div>
                ))}
                </div>

                <CAlert color="warning" className="mt-3">
                <small>
                    <CIcon icon={cilWarning} className="me-1" />
                    Los boletines se generarán en formato PDF y estarán disponibles para descarga.
                </small>
                </CAlert>
            </>
            )}
        </CModalBody>
        <CModalFooter>
            <CButton
            color="secondary"
            onClick={() => dispatch({ type: 'OCULTAR_MODAL' })}
            disabled={enviando}
            >
            Cancelar
            </CButton>
            <CButton
            color="success"
            onClick={onGenerarBoletinesLote}
            disabled={enviando}
            >
            {enviando ? (
                <>
                <CSpinner size="sm" className="me-2" />
                Generando...
                </>
            ) : (
                <>
                <CIcon icon={cilCheckCircle} className="me-1" />
                Generar Boletines
                </>
            )}
            </CButton>
        </CModalFooter>
        </CModal>
    )
    }

    // Container para toasts
    const ToastContainer = ({ toasts, dispatch }) => (
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
    )

    // ---------------------- COMPONENTE PRINCIPAL ---------------------- //
    const SistemaBoletinesDanza = () => {
    // Normalizar datos iniciales
    const dataNormalizada = useMemo(() => normalizarDatos([
        {
        id: 1,
        grado: "1er Grado",
        materias: [
            {
            id: "DAN-101",
            nombre: "Ballet Básico I",
            horario: "Lunes y Miércoles 8:00-10:00",
            estudiantes: [
                { id: 1, nombre: "Ana López", codigo: "END-101", edad: 6 },
                { id: 2, nombre: "Carlos Pérez", codigo: "END-102", edad: 7 },
                { id: 3, nombre: "María González", codigo: "END-103", edad: 6 }
            ]
            },
            {
            id: "DAN-102",
            nombre: "Ritmo y Movimiento",
            horario: "Martes y Jueves 8:00-10:00",
            estudiantes: [
                { id: 4, nombre: "Juan Rodríguez", codigo: "END-104", edad: 7 },
                { id: 5, nombre: "Laura Martínez", codigo: "END-105", edad: 6 }
            ]
            },
            {
            id: "DAN-103",
            nombre: "Expresión Corporal Básica",
            horario: "Viernes 8:00-10:00",
            estudiantes: [
                { id: 1, nombre: "Ana López", codigo: "END-101", edad: 6 },
                { id: 2, nombre: "Carlos Pérez", codigo: "END-102", edad: 7 },
                { id: 3, nombre: "María González", codigo: "END-103", edad: 6 }
            ]
            }
        ]
        },
        {
        id: 2,
        grado: "2do Grado",
        materias: [
            {
            id: "DAN-201",
            nombre: "Ballet Básico II",
            horario: "Lunes y Miércoles 10:00-12:00",
            estudiantes: [
                { id: 6, nombre: "Pedro Sánchez", codigo: "END-201", edad: 8 },
                { id: 7, nombre: "Sofía Ramírez", codigo: "END-202", edad: 7 }
            ]
            },
            {
            id: "DAN-202",
            nombre: "Expresión Corporal I",
            horario: "Martes y Jueves 10:00-12:00",
            estudiantes: [
                { id: 8, nombre: "Diego Herrera", codigo: "END-203", edad: 8 },
                { id: 9, nombre: "Valeria Castro", codigo: "END-204", edad: 9 }
            ]
            },
            {
            id: "DAN-203",
            nombre: "Danza Folklórica Básica",
            horario: "Viernes 10:00-12:00",
            estudiantes: [
                { id: 6, nombre: "Pedro Sánchez", codigo: "END-201", edad: 8 },
                { id: 7, nombre: "Sofía Ramírez", codigo: "END-202", edad: 7 }
            ]
            }
        ]
        }
    ]), [])

    // Estado con reducer
    const [state, dispatch] = useReducer(estadoReducer, estadoInicial)
    const {
        gradoSeleccionado,
        estudiantesSeleccionados,
        notasCargadas,
        boletinActual,
        vistaActual,
        toasts,
        modalVisible,
        enviando
    } = state

    // Cargar datos de notas desde localStorage
    useEffect(() => {
        const notasGuardadas = localStorage.getItem('notasEndanza')
        if (notasGuardadas) {
        dispatch({ type: 'CARGAR_NOTAS', payload: JSON.parse(notasGuardadas) })
        }
    }, [])

    // Hooks personalizados
    const { showToast } = useToast(dispatch)
    const calculos = useCalculos(notasCargadas)

    // Estadísticas precalculadas
    const estadisticas = useMemo(() => {
        const estudiantes = obtenerEstudiantesUnicos(gradoSeleccionado)
        const conNotas = estudiantes.filter(e => calculos.calcularPromedioEstudiante(e.id))
        const aprobados = conNotas.filter(e => {
        const promedio = calculos.calcularPromedioEstudiante(e.id)
        return promedio && parseFloat(promedio) >= 10
        })
        
        return {
        total: estudiantes.length,
        conNotas: conNotas.length,
        aprobados: aprobados.length,
        pendientes: estudiantes.length - conNotas.length
        }
    }, [gradoSeleccionado, calculos])

    // Mapas para acceso rápido
    const mapaEstudiantes = useMemo(() => {
        const mapa = {}
        const estudiantes = obtenerEstudiantesUnicos(gradoSeleccionado)
        estudiantes.forEach(est => {
        mapa[est.id] = est
        })
        return mapa
    }, [gradoSeleccionado])

    const promediosCache = useMemo(() => {
        const cache = {}
        const estudiantes = obtenerEstudiantesUnicos(gradoSeleccionado)
        estudiantes.forEach(est => {
        cache[est.id] = calculos.calcularPromedioEstudiante(est.id)
        })
        return cache
    }, [gradoSeleccionado, calculos])

    // Funciones de boletines
    const generarBoletinIndividual = useCallback((estudiante) => {
        if (!gradoSeleccionado) return

        const promedio = calculos.calcularPromedioEstudiante(estudiante.id)
        const promocion = calculos.determinarPromocion(promedio)
        
        const obtenerMateriasEstudiante = (estudianteId) => {
        if (!gradoSeleccionado) return []
        
        return gradoSeleccionado.materias.map(materia => {
            const notas = notasCargadas[estudianteId]?.[materia.id] || { t1: "", t2: "", t3: "", final: "" }
            const estado = notas.final ? (parseFloat(notas.final) >= 10 ? "Aprobado" : "Reprobado") : "Pendiente"
            
            return {
            ...materia,
            notas,
            estado
            }
        })
        }

        const generarObservaciones = (promocion, promedio) => {
        switch(promocion) {
            case "Excelente":
            return "Rendimiento excepcional. Promovido con honores al siguiente grado."
            case "Bueno":
            return "Buen rendimiento académico. Promovido al siguiente grado."
            case "Aprobado":
            return "Rendimiento satisfactorio. Promovido al siguiente grado."
            case "Reprobado":
            return "No alcanza los requisitos mínimos. Debe repetir el grado."
            default:
            return "Faltan notas para determinar el resultado final."
        }
        }
        
        const boletin = {
        estudiante,
        grado: gradoSeleccionado.grado,
        fecha: new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        materias: obtenerMateriasEstudiante(estudiante.id),
        promedio,
        promocion,
        observaciones: generarObservaciones(promocion, promedio)
        }
        
        dispatch({ type: 'MOSTRAR_BOLETIN', payload: boletin })
    }, [gradoSeleccionado, notasCargadas, calculos])

    const generarBoletinesLote = useCallback(() => {
        if (estudiantesSeleccionados.size === 0) {
        showToast("warning", "Seleccione al menos un estudiante")
        return
        }

        dispatch({ type: 'INICIAR_ENVIO' })
        
        // Simular generación de boletines
        setTimeout(() => {
        const boletinesGenerados = Array.from(estudiantesSeleccionados).map(id => {
            const estudiante = mapaEstudiantes[id]
            const promedio = promediosCache[id]
            return {
            estudiante,
            promedio,
            estado: calculos.determinarPromocion(promedio)
            }
        })

        console.log("Boletines generados:", boletinesGenerados)
        dispatch({ type: 'FINALIZAR_ENVIO' })
        
        showToast("success", `✅ ${boletinesGenerados.length} boletines generados correctamente`)
        }, 2000)
    }, [estudiantesSeleccionados, mapaEstudiantes, promediosCache, calculos, showToast])

    // Renderizar vista actual
    const renderVistaActual = () => {
        switch(vistaActual) {
        case 'estudiantes':
            return (
            <VistaEstudiantes
                gradoSeleccionado={gradoSeleccionado}
                notasCargadas={notasCargadas}
                estudiantesSeleccionados={estudiantesSeleccionados}
                calculos={calculos}
                estadisticas={estadisticas}
                dispatch={dispatch}
                showToast={showToast}
                onGenerarBoletinIndividual={generarBoletinIndividual}
            />
            )
        
        case 'boletin':
            return (
            <VistaBoletin
                boletinData={boletinActual}
                calculos={calculos}
                dispatch={dispatch}
            />
            )
        
        default: // 'grados'
            return (
            <VistaGrados
                data={dataNormalizada}
                onSeleccionarGrado={(grado) => dispatch({ type: 'SELECCIONAR_GRADO', payload: grado })}
            />
            )
        }
    }

    return (
        <CContainer className="py-4">
        <header className="mb-4 text-center">
            <h1 className="text-primary fw-bold mb-2">
            <CIcon icon={cilEducation} className="me-2" />
            Sistema de Boletines - Endanza
            </h1>
            <p className="text-muted">
            Generación y visualización de boletines académicos
            </p>
        </header>

        {renderVistaActual()}

        {/* Modal para generar boletines en lote */}
        <ModalBoletinesLote
            visible={modalVisible}
            enviando={enviando}
            gradoSeleccionado={gradoSeleccionado}
            estudiantesSeleccionados={estudiantesSeleccionados}
            mapaEstudiantes={mapaEstudiantes}
            promediosCache={promediosCache}
            calculos={calculos}
            dispatch={dispatch}
            onGenerarBoletinesLote={generarBoletinesLote}
        />

        {/* Toasts */}
        <ToastContainer toasts={toasts} dispatch={dispatch} />

        {/* Estilos para impresión */}
        <style>
            {`
            @media print {
                .printable-area {
                margin: 0;
                border: none;
                box-shadow: none;
                }
                .no-print {
                display: none !important;
                }
                .btn {
                display: none !important;
                }
            }
            `}
        </style>
        </CContainer>
    )
    }

    export default SistemaBoletinesDanza