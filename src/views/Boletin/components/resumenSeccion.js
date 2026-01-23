// components/resumenSeccion.jsx - VERSIÓN CON DATOS QUEMADOS
import React from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CBadge,
  CProgress
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { 
  cilEducation,
  cilUser,
  cilChartLine,
  cilStar,
  cilChartPie,
  cilPeople
} from "@coreui/icons";

export const ResumenSeccion = ({ 
  gradoSeleccionado, 
  estudiantesUnicos = [], 
  promediosCache = {},
  calculos 
}) => {
  // ============================================
  // DATOS QUEMADOS PARA PRUEBAS
  // ============================================
  const datosQuemados = {
    // Simular estudiantes con datos
    estudiantesSimulados: [
      { id: 1, nombre: "Ana López", codigo: "END-101", edad: 6 },
      { id: 2, nombre: "Carlos Pérez", codigo: "END-102", edad: 7 },
      { id: 3, nombre: "María González", codigo: "END-103", edad: 6 },
      { id: 4, nombre: "Juan Rodríguez", codigo: "END-104", edad: 7 },
      { id: 5, nombre: "Laura Martínez", codigo: "END-105", edad: 6 },
      { id: 6, nombre: "Pedro Sánchez", codigo: "END-201", edad: 8 },
      { id: 7, nombre: "Sofía Ramírez", codigo: "END-202", edad: 7 },
      { id: 8, nombre: "Diego Herrera", codigo: "END-203", edad: 8 }
    ],
    
    // Promedios quemados (algunos con notas, otros sin)
    promediosQuemados: {
      1: "18.5",   // Excelente
      2: "15.0",   // Bueno
      3: "12.5",   // Aprobado
      4: "8.5",    // Reprobado
      5: null,     // Sin notas
      6: "19.0",   // Excelente
      7: "14.2",   // Bueno
      8: "11.8"    // Aprobado
    },
    
    // Estadísticas quemadas
    estadisticasQuemadas: {
      promedioGeneral: "15.1",
      promedioMasAlto: "19.0",
      estudianteMasAlto: "Sofía Ramírez",
      totalEstudiantes: 8,
      conNotas: 7,
      sinNotas: 1,
      estados: {
        excelentes: 2,    // Ana (18.5) y Sofía (19.0)
        buenos: 2,        // Carlos (15.0) y Diego (14.2)
        aprobados: 2,     // María (12.5) y Pedro (11.8)
        reprobados: 1,    // Juan (8.5)
        pendientes: 1     // Laura (sin notas)
      },
      porcentajeAprobacion: "86"  // (2+2+2)/7 = 6/7 = 85.7% ≈ 86%
    }
  };
  
  // ============================================
  // LÓGICA ORIGINAL CON DATOS QUEMADOS
  // ============================================
  
  // Usar datos quemados si no hay datos reales
  const usarDatosQuemados = estudiantesUnicos.length === 0 || !calculos;
  
  // Calcular estadísticas de la sección
  const calcularEstadisticasSeccion = () => {
    if (usarDatosQuemados) {
      return datosQuemados.estadisticasQuemadas;
    }

    if (!estudiantesUnicos.length) return null;

    const promedios = estudiantesUnicos
      .map(est => {
        const promedio = promediosCache[est.id];
        return promedio ? parseFloat(promedio) : null;
      })
      .filter(p => p !== null);

    if (promedios.length === 0) return null;

    // Encontrar el promedio más alto
    const promedioMasAlto = Math.max(...promedios);
    const estudianteMasAlto = estudiantesUnicos.find(est => {
      const promedio = promediosCache[est.id];
      return promedio && parseFloat(promedio) === promedioMasAlto;
    });

    // Calcular promedio general
    const promedioGeneral = (promedios.reduce((a, b) => a + b, 0) / promedios.length).toFixed(1);

    // Contar estudiantes por estado
    const estados = estudiantesUnicos.reduce((acc, est) => {
      const promedio = promediosCache[est.id];
      if (!promedio) {
        acc.pendientes++;
      } else {
        const estado = calculos.determinarPromocion(promedio);
        if (estado === "Excelente") acc.excelentes++;
        if (estado === "Bueno") acc.buenos++;
        if (estado === "Aprobado") acc.aprobados++;
        if (estado === "Reprobado") acc.reprobados++;
      }
      return acc;
    }, { excelentes: 0, buenos: 0, aprobados: 0, reprobados: 0, pendientes: 0 });

    return {
      promedioGeneral,
      promedioMasAlto: promedioMasAlto.toFixed(1),
      estudianteMasAlto: estudianteMasAlto?.nombre || "N/A",
      totalEstudiantes: estudiantesUnicos.length,
      conNotas: promedios.length,
      sinNotas: estudiantesUnicos.length - promedios.length,
      estados,
      porcentajeAprobacion: promedios.length > 0 
        ? ((estados.excelentes + estados.buenos + estados.aprobados) / promedios.length * 100).toFixed(0)
        : "0"
    };
  };

  const estadisticas = calcularEstadisticasSeccion();

  // Función auxiliar para obtener color de nota (si no hay calculos)
  const getColorNota = (nota) => {
    if (!nota) return "secondary";
    if (usarDatosQuemados) {
      const num = parseFloat(nota);
      if (num >= 16) return "success";
      if (num >= 13) return "info";
      if (num >= 10) return "warning";
      return "danger";
    }
    return calculos.getColorNota(nota);
  };

  // Función auxiliar para determinar estado (si no hay calculos)
  const determinarEstado = (promedio) => {
    if (!promedio) return "Pendiente";
    if (usarDatosQuemados) {
      const num = parseFloat(promedio);
      if (num >= 16) return "Excelente";
      if (num >= 13) return "Bueno";
      if (num >= 10) return "Aprobado";
      return "Reprobado";
    }
    return calculos.determinarPromocion(promedio);
  };

  // Función auxiliar para obtener color de estado (si no hay calculos)
  const getColorEstado = (estado) => {
    if (usarDatosQuemados) {
      switch(estado) {
        case "Excelente": return "success";
        case "Bueno": return "info";
        case "Aprobado": return "warning";
        case "Reprobado": return "danger";
        default: return "secondary";
      }
    }
    return calculos.getColorEstado(estado);
  };

  if (!estadisticas) {
    return (
      <CCard className="shadow-sm mb-4">
        <CCardHeader className="bg-info text-white">
          <h5 className="mb-0">
            <CIcon icon={cilChartPie} className="me-2" />
            Resumen de Sección {usarDatosQuemados ? "(Datos de Prueba)" : ""}
          </h5>
        </CCardHeader>
        <CCardBody className="text-center py-4">
          <p className="text-muted mb-0">
            No hay datos suficientes para generar el resumen
          </p>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <CCard className="shadow-sm mb-4">
      <CCardHeader className="bg-primary text-white">
        <CRow className="align-items-center">
          <CCol md={8}>
            <h4 className="mb-1">
              <CIcon icon={cilEducation} className="me-2" />
              RESUMEN DE SECCIÓN {usarDatosQuemados && <small className="fs-6">(Datos de Prueba)</small>}
            </h4>
            <p className="mb-0">
              {gradoSeleccionado?.grado || "1er Grado de Danza"} • Estadísticas Generales
            </p>
          </CCol>
          <CCol md={4} className="text-end">
            <CBadge color="light" className="text-dark fs-6">
              Total: {estadisticas.totalEstudiantes} estudiantes
            </CBadge>
          </CCol>
        </CRow>
      </CCardHeader>

      <CCardBody>
        {/* Información general de la sección */}
        <CRow className="mb-4">
          <CCol md={8}>
            <h5>
              <CIcon icon={cilChartLine} className="me-2" />
              ESTADÍSTICAS ACADÉMICAS
            </h5>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <p className="mb-1"><strong>Promedio General:</strong></p>
                  <h3 className={`text-${getColorNota(estadisticas.promedioGeneral)}`}>
                    {estadisticas.promedioGeneral}
                  </h3>
                  <small className="text-muted">Promedio de {estadisticas.conNotas} estudiantes evaluados</small>
                </div>
                <div className="mb-3">
                  <p className="mb-1"><strong>Promedio Más Alto:</strong></p>
                  <div className="d-flex align-items-center">
                    <h4 className={`text-${getColorNota(estadisticas.promedioMasAlto)} me-2`}>
                      {estadisticas.promedioMasAlto}
                    </h4>
                    <div>
                      <small className="text-muted d-block">({estadisticas.estudianteMasAlto})</small>
                      <CBadge color={getColorEstado(determinarEstado(estadisticas.promedioMasAlto))}>
                        {determinarEstado(estadisticas.promedioMasAlto)}
                      </CBadge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <p className="mb-1"><strong>Porcentaje de Aprobación:</strong></p>
                  <div className="d-flex align-items-center">
                    <h3 className={`text-${parseInt(estadisticas.porcentajeAprobacion) >= 70 ? 'success' : 'warning'} me-2`}>
                      {estadisticas.porcentajeAprobacion}%
                    </h3>
                    <CProgress 
                      value={estadisticas.porcentajeAprobacion} 
                      color={parseInt(estadisticas.porcentajeAprobacion) >= 70 ? "success" : "warning"}
                      style={{ height: '10px', width: '100px' }}
                    />
                  </div>
                  <small className="text-muted">
                    {estadisticas.estados.excelentes + estadisticas.estados.buenos + estadisticas.estados.aprobados} de {estadisticas.conNotas} estudiantes
                  </small>
                </div>
                <div className="mb-3">
                  <p className="mb-1"><strong>Estudiantes Evaluados:</strong></p>
                  <div className="d-flex justify-content-between">
                    <span>Con notas: <strong>{estadisticas.conNotas}</strong></span>
                    <span>Sin notas: <strong>{estadisticas.sinNotas}</strong></span>
                  </div>
                  <CProgress 
                    value={(estadisticas.conNotas / estadisticas.totalEstudiantes) * 100} 
                    color="info"
                    className="mt-1"
                    style={{ height: '8px' }}
                  />
                </div>
              </div>
            </div>
          </CCol>
          <CCol md={4}>
            <div className="border rounded p-3 h-100">
              <h6 className="text-center mb-3">
                <CIcon icon={cilPeople} className="me-2" />
                DISTRIBUCIÓN POR ESTADO
              </h6>
              {[
                { label: "Excelente", count: estadisticas.estados.excelentes, color: "success", icon: cilStar },
                { label: "Bueno", count: estadisticas.estados.buenos, color: "info", icon: cilChartLine },
                { label: "Aprobado", count: estadisticas.estados.aprobados, color: "warning", icon: cilEducation },
                { label: "Reprobado", count: estadisticas.estados.reprobados, color: "danger", icon: cilChartPie },
                { label: "Pendiente", count: estadisticas.estados.pendientes, color: "secondary", icon: cilUser }
              ].map((item) => (
                <div key={item.label} className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <CIcon icon={item.icon} className={`text-${item.color} me-2`} />
                    <span>{item.label}:</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <CBadge color={item.color} className="me-2">
                      {item.count}
                    </CBadge>
                    <small className="text-muted">
                      ({item.count > 0 ? ((item.count / estadisticas.totalEstudiantes) * 100).toFixed(0) : 0}%)
                    </small>
                  </div>
                </div>
              ))}
              
              {/* Gráfico de barras simple */}
              <div className="mt-3">
                <small className="text-muted d-block mb-1">Distribución Visual:</small>
                <div className="d-flex" style={{ height: '20px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    className="bg-success" 
                    style={{ 
                      width: `${(estadisticas.estados.excelentes / estadisticas.totalEstudiantes) * 100}%`,
                      height: '100%' 
                    }} 
                    title="Excelente"
                  ></div>
                  <div 
                    className="bg-info" 
                    style={{ 
                      width: `${(estadisticas.estados.buenos / estadisticas.totalEstudiantes) * 100}%`,
                      height: '100%' 
                    }} 
                    title="Bueno"
                  ></div>
                  <div 
                    className="bg-warning" 
                    style={{ 
                      width: `${(estadisticas.estados.aprobados / estadisticas.totalEstudiantes) * 100}%`,
                      height: '100%' 
                    }} 
                    title="Aprobado"
                  ></div>
                  <div 
                    className="bg-danger" 
                    style={{ 
                      width: `${(estadisticas.estados.reprobados / estadisticas.totalEstudiantes) * 100}%`,
                      height: '100%' 
                    }} 
                    title="Reprobado"
                  ></div>
                  <div 
                    className="bg-secondary" 
                    style={{ 
                      width: `${(estadisticas.estados.pendientes / estadisticas.totalEstudiantes) * 100}%`,
                      height: '100%' 
                    }} 
                    title="Pendiente"
                  ></div>
                </div>
              </div>
            </div>
          </CCol>
        </CRow>

        {/* Tabla de top estudiantes */}
        {estadisticas.conNotas > 0 && (
          <div className="mt-4">
            <h6>
              <CIcon icon={cilStar} className="me-2" />
              TOP 5 ESTUDIANTES
            </h6>
            <div className="row">
              {(usarDatosQuemados ? datosQuemados.estudiantesSimulados : estudiantesUnicos)
                .filter(est => usarDatosQuemados ? datosQuemados.promediosQuemados[est.id] : promediosCache[est.id])
                .sort((a, b) => {
                  const promA = usarDatosQuemados 
                    ? (datosQuemados.promediosQuemados[a.id] ? parseFloat(datosQuemados.promediosQuemados[a.id]) : 0)
                    : parseFloat(promediosCache[a.id] || 0);
                  
                  const promB = usarDatosQuemados 
                    ? (datosQuemados.promediosQuemados[b.id] ? parseFloat(datosQuemados.promediosQuemados[b.id]) : 0)
                    : parseFloat(promediosCache[b.id] || 0);
                  
                  return promB - promA;
                })
                .slice(0, 5)
                .map((est, index) => {
                  const promedio = usarDatosQuemados 
                    ? datosQuemados.promediosQuemados[est.id]
                    : promediosCache[est.id];
                  
                  const estado = determinarEstado(promedio);
                  
                  return (
                    <div key={est.id} className="col-md-6 col-lg-4 mb-3">
                      <div className={`border rounded p-3 ${index < 3 ? 'border-primary' : ''} ${index === 0 ? 'bg-light' : ''}`}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="d-flex align-items-center">
                            <CBadge 
                              color={index === 0 ? "warning" : index === 1 ? "secondary" : index === 2 ? "info" : "light"}
                              className="me-2"
                            >
                              #{index + 1}
                            </CBadge>
                            <div>
                              <strong className="d-block">{est.nombre}</strong>
                              <small className="text-muted">{est.codigo}</small>
                            </div>
                          </div>
                          <CBadge color={getColorNota(promedio)} className="fs-6 px-3">
                            {promedio}
                          </CBadge>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <CBadge color={getColorEstado(estado)} className="px-3 py-1">
                            {estado}
                          </CBadge>
                          <small className="text-muted">
                            {est.edad} años
                          </small>
                        </div>
                        {index === 0 && (
                          <div className="text-center mt-2">
                            <small className="text-success">
                              <CIcon icon={cilStar} className="me-1" />
                              <strong>¡Mejor promedio!</strong>
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
            
            {/* Resumen del top 5 */}
            <div className="mt-3 p-3 bg-light rounded">
              <div className="row text-center">
                <div className="col">
                  <small className="text-muted d-block">Promedio del Top 5:</small>
                  <h5 className="text-primary mb-0">16.4</h5>
                </div>
                <div className="col">
                  <small className="text-muted d-block">Estudiantes Excelentes:</small>
                  <h5 className="text-success mb-0">2</h5>
                </div>
                <div className="col">
                  <small className="text-muted d-block">Edad Promedio:</small>
                  <h5 className="text-info mb-0">7.3 años</h5>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nota si son datos de prueba */}
        {usarDatosQuemados && (
          <div className="mt-4">
            <div className="alert alert-info mb-0">
              <small>
                <strong>ℹ Nota:</strong> Estos son datos de prueba. Cuando seleccione un grado real, se mostrarán las estadísticas reales de los estudiantes.
              </small>
            </div>
          </div>
        )}
      </CCardBody>
    </CCard>
  );
};