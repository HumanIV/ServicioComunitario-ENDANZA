import React, { useEffect, useState } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CContainer,
  CRow,
  CCol,
  CButton,
  CButtonGroup,
  CBadge,
  CProgress,
  CListGroup,
  CListGroupItem,
  CAlert,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody
} from "@coreui/react"
import { Link, useNavigate } from "react-router-dom"
import CIcon from "@coreui/icons-react"
import { 
  cilArrowLeft, 
  cilUser, 
  cilCalendar,
  cilHome,
  cilPhone,
  cilBadge,
  cilNotes,
  cilMedicalCross,
  cilBook,
  cilPencil,
  cilPrint,
  cilTrash,
  cilCloudDownload,
  cilChartLine,
  cilClipboard,
  cilInfo,
  cilWarning,
  cilStar,
  cilEnvelopeClosed
} from "@coreui/icons"

// Importa tu modal
import EditStudentModal from "./components/editModal" // Ajusta la ruta según donde la tengas

const PerfilStudents = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState(null)
  const [activeKey, setActiveKey] = useState(1)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false) // Nueva state para la modal de edición
  const [saving, setSaving] = useState(false) // Para mostrar estado de guardado
  const [toasts, setToasts] = useState([])

  // Datos de ejemplo mejorados - SOLO UN ESTUDIANTE
  const estudianteEjemplo = {
    id: 1,
    Grado: "5to Grado",
    Seccion: "Danza A",
    NombreEstudiante: "Ana",
    ApellidoEstudiante: "López",
    FechaNacimiento: "2012-05-15",
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
    
    // DATOS DEL PADRE (nuevos campos agregados)
    PadreNombre: "José Antonio",
    PadreApellido: "Pérez",
    PadreCedula: "V-98765432",
    PadreTelefono: "+1 234-567-8902",
    PadreEmail: "jose.perez@email.com",
    PadreParentesco: "Padre",
    PadreOcupacion: "Empresario",
    
    // DATOS DE LA MADRE (campos existentes renombrados para consistencia)
    MadreNombre: "María Isabel",
    MadreApellido: "González",
    MadreCedula: "V-12345678",
    MadreTelefono: "+1 234-567-8901",
    MadreEmail: "maria.gonzalez@email.com",
    MadreParentesco: "Madre",
    MadreOcupacion: "Ingeniera",

    // Campos originales (mantenidos para compatibilidad)
    RepresentanteNombre: "María Isabel", // Mantener compatibilidad con código original
    RepresentanteApellido: "González", // Mantener compatibilidad con código original
    RepresentanteCedula: "V-12345678", // Mantener compatibilidad con código original
    RepresentanteTelefono: "+1 234-567-8901", // Mantener compatibilidad con código original
    RepresentanteEmail: "maria.gonzalez@email.com", // Mantener compatibilidad con código original
    RepresentanteParentesco: "Madre", // Mantener compatibilidad con código original
    RepresentanteOcupacion: "Ingeniera", // Mantener compatibilidad con código original
    
    // Resto de datos...
    NutricionPeso: "32 kg",
    NutricionAltura: "1.35 m",
    NutricionIMC: "17.5 (Normal)",
    NutricionObs: "Buen estado nutricional",
    Alergias: "Ninguna",
    Medicamentos: "Ninguno",
    Enfermedades: "Ninguna",
    ObservacionesAcad: "Excelente rendimiento en Ballet y Jazz. Participa activamente en clase.",
    Conducta: "Excelente",
    Asistencia: "95%",
    PromedioGeneral: "18.5/20",
    Notas: [
      { materia: "Ballet", nota: "18", observacion: "Excelente" },
      { materia: "Jazz", nota: "16", observacion: "Muy Bueno" },
      { materia: "Contemporáneo", nota: "15", observacion: "Bueno" },
      { materia: "Folklor", nota: "13", observacion: "Regular" },
      { materia: "Hip Hop", nota: "17", observacion: "Excelente" }
    ],
    HistorialMedico: [
      { fecha: "2024-01-15", diagnostico: "Control médico anual", tratamiento: "Ninguno", medico: "Dr. Pérez" },
      { fecha: "2023-11-20", diagnostico: "Gripe común", tratamiento: "Reposo y líquidos", medico: "Dr. López" }
    ]
  }

  // Simular carga de datos
  useEffect(() => {
    // Simular tiempo de carga
    setTimeout(() => {
      setStudent(estudianteEjemplo)
      setLoading(false)
    }, 800)
  }, [])

  // Función para mostrar toasts
  const showToast = (type, title, message) => {
    setToasts((prev) => [...prev, { 
      id: Date.now(), 
      type, 
      title, 
      message,
      delay: 3000 
    }])
  }

  // Funcionalidad de edición - Ahora abre la modal
  const handleEdit = () => {
    showToast("info", "Editar", "Abriendo editor de estudiante")
    setEditModalVisible(true)
  }

  const handlePrint = () => {
    window.print()
    showToast("success", "Imprimir", "Preparando para imprimir...")
  }

  const handleExport = () => {
    showToast("info", "Exportar", "Generando archivo PDF...")
    // Lógica de exportación
  }

  const handleDelete = () => {
    setDeleteModalVisible(true)
  }

  const confirmDelete = () => {
    showToast("danger", "Eliminado", "Estudiante eliminado del sistema")
    setTimeout(() => navigate("/students"), 1500)
  }

  // NUEVA FUNCIÓN: Manejar guardado de datos desde la modal
  const handleSaveStudent = async (updatedData) => {
    setSaving(true)
    
    try {
      // Simular una llamada API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Actualizar los datos del estudiante localmente
      setStudent(prev => ({
        ...prev,
        ...updatedData,
        // Mantener los datos que no están en el formulario
        id: prev.id,
        Edad: prev.Edad, // La edad se calcularía automáticamente
        FechaIngreso: prev.FechaIngreso,
        // Actualizar los campos del padre y madre
        PadreNombre: updatedData.PadreNombre || prev.PadreNombre,
        PadreApellido: updatedData.PadreApellido || prev.PadreApellido,
        PadreCedula: updatedData.PadreCedula || prev.PadreCedula,
        PadreTelefono: updatedData.PadreTelefono || prev.PadreTelefono,
        PadreEmail: updatedData.PadreEmail || prev.PadreEmail,
        PadreOcupacion: updatedData.PadreOcupacion || prev.PadreOcupacion,
        MadreNombre: updatedData.MadreNombre || prev.MadreNombre,
        MadreApellido: updatedData.MadreApellido || prev.MadreApellido,
        MadreCedula: updatedData.MadreCedula || prev.MadreCedula,
        MadreTelefono: updatedData.MadreTelefono || prev.MadreTelefono,
        MadreEmail: updatedData.MadreEmail || prev.MadreEmail,
        MadreOcupacion: updatedData.MadreOcupacion || prev.MadreOcupacion,
      }))
      
      // Mostrar toast de éxito
      showToast("success", "Guardado", "Datos del estudiante actualizados correctamente")
      
      // Cerrar modal
      setEditModalVisible(false)
    } catch (error) {
      showToast("danger", "Error", "No se pudieron guardar los datos")
      console.error("Error al guardar:", error)
    } finally {
      setSaving(false)
    }
  }

  const calcularProgreso = (promedio) => {
    const valor = parseFloat(promedio) / 20 * 100
    let color = "success"
    if (valor < 70) color = "warning"
    if (valor < 50) color = "danger"
    return { valor, color }
  }

  const StatusBadge = ({ status }) => {
    const colorMap = {
      "Activo": "success",
      "Inactivo": "secondary",
      "Graduado": "info",
      "Retirado": "danger"
    }
    return <CBadge color={colorMap[status] || "primary"}>{status}</CBadge>
  }

  if (loading) {
    return (
      <CContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <CSpinner color="primary" size="lg" />
          <p className="mt-3">Cargando información del estudiante...</p>
        </div>
      </CContainer>
    )
  }

  if (!student) {
    return (
      <CContainer className="mt-5">
        <CAlert color="danger" className="d-flex align-items-center">
          <CIcon icon={cilWarning} className="flex-shrink-0 me-3" size="xl" />
          <div>
            <h4 className="alert-heading">Estudiante no encontrado</h4>
            <p>No se encontró el estudiante solicitado</p>
            <Link to="/students">
              <CButton color="primary">
                <CIcon icon={cilArrowLeft} className="me-2" />
                Volver al listado
              </CButton>
            </Link>
          </div>
        </CAlert>
      </CContainer>
    )
  }

  const progreso = calcularProgreso(student.PromedioGeneral || 0)

  return (
    <CContainer fluid className="px-md-5 py-4">
      {/* Header con navegación y acciones */}
      <CRow className="mb-4 align-items-center">
        <CCol xs={12} md={6}>
          <div className="d-flex align-items-center">
            <Link to="/students" className="text-decoration-none">
              <CButton color="light" variant="outline" className="me-3">
                <CIcon icon={cilArrowLeft} />
              </CButton>
            </Link>
            <div>
              <h1 className="h3 mb-0">Perfil del Estudiante</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><Link to="/students" className="text-decoration-none">Estudiantes</Link></li>
                  <li className="breadcrumb-item active">{student.NombreEstudiante} {student.ApellidoEstudiante}</li>
                </ol>
              </nav>
            </div>
          </div>
        </CCol>
      </CRow>

      {/* Información principal */}
      <CRow className="mb-4">
        <CCol xs={12} lg={4}>
          <CCard className="h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <div className="avatar-circle-lg bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                  <CIcon icon={cilUser} size="xxl" />
                </div>
                <h3 className="mb-1">{student.NombreEstudiante} {student.ApellidoEstudiante}</h3>
                <p className="text-muted">Matrícula: #{student.id}</p>
                <StatusBadge status={student.Estatus} />
              </div>
              
              <CListGroup flush className="text-start">
                <CListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0">
                  <span className="d-flex align-items-center">
                    <CIcon icon={cilCalendar} className="me-2 text-muted" />
                    Grado
                  </span>
                  <strong>{student.Grado} - {student.Seccion}</strong>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0">
                  <span className="d-flex align-items-center">
                    <CIcon icon={cilCalendar} className="me-2 text-muted" />
                    Fecha Nacimiento
                  </span>
                  <strong>{student.FechaNacimiento}</strong>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0">
                  <span className="d-flex align-items-center">
                    <CIcon icon={cilCalendar} className="me-2 text-muted" />
                    Edad
                  </span>
                  <strong>{student.Edad}</strong>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0">
                  <span className="d-flex align-items-center">
                    <CIcon icon={cilMedicalCross} className="me-2 text-muted" />
                    Tipo de Sangre
                  </span>
                  <strong>{student.TipoSangre}</strong>
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} lg={8}>
          <CRow>
            <CCol xs={12} md={6} className="mb-3">
              <CCard className="h-100 border-0 shadow-sm border-top border-top-3 border-primary">
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="text-muted mb-1">Rendimiento Académico</h6>
                      <h4 className="mb-0">{student.PromedioGeneral || "N/A"}</h4>
                    </div>
                    <CIcon icon={cilChartLine} className="text-primary" size="lg" />
                  </div>
                  <CProgress value={progreso.valor} color={progreso.color} className="mb-2" />
                  <small className="text-muted">Promedio general de notas</small>
                </CCardBody>
              </CCard>
            </CCol>



            <CCol xs={12} md={6} className="mb-3">
              <CCard className="h-100 border-0 shadow-sm border-top border-top-3 border-info">
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="text-muted mb-1">Conducta</h6>
                      <h4 className="mb-0">{student.Conducta || "N/A"}</h4>
                    </div>
                    <CIcon icon={cilStar} className="text-info" size="lg" />
                  </div>
                  <CBadge color="info" className="fs-6">{student.Conducta}</CBadge>
                  <small className="text-muted d-block mt-2">Evaluación de conducta</small>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Este es el CCol que cambiamos por botones */}
            <CCol xs={12} md={15} className="mb-3">
              <CCard className="h-100 border-0 shadow-sm border-top border-top-3 border-warning">
                <CCardBody className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h6 className="text-muted mb-1">Acciones Rápidas</h6>
                      <h4 className="mb-0">Actualizar Datos</h4>
                    </div>
                    <CIcon icon={cilPencil} className="text-warning" size="lg" />
                  </div>
                  
                  {/* Botones uno al lado del otro */}
                  <div className="d-flex gap-3 mt-2">
                    {/* Botón 1: Actualizar Información Personal */}
                    <CButton 
                      color="warning" 
                      variant="outline" 
                      className="flex-fill d-flex flex-column align-items-center justify-content-center py-4"
                      onClick={() => {
                        showToast("info", "Actualizar", "Editar información personal")
                        setActiveKey(1) // Ir a pestaña de información personal
                        setEditModalVisible(true) // Abrir modal de edición
                      }}
                    >
                      <CIcon icon={cilUser} className="mb-2" size="xl" />
                      <div className="text-center">
                        <div className="fw-bold">Información Personal</div>
                        <small className="text-muted d-block">Datos básicos</small>
                      </div>
                    </CButton>

                    {/* Botón 2: Actualizar Datos de Representantes */}
                    <CButton 
                      color="success" 
                      variant="outline" 
                      className="flex-fill d-flex flex-column align-items-center justify-content-center py-4"
                      onClick={() => {
                        showToast("info", "Actualizar", "Editar datos de representantes")
                        setActiveKey(2) // Ir a pestaña de representantes
                        setEditModalVisible(true) // Abrir modal de edición
                      }}
                    >
                      <CIcon icon={cilBadge} className="mb-2" size="xl" />
                      <div className="text-center">
                        <div className="fw-bold">Representantes</div>
                        <small className="text-muted d-block">Padre y madre</small>
                      </div>
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCol>
      </CRow>

      {/* Pestañas de información detallada */}
      <CTabs activeTabKey={activeKey} onActiveTabKeyChange={setActiveKey}>
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink onClick={() => setActiveKey(1)}>
              <CIcon icon={cilUser} className="me-2" />
              Información Personal
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={() => setActiveKey(2)}>
              <CIcon icon={cilBadge} className="me-2" />
              Representante
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={() => setActiveKey(4)}>
              <CIcon icon={cilMedicalCross} className="me-2" />
              Salud
            </CNavLink>
          </CNavItem>
        </CNav>
        
        <CTabContent>
          {/* Información Personal - Tab 1 */}
          <CTabPane visible={activeKey === 1}>
            <div className="mt-4">
              <CRow>
                <CCol xs={12} lg={6}>
                  <CCard className="mb-4 border-0 shadow-sm">
                    <CCardHeader className="bg-primary bg-opacity-10 border-0 d-flex align-items-center">
                      <CIcon icon={cilUser} className="me-2 text-primary" />
                      <h5 className="mb-0">Datos Personales</h5>
                    </CCardHeader>
                    <CCardBody>
                      <CListGroup className="list-group-flush">
                        <CListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 py-2">
                          <span className="text-muted">Nombre Completo</span>
                          <strong>{student.NombreEstudiante} {student.ApellidoEstudiante}</strong>
                        </CListGroupItem>
                        <CListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 py-2">
                          <span className="text-muted">Fecha de Nacimiento</span>
                          <strong>{student.FechaNacimiento}</strong>
                        </CListGroupItem>
                        <CListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 py-2">
                          <span className="text-muted">Edad</span>
                          <strong>{student.Edad}</strong>
                        </CListGroupItem>
                        <CListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 py-2">
                          <span className="text-muted">Sexo</span>
                          <strong>{student.Sexo}</strong>
                        </CListGroupItem>
                        <CListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 py-2">
                          <span className="text-muted">Tipo de Sangre</span>
                          <strong>{student.TipoSangre}</strong>
                        </CListGroupItem>
                      </CListGroup>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol xs={12} lg={6}>
                  <CCard className="mb-4 border-0 shadow-sm">
                    <CCardHeader className="bg-info bg-opacity-10 border-0 d-flex align-items-center">
                      <CIcon icon={cilHome} className="me-2 text-info" />
                      <h5 className="mb-0">Información de Contacto</h5>
                    </CCardHeader>
                    <CCardBody>
                      <CListGroup className="list-group-flush">
                        <CListGroupItem className="d-flex align-items-start border-0 px-0 py-2">
                          <CIcon icon={cilHome} className="me-2 text-muted mt-1" />
                          <div>
                            <div className="text-muted">Dirección</div>
                            <strong>{student.Direccion}</strong>
                            <div className="small text-muted">{student.Ciudad}, {student.Estado}</div>
                          </div>
                        </CListGroupItem>
                        <CListGroupItem className="d-flex align-items-start border-0 px-0 py-2">
                          <CIcon icon={cilPhone} className="me-2 text-muted mt-1" />
                          <div>
                            <div className="text-muted">Teléfono</div>
                            <strong>{student.Telefono}</strong>
                          </div>
                        </CListGroupItem>
                        <CListGroupItem className="d-flex align-items-start border-0 px-0 py-2">
                          <CIcon icon={cilEnvelopeClosed} className="me-2 text-muted mt-1" />
                          <div>
                            <div className="text-muted">Correo Electrónico</div>
                            <strong>{student.Email}</strong>
                          </div>
                        </CListGroupItem>
                      </CListGroup>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </div>
          </CTabPane>

        {/* Información del Representante - Tab 2 */}
         <CTabPane visible={activeKey === 2}>
  <div className="mt-4">
    <CCard className="border-0 shadow-sm">
      <CCardHeader className="bg-warning bg-opacity-10 border-0 d-flex align-items-center">
        <CIcon icon={cilBadge} className="me-2 text-warning" />
        <h5 className="mb-0">Datos de los Representantes</h5>
      </CCardHeader>
      <CCardBody>
        <CRow>
          {/* PADRE */}
          <CCol xs={12} md={6}>
            <CCard className="h-100 border-0 shadow-sm border-top border-top-3 border-primary">
              <CCardHeader className="bg-primary bg-opacity-10 border-0 d-flex align-items-center">
                <CIcon icon={cilUser} className="me-2 text-primary" />
                <h6 className="mb-0">Padre</h6>
              </CCardHeader>
              <CCardBody>
                <div className="mb-3">
                  <h6 className="text-muted mb-3">Información Básica</h6>
                  <CRow>
                    <CCol xs={12} className="mb-3">
                      <label className="form-label text-muted">Nombre Completo</label>
                      <div className="fs-5 fw-bold">
                        {student.PadreNombre} {student.PadreApellido}
                      </div>
                    </CCol>
                    <CCol xs={12} md={6} className="mb-3">
                      <label className="form-label text-muted">Cédula de Identidad</label>
                      <div className="fs-5">
                        <code>{student.PadreCedula}</code>
                      </div>
                    </CCol>
                    <CCol xs={12} md={6} className="mb-3">
                      <label className="form-label text-muted">Parentesco</label>
                      <div className="fs-5">
                        <CBadge color="primary">{student.PadreParentesco}</CBadge>
                      </div>
                    </CCol>
                    <CCol xs={12} className="mb-3">
                      <label className="form-label text-muted">Ocupación</label>
                      <div className="fs-5">{student.PadreOcupacion}</div>
                    </CCol>
                  </CRow>
                </div>
                
                <div className="mt-4 pt-3 border-top">
                  <h6 className="text-muted mb-3">Contacto</h6>
                  <CListGroup className="list-group-flush">
                    <CListGroupItem className="d-flex align-items-center border-0 px-0 py-3">
                      <CIcon icon={cilPhone} className="me-3 text-primary" />
                      <div>
                        <div className="text-muted">Teléfono</div>
                        <strong>{student.PadreTelefono}</strong>
                      </div>
                    </CListGroupItem>
                    <CListGroupItem className="d-flex align-items-center border-0 px-0 py-3">
                      <CIcon icon={cilEnvelopeClosed} className="me-3 text-primary" />
                      <div>
                        <div className="text-muted">Correo Electrónico</div>
                        <strong>{student.PadreEmail}</strong>
                      </div>
                    </CListGroupItem>
                  </CListGroup>
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          {/* MADRE */}
          <CCol xs={12} md={6}>
            <CCard className="h-100 border-0 shadow-sm border-top border-top-3 border-success">
              <CCardHeader className="bg-success bg-opacity-10 border-0 d-flex align-items-center">
                <CIcon icon={cilUser} className="me-2 text-success" />
                <h6 className="mb-0">Madre</h6>
              </CCardHeader>
              <CCardBody>
                <div className="mb-3">
                  <h6 className="text-muted mb-3">Información Básica</h6>
                  <CRow>
                    <CCol xs={12} className="mb-3">
                      <label className="form-label text-muted">Nombre Completo</label>
                      <div className="fs-5 fw-bold">
                        {student.MadreNombre} {student.MadreApellido}
                      </div>
                    </CCol>
                    <CCol xs={12} md={6} className="mb-3">
                      <label className="form-label text-muted">Cédula de Identidad</label>
                      <div className="fs-5">
                        <code>{student.MadreCedula}</code>
                      </div>
                    </CCol>
                    <CCol xs={12} md={6} className="mb-3">
                      <label className="form-label text-muted">Parentesco</label>
                      <div className="fs-5">
                        <CBadge color="success">{student.MadreParentesco}</CBadge>
                      </div>
                    </CCol>
                    <CCol xs={12} className="mb-3">
                      <label className="form-label text-muted">Ocupación</label>
                      <div className="fs-5">{student.MadreOcupacion}</div>
                    </CCol>
                  </CRow>
                </div>
                
                <div className="mt-4 pt-3 border-top">
                  <h6 className="text-muted mb-3">Contacto</h6>
                  <CListGroup className="list-group-flush">
                    <CListGroupItem className="d-flex align-items-center border-0 px-0 py-3">
                      <CIcon icon={cilPhone} className="me-3 text-primary" />
                      <div>
                        <div className="text-muted">Teléfono</div>
                        <strong>{student.MadreTelefono}</strong>
                      </div>
                    </CListGroupItem>
                    <CListGroupItem className="d-flex align-items-center border-0 px-0 py-3">
                      <CIcon icon={cilEnvelopeClosed} className="me-3 text-primary" />
                      <div>
                        <div className="text-muted">Correo Electrónico</div>
                        <strong>{student.MadreEmail}</strong>
                      </div>
                    </CListGroupItem>
                  </CListGroup>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* REPRESENTANTE PRINCIPAL (Compatibilidad) */}
        <CRow className="mt-4">
          <CCol xs={12}>
            <CCard className="border-0 shadow-sm border-top border-top-3 border-warning">
              <CCardHeader className="bg-warning bg-opacity-10 border-0 d-flex align-items-center">
                <CIcon icon={cilBadge} className="me-2 text-warning" />
                <h6 className="mb-0">Representante Principal</h6>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol xs={12} md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-3">Información Básica</h6>
                      <CRow>
                        <CCol xs={12} className="mb-3">
                          <label className="form-label text-muted">Nombre Completo</label>
                          <div className="fs-5 fw-bold">
                            {student.RepresentanteNombre} {student.RepresentanteApellido}
                          </div>
                        </CCol>
                        <CCol xs={12} md={6} className="mb-3">
                          <label className="form-label text-muted">Cédula de Identidad</label>
                          <div className="fs-5">
                            <code>{student.RepresentanteCedula}</code>
                          </div>
                        </CCol>
                        <CCol xs={12} md={6} className="mb-3">
                          <label className="form-label text-muted">Parentesco</label>
                          <div className="fs-5">
                            <CBadge color="warning">{student.RepresentanteParentesco}</CBadge>
                          </div>
                        </CCol>
                        <CCol xs={12} className="mb-3">
                          <label className="form-label text-muted">Ocupación</label>
                          <div className="fs-5">{student.RepresentanteOcupacion}</div>
                        </CCol>
                      </CRow>
                    </div>
                  </CCol>
                  
                  <CCol xs={12} md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-3">Contacto</h6>
                      <CListGroup className="list-group-flush">
                        <CListGroupItem className="d-flex align-items-center border-0 px-0 py-3">
                          <CIcon icon={cilPhone} className="me-3 text-primary" />
                          <div>
                            <div className="text-muted">Teléfono</div>
                            <strong>{student.RepresentanteTelefono}</strong>
                          </div>
                        </CListGroupItem>
                        <CListGroupItem className="d-flex align-items-center border-0 px-0 py-3">
                          <CIcon icon={cilEnvelopeClosed} className="me-3 text-primary" />
                          <div>
                            <div className="text-muted">Correo Electrónico</div>
                            <strong>{student.RepresentanteEmail}</strong>
                          </div>
                        </CListGroupItem>
                      </CListGroup>
                    </div>
                  </CCol>
                </CRow>
                
                <div className="mt-4 pt-3 border-top">
                  <CAlert color="info" className="d-flex align-items-center">
                    <CIcon icon={cilInfo} className="me-2" />
                    <div>
                      <strong>Contacto principal para emergencias y comunicaciones escolares</strong>
                      <div className="mt-1">
                        <small>
                          Este es el contacto principal designado para todas las comunicaciones oficiales de la escuela.
                          Para asuntos específicos, también se puede contactar a los padres según corresponda.
                        </small>
                      </div>
                    </div>
                  </CAlert>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  </div>
