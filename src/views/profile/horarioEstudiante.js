import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CContainer,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CSpinner,
  CAlert,
  CButton
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendar, cilWarning, cilArrowLeft } from "@coreui/icons"

// Importar componentes
import EncabezadoEstudiante from './components/horario/encabezadoEstudiante'
import ControlesVista from './components/horario/controlesVista'
import NavegacionDias from './components/horario/navegacionDias'
import ListaClasesDia from './components/horario/listaClasesDia'
import VistaSemanal from './components/horario/vistaSemanal'
import InformacionAdicional from './components/horario/informacionAdicional'

// Importar servicios  
import { getHorarioEstudiante } from 'src/services/horarioService'

// Importar utilidades
import { generarPDFHorario } from './components/horario/utils/pdfGenerator'
import { calcularHorasDia } from './components/horario/utils/helpers'

// Datos de días (estos sí pueden ser estáticos)
const diasSemana = [
  { id: 'LUNES', nombre: 'Lunes', color: 'primary' },
  { id: 'MARTES', nombre: 'Martes', color: 'success' },
  { id: 'MIERCOLES', nombre: 'Miércoles', color: 'warning' },
  { id: 'JUEVES', nombre: 'Jueves', color: 'info' },
  { id: 'VIERNES', nombre: 'Viernes', color: 'danger' }
]

