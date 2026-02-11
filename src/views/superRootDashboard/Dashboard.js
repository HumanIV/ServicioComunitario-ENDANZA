import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CContainer,
  CSpinner,
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilPlus, cilSchool, cilUser, cilAddressBook, cilExternalLink, cilChevronBottom } from '@coreui/icons'

// Componentes
import StatsWidgets from './components/widgets/statsWidgets'
import TeacherSectionsList from './components/TeacherSectionsList'
import PeriodoInscripcionModal from './components/modals/periodoInscripcionModal'
import SubidaNotasModal from './components/modals/subidaNotasModal'
import SystemMessageModal from '../../components/SystemMessageModal'

// Hook y servicios
import useSuperRootData from './hooks/userSuperRootData'
import { addAcademicYear, getAvailableYears } from '../../services/schedules'

export const SuperRootDashboard = () => {
  const navigate = useNavigate()
  const [currentYear, setCurrentYear] = useState('')
  const [availableYears, setAvailableYears] = useState([])

  const {
    periodoInscripcion,
    periodoSubidaNotas,
    usuarios,
    repsCount,
    students,
    sections,
    loading,
    visiblePeriodoInscripcion,
    setVisiblePeriodoInscripcion,
    visibleSubidaNotas,
    setVisibleSubidaNotas,
    guardarPeriodoInscripcion,
    guardarPeriodoSubidaNotas
  } = useSuperRootData()

  const [messageModal, setMessageModal] = useState({
    visible: false,
    title: '',
    message: '',
    variant: 'alert',
    type: 'info',
    onConfirm: null
  })

  useEffect(() => {
    fetchYears()
  }, [])

  const fetchYears = async () => {
    try {
      const years = await getAvailableYears()
      setAvailableYears(years)
      if (years.length > 0 && !currentYear) setCurrentYear(years[0])
    } catch (error) {
      console.error("Error fetching years:", error)
    }
  }

  const checkCanCreateYear = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentCalendarYear = now.getFullYear()

    if (currentMonth !== 8) {
      return {
        allowed: false,
        reason: 'La apertura de nuevos ciclos académicos solo está permitida durante el mes de Septiembre.'
      }
    }

    const lastCreated = localStorage.getItem('last_academic_year_creation_calendar_year')
    if (lastCreated === currentCalendarYear.toString()) {
      return {
        allowed: false,
        reason: 'El ciclo académico para este periodo ya ha sido aperturado previamente.'
      }
    }
    return { allowed: true }
  }

  const confirmCreateYear = async () => {
    closeMessageModal()
    if (!currentYear) return

    const [start, end] = currentYear.split('-').map(Number);
    const nextYear = `${start + 1}-${end + 1}`;

    try {
      await addAcademicYear(nextYear)
      localStorage.setItem('last_academic_year_creation_calendar_year', new Date().getFullYear().toString())
      await fetchYears()

      setTimeout(() => {
        showSystemMessage('¡Éxito!', `Ciclo ${nextYear} creado y aperturado correctamente.`, 'success')
      }, 300)
    } catch (e) {
      setTimeout(() => {
        showSystemMessage('Error', 'No se pudo crear el ciclo: ' + e.message, 'error')
      }, 300)
    }
  }

  const handleCreateNextYear = () => {
    const validation = checkCanCreateYear()
    if (!validation.allowed) {
      showSystemMessage('Apertura Bloqueada', validation.reason, 'warning')
      return
    }

    if (!currentYear) return

    const [start, end] = currentYear.split('-').map(Number);
    const nextYear = `${start + 1}-${end + 1}`;

    showSystemMessage(
      'Confirmar Nuevo Ciclo',
      `¿Desea aperturar oficialmente el nuevo Ciclo Académico ${nextYear}? Esta acción preparará el sistema para el nuevo periodo.`,
      'info',
      'confirm',
      confirmCreateYear
    )
  }

  const closeMessageModal = () => {
    setMessageModal(prev => ({ ...prev, visible: false }))
  }

  const showSystemMessage = (title, message, type = 'info', variant = 'alert', onConfirm = null) => {
    setMessageModal({
      visible: true,
      title,
      message,
      type,
      variant,
      onConfirm
    })
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light-custom">
        <CSpinner color="primary" variant="grow" />
      </div>
    )
  }

  return (
    <CContainer fluid className="px-0 pb-5 overflow-hidden">
      {/* HEADER REFINADO */}
      <div className="mb-4 mb-md-5 mt-4 px-3 px-md-4">
        <CRow className="align-items-center g-3">
          <CCol xs={12} lg={7}>
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded-4 me-3 d-flex align-items-center justify-content-center shadow-orange flex-shrink-0" style={{ width: '56px', height: '56px' }}>
                <CIcon icon={cilSpeedometer} className="text-white" size="xl" />
              </div>
              <div className="overflow-hidden">
                <h2 className="fw-black mb-0 header-title-custom ls-tight display-6 fs-3 fs-md-2">Consola SuperRoot</h2>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="text-muted-custom fw-medium small">Gestión Administrativa de</span>
                  <span className="text-primary fw-bold px-2 py-0 rounded bg-orange-soft small">ENDANZA</span>
                </div>
              </div>
            </div>
          </CCol>
          <CCol xs={12} lg={5} className="d-flex justify-content-lg-end align-items-center gap-2 flex-wrap flex-md-nowrap">
            <CDropdown className="cycle-dropdown">
              <CDropdownToggle
                className="bg-glass-premium border border-light-custom border-opacity-10 fw-bold text-primary-header small d-flex align-items-center px-3 py-2 rounded-pill hover-lift shadow-none"
              >
                <CIcon icon={cilSchool} className="me-2 text-primary" />
                <span>CICLO {currentYear}</span>
                <CIcon icon={cilChevronBottom} className="ms-2 opacity-50" size="sm" />
              </CDropdownToggle>
              <CDropdownMenu className="cycle-dropdown-menu">
                {availableYears.map(year => (
                  <CDropdownItem
                    key={year}
                    onClick={() => setCurrentYear(year)}
                    className={`cycle-dropdown-item ${currentYear === year ? 'active' : ''}`}
                  >
                    Período {year}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>

            <CButton
              color="primary"
              className="rounded-pill px-4 py-2 fw-bold text-white shadow-sm d-flex align-items-center btn-premium"
              onClick={handleCreateNextYear}
              style={{ height: '42px' }}
            >
              <CIcon icon={cilPlus} className="me-2" size="sm" />
              <span className="text-nowrap">NUEVA GESTIÓN</span>
            </CButton>
          </CCol>
        </CRow>
      </div>

      <div className="px-3 px-md-4">
        {/* WIDGETS DE ESTADÍSTICAS */}
        <StatsWidgets
          students={students}
          repsCount={repsCount}
          periodoInscripcion={periodoInscripcion}
          periodoSubidaNotas={periodoSubidaNotas}
          onOpenPeriodoInscripcion={() => setVisiblePeriodoInscripcion(true)}
          onOpenSubidaNotas={() => setVisibleSubidaNotas(true)}
        />

        <CRow className="gy-4">
          <CCol xs={12} lg={8}>
            <TeacherSectionsList sections={sections} />
          </CCol>

          <CCol xs={12} lg={4}>
            {/* PANEL DE USUARIOS REFINADO */}
            <CCard className="premium-card border-0 shadow-sm overflow-hidden h-100 bg-glass-premium" style={{ borderRadius: '24px' }}>
              <CCardHeader className="bg-transparent border-0 pt-4 px-4 pb-0">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h5 className="fw-bold header-title-custom d-flex align-items-center mb-0">
                    <CIcon icon={cilUser} className="me-2 text-primary" />
                    Accesos
                  </h5>
                  <CBadge color="primary" className="bg-opacity-10 text-primary rounded-pill px-2 py-1">
                    {usuarios.length} TOTAL
                  </CBadge>
                </div>
              </CCardHeader>
              <CCardBody className="px-4 py-4">
                <div className="d-flex flex-column gap-2 mb-4">
                  {usuarios.slice(0, 5).map(u => (
                    <div key={u.id} className="d-flex align-items-center p-3 rounded-4 bg-light-custom bg-opacity-25 border border-light-custom border-opacity-10 hover-lift-subtle shadow-xs">
                      <div className="bg-orange-soft rounded-circle me-3 d-flex align-items-center justify-content-center text-primary fw-bold flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                        {u.nombre[0]}
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="fw-bold header-title-custom text-truncate small">{u.nombre}</div>
                        <div className="text-muted-custom text-truncate" style={{ fontSize: '0.7rem' }}>{u.rol.toUpperCase()}</div>
                      </div>
                      {u.activo ? (
                        <span className="badge-dot bg-success"></span>
                      ) : (
                        <span className="badge-dot bg-danger"></span>
                      )}
                    </div>
                  ))}
                </div>

                <CButton
                  className="w-100 rounded-pill fw-bold py-3 btn-orange-outline d-flex align-items-center justify-content-center"
                  onClick={() => navigate('/users')}
                >
                  GESTIONAR TODOS LOS USUARIOS
                  <CIcon icon={cilExternalLink} className="ms-2" size="sm" />
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>

      {/* MODALES */}
      <PeriodoInscripcionModal
        visible={visiblePeriodoInscripcion}
        onClose={() => setVisiblePeriodoInscripcion(false)}
        periodoInscripcion={periodoInscripcion}
        onSave={guardarPeriodoInscripcion}
      />

      <SubidaNotasModal
        visible={visibleSubidaNotas}
        onClose={() => setVisibleSubidaNotas(false)}
        periodoSubida={periodoSubidaNotas}
        onSave={guardarPeriodoSubidaNotas}
      />

      <SystemMessageModal
        visible={messageModal.visible}
        onClose={closeMessageModal}
        onConfirm={messageModal.onConfirm}
        variant={messageModal.variant}
        type={messageModal.type}
        title={messageModal.title}
        message={messageModal.message}
      />
    </CContainer >
  )
}

export default SuperRootDashboard