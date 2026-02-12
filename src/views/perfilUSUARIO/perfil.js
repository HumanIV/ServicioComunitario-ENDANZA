// PerfilUsuarioGeneral.jsx - VERSIÓN COMPLETA CON API
import React, { useEffect, useState } from "react"
import {
  CCard,
  CCardBody,
  CCardFooter,
  CContainer,
  CRow,
  CCol,
  CButton,
  CSpinner,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CAlert,
  CFormLabel,
  CBadge
} from "@coreui/react"
import { Link, useNavigate } from "react-router-dom"
import CIcon from "@coreui/icons-react"
import {
  cilArrowLeft,
  cilUser,
  cilEnvelopeClosed,
  cilPhone,
  cilBadge,
  cilCalendar,
  cilLocationPin,
  cilMap,
  cilPencil,
  cilLockLocked,
  cilCheckCircle,
  cilInfo,
  cilShieldAlt,
  cilClock
} from "@coreui/icons"

// Servicios
import { profileService } from '../../services/profileService'
import { authService } from '../../services/authService'

// Componentes
import ProfileSummary from "./components/profileSumary"
import ChangePasswordModal from "./components/changeContraseña"
import EditProfileModal from "./components/editPerfil"

const PerfilUsuarioGeneral = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])

  // Cargar datos del perfil desde el backend
  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('📥 Cargando perfil del usuario...')
      const response = await profileService.getProfile()
      
      if (response.success) {
        console.log('✅ Perfil cargado:', response.user)
        setUser(response.user)
        
        // Actualizar localStorage con datos frescos
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        const updatedUser = { ...currentUser, ...response.user }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      } else {
        setError(response.message)
        showToast('danger', 'Error', response.message)
      }
    } catch (err) {
      console.error('❌ Error cargando perfil:', err)
      setError('Error al cargar los datos del perfil')
      showToast('danger', 'Error', 'No se pudo cargar el perfil')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Verificar autenticación
    if (!localStorage.getItem('accessToken')) {
      navigate('/login')
      return
    }
    
    loadProfile()
  }, [navigate])

  const showToast = (type, title, message) => {
    setToasts((prev) => [...prev, { 
      id: Date.now(), 
      type, 
      title, 
      message, 
      delay: 3000 
    }])
  }

  const handleEditProfile = () => setEditModalVisible(true)
  const handleChangePassword = () => setPasswordModalVisible(true)

  const handleSaveProfile = async (updatedData) => {
    setSaving(true)
    try {
      console.log('📤 Actualizando perfil...', updatedData)
      
      const response = await profileService.updateProfile(updatedData)
      
      if (response.success) {
        // Recargar perfil para obtener datos actualizados
        await loadProfile()
        
        showToast("success", "Perfil Actualizado", "Tus datos se han guardado correctamente")
        setEditModalVisible(false)
      } else {
        showToast("danger", "Error", response.message)
      }
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error)
      showToast("danger", "Error", "No se pudieron guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePasswordSubmit = async (passwordData) => {
    setSaving(true)
    try {
      console.log('🔐 Cambiando contraseña...')
      
      const response = await profileService.changePassword(passwordData)
      
      if (response.success) {
        showToast("success", "Contraseña Actualizada", "Tu contraseña ha sido cambiada exitosamente")
        setPasswordModalVisible(false)
      } else {
        showToast("danger", "Error", response.message)
      }
    } catch (error) {
      console.error('❌ Error cambiando contraseña:', error)
      showToast("danger", "Error", "No se pudo cambiar la contraseña")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/login?logout=success')
    } catch (error) {
      console.error('Error en logout:', error)
      navigate('/login')
    }
  }

  if (loading) {
    return (
      <CContainer className="py-5 text-center">
        <div className="d-flex justify-content-center mb-3">
          <div className="p-4 bg-orange-soft rounded-circle">
            <CSpinner color="warning" variant="grow" />
          </div>
        </div>
        <h5 className="fw-bold text-dark">Cargando Perfil de Usuario</h5>
        <p className="mt-2 text-muted small text-uppercase ls-1">Recuperando información personal...</p>
      </CContainer>
    )
  }

  if (error || !user) {
    return (
      <CContainer className="py-5">
        <CAlert color="danger" className="text-center">
          <CIcon icon={cilInfo} className="me-2" />
          {error || 'Error al cargar los datos del perfil'}
        </CAlert>
      </CContainer>
    )
  }

  // Mapear datos para mostrar en la UI
  const userDisplay = {
    ...user,
    fechaNacimiento: user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString('es-ES') : 'No registrada',
    edad: user.fechaNacimiento ? `${Math.floor((new Date() - new Date(user.fechaNacimiento)) / (365.25 * 24 * 60 * 60 * 1000))} años` : 'No registrada',
    direccionCompleta: user.direccion ? 
      `${user.direccion.nombre_direccion || ''}, ${user.direccion.ciudad || ''}, ${user.direccion.estado || ''}, ${user.direccion.pais || ''}`.replace(/^, |, $/g, '') || 'No registrada'
      : 'No registrada'
  }

  return (
    <CContainer className="py-4 profile-container pb-5 animate__animated animate__fadeIn">
      {/* Header */}
      <CRow className="mb-5 align-items-center no-print">
        <CCol xs={12} md={6}>
          <div className="d-flex align-items-center gap-3">
            <Link to="/inicio" className="btn btn-outline-secondary rounded-circle shadow-sm border-2 profile-back-btn p-2 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
              <CIcon icon={cilArrowLeft} />
            </Link>
            <div>
              <h2 className="mb-0 fw-bold profile-header-title text-uppercase ls-1">Mi Perfil</h2>
              <p className="footer-text small mb-0 text-uppercase ls-1 fw-bold">Configuración de Cuenta</p>
            </div>
          </div>
        </CCol>
        <CCol xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <div className="d-flex justify-content-md-end gap-3">
            <CButton 
              className="btn-premium px-4 d-flex align-items-center" 
              onClick={handleEditProfile}
              disabled={saving}
            >
              <CIcon icon={cilPencil} className="me-2" />
              EDITAR PERFIL
            </CButton>
            <CButton 
              variant="outline" 
              className="border-2 shadow-sm rounded-pill px-4 fw-bold profile-outline-btn d-flex align-items-center"
              onClick={handleChangePassword}
              disabled={saving}
            >
              <CIcon icon={cilLockLocked} className="me-2" />
              CAMBIAR CONTRASEÑA
            </CButton>
          </div>
        </CCol>
      </CRow>

      {/* Profile Summary and Info */}
      <CRow className="mb-4 g-4">
        <CCol xs={12} lg={4}>
          <ProfileSummary user={userDisplay} />
        </CCol>
        <CCol xs={12} lg={8}>
          <CCard className="border-0 premium-card shadow-lg h-100">
            <CCardBody className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0 d-flex align-items-center">
                  <CIcon icon={cilInfo} className="me-2 text-warning" />
                  Información General
                </h5>
                <CBadge color="warning" className="text-white px-3 py-2 rounded-pill">
                  <CIcon icon={cilShieldAlt} className="me-1" />
                  {user.rol || 'Usuario'}
                </CBadge>
              </div>
              
              <CRow className="g-4">
                <CCol sm={6}>
                  <div className="d-flex align-items-start p-3 bg-light rounded-3">
                    <div className="me-3 p-2 bg-white rounded-circle shadow-sm">
                      <CIcon icon={cilUser} className="text-warning" />
                    </div>
                    <div>
                      <small className="text-muted text-uppercase fw-bold small">Nombre Completo</small>
                      <p className="mb-0 fw-semibold">{user.nombre} {user.apellido}</p>
                    </div>
                  </div>
                </CCol>
                
                <CCol sm={6}>
                  <div className="d-flex align-items-start p-3 bg-light rounded-3">
                    <div className="me-3 p-2 bg-white rounded-circle shadow-sm">
                      <CIcon icon={cilBadge} className="text-warning" />
                    </div>
                    <div>
                      <small className="text-muted text-uppercase fw-bold small">Cédula de Identidad</small>
                      <p className="mb-0 fw-semibold">{user.cedula || 'No registrada'}</p>
                    </div>
                  </div>
                </CCol>

                <CCol sm={6}>
                  <div className="d-flex align-items-start p-3 bg-light rounded-3">
                    <div className="me-3 p-2 bg-white rounded-circle shadow-sm">
                      <CIcon icon={cilEnvelopeClosed} className="text-warning" />
                    </div>
                    <div>
                      <small className="text-muted text-uppercase fw-bold small">Correo Electrónico</small>
                      <p className="mb-0 fw-semibold">{user.email}</p>
                    </div>
                  </div>
                </CCol>

                <CCol sm={6}>
                  <div className="d-flex align-items-start p-3 bg-light rounded-3">
                    <div className="me-3 p-2 bg-white rounded-circle shadow-sm">
                      <CIcon icon={cilPhone} className="text-warning" />
                    </div>
                    <div>
                      <small className="text-muted text-uppercase fw-bold small">Teléfono</small>
                      <p className="mb-0 fw-semibold">{user.telefono || 'No registrado'}</p>
                    </div>
                  </div>
                </CCol>

                <CCol sm={6}>
                  <div className="d-flex align-items-start p-3 bg-light rounded-3">
                    <div className="me-3 p-2 bg-white rounded-circle shadow-sm">
                      <CIcon icon={cilCalendar} className="text-warning" />
                    </div>
                    <div>
                      <small className="text-muted text-uppercase fw-bold small">Fecha Nacimiento</small>
                      <p className="mb-0 fw-semibold">{userDisplay.fechaNacimiento} ({userDisplay.edad})</p>
                    </div>
                  </div>
                </CCol>

                <CCol sm={6}>
                  <div className="d-flex align-items-start p-3 bg-light rounded-3">
                    <div className="me-3 p-2 bg-white rounded-circle shadow-sm">
                      <CIcon icon={cilClock} className="text-warning" />
                    </div>
                    <div>
                      <small className="text-muted text-uppercase fw-bold small">Último Acceso</small>
                      <p className="mb-0 fw-semibold">{user.ultimoAcceso || 'No registrado'}</p>
                    </div>
                  </div>
                </CCol>

                <CCol xs={12}>
                  <div className="d-flex align-items-start p-3 bg-light rounded-3">
                    <div className="me-3 p-2 bg-white rounded-circle shadow-sm">
                      <CIcon icon={cilLocationPin} className="text-warning" />
                    </div>
                    <div>
                      <small className="text-muted text-uppercase fw-bold small">Dirección</small>
                      <p className="mb-0 fw-semibold">{userDisplay.direccionCompleta}</p>
                    </div>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modales */}
      <EditProfileModal 
        visible={editModalVisible} 
        onClose={() => setEditModalVisible(false)} 
        userData={user} 
        onSave={handleSaveProfile} 
        loading={saving} 
      />

      <ChangePasswordModal 
        visible={passwordModalVisible} 
        onClose={() => setPasswordModalVisible(false)} 
        onSubmit={handleChangePasswordSubmit} 
        loading={saving} 
      />

      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast 
            key={t.id} 
            autohide 
            delay={t.delay} 
            color={t.type === 'success' ? 'success' : 'danger'} 
            visible 
            className="border-0 shadow-lg text-white"
          >
            <CToastHeader closeButton className="bg-transparent text-white border-0">
              <strong className="me-auto">{t.title}</strong>
            </CToastHeader>
            <CToastBody className="fw-medium">{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.2s ease; }
        .bg-orange-soft { background-color: rgba(242, 140, 15, 0.08) !important; }
        
        .profile-header-title { color: var(--neutral-800); }
        .profile-back-btn { color: var(--neutral-600); border-color: var(--neutral-200); }
        .profile-outline-btn { color: var(--neutral-600) !important; border-color: var(--neutral-300) !important; background-color: transparent !important; }
        .profile-outline-btn:hover { background-color: #F28C0F !important; color: white !important; border-color: #F28C0F !important; }
        .footer-text { color: var(--neutral-500); }
        .btn-premium { background: linear-gradient(135deg, #F28C0F 0%, #F8A13E 100%); border: none; color: white; border-radius: 50px; font-weight: 600; box-shadow: 0 4px 10px rgba(242, 140, 15, 0.3); }
        .btn-premium:hover { background: linear-gradient(135deg, #E67E22 0%, #F28C0F 100%); transform: translateY(-2px); box-shadow: 0 6px 15px rgba(242, 140, 15, 0.4); }

        [data-coreui-theme="dark"] .profile-header-title { color: white; }
        [data-coreui-theme="dark"] .profile-back-btn { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.1); }
        [data-coreui-theme="dark"] .profile-outline-btn { color: #F28C0F !important; border-color: #F28C0F !important; background-color: rgba(242, 140, 15, 0.05) !important; }
        [data-coreui-theme="dark"] .profile-outline-btn:hover { background-color: #F28C0F !important; color: white !important; }
        [data-coreui-theme="dark"] .footer-text { color: rgba(255,255,255,0.4); }
        [data-coreui-theme="dark"] .bg-light { background-color: rgba(255,255,255,0.05) !important; }
        [data-coreui-theme="dark"] .bg-white { background-color: #2d3a4f !important; }

        @media print { .no-print { display: none !important; } }
      `}</style>
    </CContainer>
  )
}

export default PerfilUsuarioGeneral