const HorarioUsuario = () => {
  const { id } = useParams(); // Cambiado de estudianteId a id para coincidir con la ruta
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [horarioData, setHorarioData] = useState(null)
  const [activeDay, setActiveDay] = useState('LUNES')
  const [toasts, setToasts] = useState([])
  const [modoVista, setModoVista] = useState('diario')

  // Validar que hay un ID
  useEffect(() => {
    if (!id) {
      setError('No se especificó el estudiante');
      setLoading(false);
      return;
    }
  }, [id]);

  // Cargar datos del horario
  useEffect(() => {
    const cargarHorario = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        console.log(`🔄 Cargando horario para estudiante ID: ${id}`);
        const data = await getHorarioEstudiante(id);
        
        setHorarioData(data);
        showToast('success', '✅ Horario cargado correctamente');
        
      } catch (err) {
        console.error('❌ Error cargando horario:', err);
        setError(err.message || 'Error al cargar el horario');
        showToast('danger', '❌ Error al cargar el horario');
      } finally {
        setLoading(false);
      }
    };

    cargarHorario();
  }, [id]);

  const showToast = useCallback((type, message) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const handleGenerarPDF = useCallback(() => {
    if (!horarioData) return;
    
    showToast('info', 'Generando horario institucional...')
    try {
      generarPDFHorario(horarioData, diasSemana, () => {
        showToast('success', '✅ Horario descargado correctamente')
      })
    } catch (error) {
      console.error('Error generando PDF:', error);
      showToast('danger', '❌ Error al generar el PDF')
    }
  }, [horarioData, showToast])

  const handleImprimir = () => {
    showToast('info', 'Preparando vista de impresión...')
    setTimeout(() => {
      window.print()
    }, 500)
  }

  const calcularHorasDelDia = useCallback((dia) => {
    if (!horarioData) return 0;
    return calcularHorasDia(horarioData.horarioCompleto, dia)
  }, [horarioData])

  // Si no hay ID, mostrar mensaje de error con botón para volver
  if (!id) {
    return (
      <CContainer className="py-5">
        <CAlert color="warning" className="text-center border-0 shadow-sm">
          <CIcon icon={cilWarning} size="xl" className="mb-3" />
          <h4 className="fw-bold">Estudiante no especificado</h4>
          <p className="mb-4">No se ha proporcionado un ID de estudiante válido.</p>
          <CButton 
            color="primary" 
            className="rounded-pill px-4"
            onClick={() => navigate('/inicio-horarios')}
          >
            <CIcon icon={cilArrowLeft} className="me-2" />
            Volver a Horarios
          </CButton>
        </CAlert>
      </CContainer>
    )
  }

  if (loading) {
    return (
      <CContainer className="py-5 text-center">
        <div className="p-5 loading-spinner-bg rounded-circle d-inline-flex mb-4">
          <CSpinner color="warning" variant="grow" size="xl" />
        </div>
        <h3 className="fw-bold loading-text mb-2">Cargando Horario del Estudiante</h3>
        <p className="loading-subtext small text-uppercase ls-1">Consultando sistema académico</p>
      </CContainer>
    )
  }

  if (error || !horarioData) {
    return (
      <CContainer className="py-5">
        <CAlert color="danger" className="text-center border-0 shadow-sm">
          <CIcon icon={cilWarning} size="xl" className="mb-3" />
          <h4 className="fw-bold">Error al cargar el horario</h4>
          <p>{error || 'No se pudo obtener la información del horario'}</p>
          <p className="small">Verifique que el estudiante esté inscrito en una sección</p>
          <CButton 
            color="primary" 
            className="rounded-pill px-4 mt-3"
            onClick={() => navigate('/inicio-horarios')}
          >
            <CIcon icon={cilArrowLeft} className="me-2" />
            Volver a Horarios
          </CButton>
        </CAlert>
      </CContainer>
    )
  }

  // Verificar si hay clases
  const tieneClases = Object.values(horarioData.horarioCompleto).some(
    clases => clases.length > 0
  );

  if (!tieneClases) {
    return (
      <CContainer className="py-4 pb-5">
        <EncabezadoEstudiante
          estudiante={horarioData.estudiante}
          estadisticas={horarioData.estadisticas}
        />
        <CAlert color="info" className="text-center border-0 shadow-sm mt-4">
          <h5 className="fw-bold mb-2">Sin Horario Asignado</h5>
          <p className="mb-0">El estudiante no tiene clases programadas en este período.</p>
          <CButton 
            color="primary" 
            className="rounded-pill px-4 mt-3"
            onClick={() => navigate('/inicio-horarios')}
          >
            <CIcon icon={cilArrowLeft} className="me-2" />
            Volver a Horarios
          </CButton>
        </CAlert>
      </CContainer>
    )
  }

  return (
    <CContainer className="py-4 pb-5">
      <EncabezadoEstudiante
        estudiante={horarioData.estudiante}
        estadisticas={horarioData.estadisticas}
      />

      <ControlesVista
        modoVista={modoVista}
        setModoVista={setModoVista}
        onDescargarPDF={handleGenerarPDF}
        onImprimir={handleImprimir}
      />

      {modoVista === 'diario' ? (
        <div className="animate__animated animate__fadeIn">
          <NavegacionDias
            diasSemana={diasSemana}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            calcularHorasDia={calcularHorasDelDia}
          />

          <div className="mt-4">
            {diasSemana.map(dia => (
              <div
                key={dia.id}
                className={`tab-pane fade ${activeDay === dia.id ? 'show active' : 'd-none'}`}
              >
                <ListaClasesDia
                  dia={dia}
                  clases={horarioData.horarioCompleto[dia.id] || []}
                  estudiante={horarioData.estudiante}
                  colorDia={dia.color}
                  horasDia={calcularHorasDelDia(dia.id)}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate__animated animate__fadeIn">
          <VistaSemanal
            diasSemana={diasSemana}
            horarioCompleto={horarioData.horarioCompleto}
          />
        </div>
      )}

      <InformacionAdicional
        profesores={horarioData.profesores}
      />

      <div className="text-center py-5 mt-4 border-top">
        <small className="loading-subtext opacity-50 text-uppercase ls-1">
          <CIcon icon={cilCalendar} className="me-2" />
          Escuela de Danza Endanza • Gestión de Horarios
        </small>
      </div>

      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast
            key={t.id}
            visible
            color={t.type}
            className="border-0 shadow-lg"
          >
            <CToastHeader closeButton className="bg-transparent text-white border-0">
              <strong className="me-auto">Sistema de Horarios</strong>
            </CToastHeader>
            <CToastBody className="fw-bold">{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </CContainer>
  )
}

export default HorarioUsuario