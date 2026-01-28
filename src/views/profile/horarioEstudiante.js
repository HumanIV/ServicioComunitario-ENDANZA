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
    setTimeout(() => {
      setLoading(false)
    }, 1200)
  }, [])

  const showToast = useCallback((type, message) => {
    const id = Date.now()
    const newToast = { id, type, message }
    setToasts(prev => [...prev, newToast])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const handleGenerarPDF = useCallback(() => {
    showToast('info', 'Generando horario institucional...')
    try {
      generarPDFHorario(horarioUsuario, diasSemana, () => {
        showToast('success', '✅ Horario descargado correctamente')
      })
    } catch (error) {
      showToast('danger', '❌ Error al generar el PDF')
    }
  }, [showToast])

  const handleImprimir = () => {
    showToast('info', 'Preparando vista de impresión...')
    setTimeout(() => {
      window.print()
    }, 500)
  }

  const calcularHorasDelDia = useCallback((dia) => {
    return calcularHorasDia(horarioUsuario.horarioCompleto, dia)
  }, [])

  if (loading) {
    return (
      <CContainer className="py-5 text-center">
        <div className="p-5 bg-orange-soft rounded-circle d-inline-flex mb-4">
          <CSpinner color="primary" variant="grow" size="xl" />
        </div>
        <h3 className="fw-bold text-dark mb-2">Cargando Cronograma Académico</h3>
        <p className="text-muted small text-uppercase ls-1">Sincronizando con el sistema central</p>
      </CContainer>
    )
  }

  return (
    <CContainer className="py-4 pb-5">
      <EncabezadoEstudiante
        estudiante={horarioUsuario.estudiante}
        estadisticas={horarioUsuario.estadisticas}
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
                  clases={horarioUsuario.horarioCompleto[dia.id] || []}
                  estudiante={horarioUsuario.estudiante}
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
            horarioCompleto={horarioUsuario.horarioCompleto}
          />
        </div>
      )}

      <InformacionAdicional
        profesores={horarioUsuario.profesores}
      />

      <div className="text-center py-5 mt-4 border-top">
        <small className="text-muted opacity-50 text-uppercase ls-1">
          <CIcon icon={cilCalendar} className="me-2" />
          Escuela de Danza Endanza • Gestión de Horarios 2024-2025
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

      <style>
        {`
          .ls-1 { letter-spacing: 1.5px; }
          .bg-orange-soft { background-color: rgba(242, 140, 15, 0.1); }
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; }
            .premium-card { border: 1px solid #eee !important; box-shadow: none !important; }
          }
        `}
      </style>
    </CContainer>
  )
}

export default HorarioUsuario