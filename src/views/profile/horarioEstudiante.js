// HorarioUsuario.js (versión completa)
import React, { useState, useEffect, useCallback } from 'react'
import {
  CContainer,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CSpinner,
  CCardFooter
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar } from "@coreui/icons"

// Importar componentes
import EncabezadoEstudiante from './components/horario/encabezadoEstudiante'
import ControlesVista from './components/horario/controlesVista'
import NavegacionDias from './components/horario/navegacionDias'
import ListaClasesDia from './components/horario/listaClasesDia'
import VistaSemanal from './components/horario/vistaSemanal'
import InformacionAdicional from './components/horario/informacionAdicional'

// Importar datos y utilidades
import { horarioUsuario, diasSemana } from './components/data'
import { generarPDFHorario } from './components/horario/utils/pdfGenerator'
import { calcularHorasDia } from './components/horario/utils/helpers'

const HorarioUsuario = () => {
  const [loading, setLoading] = useState(true)
  const [activeDay, setActiveDay] = useState('LUNES')
  const [toasts, setToasts] = useState([])
  const [modoVista, setModoVista] = useState('diario')

  useEffect(() => {
    setLoading(true)
    // Simular carga de datos del servidor
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])

  // Función para mostrar notificaciones toast
  const showToast = useCallback((type, message) => {
    const id = Date.now()
    const newToast = { id, type, message }
    setToasts(prev => [...prev, newToast])
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  // Función para generar PDF usando la utilidad
  const handleGenerarPDF = useCallback(() => {
    showToast('info', 'Generando horario en PDF...')
    
    try {
      generarPDFHorario(horarioUsuario, diasSemana, () => {
        showToast('success', 'Horario descargado correctamente')
      })
    } catch (error) {
      console.error('Error generando PDF:', error)
      showToast('danger', 'Error al generar el PDF')
    }
  }, [showToast])

  // Función para imprimir horario
  const handleImprimir = () => {
    showToast('info', 'Preparando para imprimir...')
    setTimeout(() => {
      window.print()
      showToast('success', 'Listo para imprimir')
    }, 500)
  }

  // Función wrapper para calcular horas del día
  const calcularHorasDelDia = useCallback((dia) => {
    return calcularHorasDia(horarioUsuario.horarioCompleto, dia)
  }, [])

  // Renderizar loading
  if (loading) {
    return (
      <CContainer className="py-5 text-center">
        <CSpinner color="primary" size="lg" />
        <h4 className="mt-3 text-primary">Cargando tu horario...</h4>
        <p className="text-muted">Obteniendo información actualizada</p>
      </CContainer>
    )
  }

  return (
    <CContainer className="py-4">
      {/* Encabezado con información del estudiante */}
      <EncabezadoEstudiante 
        estudiante={horarioUsuario.estudiante}
        estadisticas={horarioUsuario.estadisticas}
      />
      
      {/* Controles de vista y acciones */}
      <ControlesVista 
        modoVista={modoVista}
        setModoVista={setModoVista}
        onDescargarPDF={handleGenerarPDF}
        onImprimir={handleImprimir}
      />

      {/* Vista según modo seleccionado */}
      {modoVista === 'diario' ? (
        <>
          {/* Navegación por días de la semana */}
          <NavegacionDias 
            diasSemana={diasSemana}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            calcularHorasDia={calcularHorasDelDia}
          />
          
          {/* Contenido del día seleccionado */}
          <div className="tab-content">
            {diasSemana.map(dia => (
              <div 
                key={dia.id} 
                className={`tab-pane fade ${activeDay === dia.id ? 'show active' : ''}`}
              >
                <ListaClasesDia 
                  dia={dia}
                  clases={horarioUsuario.horarioCompleto[dia.id] || []}
                  estudiante={horarioUsuario.estudiante}
                  colorDia={dia.color}
                  horasDia={calcularHorasDelDia(dia.id)}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Vista semanal completa */
        <VistaSemanal 
          diasSemana={diasSemana}
          horarioCompleto={horarioUsuario.horarioCompleto}
        />
      )}

      {/* Información adicional (profesores, recordatorios) */}
      <InformacionAdicional 
        profesores={horarioUsuario.profesores}
      />

      {/* Pie de página */}
      <CCardFooter className="text-center text-muted small mt-4">
        <CIcon icon={cilCalendar} className="me-1" />
        Este horario es oficial y está sujeto a cambios. Cualquier modificación será notificada.
      </CCardFooter>

      {/* Sistema de notificaciones toast */}
      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast 
            key={t.id} 
            visible 
            color={t.type} 
            className="text-white animate__animated animate__fadeInDown"
          >
            <CToastHeader closeButton className="text-white bg-transparent">
              <strong className="me-auto">
                {t.type === 'success' ? '✅ Listo' : 
                 t.type === 'warning' ? '⚠ Atención' : 
                 t.type === 'danger' ? '❌ Error' : 'ℹ Información'}
              </strong>
            </CToastHeader>
            <CToastBody>{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      {/* Estilos CSS adicionales */}
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            
            .card {
              border: 1px solid #dee2e6 !important;
              box-shadow: none !important;
            }
            
            .btn, .nav-tabs, .toast-container {
              display: none !important;
            }
            
            body {
              background-color: white !important;
            }
          }
          
          /* Animación para toasts */
          .animate__animated {
            animation-duration: 0.3s;
          }
          
          /* Estilos para la línea de tiempo */
          .timeline-item {
            position: relative;
          }
          
          .timeline-content:before {
            content: '';
            position: absolute;
            left: -6px;
            top: 0;
            bottom: -20px;
            width: 2px;
            background-color: #dee2e6;
          }
          
          .timeline-item:last-child .timeline-content:before {
            bottom: 0;
          }
          
          /* Mejoras de accesibilidad */
          @media (max-width: 768px) {
            .timeline-time {
              display: none;
            }
            
            .timeline-content {
              border-left: none !important;
              padding-left: 0 !important;
            }
            
            .timeline-content:before {
              display: none;
            }
          }
        `}
      </style>
    </CContainer>
  )
}

export default HorarioUsuario