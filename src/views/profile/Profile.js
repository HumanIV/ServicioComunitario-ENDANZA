import React, { useEffect, useState, useMemo } from "react"
import {
  CCard,
  CCardFooter,
  CContainer,
  CRow,
  CCol,
  CButton,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CSpinner,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CAlert
} from "@coreui/react"
import { Link, useNavigate } from "react-router-dom"
import CIcon from "@coreui/icons-react"
import {
  cilArrowLeft,
  cilUser,
  cilPhone,
  cilBadge,
  cilMedicalCross,
  cilPencil,
  cilPrint,
  cilCheckCircle
} from "@coreui/icons"

// Componentes
import EditStudentModal from "./components/profile/editModal"
import ProfileSummary from "./components/profile/ProfileSummary"
import ProfileStatsCards from "./components/profile/ProfileStatsCards"
import PersonalInfoTab from "./components/profile/PersonalInfoTab"
import RepresentativeTab from "./components/profile/RepresentativeTab"
import HealthTab from "./components/profile/HealthTab"

const PerfilEstudiantePrivado = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState(null)
  const [activeKey, setActiveKey] = useState(1)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])

  // Datos de ejemplo
  const estudianteEjemplo = {
    id: 1,
    Grado: "5to Grado",
    Seccion: "Danza A",
    NombreEstudiante: "Ana",
    ApellidoEstudiante: "López",
    FechaNacimiento: "15/05/2012",
    Edad: "12 años",
    Sexo: "Femenino",
    TipoSangre: "O+",
    Direccion: "Av. Principal 123, Ciudad",
    Ciudad: "Caracas",
    Estado: "Distrito Capital",
    Telefono: "+1 234-567-8900",
    Email: "ana.lopez@endanza.edu",
    Estatus: "Activo",
    FechaIngreso: "2020-03-10",
    PadreNombre: "José Antonio",
    PadreApellido: "Pérez",
    PadreCedula: "V-98765432",
    PadreTelefono: "+1 234-567-8902",
    PadreEmail: "jose.perez@email.com",
    PadreParentesco: "Padre",
    PadreOcupacion: "Empresario",
    MadreNombre: "María Isabel",
    MadreApellido: "González",
    MadreCedula: "V-12345678",
    MadreTelefono: "+1 234-567-8901",
    MadreEmail: "maria.gonzalez@email.com",
    MadreParentesco: "Madre",
    MadreOcupacion: "Ingeniera",
    NutricionPeso: "32 kg",
    NutricionAltura: "1.35 m",
    NutricionIMC: "17.5 (Normal)",
    NutricionObs: "Buen estado nutricional",
    Alergias: "Ninguna",
    Medicamentos: "Ninguno",
    Enfermedades: "Ninguna",
    Conducta: "Excelente",
    PromedioGeneral: "18.5/20",
    FechaActualizacion: "25/01/2026",
    RepresentanteNombre: "María Isabel",
    RepresentanteApellido: "González",
    RepresentanteCedula: "V-12345678"
  }

  useEffect(() => {
    setTimeout(() => {
      setStudent(estudianteEjemplo)
      setLoading(false)
    }, 800)
  }, [])

  const showToast = (type, title, message) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, title, message, delay: 3000 }])
  }

  const handleEdit = () => setEditModalVisible(true)
  const handlePrint = () => {
    window.print()
    showToast("success", "Imprimir", "Preparando documento...")
  }

  const handleSaveStudent = async (updatedData) => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStudent(prev => ({ ...prev, ...updatedData }))
      showToast("success", "Guardado", "Datos actualizados correctamente")
      setEditModalVisible(false)
    } catch (error) {
      showToast("danger", "Error", "No se pudieron guardar los datos")
    } finally {
      setSaving(false)
    }
  }

  const progreso = useMemo(() => {
    if (!student) return { valor: 0, color: "secondary" }
    const promedio = parseFloat(student.PromedioGeneral)
    if (promedio >= 15) return { valor: 90, color: "success" }
    if (promedio >= 10) return { valor: 60, color: "warning" }
    return { valor: 30, color: "danger" }
  }, [student])

  if (loading) {
    return (
      <CContainer className="py-5 text-center">
        <div className="d-flex justify-content-center mb-3">
          <div className="p-4 bg-orange-soft rounded-circle">
            <CSpinner color="primary" variant="grow" />
          </div>
        </div>
        <h5 className="fw-bold text-dark">Cargando Perfil Estudiantil</h5>
        <p className="mt-2 text-muted small text-uppercase ls-1">Recuperando datos del servidor...</p>
      </CContainer>
    )
  }

  if (!student) return <CAlert color="danger">Error al cargar datos del sistema</CAlert>

  return (
    <CContainer className="py-4 profile-container pb-5 animate__animated animate__fadeIn">
      <CRow className="mb-5 align-items-center no-print">
        <CCol xs={12} md={6}>
          <div className="d-flex align-items-center gap-3">
            <Link to="/inicio" className="btn btn-outline-secondary rounded-circle shadow-sm border-2 profile-back-btn p-2 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
              <CIcon icon={cilArrowLeft} />
            </Link>
            <div>
              <h2 className="mb-0 fw-bold profile-header-title text-uppercase ls-1">Expediente Académico</h2>
              <p className="footer-text small mb-0 text-uppercase ls-1 fw-bold">Gestión Integral del Estudiante</p>
            </div>
          </div>
        </CCol>
        <CCol xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <div className="d-flex justify-content-md-end gap-3">
            <CButton className="btn-premium px-4 d-flex align-items-center" onClick={handleEdit}>
              <CIcon icon={cilPencil} className="me-2" />
              EDITAR DATOS
            </CButton>
            <CButton variant="outline" className="border-2 shadow-sm rounded-pill px-4 fw-bold profile-outline-btn d-flex align-items-center" onClick={handlePrint}>
              <CIcon icon={cilPrint} className="me-2" />
              IMPRIMIR FICHA
            </CButton>
          </div>
        </CCol>
      </CRow>

      <CRow className="mb-4 g-4">
        <CCol xs={12} lg={4}>
          <ProfileSummary student={student} />
        </CCol>
        <CCol xs={12} lg={8}>
          <ProfileStatsCards
            student={student}
            progreso={progreso}
            showToast={showToast}
            setActiveKey={setActiveKey}
            setEditModalVisible={setEditModalVisible}
          />
        </CCol>
      </CRow>

      <div className="mb-5">
        <CTabs activeTabKey={activeKey} onActiveTabKeyChange={setActiveKey}>
          <CNav variant="pills" className="border-0 gap-3 mb-4 justify-content-center justify-content-md-start">
            <CNavItem>
              <CNavLink
                onClick={() => setActiveKey(1)}
                className={`rounded-pill px-4 py-2 border-0 fw-bold transition-all cursor-pointer d-flex align-items-center ${activeKey === 1 ? 'bg-warning text-white shadow-sm' : 'profile-nav-link shadow-sm hover-lift'}`}
              >
                <CIcon icon={cilUser} className="me-2" />
                DATOS PERSONALES
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                onClick={() => setActiveKey(2)}
                className={`rounded-pill px-4 py-2 border-0 fw-bold transition-all cursor-pointer d-flex align-items-center ${activeKey === 2 ? 'bg-warning text-white shadow-sm' : 'profile-nav-link shadow-sm hover-lift'}`}
              >
                <CIcon icon={cilBadge} className="me-2" />
                REPRESENTANTES
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                onClick={() => setActiveKey(4)}
                className={`rounded-pill px-4 py-2 border-0 fw-bold transition-all cursor-pointer d-flex align-items-center ${activeKey === 4 ? 'bg-warning text-white shadow-sm' : 'profile-nav-link shadow-sm hover-lift'}`}
              >
                <CIcon icon={cilMedicalCross} className="me-2" />
                SALUD Y BIENESTAR
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent className="pt-2">
            <CTabPane visible={activeKey === 1}><PersonalInfoTab student={student} /></CTabPane>
            <CTabPane visible={activeKey === 2}><RepresentativeTab student={student} /></CTabPane>
            <CTabPane visible={activeKey === 4}><HealthTab student={student} /></CTabPane>
          </CTabContent>
        </CTabs>
      </div>

      <CCard className="mt-5 border-0 premium-card overflow-hidden shadow-lg">
        <CCardFooter className="d-flex justify-content-between align-items-center bg-orange-soft border-0 py-4 px-4">
          <div className="d-flex align-items-center">
            <div className="p-2 bg-warning rounded-circle me-3 shadow-sm d-none d-md-block">
              <CIcon icon={cilCheckCircle} size="lg" className="text-white" />
            </div>
            <div>
              <div className="profile-header-title fw-bold small text-uppercase ls-1">Estado del Expediente</div>
              <small className="footer-text d-block">ID Único: <span className="font-monospace">{student.id}</span> | Sincronizado: {student.FechaActualizacion || "25/01/2026"}</small>
            </div>
          </div>
          <div className="d-flex gap-2">
            <CButton size="sm" className="border-2 rounded-pill px-4 profile-outline-btn fw-bold shadow-sm d-flex align-items-center" onClick={handlePrint} variant="outline">
              <CIcon icon={cilPrint} className="me-2 text-warning" />
              Descargar PDF
            </CButton>
          </div>
        </CCardFooter>
      </CCard>

      <EditStudentModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} studentData={student} onSave={handleSaveStudent} loading={saving} />

      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast key={t.id} autohide delay={t.delay} color={t.type === 'success' ? 'success' : 'danger'} visible className="border-0 shadow-lg text-white">
            <CToastHeader closeButton className={`bg-transparent text-white border-0`}>
              <strong className="me-auto">{t.title}</strong>
            </CToastHeader>
            <CToastBody className="fw-medium">{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .hover-lift:hover { transform: translateY(-3px); }
        .hover-orange:hover { color: #F28C0F !important; background: rgba(242, 140, 15, 0.05) !important; }
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.2s ease; }
        
        .profile-header-title { color: var(--neutral-800); }
        .profile-nav-link { background-color: var(--neutral-100) !important; color: var(--neutral-600) !important; }
        .profile-back-btn { color: var(--neutral-600); border-color: var(--neutral-200); }
        .profile-outline-btn { color: var(--neutral-600) !important; border-color: var(--neutral-300) !important; background-color: transparent !important; }
        .footer-text { color: var(--neutral-500); }

        [data-coreui-theme="dark"] .profile-header-title { color: white; }
        [data-coreui-theme="dark"] .profile-nav-link { background-color: rgba(255,255,255,0.05) !important; color: rgba(255,255,255,0.6) !important; }
        [data-coreui-theme="dark"] .profile-back-btn { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.1); }
        [data-coreui-theme="dark"] .profile-outline-btn { color: #F28C0F !important; border-color: #F28C0F !important; background-color: rgba(242, 140, 15, 0.05) !important; }
        [data-coreui-theme="dark"] .profile-outline-btn:hover { background-color: #F28C0F !important; color: white !important; }
        [data-coreui-theme="dark"] .footer-text { color: rgba(255,255,255,0.4); }

        @media print { .no-print { display: none !important; } }
      `}</style>
    </CContainer>
  )
}

export default PerfilEstudiantePrivado