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
    <CContainer className="py-2 profile-container pb-5 animate__animated animate__fadeIn">
      {/* Header Premium */}
      <div className="bg-glass-premium p-4 rounded-4 border border-light-custom shadow-sm mb-5 mt-3 no-print">
        <CRow className="align-items-center">
          <CCol xs={12} md={6}>
            <div className="d-flex align-items-center gap-4">
              <Link to="/inicio" className="premium-back-btn p-2 d-flex align-items-center justify-content-center">
                <CIcon icon={cilArrowLeft} size="lg" />
              </Link>
              <div>
                <h2 className="mb-1 fw-bold profile-header-title text-uppercase ls-1 fs-4">Gestión de Perfil</h2>
                <div className="d-flex align-items-center gap-2">
                  <div className="pulse-dot"></div>
                  <p className="footer-text small mb-0 text-uppercase ls-1 fw-bold opacity-75">Configuración de Cuenta Personal</p>
                </div>
              </div>
            </div>
          </CCol>
          <CCol xs={12} md={6} className="text-md-end mt-4 mt-md-0">
            <div className="d-flex justify-content-md-end gap-3 flex-wrap">
              <CButton
                className="btn-premium-action px-4 py-2 d-flex align-items-center border-0"
                onClick={handleEditProfile}
                disabled={saving}
              >
                <CIcon icon={cilPencil} className="me-2" />
                EDITAR INFORMACIÓN
              </CButton>
              <CButton
                variant="outline"
                className="premium-outline-btn px-4 py-2 d-flex align-items-center fw-bold transition-all"
                onClick={handleChangePassword}
                disabled={saving}
              >
                <CIcon icon={cilLockLocked} className="me-2" />
                CAMBIAR CONTRASEÑA
              </CButton>
            </div>
          </CCol>
        </CRow>
      </div>

      {/* Main Content Grid */}
      <CRow className="g-4">
        <CCol xs={12} lg={4}>
          <ProfileSummary user={userDisplay} />
        </CCol>
        <CCol xs={12} lg={8}>
          <CCard className="border-0 premium-card shadow-lg h-100 overflow-hidden">
            <div className="premium-card-header p-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 d-flex align-items-center header-title-custom">
                  <div className="header-icon-container me-3">
                    <CIcon icon={cilInfo} />
                  </div>
                  Información General
                </h5>
                <CBadge color="warning" className="premium-role-badge px-4 py-2 rounded-pill shadow-sm">
                  <CIcon icon={cilShieldAlt} className="me-2" />
                  ROL: {user.rol?.toUpperCase() || 'USUARIO'}
                </CBadge>
              </div>
            </div>

            <CCardBody className="p-4 pt-2">
              <CRow className="g-4">
                {[
                  { icon: cilUser, label: 'Nombre Completo', value: `${user.nombre} ${user.apellido}` },
                  { icon: cilBadge, label: 'Cédula de Identidad', value: user.cedula || 'No registrada' },
                  { icon: cilEnvelopeClosed, label: 'Correo Electrónico', value: user.email },
                  { icon: cilPhone, label: 'Teléfono de Contacto', value: user.telefono || 'No registrado' },
                  { icon: cilCalendar, label: 'Fecha de Nacimiento', value: `${userDisplay.fechaNacimiento} (${userDisplay.edad})` },
                  { icon: cilClock, label: 'Último Acceso', value: user.ultimoAcceso || 'No registrado' }
                ].map((item, idx) => (
                  <CCol sm={6} key={idx}>
                    <div className="premium-info-box p-3 rounded-4 transition-all">
                      <div className="d-flex align-items-center">
                        <div className="info-box-icon p-2 rounded-3 me-3">
                          <CIcon icon={item.icon} />
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <small className="text-muted-custom text-uppercase fw-bold ls-1 d-block mb-1" style={{ fontSize: '0.65rem' }}>{item.label}</small>
                          <p className="mb-0 fw-bold text-dark-custom text-truncate">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  </CCol>
                ))}

                <CCol xs={12}>
                  <div className="premium-info-box p-3 rounded-4 transition-all">
                    <div className="d-flex align-items-center">
                      <div className="info-box-icon p-2 rounded-3 me-3">
                        <CIcon icon={cilLocationPin} />
                      </div>
                      <div>
                        <small className="text-muted-custom text-uppercase fw-bold ls-1 d-block mb-1" style={{ fontSize: '0.65rem' }}>Dirección de Residencia</small>
                        <p className="mb-0 fw-bold text-dark-custom">{userDisplay.direccionCompleta}</p>
                      </div>
                    </div>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modals y Toasters */}
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
            className="border-0 shadow-lg text-white premium-toast"
          >
            <CToastHeader closeButton className="bg-transparent text-white border-0">
              <div className="d-flex align-items-center">
                <CIcon icon={t.type === 'success' ? cilCheckCircle : cilInfo} className="me-2" />
                <strong className="me-auto text-uppercase ls-1">{t.title}</strong>
              </div>
            </CToastHeader>
            <CToastBody className="fw-medium">{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        
        /* Header & Back Button */
        .premium-back-btn { 
          color: #64748b; 
          border: 1px solid rgba(0,0,0,0.05); 
          background: white; 
          border-radius: 14px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .premium-back-btn:hover { 
          color: #F28C0F; 
          transform: translateX(-3px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }

        /* Buttons */
        .btn-premium-action {
          background: linear-gradient(135deg, #F28C0F 0%, #F8A13E 100%);
          color: white;
          font-weight: 700;
          letter-spacing: 0.5px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(242, 140, 15, 0.25);
        }
        .btn-premium-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(242, 140, 15, 0.35);
          filter: brightness(1.05);
        }

        .premium-outline-btn {
          border: 2px solid #e2e8f0;
          color: #64748b;
          border-radius: 12px;
          background: white;
        }
        .premium-outline-btn:hover {
          background: #F28C0F !important;
          border-color: #F28C0F !important;
          color: white !important;
          transform: translateY(-2px);
        }

        /* Information Boxes */
        .premium-info-box {
          background: #f8fafc;
          border: 1px solid rgba(0,0,0,0.03);
        }
        .premium-info-box:hover {
          background: white;
          border-color: #F28C0F;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
        }
        .info-box-icon {
          background: rgba(242, 140, 15, 0.08);
          color: #F28C0F;
          font-size: 1.1rem;
        }

        .premium-role-badge {
          background: linear-gradient(135deg, #F28C0F 0%, #fbbf24 100%) !important;
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          color: white !important;
        }

        .header-icon-container {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(242, 140, 15, 0.1);
          color: #F28C0F;
          border-radius: 10px;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        [data-coreui-theme="dark"] .bg-glass-premium { 
          background: rgba(30, 41, 59, 0.7) !important; 
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        [data-coreui-theme="dark"] .premium-card {
          background: rgba(30, 41, 59, 0.4) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        [data-coreui-theme="dark"] .premium-back-btn { background: #1e293b; border-color: rgba(255,255,255,0.05); color: #94a3b8; }
        [data-coreui-theme="dark"] .premium-outline-btn { background: transparent; border-color: #334155; color: #94a3b8; }
        [data-coreui-theme="dark"] .premium-info-box { 
          background: rgba(255, 255, 255, 0.03) !important; 
          border-color: rgba(255, 255, 255, 0.05) !important;
        }
        [data-coreui-theme="dark"] .premium-info-box:hover { 
          background: rgba(255, 255, 255, 0.06) !important; 
          border-color: #F28C0F !important;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
        }
        [data-coreui-theme="dark"] .premium-toast { background: #1e293b !important; }
        [data-coreui-theme="dark"] .header-title-custom { color: white; }
        [data-coreui-theme="dark"] .text-dark-custom { color: #e2e8f0; }
        [data-coreui-theme="dark"] .text-muted-custom { color: #94a3b8; }
        [data-coreui-theme="dark"] .info-box-icon { background: rgba(242, 140, 15, 0.15); }

        @media print { .no-print { display: none !important; } .premium-card { box-shadow: none !important; border: 1px solid #eee !important; } }
      `}</style>
    </CContainer>
  )
}

export default PerfilUsuarioGeneral