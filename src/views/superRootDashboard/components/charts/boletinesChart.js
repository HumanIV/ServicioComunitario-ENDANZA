import React from 'react'
import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const BoletinesChart = ({ boletines }) => {
  return (
    <CCard className="premium-card border-0 h-100">
      <CCardHeader className="bg-orange-soft border-0 py-3 fw-bold">Estado de Boletines</CCardHeader>
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