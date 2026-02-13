import React from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilSchool, cilCalendar, cilPencil } from '@coreui/icons'

const StatsWidgets = ({ 
  students = [], 
  repsCount = 0,
  periodoInscripcion,
  periodoSubidaNotas,
  onOpenPeriodoInscripcion,
  onOpenSubidaNotas 
}) => {
  
  // Estadísticas base (sin depender de datos reales)
  const stats = [
    {
      title: 'ESTUDIANTES',
      value: students.length || 0, // Si está vacío, muestra 0
      icon: cilUser,
      color: 'primary',
      bgColor: 'bg-orange-soft'
    },
    {
      title: 'REPRESENTANTES',
      value: repsCount,
      icon: cilSchool,
      color: 'primary',
      bgColor: 'bg-orange-soft'
    },
    {
      title: 'INSCRIPCIONES',
      value: periodoInscripcion.activo ? 'ABIERTO' : 'CERRADO',
      icon: cilCalendar,
      color: 'primary',
      bgColor: 'bg-orange-soft',
      action: onOpenPeriodoInscripcion
    },
    {
      title: 'SUBIDA NOTAS',
      value: periodoSubidaNotas.activo ? 'ABIERTO' : 'CERRADO',
      icon: cilPencil,
      color: 'primary',
      bgColor: 'bg-orange-soft',
      action: onOpenSubidaNotas
    }
  ]

  return (
    <CRow className="g-3 mb-4">
      {stats.map((stat, index) => (
        <CCol xs={6} lg={3} key={index}>
          <CCard 
            className={`premium-card border-0 shadow-sm h-100 ${stat.action ? 'cursor-pointer hover-lift' : ''}`}
            style={{ borderRadius: '24px', backgroundColor: 'rgba(224, 122, 0, 0.02)' }}
            onClick={stat.action}
          >
            <CCardBody className="p-4">
              <div className="d-flex align-items-center">
                <div className={`${stat.bgColor} rounded-3 p-3 me-3`}>
                  <CIcon icon={stat.icon} className="text-primary" size="xl" />
                </div>
                <div>
                  <h6 className="text-muted-custom small fw-bold mb-1 ls-1">{stat.title}</h6>
                  <h3 className="fw-black header-title-custom mb-0">{stat.value}</h3>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  )
}

export default StatsWidgets