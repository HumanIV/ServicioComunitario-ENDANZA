// hooks/useCalculos.js
import { useCallback } from 'react';

export const useCalculos = (notasCargadas) => {
  // Memoizar cálculos de promedios
  const calcularPromedioEstudiante = useCallback((estudianteId) => {
    const notasEstudiante = notasCargadas[estudianteId];
    if (!notasEstudiante) return null;

    const notasFinales = [];
    
    // Usar for...in para mejor performance
    for (const materiaId in notasEstudiante) {
      const materiaNotas = notasEstudiante[materiaId];
      if (materiaNotas?.final && !isNaN(parseFloat(materiaNotas.final))) {
        notasFinales.push(parseFloat(materiaNotas.final));
      }
    }

    return notasFinales.length > 0 
      ? (notasFinales.reduce((acc, nota) => acc + nota, 0) / notasFinales.length).toFixed(1)
      : null;
  }, [notasCargadas]);

  const determinarPromocion = useCallback((promedio) => {
    if (promedio === null) return "Pendiente";
    const num = parseFloat(promedio);
    if (num >= 16) return "Excelente";
    if (num >= 13) return "Bueno";
    if (num >= 10) return "Aprobado";
    return "Reprobado";
  }, []);

  const getColorEstado = useCallback((estado) => {
    switch(estado) {
      case "Excelente": return "success";
      case "Bueno": return "info";
      case "Aprobado": return "warning";
      case "Reprobado": return "danger";
      default: return "secondary";
    }
  }, []);

  const getColorNota = useCallback((nota) => {
    if (!nota) return "secondary";
    const num = parseFloat(nota);
    if (num >= 16) return "success";
    if (num >= 13) return "info";
    if (num >= 10) return "warning";
    return "danger";
  }, []);

  return {
    calcularPromedioEstudiante,
    determinarPromocion,
    getColorEstado,
    getColorNota
  };
};