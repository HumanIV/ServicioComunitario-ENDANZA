import React from 'react'
import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const ValidacionChart = ({ chartRef }) => {
  return (
    <CCard className="premium-card border-0 h-100">
      <CCardHeader className="bg-orange-soft border-0 py-3 fw-bold">Actividad de Validación - Últimos 6 meses</CCardHeader>
      <CCardBody>
        <CChartLine
          ref={chartRef}
          data={{
            labels: ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [
              {
                label: 'Notas Aprobadas',
                borderColor: 'rgba(32,201,151,0.9)',
                backgroundColor: 'rgba(32,201,151,0.2)',
                tension: 0.4,
                fill: true,
                data: [45, 52, 48, 55, 58, 62],
              },
              {
                label: 'Notas Pendientes',
                borderColor: 'rgba(255,193,7,0.9)',
                backgroundColor: 'rgba(255,193,7,0.2)',
                tension: 0.4,
                fill: true,
                data: [12, 15, 10, 8, 6, 5],
              },
            ],
          }}
          options={{
            scales: {
              x: { ticks: { color: getStyle('--cui-body-color') } },
              y: { ticks: { color: getStyle('--cui-body-color') } },
            },
          }}
        />
      </CCardBody>
    </CCard>
  )
}

export default ValidacionChart