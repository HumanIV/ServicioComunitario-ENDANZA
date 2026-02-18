import React, { useState, useEffect, useMemo, useCallback, useReducer } from "react";
import {
  CContainer,
  CCard,
  CCardBody,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilFile,
  cilEducation,
  cilArrowLeft
} from "@coreui/icons";

// Servicios
import { getAvailableYears, getActiveYear, getLapsosByYear } from '../../services/configService';
import { getSectionsForGrades, getGradesForSection } from '../../services/gradeService';
import { generarBoletines } from '../../services/boletinesService';

// Importar utilidades y hooks
import { obtenerEstudiantesUnicos, normalizarDatos } from './utils/helpers';
import { useToast } from './hooks/useToast';
import { useCalculos } from './hooks/useCalculos';
import { estadoReducer, estadoInicial } from './reducers/estadoReducer';

// Importar componentes
import { VistaGrados } from './components/vistaGrados';
import { TablaEstudiantes } from './components/tablaEstudiantes';
import { VistaBoletin } from './components/vistaBoletin';
import { ModalBoletinesLote } from './components/modalBoletinesLote';
import { ToastContainer } from './components/toastContainer';
import { ResumenSeccion } from "./components/resumenSeccion";

const SistemaBoletinesDanza = () => {

  // Estados para datos reales
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [lapsos, setLapsos] = useState([]);
  const [selectedLapso, setSelectedLapso] = useState(null);

  // Estado con reducer
  const [state, dispatch] = useReducer(estadoReducer, estadoInicial);
  const {
    gradoSeleccionado,
    estudiantesSeleccionados,
    notasCargadas,
    boletinActual,
    vistaActual,
    toasts,
    modalVisible,
    enviando
  } = state;

  // Cargar años académicos
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const yearsData = await getAvailableYears();
        setYears(yearsData);
        const active = await getActiveYear();
        if (active) setSelectedYear(active);
        else if (yearsData.length > 0) setSelectedYear(yearsData[0]);
      } catch (error) {
        console.error("Error loading years:", error);
      }
    };
    fetchYears();
  }, []);

  // Cargar estructura de grados/secciones cuando cambia el año
  useEffect(() => {
    if (!selectedYear) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const sectionsData = await getSectionsForGrades(selectedYear.id);
        const normalized = normalizarDatos(sectionsData);
        setDashboardData(normalized);

        // Cargar Lapsos
        const lapsosData = await getLapsosByYear(selectedYear.id);
        setLapsos(lapsosData);
        if (lapsosData.length > 0) {
          setSelectedLapso(lapsosData[0]);
        } else {
          setSelectedLapso(null);
        }

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  // Cargar notas de todas las materias cargadas
  useEffect(() => {
    if (dashboardData.length === 0) return;

    const fetchAllGrades = async () => {
      const notasAcumuladas = {};

      for (const grado of dashboardData) {
        for (const materia of grado.materias) {
          try {
            const notasMateria = await getGradesForSection(
              materia.sectionId || materia.id,
              selectedLapso ? selectedLapso.id : null
            );

            Object.keys(notasMateria).forEach(studentId => {
              if (!notasAcumuladas[studentId]) notasAcumuladas[studentId] = {};

              const notas = notasMateria[studentId];

              // Calcular definitiva
              const valores = [notas.n1, notas.n2, notas.n3, notas.n4].filter(n => n && !isNaN(parseFloat(n)));
              const final = valores.length > 0
                ? (valores.reduce((a, b) => a + parseFloat(b), 0) / valores.length).toFixed(1)
                : "";

              notasAcumuladas[studentId][materia.id] = {
                t1: notas.n1,
                t2: notas.n2,
                t3: notas.n3,
                t4: notas.n4,
                final: final,
                ...notas
              };
            });
          } catch (err) {
            console.error(`Error cargando notas para materia ${materia.id}:`, err);
          }
        }
      }

      dispatch({ type: 'CARGAR_NOTAS', payload: notasAcumuladas });
    };

    if (selectedLapso) {
      fetchAllGrades();
    }
  }, [dashboardData, selectedLapso]);

  // Hooks personalizados
  const { showToast } = useToast(dispatch);
  const calculos = useCalculos(notasCargadas);

  // Datos derivados
  const dataParaVista = useMemo(() => dashboardData, [dashboardData]);

  // Datos derivados del reducer
  const estudiantesUnicos = useMemo(() =>
    obtenerEstudiantesUnicos(gradoSeleccionado),
    [gradoSeleccionado]
  );

  // Mapas para acceso rápido
  const mapaEstudiantes = useMemo(() => {
    const mapa = {};
    estudiantesUnicos.forEach(est => {
      mapa[est.id] = est;
    });
    return mapa;
  }, [estudiantesUnicos]);

  const promediosCache = useMemo(() => {
    const cache = {};
    estudiantesUnicos.forEach(est => {
      cache[est.id] = calculos.calcularPromedioEstudiante(est.id);
    });
    return cache;
  }, [estudiantesUnicos, calculos]);


  // Función para generar boletín individual (visualización)
  const generarBoletinIndividual = useCallback((estudiante) => {
    if (!gradoSeleccionado) return;

    const promedio = calculos.calcularPromedioEstudiante(estudiante.id);
    const promocion = calculos.determinarPromocion(promedio);

    const obtenerMateriasEstudiante = (estudianteId) => {
      if (!gradoSeleccionado) return [];

      return gradoSeleccionado.materias.map(materia => {
        const notas = notasCargadas[estudianteId]?.[materia.id] || { t1: "", t2: "", t3: "", final: "" };
        const estado = notas.final ? (parseFloat(notas.final) >= 10 ? "Aprobado" : "Reprobado") : "Pendiente";

        return {
          ...materia,
          notas,
          estado
        };
      });
    };

    const generarObservaciones = (promocion, promedio) => {
      switch (promocion) {
        case "Excelente":
          return "Rendimiento excepcional. Promovido con honores al siguiente grado.";
        case "Bueno":
          return "Buen rendimiento académico. Promovido al siguiente grado.";
        case "Aprobado":
          return "Rendimiento satisfactorio. Promovido al siguiente grado.";
        case "Reprobado":
          return "No alcanza los requisitos mínimos. Debe repetir el grado.";
        default:
          return "Faltan notas para determinar el resultado final.";
      }
    };

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
    };

    dispatch({ type: 'MOSTRAR_BOLETIN', payload: boletin });
  }, [gradoSeleccionado, notasCargadas, calculos]);

  // Función para generar boletines (Backend)
  const generarBoletinesLote = useCallback(async () => {
    if (estudiantesSeleccionados.size === 0) {
      showToast("warning", "Seleccione al menos un estudiante");
      return;
    }

    if (!selectedYear) {
      showToast("error", "No hay año académico seleccionado");
      return;
    }

    dispatch({ type: 'INICIAR_ENVIO' });

    try {
      const studentIds = Array.from(estudiantesSeleccionados);
      // Pasar el ID del grado seleccionado para filtrar materias
      const response = await generarBoletines(
        studentIds,
        selectedYear.id,
        gradoSeleccionado.id,
        selectedLapso ? selectedLapso.id : null
      );

      if (response && response.ok) {
        showToast("success", `✅ ${studentIds.length} boletines generados y habilitados correctamente`);
        dispatch({ type: 'OCULTAR_MODAL' }); // Cerrar modal si éxito
      } else {
        showToast("error", response?.msg || "Error generando boletines");
      }
    } catch (error) {
      console.error("Error generando boletines:", error);
      showToast("error", "Error de conexión al generar boletines");
    } finally {
      dispatch({ type: 'FINALIZAR_ENVIO' });
    }
  }, [estudiantesSeleccionados, selectedYear, gradoSeleccionado, showToast, selectedLapso]);

  // Handlers
  const handleToggleSeleccion = useCallback((estudianteId) => {
    if (estudianteId === 'todos') {
      dispatch({ type: 'TOGGLE_SELECCION_TODOS' });
    } else {
      dispatch({ type: 'TOGGLE_SELECCION_ESTUDIANTE', payload: estudianteId });
    }
  }, [dispatch]);

  const handleAgregarBoletin = useCallback((estudiante) => {
    dispatch({ type: 'TOGGLE_SELECCION_ESTUDIANTE', payload: estudiante.id });
    showToast("info", `${estudiante.nombre} añadido a la lista de boletines`);
  }, [dispatch, showToast]);

  // Render
  const renderVistaActual = () => {
    switch (vistaActual) {
      case 'estudiantes':
        return (
          <div className="animate__animated animate__fadeIn">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 mb-md-5">
              <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                <CButton
                  className="me-3 btn-back-premium rounded-circle"
                  style={{ width: '40px', height: '40px', padding: 0 }}
                  onClick={() => dispatch({ type: 'VOLVER_A_GRADOS' })}
                >
                  <CIcon icon={cilArrowLeft} />
                </CButton>
                <div>
                  <h3 className="mb-0 fw-bold header-title-custom fs-4 fs-md-3">{gradoSeleccionado.grado}</h3>
                  <small className="text-muted-custom fw-bold ls-1 text-uppercase" style={{ fontSize: '0.65rem' }}>Gestión de Boletines</small>
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
                <CButton
                  color="light"
                  className="text-primary fw-bold w-100 w-sm-auto shadow-sm"
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => handleToggleSeleccion('todos')}
                >
                  {estudiantesSeleccionados.size === estudiantesUnicos.length
                    ? "Deseleccionar Todos"
                    : "Seleccionar Todos"}
                </CButton>

                <CButton
                  className={`btn-premium px-4 d-flex align-items-center justify-content-center w-100 w-sm-auto shadow-sm ${estudiantesSeleccionados.size === 0 ? 'opacity-50' : ''}`}
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => dispatch({ type: 'MOSTRAR_MODAL' })}
                  disabled={estudiantesSeleccionados.size === 0}
                >
                  <CIcon icon={cilFile} className="me-2" />
                  GENERAR {estudiantesSeleccionados.size > 0 ? `(${estudiantesSeleccionados.size})` : ''}
                </CButton>
              </div>
            </div>

            <ResumenSeccion
              gradoSeleccionado={gradoSeleccionado}
              estudiantesUnicos={estudiantesUnicos}
              promediosCache={promediosCache}
              calculos={calculos}
              estudiantesSeleccionados={estudiantesSeleccionados}
            />

            <CCard className="premium-card border-0 shadow-sm overflow-hidden mb-5">
              <div className="px-4 py-3 border-bottom bg-light-custom d-flex justify-content-between align-items-center border-opacity-10">
                <h6 className="mb-0 fw-bold text-uppercase ls-1 header-title-custom small">
                  Listado de Estudiantes Inscritos
                </h6>
                <div className="text-muted-custom small fw-bold">
                  Total: {estudiantesUnicos.length}
                </div>
              </div>
              <CCardBody className="p-0">
                <TablaEstudiantes
                  estudiantes={estudiantesUnicos}
                  estudiantesSeleccionados={estudiantesSeleccionados}
                  promediosCache={promediosCache}
                  calculos={calculos}
                  onToggleSeleccion={handleToggleSeleccion}
                  onVerBoletin={generarBoletinIndividual}
                  onAgregarBoletin={handleAgregarBoletin}
                />
              </CCardBody>
            </CCard>
          </div>
        );

      case 'boletin':
        return <VistaBoletin boletinData={boletinActual} calculos={calculos} dispatch={dispatch} academicYear={selectedYear?.name} />;

      default:
        return <VistaGrados
          data={dataParaVista}
          onSeleccionarGrado={(grado) => dispatch({ type: 'SELECCIONAR_GRADO', payload: grado })}
          academicYear={selectedYear?.name}
        />;
    }
  };

  if (!vistaActual) return null;

  return (
    <CContainer className="py-4">
      {vistaActual === 'grados' && (
        <header className="mb-5 text-center">
          <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-orange-soft mb-3 text-primary">
            <CIcon icon={cilEducation} size="xl" />
          </div>
          <h2 className="header-title-custom fw-bold mb-1 ls-1">
            Sistema de Boletines
          </h2>
          <p className="text-muted-custom small text-uppercase ls-1 fw-bold">
            Ciclo Académico {selectedYear?.name || "Cargando..."}
          </p>

          {/* Selector de Lapso */}
          {lapsos.length > 0 && (
            <div className="d-flex justify-content-center mt-3">
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted-custom small fw-bold">Lapso:</span>
                <select
                  className="form-select form-select-sm w-auto"
                  value={selectedLapso?.id || ''}
                  onChange={(e) => {
                    const lapso = lapsos.find(l => l.id === parseInt(e.target.value))
                    setSelectedLapso(lapso)
                  }}
                >
                  {lapsos.map(lapso => (
                    <option key={lapso.id} value={lapso.id}>
                      {lapso.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </header>
      )}

      {renderVistaActual()}

      <ModalBoletinesLote
        visible={modalVisible}
        enviando={enviando}
        gradoSeleccionado={gradoSeleccionado}
        estudiantesSeleccionados={estudiantesSeleccionados}
        estudiantesUnicos={estudiantesUnicos}
        calculos={calculos}
        dispatch={dispatch}
        onGenerarBoletinesLote={generarBoletinesLote}
      />

      <ToastContainer toasts={toasts} dispatch={dispatch} />
    </CContainer>
  );
};

export default SistemaBoletinesDanza;