</CTabPane>


          {/* Información de Salud - Tab 4 */}
          <CTabPane visible={activeKey === 4}>
            <div className="mt-4">
              <CRow>
                <CCol xs={12} lg={6}>
                  <CCard className="mb-4 border-0 shadow-sm">
                    <CCardHeader className="bg-danger bg-opacity-10 border-0 d-flex align-items-center">
                      <CIcon icon={cilMedicalCross} className="me-2 text-danger" />
                      <h5 className="mb-0">Datos Nutricionales</h5>
                    </CCardHeader>
                    <CCardBody>
                      <CRow className="g-4">
                        <CCol xs={12} md={6}>
                          <div className="text-center p-3 border rounded">
                            <div className="text-muted">Peso</div>
                            <h3 className="my-2">{student.NutricionPeso}</h3>
                            <small className="text-muted">Peso actual</small>
                          </div>
                        </CCol>
                        <CCol xs={12} md={6}>
                          <div className="text-center p-3 border rounded">
                            <div className="text-muted">Altura</div>
                            <h3 className="my-2">{student.NutricionAltura}</h3>
                            <small className="text-muted">Altura actual</small>
                          </div>
                        </CCol>
                        <CCol xs={12}>
                          <div className="p-3 rounded">
                            <h6 className="text-muted mb-2">Índice de Masa Corporal (IMC)</h6>
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1 me-3">
                                <CProgress 
                                  value={parseFloat(student.NutricionIMC?.split(" ")[0]) * 5 || 0} 
                                  color="success" 
                                  className="mb-2"
                                />
                              </div>
                              <div className="fs-4 fw-bold">{student.NutricionIMC}</div>
                            </div>
                          </div>
                        </CCol>
                        <CCol xs={12}>
                          <h6 className="text-muted mb-2">Observaciones</h6>
                          <div className="alert alert-success">
                            <CIcon icon={cilInfo} className="me-2" />
                            {student.NutricionObs}
                          </div>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
                
                <CCol xs={12} lg={6}>
                  <CCard className="mb-4 border-0 shadow-sm">
                    <CCardHeader className="bg-warning bg-opacity-10 border-0 d-flex align-items-center">
                      <CIcon icon={cilNotes} className="me-2 text-warning" />
                      <h5 className="mb-0">Historial Médico</h5>
                    </CCardHeader>
                    <CCardBody>
                      <CListGroup className="list-group-flush">
                        <CListGroupItem className="border-0 px-0 py-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0">
                              <div className="avatar avatar-sm rounded">
                                <CIcon icon={cilMedicalCross} className="text-danger" />
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <div className="d-flex justify-content-between">
                                <h6 className="mb-1">Alergias</h6>
                                <small className="text-muted">Estado</small>
                              </div>
                              <p className="mb-0">
                                {student.Alergias === "Ninguna" ? (
                                  <span className="badge bg-success">Sin alergias reportadas</span>
                                ) : (
                                  <span className="badge bg-danger">{student.Alergias}</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </CListGroupItem>
                        
                        <CListGroupItem className="border-0 px-0 py-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0">
                              <div className="avatar avatar-sm bg-light rounded">
                                <CIcon icon={cilMedicalCross} className="text-warning" />
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <div className="d-flex justify-content-between">
                                <h6 className="mb-1">Medicamentos</h6>
                                <small className="text-muted">Consumo actual</small>
                              </div>
                              <p className="mb-0">
                                {student.Medicamentos === "Ninguno" ? (
                                  <span className="badge bg-success">Sin medicamentos</span>
                                ) : (
                                  <span className="badge bg-warning">{student.Medicamentos}</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </CListGroupItem>
                        
                        <CListGroupItem className="border-0 px-0 py-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0">
                              <div className="avatar avatar-sm rounded">
                                <CIcon icon={cilMedicalCross} className="text-info" />
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <div className="d-flex justify-content-between">
                                <h6 className="mb-1">Enfermedades</h6>
                                <small className="text-muted">Condiciones</small>
                              </div>
                              <p className="mb-0">
                                {student.Enfermedades === "Ninguna" ? (
                                  <span className="badge bg-success">Sin enfermedades reportadas</span>
                                ) : (
                                  <span className="badge bg-info">{student.Enfermedades}</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </CListGroupItem>
                      </CListGroup>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </div>
          </CTabPane>
        </CTabContent>
      </CTabs>

      {/* Pie de página con información adicional */}
      <CCard className="mt-4 border-0 shadow-sm">
        <CCardFooter className="d-flex justify-content-between align-items-center">
          <div>
            <small className="text-muted">
              Estudiante registrado desde: {student.FechaIngreso} | 
              Última actualización: {new Date().toLocaleDateString()}
            </small>
          </div>
          <div className="d-flex gap-2">
            <CButton color="light" size="sm" variant="outline" onClick={handlePrint}>
              <CIcon icon={cilPrint} className="me-1" />
              Imprimir Perfil
            </CButton>
            <CButton color="primary" size="sm" onClick={handleEdit}>
              <CIcon icon={cilPencil} className="me-1" />
              Editar Información
            </CButton>
          </div>
        </CCardFooter>
      </CCard>

      {/* NUEVA MODAL DE EDICIÓN */}
      <EditStudentModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        studentData={student}
        onSave={handleSaveStudent}
        loading={saving}
      />

      {/* Toaster para notificaciones */}
      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast 
            key={t.id} 
            autohide={t.delay} 
            delay={t.delay} 
            color={t.type} 
            visible
            className="border-0 shadow"
          >
            <CToastHeader closeButton className={`bg-${t.type} text-white`}>
              <strong className="me-auto">{t.title}</strong>
            </CToastHeader>
            <CToastBody>
              {t.message}
            </CToastBody>
          </CToast>
        ))}
      </CToaster>

      {/* Estilos adicionales */}
      <style>{`
        .avatar-circle-lg {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .border-top-3 {
          border-top-width: 3px !important;
        }
        .print-only {
          display: none;
        }
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
        }
      `}</style>
    </CContainer>
  )
}

export default PerfilStudents