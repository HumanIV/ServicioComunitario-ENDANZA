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

import { getStudent, updateStudent as updateStudentService } from '../../services/studentsService'

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
      console.log("Datos del estudiante recibidos:", data) // Para debugging
      setStudent(data)
    } catch (error) {
      console.error("Error fetching student:", error)
      showToast("danger", "Error", "No se pudo cargar el perfil del estudiante")
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
      await fetchStudentData() // Refrescar datos
    } catch (error) {
      showToast("danger", "Error", "No se pudieron guardar los datos")
    } finally {
      setSaving(false)
    }
  }

  // Calcular progreso basado en datos disponibles
  const progreso = useMemo(() => {
    if (!student) return { valor: 0, color: "secondary" }
    
    // Si tiene secciones asignadas, consideramos progreso básico
    const tieneSecciones = student.sections && student.sections.length > 0
    const tieneRepresentante = student.representative_id
    
    if (tieneSecciones && tieneRepresentante) {
      return { valor: 90, color: "success" }
    } else if (tieneSecciones || tieneRepresentante) {
      return { valor: 60, color: "warning" }
    }
    return { valor: 30, color: "danger" }
  }, [student])

  // Obtener fecha de registro (usando la primera sección si existe)
  const fechaRegistro = useMemo(() => {
    if (!student) return "No disponible"
    if (student.sections && student.sections.length > 0) {
      return student.sections[0].academic_year || "No disponible"
    }
    return new Date().toLocaleDateString()
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
                  <li className="breadcrumb-item active" aria-current="page">
                    {student.first_name} {student.last_name}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </CCol>
        <CCol xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <div className="d-flex justify-content-md-end gap-2">
            <CButton className="btn-premium" onClick={handleEdit}>
              <CIcon icon={cilPencil} className="me-2" />Editar Perfil
            </CButton>
            <CButton variant="outline" className="border-2 rounded-pill profile-outline-btn d-flex align-items-center" onClick={handlePrint}>
              <CIcon icon={cilPrint} className="me-2" />Imprimir Ficha
            </CButton>
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
              onClick={() => setActiveKey(3)}
              className={`rounded-pill px-4 py-2 border-0 fw-bold transition-all cursor-pointer d-flex align-items-center ${activeKey === 3 ? 'bg-primary text-white shadow-sm' : 'profile-nav-link shadow-sm hover-lift'}`}
            >
              <CIcon icon={cilMedicalCross} className="me-2" />
              SALUD Y BIENESTAR
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              onClick={() => setActiveKey(4)}
              className={`rounded-pill px-4 py-2 border-0 fw-bold transition-all cursor-pointer d-flex align-items-center ${activeKey === 4 ? 'bg-primary text-white shadow-sm' : 'profile-nav-link shadow-sm hover-lift'}`}
            >
              <CIcon icon={cilCalendar} className="me-2" />
              SECCIONES
            </CNavLink>
          </CNavItem>
        </CNav>
        <CTabContent>
          <CTabPane visible={activeKey === 1}>
            <PersonalInfoTab student={student} />
          </CTabPane>
          <CTabPane visible={activeKey === 2}>
            <RepresentativeTab student={student} />
          </CTabPane>
          <CTabPane visible={activeKey === 3}>
            <HealthTab student={student} />
          </CTabPane>
          <CTabPane visible={activeKey === 4}>
            <div className="p-4">
              <h5 className="fw-bold header-title-custom mb-3">Secciones Asignadas</h5>
              {student.sections && student.sections.length > 0 ? (
                <div className="row g-3">
                  {student.sections.map((section, index) => (
                    <div key={index} className="col-md-6">
                      <div className="p-3 border rounded-3 bg-light">
                        <h6 className="fw-bold text-primary mb-2">{section.section_name}</h6>
                        <p className="small text-muted mb-1">
                          <CIcon icon={cilCalendar} className="me-1" size="sm" />
                          Año Académico: {section.academic_year}
                        </p>
                        <p className="small text-muted mb-0">
                          <CIcon icon={cilBadge} className="me-1" size="sm" />
                          Lapso: {section.period}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <CIcon icon={cilWarning} size="3xl" className="text-muted opacity-25 mb-3" />
                  <p className="text-muted-custom">No hay secciones asignadas</p>
                </div>
              )}
            </div>
          </CTabPane>
        </CTabContent>
      </CTabs>

      <CCard className="mt-4 border-0 shadow-sm premium-card">
        <CCardFooter className="d-flex justify-content-between align-items-center profile-footer border-0 py-3">
          <small className="footer-text">
            Estudiante registrado desde: {fechaRegistro} | 
            Última actualización: {new Date().toLocaleDateString()}
          </small>
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

      <EditStudentModal 
        visible={editModalVisible} 
        onClose={() => setEditModalVisible(false)} 
        studentData={student} 
        onSave={handleSaveStudent} 
        loading={saving} 
      />

      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast key={t.id} autohide delay={t.delay} color={t.type} visible className="border-0 shadow">
            <CToastHeader closeButton className={`bg-${t.type} text-white`}>
              <strong className="me-auto">{t.title}</strong>
            </CToastHeader>
            <CToastBody>{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
        .profile-container {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        }
        .profile-back-btn {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .profile-back-btn:hover {
          background-color: var(--primary-600);
          color: white;
          border-color: var(--primary-600);
        }
        .profile-header-title {
          color: var(--primary-700);
          letter-spacing: -0.02em;
        }
        .profile-outline-btn {
          color: var(--primary-600);
          border-color: var(--primary-200);
          transition: all 0.3s ease;
        }
        .profile-outline-btn:hover {
          background-color: var(--primary-50);
          border-color: var(--primary-400);
        }
        .profile-nav-link {
          background: white;
          color: var(--primary-700);
          transition: all 0.3s ease;
        }
        .profile-nav-link:hover:not(.bg-primary) {
          background-color: var(--primary-50);
          transform: translateY(-2px);
        }
        .hover-lift {
          transition: transform 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        .profile-footer {
          background: linear-gradient(135deg, var(--primary-50) 0%, white 100%);
        }
        .footer-text {
          color: var(--primary-700);
          opacity: 0.8;
        }
        .btn-premium {
          background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
          color: white;
          border: none;
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }
        .btn-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(var(--primary-rgb), 0.5);
        }
        .breadcrumb {
          background: transparent;
          padding: 0;
        }
        .breadcrumb-item a {
          color: var(--primary-600);
          text-decoration: none;
        }
        .breadcrumb-item.active {
          color: var(--primary-800);
          font-weight: 500;
        }
      `}</style>
    </CContainer>
  )
}

export default PerfilStudents