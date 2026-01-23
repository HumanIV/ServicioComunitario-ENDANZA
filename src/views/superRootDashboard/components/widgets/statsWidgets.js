import React from 'react'
import { CRow, CCol, CWidgetStatsA, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions, cilClipboard, cilChartLine, cilCalendar, cilUserFollow } from '@coreui/icons'

const StatsWidgets = ({
  notasPendientes,
  boletines,
  periodoInscripcion,
  usuarios,
  onOpenValidacionNotas,
  onOpenControlBoletines,
  onOpenPeriodoInscripcion,
  onOpenGestionAccesos
}) => {
  return (
    <CRow className="mb-4 gy-4">
      {/* Notas Pendientes */}
      <CCol xs={12} md={3}>
        <CWidgetStatsA
          className="shadow-sm cursor-pointer"
          color="warning"
          onClick={onOpenValidacionNotas}
          value={
            <>
              {notasPendientes.filter(n => n.estado === 'pendiente').length}
              <span className="fs-6 fw-normal">
                pendientes
              </span>
            </>
          }
          title="Notas por Validar"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={onOpenValidacionNotas}>Ver todas</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          icon={<CIcon icon={cilClipboard} height={36} />}
        />
      </CCol>

      {/* Boletines */}
      <CCol xs={12} md={3}>
        <CWidgetStatsA
          className="shadow-sm cursor-pointer"
          color="info"
          onClick={onOpenControlBoletines}
          value={
            <>
              {boletines.filter(b => b.disponible).length}
              <span className="fs-6 fw-normal">
                / {boletines.length} disponibles
              </span>
            </>
          }
          title="Boletines Activos"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={onOpenControlBoletines}>Gestionar</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          icon={<CIcon icon={cilChartLine} height={36} />}
        />
      </CCol>

      {/* Inscripciones */}
      <CCol xs={12} md={3}>
        <CWidgetStatsA
          className="shadow-sm cursor-pointer"
          color={periodoInscripcion.activo ? "success" : "secondary"}
          onClick={onOpenPeriodoInscripcion}
          value={
            <>
              {periodoInscripcion.activo ? "Activo" : "Inactivo"}
            </>
          }
          title="Periodo de Inscripciones"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={onOpenPeriodoInscripcion}>Configurar</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          icon={<CIcon icon={cilCalendar} height={36} />}
        />
      </CCol>

      {/* Usuarios Activos */}
      <CCol xs={12} md={3}>
        <CWidgetStatsA
          className="shadow-sm cursor-pointer"
          color="primary"
          onClick={onOpenGestionAccesos}
          value={
            <>
              {usuarios.filter(u => u.activo).length}
              <span className="fs-6 fw-normal">
                usuarios activos
              </span>
            </>
          }
          title="Gestión de Accesos"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={onOpenGestionAccesos}>Administrar</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          icon={<CIcon icon={cilUserFollow} height={36} />}
        />
      </CCol>
    </CRow>
  )
}

export default StatsWidgets