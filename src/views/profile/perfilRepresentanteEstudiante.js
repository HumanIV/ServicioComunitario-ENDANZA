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
import { useParams, useNavigate, useLocation } from "react-router-dom"
import CIcon from "@coreui/icons-react"
import {
  cilArrowLeft,
  cilUser,
  cilCalendar,
  cilBadge,
  cilMedicalCross,
  cilPrint,
  cilWarning
} from "@coreui/icons"

import ProfileSummary from "../profile/components/profile/ProfileSummary"
import ProfileStatsCards from "../profile/components/profile/ProfileStatsCards"
import PersonalInfoTab from "../profile/components/profile/PersonalInfoTab"
import RepresentativeTab from "../profile/components/profile/RepresentativeTab"
import HealthTab from "../profile/components/profile/HealthTab"

// 👇 Importar el servicio para representantes (como fallback)
import { getStudentProfile } from '../../services/studentsService'
import useUserRole from '../../Hooks/useUserRole'

// 👇 LOG 1: Verificar que el archivo se carga
console.log("📦 ARCHIVO PerfilRepresentanteEstudiante CARGADO EN MEMORIA");

const PerfilRepresentanteEstudiante = () => {
  // 👇 LOG 2: Verificar que el componente se monta
  console.log("🏗️ COMPONENTE Montándose - PerfilRepresentanteEstudiante");
  
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  // 👇 IMPORTANTE: Obtener también isLoading
  const { isRepresentante, isLoading } = useUserRole()
  
  // 👇 LOG 3: Verificar parámetros
  console.log("📍 useParams:", { id });
  console.log("📍 location.pathname:", location.pathname);
  console.log("📍 location.state:", location.state);
  console.log("📍 isRepresentante:", isRepresentante);
  console.log("📍 isLoading:", isLoading);
  
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState(null)
  const [activeKey, setActiveKey] = useState(1)
  const [toasts, setToasts] = useState([])

  // 👇 SOLUCIÓN: Esperar a que isLoading sea false antes de ejecutar la lógica
  useEffect(() => {
    // Si todavía está cargando el rol, no hacer nada
    if (isLoading) {
      console.log("⏳ Esperando a que cargue el rol del usuario...");
      return;
    }
    
    console.log("🔄 useEffect ejecutándose - id:", id, "isRepresentante:", isRepresentante);
    
    // Redirigir si no es representante (ahora con datos reales)
    if (!isRepresentante) {
      console.log("🚫 No es representante, redirigiendo a /inicio");
      navigate('/inicio')
      return
    }
    
    // Intentar obtener el estudiante de la lista cacheada
    const studentsList = location.state?.studentsList
    console.log("📋 studentsList desde state:", studentsList);
    
    if (studentsList && studentsList.length > 0) {
      console.log("📦 Usando estudiantes de la lista cacheada:", studentsList)
      // Buscar el estudiante por ID (convertir a número por si acaso)
      const foundStudent = studentsList.find(s => s.id === parseInt(id) || s.id === id)
      
      if (foundStudent) {
        console.log("✅ Estudiante encontrado en cache:", foundStudent)
        setStudent(foundStudent)
        setLoading(false)
        return
      } else {
        console.warn("⚠️ Estudiante no encontrado en cache, haciendo petición...")
      }
    } else {
      console.log("📡 No hay cache disponible, haciendo petición al backend")
    }
    
    // Fallback: hacer petición al backend
    fetchStudentData()
  }, [id, isRepresentante, isLoading, location.state]) // 👈 AÑADIR isLoading a las dependencias

  const fetchStudentData = async () => {
    console.log("📤 fetchStudentData - Iniciando petición al backend");
    setLoading(true)
    try {
      console.log(`📥 Representante cargando perfil del estudiante ID: ${id} (fallback)`)
      const data = await getStudentProfile(id)
      console.log("✅ Perfil cargado desde backend:", data)
      setStudent(data)
    } catch (error) {
      console.error("❌ Error fetching student:", error)
      showToast("danger", "Error", error.message || "No se pudo cargar el perfil del estudiante")
    } finally {
      setLoading(false)
    }
  }

  const showToast = (type, title, message) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, title, message, delay: 3000 }])
  }

  const handlePrint = () => {
    window.print()
    showToast("success", "Imprimir", "Preparando para imprimir...")
  }

  const handleGoBack = () => {
    console.log("👈 handleGoBack - navegando a /inicio");
    navigate('/inicio')
  }

  // Calcular progreso
  const progreso = useMemo(() => {
    if (!student) return { valor: 0, color: "secondary" }
    const tieneSecciones = student.sections && student.sections.length > 0
    return tieneSecciones ? { valor: 90, color: "success" } : { valor: 60, color: "warning" }
  }, [student])

  // Fecha de registro
  const fechaRegistro = useMemo(() => {
    if (!student) return "No disponible"
    if (student.sections && student.sections.length > 0) {
      return student.sections[0].academic_year || "No disponible"
    }
    return new Date().toLocaleDateString()
  }, [student])

  console.log("⏳ Estado actual - loading:", loading, "student:", student ? "✅" : "❌", "isLoading:", isLoading);

  // 👇 Mostrar spinner mientras carga el rol
  if (isLoading) {
    return (
      <CContainer className="py-5 text-center">
        <CSpinner color="warning" />
        <p className="mt-2 text-muted">Verificando permisos de usuario...</p>
      </CContainer>
    )
  }

  if (loading) {
    return (
      <CContainer className="py-5 text-center">
        <CSpinner color="warning" />
        <p className="mt-2 text-muted">Cargando perfil del estudiante...</p>
      </CContainer>
    )
  }

  if (!student) {
    return (
      <CContainer className="py-5">
        <CAlert color="danger">Estudiante no encontrado</CAlert>
        <CButton color="warning" onClick={handleGoBack}>Volver al Inicio</CButton>
      </CContainer>
    )
  }

  return (
    <CContainer className="py-4 profile-container pb-5">
      <CRow className="mb-4 align-items-center no-print">
        <CCol xs={12} md={6}>
          <div className="d-flex align-items-center gap-3">
            <CButton
              color="light"
              onClick={handleGoBack}
              className="rounded-circle p-2 d-flex align-items-center justify-content-center profile-back-btn"
              style={{ width: '45px', height: '45px' }}
            >
              <CIcon icon={cilArrowLeft} />
            </CButton>
            <div>
              <h2 className="mb-0 fw-bold profile-header-title">Perfil del Estudiante</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 small">
                  <li className="breadcrumb-item">Inicio</li>
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
            setEditModalVisible={() => {}} // No hay edición
          />
        </CCol>
      </CRow>

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
              onClick={() => setActiveKey(3)}
              className={`rounded-pill px-4 py-2 border-0 fw-bold transition-all cursor-pointer d-flex align-items-center ${activeKey === 3 ? 'bg-warning text-white shadow-sm' : 'profile-nav-link shadow-sm hover-lift'}`}
            >
              <CIcon icon={cilMedicalCross} className="me-2" />
              SALUD Y BIENESTAR
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              onClick={() => setActiveKey(4)}
              className={`rounded-pill px-4 py-2 border-0 fw-bold transition-all cursor-pointer d-flex align-items-center ${activeKey === 4 ? 'bg-warning text-white shadow-sm' : 'profile-nav-link shadow-sm hover-lift'}`}
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
                        <h6 className="fw-bold text-warning mb-2">{section.section_name}</h6>
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
            Estudiante registrado desde: {fechaRegistro}
          </small>
          <div className="d-flex gap-2">
            <CButton variant="outline" className="border-2 rounded-pill px-3 profile-outline-btn d-flex align-items-center" onClick={handlePrint}>
              <CIcon icon={cilPrint} className="me-1" />Exportar Perfil
            </CButton>
          </div>
        </CCardFooter>
      </CCard>

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
          background-color: var(--warning);
          color: white;
          border-color: var(--warning);
        }
        .profile-header-title {
          color: var(--warning-dark);
          letter-spacing: -0.02em;
        }
        .profile-outline-btn {
          color: var(--warning);
          border-color: var(--warning-200);
          transition: all 0.3s ease;
        }
        .profile-outline-btn:hover {
          background-color: var(--warning-50);
          border-color: var(--warning-400);
        }
        .profile-nav-link {
          background: white;
          color: var(--warning-dark);
          transition: all 0.3s ease;
        }
        .profile-nav-link:hover:not(.bg-warning) {
          background-color: var(--warning-50);
          transform: translateY(-2px);
        }
        .hover-lift {
          transition: transform 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        .profile-footer {
          background: linear-gradient(135deg, var(--warning-50) 0%, white 100%);
        }
        .footer-text {
          color: var(--warning-dark);
          opacity: 0.8;
        }
        .btn-premium {
          background: linear-gradient(135deg, var(--warning) 0%, var(--warning-dark) 100%);
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
          box-shadow: 0 10px 25px -5px rgba(var(--warning-rgb), 0.5);
        }
        .breadcrumb {
          background: transparent;
          padding: 0;
        }
        .breadcrumb-item a {
          color: var(--warning);
          text-decoration: none;
        }
        .breadcrumb-item.active {
          color: var(--warning-dark);
          font-weight: 500;
        }
      `}</style>
    </CContainer>
  )
}

export default PerfilRepresentanteEstudiante