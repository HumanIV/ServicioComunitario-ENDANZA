// reducers/estadoReducer.js
import { obtenerEstudiantesUnicos } from '../utils/helpers';

export const estadoInicial = {
  gradoSeleccionado: null,
  estudiantesSeleccionados: new Set(),
  notasCargadas: {},
  boletinActual: null,
  vistaActual: 'grados', // 'grados' | 'estudiantes' | 'boletin'
  toasts: [],
  modalVisible: false,
  enviando: false
};

export function estadoReducer(state, action) {
  switch (action.type) {
    case 'SELECCIONAR_GRADO':
      return {
        ...state,
        gradoSeleccionado: action.payload,
        vistaActual: 'estudiantes',
        estudiantesSeleccionados: new Set()
      };
      
    case 'VOLVER_A_GRADOS':
      return {
        ...state,
        gradoSeleccionado: null,
        vistaActual: 'grados',
        estudiantesSeleccionados: new Set()
      };
      
    case 'MOSTRAR_BOLETIN':
      return {
        ...state,
        boletinActual: action.payload,
        vistaActual: 'boletin'
      };
      
    case 'OCULTAR_BOLETIN':
      return {
        ...state,
        boletinActual: null,
        vistaActual: 'estudiantes'
      };
      
    case 'TOGGLE_SELECCION_ESTUDIANTE':
      const nuevosSeleccionados = new Set(state.estudiantesSeleccionados);
      if (nuevosSeleccionados.has(action.payload)) {
        nuevosSeleccionados.delete(action.payload);
      } else {
        nuevosSeleccionados.add(action.payload);
      }
      return { 
        ...state, 
        estudiantesSeleccionados: nuevosSeleccionados 
      };
      
    case 'TOGGLE_SELECCION_TODOS':
      const estudiantesUnicos = obtenerEstudiantesUnicos(state.gradoSeleccionado);
      const todosIds = estudiantesUnicos.map(e => e.id);
      const todosSeleccionados = state.estudiantesSeleccionados.size === todosIds.length;
      
      return {
        ...state,
        estudiantesSeleccionados: todosSeleccionados ? new Set() : new Set(todosIds)
      };
      
    case 'MOSTRAR_MODAL':
      return { 
        ...state, 
        modalVisible: true 
      };
      
    case 'OCULTAR_MODAL':
      return { 
        ...state, 
        modalVisible: false, 
        enviando: false 
      };
      
    case 'INICIAR_ENVIO':
      return { 
        ...state, 
        enviando: true 
      };
      
    case 'FINALIZAR_ENVIO':
      return {
        ...state,
        enviando: false,
        modalVisible: false,
        estudiantesSeleccionados: new Set()
      };
      
    case 'AGREGAR_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { 
          id: Date.now(), 
          type: action.payload.type, 
          message: action.payload.message 
        }]
      };
      
    case 'REMOVER_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload)
      };
      
    case 'CARGAR_NOTAS':
      return { 
        ...state, 
        notasCargadas: action.payload 
      };
      
    default:
      return state;
  }
}