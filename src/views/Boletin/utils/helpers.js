// utils/helpers.js

// Función optimizada para obtener estudiantes únicos (O(n))
export function obtenerEstudiantesUnicos(grado) {
  if (!grado || !grado.materias) return [];
  
  const estudiantesMap = new Map();
  
  // Usar loops simples para mejor performance
  for (const materia of grado.materias) {
    if (materia.estudiantes) {
      for (const estudiante of materia.estudiantes) {
        if (!estudiantesMap.has(estudiante.id)) {
          estudiantesMap.set(estudiante.id, estudiante);
        }
      }
    }
  }
  
  return Array.from(estudiantesMap.values());
}

// Normalizar estructura de datos inicial
export const normalizarDatos = (data) => {
  return data.map(grado => {
    const estudiantesUnicos = obtenerEstudiantesUnicos(grado);
    
    return {
      ...grado,
      estudiantes: estudiantesUnicos,
      materias: grado.materias.map(materia => ({
        ...materia,
        estudianteIds: materia.estudiantes ? materia.estudiantes.map(e => e.id) : []
      }))
    };
  });
};

// Función para generar boletín individual
export const generarBoletinIndividual = (estudiante, gradoSeleccionado, notasCargadas, calculos) => {
  if (!gradoSeleccionado) return null;

  const promedio = calculos.calcularPromedioEstudiante(estudiante.id);
  const promocion = calculos.determinarPromocion(promedio);
  
  const obtenerMateriasEstudiante = (estudianteId) => {
    if (!gradoSeleccionado || !gradoSeleccionado.materias) return [];
    
    return gradoSeleccionado.materias.map(materia => {
      const notas = notasCargadas[estudianteId]?.[materia.id] || { 
        t1: "", 
        t2: "", 
        t3: "", 
        final: "" 
      };
      const estado = notas.final ? (parseFloat(notas.final) >= 10 ? "Aprobado" : "Reprobado") : "Pendiente";
      
      return {
        ...materia,
        notas,
        estado
      };
    });
  };

  const generarObservaciones = (promocion, promedio) => {
    switch(promocion) {
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
  
  return {
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
};

// Función para simular notas de ejemplo (opcional)
export const generarNotasEjemplo = () => {
  const notas = {};
  
  // IDs de estudiantes del ejemplo
  const estudiantesIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const materiasIds = ["DAN-101", "DAN-102", "DAN-103", "DAN-201", "DAN-202", "DAN-203"];
  
  estudiantesIds.forEach(estId => {
    notas[estId] = {};
    
    materiasIds.forEach(matId => {
      // Generar notas aleatorias entre 5 y 20
      const t1 = (Math.random() * 15 + 5).toFixed(1);
      const t2 = (Math.random() * 15 + 5).toFixed(1);
      const t3 = (Math.random() * 15 + 5).toFixed(1);
      const final = ((parseFloat(t1) + parseFloat(t2) + parseFloat(t3)) / 3).toFixed(1);
      
      notas[estId][matId] = {
        t1,
        t2,
        t3,
        final
      };
    });
  });
  
  return notas;
};