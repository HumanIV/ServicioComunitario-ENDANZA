import React, { useState, useEffect, useMemo, useCallback, useReducer } from "react";
import {
  CContainer,
  CCard,
  CCardBody,
  CButton,
  CProgress
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilFile,
  cilEducation,
  cilArrowLeft
} from "@coreui/icons";

// Importar utilidades y hooks que vamos a crear
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
          horario: "Martes y Miércoles 8:00-10:00",
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
  ]), []);

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

  // Cargar datos de notas desde localStorage
  useEffect(() => {
    const notasGuardadas = localStorage.getItem('notasEndanza');
    if (notasGuardadas) {
      dispatch({ type: 'CARGAR_NOTAS', payload: JSON.parse(notasGuardadas) });
    }
  }, []);

  // Hooks personalizados
  const { showToast } = useToast(dispatch);
  const calculos = useCalculos(notasCargadas);

  // Datos derivados
  const estudiantesUnicos = useMemo(() =>
    obtenerEstudiantesUnicos(gradoSeleccionado),
    [gradoSeleccionado]
  );

  const estadisticas = useMemo(() => {
    const conNotas = estudiantesUnicos.filter(e => calculos.calcularPromedioEstudiante(e.id));
    const aprobados = conNotas.filter(e => {
      const promedio = calculos.calcularPromedioEstudiante(e.id);
      return promedio && parseFloat(promedio) >= 10;
    });

    return {
      total: estudiantesUnicos.length,
      conNotas: conNotas.length,
      aprobados: aprobados.length,
      pendientes: estudiantesUnicos.length - conNotas.length
    };
  }, [estudiantesUnicos, calculos]);

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

  // Función para generar boletín individual
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

  // Función para generar boletines en lote
  const generarBoletinesLote = useCallback(() => {
    if (estudiantesSeleccionados.size === 0) {
      showToast("warning", "Seleccione al menos un estudiante");
      return;
    }

    dispatch({ type: 'INICIAR_ENVIO' });

    // Simular generación de boletines
    setTimeout(() => {
      const boletinesGenerados = Array.from(estudiantesSeleccionados).map(id => {
        const estudiante = mapaEstudiantes[id];
        const promedio = promediosCache[id];
        return {
          estudiante,
          promedio,
          estado: calculos.determinarPromocion(promedio)
        };
      });

      console.log("Boletines generados:", boletinesGenerados);
      dispatch({ type: 'FINALIZAR_ENVIO' });

      showToast("success", `✅ ${boletinesGenerados.length} boletines generados correctamente`);
    }, 2000);
  }, [estudiantesSeleccionados, mapaEstudiantes, promediosCache, calculos, showToast]);

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

  // Renderizar vista actual - VERSIÓN MODIFICADA CON RESUMEN DE SECCIÓN
  const renderVistaActual = () => {
    switch (vistaActual) {
      case 'estudiantes':
        return (
          <div className="animate__animated animate__fadeIn">
            <div className="d-flex align-items-center justify-content-between mb-5">
              <div className="d-flex align-items-center">
                <CButton
                  color="light"
                  className="me-3 rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm"
                  style={{ width: '45px', height: '45px' }}
                  onClick={() => dispatch({ type: 'VOLVER_A_GRADOS' })}
                >
                  <CIcon icon={cilArrowLeft} />
                </CButton>
                <div>
                  <h3 className="mb-0 fw-bold header-title-custom">{gradoSeleccionado.grado}</h3>
                  <small className="text-muted-custom fw-bold ls-1 text-uppercase" style={{ fontSize: '0.7rem' }}>Gestión de Boletines</small>
                </div>
              </div>

              <div className="d-flex gap-2">
                <CButton
                  color="light"
                  className="text-primary fw-bold"
                  onClick={() => handleToggleSeleccion('todos')}
                >
                  {estudiantesSeleccionados.size === estudiantesUnicos.length
                    ? "Deseleccionar Todos"
                    : "Seleccionar Todos"}
                </CButton>

                <CButton
                  className={`btn-premium px-4 d-flex align-items-center ${estudiantesSeleccionados.size === 0 ? 'opacity-50' : ''}`}
                  onClick={() => dispatch({ type: 'MOSTRAR_MODAL' })}
                  disabled={estudiantesSeleccionados.size === 0}
                >
                  <CIcon icon={cilFile} className="me-2" />
                  GENERAR {estudiantesSeleccionados.size > 0 ? `(${estudiantesSeleccionados.size})` : ''} BOLETINES
                </CButton>
              </div>
            </div>

            {/* =========== RESUMEN DE SECCIÓN =========== */}
            <ResumenSeccion
              gradoSeleccionado={gradoSeleccionado}
              estudiantesUnicos={estudiantesUnicos}
              promediosCache={promediosCache}
              calculos={calculos}
              estudiantesSeleccionados={estudiantesSeleccionados}
            />
            {/* =========== FIN RESUMEN =========== */}

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
              {/* Barra de progreso eliminada según solicitud */}
            </CCard>
          </div>
        );

      case 'boletin':
        return <VistaBoletin boletinData={boletinActual} calculos={calculos} dispatch={dispatch} />;

      default:
        return <VistaGrados data={dataNormalizada} onSeleccionarGrado={(grado) => dispatch({ type: 'SELECCIONAR_GRADO', payload: grado })} />;
    }
  };

  if (!vistaActual) return null; // Evitar renderizado si no hay estado

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
            Ciclo Académico 2024 - 2025
          </p>
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
          .ls-1 { letter-spacing: 1px; }
        `}
      </style>
    </CContainer>
  );
};

export default SistemaBoletinesDanza;