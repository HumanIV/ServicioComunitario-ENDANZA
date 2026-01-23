import React from 'react'
import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const BoletinesChart = ({ boletines }) => {
  return (
    <CCard className="shadow border-0" style={{ borderRadius: '16px' }}>
      <CCardHeader className="fw-bold">Descargas de Boletines - Por Curso</CCardHeader>
      <CCardBody>
        <CChartBar
          data={{
            labels: boletines.map(b => b.curso),
            datasets: [
              {
                label: 'Descargas',
                backgroundColor: boletines.map(b => 
                  b.disponible ? 'rgba(0,123,255,0.7)' : 'rgba(108,117,125,0.5)'
                ),
                data: boletines.map(b => b.descargas),
              },
            ],
          }}
          options={{
            scales: {
              x: { ticks: { color: getStyle('--cui-body-color') } },
              y: { 
                ticks: { color: getStyle('--cui-body-color') },
                beginAtZero: true
              },
            },
          }}
        />
      </CCardBody>
    </CCard>
  )
}

export default BoletinesChart