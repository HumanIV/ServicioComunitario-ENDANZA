import React, { useEffect, useState, useMemo } from "react"
import {
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
  CAlert,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CCard,
  CCardFooter
} from "@coreui/react"
import { useParams, Link, useNavigate } from "react-router-dom"
import CIcon from "@coreui/icons-react"
import {
  cilArrowLeft,
  cilUser,
  cilCalendar,
  cilBadge,
  cilMedicalCross,
  cilPencil,
  cilPrint,
  cilTrash,
  cilCloudDownload,
  cilWarning
} from "@coreui/icons"

import ProfileSummary from "../profile/components/profile/ProfileSummary"
import ProfileStatsCards from "../profile/components/profile/ProfileStatsCards"
import PersonalInfoTab from "../profile/components/profile/PersonalInfoTab"
import RepresentativeTab from "../profile/components/profile/RepresentativeTab"
import HealthTab from "../profile/components/profile/HealthTab"
import EditStudentModal from "../profile/components/profile/editModal"

import { getStudent, updateStudent as updateStudentService } from 'src/services/students'

const PerfilStudents = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState(null)
  const [activeKey, setActiveKey] = useState(1)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    fetchStudentData()
  }, [id])

  const fetchStudentData = async () => {
    setLoading(true)
    try {
      const data = await getStudent(id)
      setStudent(data)
    } catch (error) {
      console.error("Error fetching student:", error)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (type, title, message) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, title, message, delay: 3000 }])
  }

  const handleEdit = () => {
    setEditModalVisible(true)
  }

  const handlePrint = () => {
    window.print()
    showToast("success", "Imprimir", "Preparando para imprimir...")
  }

  const handleSaveStudent = async (updatedData) => {
    setSaving(true)
    try {
      const updated = await updateStudentService(id, updatedData)
      setStudent(updated)
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
        <CSpinner color="primary" />
        <p className="mt-2 text-muted">Cargando perfil del estudiante...</p>
      </CContainer>
    )
  }

  if (!student) {
    return (
      <CContainer className="py-5">
        <CAlert color="danger">Estudiante no encontrado</CAlert>
        <CButton color="primary" onClick={() => navigate("/students")}>Volver a la lista</CButton>
      </CContainer>
    )
  }

  return (
    <CContainer className="py-4 profile-container pb-5">
      <CRow className="mb-4 align-items-center no-print">
        <CCol xs={12} md={6}>
          <div className="d-flex align-items-center gap-3">
            <Link to="/students" className="btn btn-outline-secondary rounded-pill border-2 profile-back-btn">
              <CIcon icon={cilArrowLeft} />
            </Link>
            <div>
              <h2 className="mb-0 fw-bold profile-header-title">Perfil del Alumno</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 small">
                  <li className="breadcrumb-item"><Link to="/inicio">Inicio</Link></li>
                  <li className="breadcrumb-item"><Link to="/students">Estudiantes</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">{student.NombreEstudiante} {student.ApellidoEstudiante}</li>
                </ol>
              </nav>
            </div>
          </div>
        </CCol>
        <CCol xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <div className="d-flex justify-content-md-end gap-2">
            <CButton className="btn-premium" onClick={handleEdit}><CIcon icon={cilPencil} className="me-2" />Editar Perfil</CButton>
            <CButton variant="outline" className="border-2 rounded-pill profile-outline-btn d-flex align-items-center" onClick={handlePrint}><CIcon icon={cilPrint} className="me-2" />Imprimir Ficha</CButton>
          </div>
        </CCol>
      </CRow>

      <CRow className="mb-4">
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

      <CTabs activeTabKey={activeKey} onActiveTabKeyChange={setActiveKey}>
        <CNav variant="pills" className="border-0 gap-3 mb-4 justify-content-center justify-content-md-start">
          <CNavItem>
            <CNavLink
              onClick={() => setActiveKey(1)}
              className={`rounded-pill px-4 py-2 border-0 fw-bold transition-all cursor-pointer d-flex align-items-center ${activeKey === 1 ? 'bg-primary text-white shadow-sm' : 'profile-nav-link shadow-sm hover-lift'}`}
            >
              <CIcon icon={cilUser} className="me-2" />
              DATOS PERSONALES
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              onClick={() => setActiveKey(2)}
              className={`rounded-pill px-4 py-2 border-0 fw-bold transition-all cursor-pointer d-flex align-items-center ${activeKey === 2 ? 'bg-primary text-white shadow-sm' : 'profile-nav-link shadow-sm hover-lift'}`}
            >
              <CIcon icon={cilBadge} className="me-2" />
              REPRESENTANTES
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              onClick={() => setActiveKey(4)}
              className={`rounded-pill px-4 py-2 border-0 fw-bold transition-all cursor-pointer d-flex align-items-center ${activeKey === 4 ? 'bg-primary text-white shadow-sm' : 'profile-nav-link shadow-sm hover-lift'}`}
            >
              <CIcon icon={cilMedicalCross} className="me-2" />
              SALUD Y BIENESTAR
            </CNavLink>
          </CNavItem>
        </CNav>
        <CTabContent>
          <CTabPane visible={activeKey === 1}><PersonalInfoTab student={student} /></CTabPane>
          <CTabPane visible={activeKey === 2}><RepresentativeTab student={student} /></CTabPane>
          <CTabPane visible={activeKey === 4}><HealthTab student={student} /></CTabPane>
        </CTabContent>
      </CTabs>

      <CCard className="mt-4 border-0 shadow-sm premium-card">
        <CCardFooter className="d-flex justify-content-between align-items-center profile-footer border-0 py-3">
          <small className="footer-text">Estudiante registrado desde: {student.FechaIngreso} | Última actualización: {new Date().toLocaleDateString()}</small>
          <div className="d-flex gap-2">
            <CButton variant="outline" className="border-2 rounded-pill px-3 profile-outline-btn d-flex align-items-center" onClick={handlePrint}>
              <CIcon icon={cilPrint} className="me-1" />Exportar Perfil
            </CButton>
            <CButton className="btn-premium border-0 py-2 px-3 shadow-sm" size="sm" onClick={handleEdit}>
              <CIcon icon={cilPencil} className="me-1" />Editar Información
            </CButton>
          </div>
        </CCardFooter>
      </CCard>

      <EditStudentModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} studentData={student} onSave={handleSaveStudent} loading={saving} />

      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast key={t.id} autohide delay={t.delay} color={t.type} visible className="border-0 shadow">
            <CToastHeader closeButton className={`bg-${t.type} text-white`}><strong className="me-auto">{t.title}</strong></CToastHeader>
            <CToastBody>{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      <style>{`
        .profile-header-title { color: var(--neutral-800); }
        .profile-nav-link { background-color: var(--neutral-100) !important; color: var(--neutral-600) !important; border: 1px solid transparent !important; }
        .profile-nav-link:hover { background-color: var(--neutral-200) !important; color: var(--primary-600) !important; }
        .profile-back-btn { color: var(--neutral-600); border-color: var(--neutral-200); }
        .profile-outline-btn { color: var(--neutral-600) !important; border-color: var(--neutral-300) !important; background-color: transparent !important; }
        .profile-footer { background-color: var(--neutral-50); }
        .footer-text { color: var(--neutral-500); }

        [data-coreui-theme="dark"] .profile-header-title { color: white; }
        [data-coreui-theme="dark"] .profile-nav-link { background-color: rgba(255,255,255,0.05) !important; color: rgba(255,255,255,0.6) !important; border: 1px solid rgba(255,255,255,0.05) !important; }
        [data-coreui-theme="dark"] .profile-nav-link:hover { background-color: rgba(255,255,255,0.1) !important; color: white !important; }
        [data-coreui-theme="dark"] .profile-back-btn { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.1); }
        [data-coreui-theme="dark"] .profile-outline-btn { color: var(--primary-400) !important; border-color: var(--primary-400) !important; background-color: rgba(245, 185, 55, 0.05) !important; }
        [data-coreui-theme="dark"] .profile-outline-btn:hover { background-color: var(--primary-500) !important; color: white !important; }
        [data-coreui-theme="dark"] .profile-footer { background-color: rgba(0,0,0,0.2) !important; }
        [data-coreui-theme="dark"] .footer-text { color: rgba(255,255,255,0.4); }

        .avatar-circle-lg { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; }
        .border-top-3 { border-top-width: 3px !important; }
        .hover-lift:hover { transform: translateY(-3px); }
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.2s ease; }
        @media print { .no-print { display: none !important; } }
      `}</style>
    </CContainer>
  )
}

export default PerfilStudents