import React from 'react';
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CBadge
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilEducation,
  cilChartPie,
  cilChartLine,
  cilFile
} from "@coreui/icons";

export const ResumenSeccion = ({
  gradoSeleccionado,
  estudiantesUnicos = [],
  promediosCache = {},
  calculos,
  estudiantesSeleccionados
}) => {
  // ============================================
  // DATOS QUEMADOS PARA PRUEBAS
  // ============================================
  const datosQuemados = {
    estadisticas: {
      total: 5,
      aprobados: 0,
      pendientes: 5,
      seleccionados: 0
    }
  };

  // Usar datos quemados si no hay datos reales
  const usarDatosQuemados = estudiantesUnicos.length === 0 || !calculos;

  // Calcular estadísticas de la sección
  const stats = React.useMemo(() => {
    if (usarDatosQuemados) return datosQuemados.estadisticas;

    // Si hay estudiantes seleccionados, usar esa cantidad
    const seleccionadosCount = estudiantesSeleccionados ? estudiantesSeleccionados.size : 0;

    return {
      total: estudiantesUnicos.length,
      aprobados: estudiantesUnicos.filter(est => {
        const prom = promediosCache[est.id];
        return prom && parseFloat(prom) >= 10;
      }).length,
      pendientes: estudiantesUnicos.filter(est => {
        const prom = promediosCache[est.id];
        return !prom;
      }).length,
      seleccionados: seleccionadosCount
    };
  }, [estudiantesUnicos, promediosCache, estudiantesSeleccionados]);


  return (
    <div className="mb-4">
      <div className="p-3 bg-orange-soft text-primary border-0 rounded-top d-flex align-items-center">
        <CIcon icon={cilChartPie} className="me-2" />
        <h6 className="mb-0 fw-bold">Resumen de Sección</h6>
      </div>
      <CCard className="border-0 shadow-sm rounded-bottom rounded-0 overflow-hidden">
        <CCardBody className="p-4 bg-light bg-opacity-50">
          {usarDatosQuemados ? (
            <div className="text-center text-muted py-3">
              No hay datos suficientes para generar el resumen
            </div>
          ) : (
            <CRow className="g-3">
              <CCol md={3}>
                <div className="bg-white p-3 rounded-3 border border-warning h-100 text-center shadow-sm">
                  <div className="text-muted small fw-bold text-uppercase ls-1 mb-2">Total Estudiantes</div>
                  <h2 className="text-warning mb-0 fw-bold">{stats.total}</h2>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="bg-white p-3 rounded-3 border border-success h-100 text-center shadow-sm">
                  <div className="text-muted small fw-bold text-uppercase ls-1 mb-2">Aprobados</div>
                  <h2 className="text-success mb-0 fw-bold">{stats.aprobados}</h2>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="bg-white p-3 rounded-3 border border-secondary h-100 text-center shadow-sm">
                  <div className="text-muted small fw-bold text-uppercase ls-1 mb-2">Pendientes</div>
                  <h2 className="text-secondary mb-0 fw-bold">{stats.pendientes}</h2>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="bg-white p-3 rounded-3 border border-primary h-100 text-center shadow-sm position-relative overflow-hidden">
                  <div className="text-muted small fw-bold text-uppercase ls-1 mb-2">Seleccionados</div>
                  <h2 className="text-primary mb-0 fw-bold position-relative z-1">{stats.seleccionados}</h2>

                  {/* Barra de progreso sutil de fondo */}
                  <div className="position-absolute bottom-0 start-0 w-100 bg-light" style={{ height: '6px' }}>
                    <div
                      className="bg-primary h-100 transition-width"
                      style={{ width: `${(stats.seleccionados / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CCol>
            </CRow>
          )}
        </CCardBody>
      </CCard>

      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .transition-width { transition: width 0.3s ease; }
      `}</style>
    </div>
  );
};