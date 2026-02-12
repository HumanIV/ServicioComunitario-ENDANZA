// src/views/pages/login/Login.jsx - VERSIÓN 100% SIN CACHE
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilLockLocked,
  cilUser,
  cilInput,
  cilWarning,
  cilCheckCircle,
  cilShieldAlt,
  cilXCircle,
  cilInfo
} from '@coreui/icons'

import { authService } from '../../../services/authService'

// FUNCIÓN PARA NORMALIZAR Y DETECTAR TIPOS DE ERROR
const detectErrorType = (response) => {
  const msg = String(response.msg || response.message || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')

  const patterns = {
    password: [
      'contraseña', 'password', 'credencial', 'incorrect password',
      'invalid password', 'wrong password', 'clave incorrecta',
      'bad credentials', 'invalid credentials'
    ],
    email: [
      'correo', 'email', 'usuario', 'user', 'not found', 'no encontrado',
      'invalid email', 'email not found', 'user not found', 'does not exist',
      'no existe', 'no registrado'
    ],
    inactive: [
      'inactivo', 'inactive', 'bloqueado', 'blocked', 'suspendido',
      'suspended', 'desactivado', 'deshabilitado', 'disabled',
      'account is inactive', 'cuenta inactiva', 'activo ',
      'no activo', 'not active', 'pending activation', 'is inactive'
    ],
    unauthorized: [
      'no autorizado', 'unauthorized', 'permiso', 'permission',
      'acceso denegado', 'access denied', 'forbidden', 'prohibido',
      'no tiene permisos'
    ],
    validation: [
      'validation', 'validación', 'formato incorrecto', 'invalid format',
      'campo requerido', 'required field'
    ]
  }

  for (const [type, keywords] of Object.entries(patterns)) {
    for (const keyword of keywords) {
      const normalizedKeyword = keyword.trim().toLowerCase()
      if (
        msg === normalizedKeyword ||
        msg.includes(normalizedKeyword) ||
        (normalizedKeyword === 'activo ' && (msg.includes('activo') || msg === 'activo'))
      ) {
        return type
      }
    }
  }
  return 'generic'
}

// FUNCIÓN PARA VERIFICAR ESTADO DE CUENTA
const validateAccountStatus = (userData) => {
  if (!userData) return false

  // Buscar directamente en is_active que es como viene del backend
  if (userData.is_active) {
    const estado = String(userData.is_active).toLowerCase().trim()
    if (estado.includes('activo') || estado === '1' || estado === 'true') {
      console.log('✅ Usuario activo:', estado)
      return true
    }
  }
  
  return false
}

// FUNCIÓN PARA REDIRECCIÓN POR ROL - SIN CACHE
const getRedirectPathByRole = (roleName) => {
  switch (roleName) {
    case 'admin':
      return '/dashboard'
    case 'docente':
      return '/docente/inicio'
    case 'estudiante':
      return '/inicio'
    case 'representante':
      return '/inicio'
    default:
      return '/inicio'
  }
}

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking')

  const [visiblePassError, setVisiblePassError] = useState(false)
  const [visibleEmailError, setVisibleEmailError] = useState(false)
  const [visibleGenericError, setVisibleGenericError] = useState(false)
  const [visibleInactiveError, setVisibleInactiveError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const sessionExpired = searchParams.get('session') === 'expired'
  const logoutSuccess = searchParams.get('logout') === 'success'

  // ✅ SOLO verificar conexión, NUNCA redirigir automáticamente
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const { helpFetch } = await import('../../../api/helpFetch')
        const api = helpFetch()
        const isConnected = await api.checkConnection()
        setBackendStatus(isConnected ? 'connected' : 'error')
      } catch (error) {
        setBackendStatus('error')
      }
    }
    checkBackend()
  }, [])

  // ✅ SOLO manejar logout exitoso, NO redirección automática por token
  useEffect(() => {
    if (logoutSuccess) {
      const timer = setTimeout(() => {
        navigate('/login', { replace: true })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [logoutSuccess, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRetryConnection = async () => {
    setBackendStatus('checking')
    try {
      const { helpFetch } = await import('../../../api/helpFetch')
      const api = helpFetch()
      const isConnected = await api.checkConnection()
      setBackendStatus(isConnected ? 'connected' : 'error')
    } catch {
      setBackendStatus('error')
    }
  }

  const handleContactAdmin = () => {
    setVisibleInactiveError(false)
    alert('Por favor, contacta al administrador del sistema para activar tu cuenta.')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    setVisiblePassError(false)
    setVisibleEmailError(false)
    setVisibleGenericError(false)
    setVisibleInactiveError(false)
    setErrorMessage('')

    // Validaciones
    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('Por favor, completa todos los campos')
      setVisibleGenericError(true)
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido')
      setVisibleGenericError(true)
      setLoading(false)
      return
    }

    try {
      const response = await authService.login(
        formData.email.trim(),
        formData.password
      )

      if (response.success) {
        // ✅ 1. Obtener usuario de la respuesta (NO de localStorage)
        const userData = response.user
        
        // ✅ 2. Verificar estado con datos FRESCOS
        if (!validateAccountStatus(userData)) {
          setErrorMessage('Tu cuenta está inactiva. Contacta al administrador.')
          setVisibleInactiveError(true)
          setLoading(false)
          return
        }
        
        // ✅ 3. Obtener rol del usuario (ya viene mapeado del authService)
        const roleName = userData.rol || 'estudiante'
        
        // ✅ 4. Redirigir INMEDIATAMENTE sin usar cache
        const redirectPath = getRedirectPathByRole(roleName)
        console.log(`🚀 Redirigiendo a ${redirectPath} como ${roleName}`)
        navigate(redirectPath, { replace: true })
        
      } else {
        const errorType = detectErrorType({ msg: response.message })
        
        switch (errorType) {
          case 'password':
            setVisiblePassError(true)
            break
          case 'email':
            setVisibleEmailError(true)
            break
          case 'inactive':
            setErrorMessage(response.message)
            setVisibleInactiveError(true)
            break
          default:
            setErrorMessage(response.message || 'Error en el inicio de sesión')
            setVisibleGenericError(true)
        }
      }
    } catch (error) {
      console.error('❌ Error en login:', error)
      setErrorMessage('Error de conexión con el servidor. Verifica tu conexión a internet.')
      setVisibleGenericError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page-wrapper">
      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>

      <CContainer>
        <CRow className="min-vh-100 align-items-center justify-content-center">
          <CCol md={8} lg={6} xl={4}>
            <div className="login-brand text-center mb-4">
              <div className="sidebar-logo-circle-premium mx-auto mb-3">
                <img src="/favicon.png" alt="ENDANZA Logo" className="img-fluid" style={{ maxWidth: '85px' }} />
              </div>
              <h1 className="text-white h3 fw-medium mb-1">ENDANZA</h1>
              <p className="text-white-50 fw-regular small mb-0">Escuela Nacional de Danza</p>

              <div className="mt-3">
                {backendStatus === 'checking' && (
                  <div className="d-flex align-items-center justify-content-center text-warning">
                    <CSpinner size="sm" className="me-2" />
                    <small className="text-white-50">Conectando al servidor...</small>
                  </div>
                )}
                {backendStatus === 'connected' && (
                  <div className="d-flex align-items-center justify-content-center text-success">
                    <CIcon icon={cilCheckCircle} className="me-2" />
                    <small className="text-white-50">Conectado al servidor</small>
                  </div>
                )}
                {backendStatus === 'error' && (
                  <div className="d-flex align-items-center justify-content-center text-danger">
                    <CIcon icon={cilWarning} className="me-2" />
                    <small className="text-white-50">Error de conexión</small>
                    <CButton
                      size="sm"
                      color="link"
                      className="text-warning p-0 ms-2"
                      onClick={handleRetryConnection}
                    >
                      Reintentar
                    </CButton>
                  </div>
                )}
              </div>
            </div>

            <CCard className="premium-card border-0 overflow-hidden shadow-lg">
              <CCardBody className="p-4 bg-light-custom">
                {sessionExpired && (
                  <CAlert color="warning" className="mb-3 py-2">
                    <CIcon icon={cilWarning} className="me-2" />
                    Tu sesión ha expirado. Por favor, inicia sesión nuevamente.
                  </CAlert>
                )}

                {logoutSuccess && (
                  <CAlert color="success" className="mb-3 py-2">
                    <CIcon icon={cilCheckCircle} className="me-2" />
                    Sesión cerrada exitosamente. ¡Vuelve pronto!
                  </CAlert>
                )}

                <CForm onSubmit={handleLogin}>
                  <div className="mb-3">
                    <h2 className="fw-bold header-title-custom h5 mb-1">Bienvenido</h2>
                    <p className="text-muted-custom small mb-0">Ingresa tus datos para acceder.</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted-custom mb-1 ls-1">
                      Correo Electrónico
                    </label>
                    <CInputGroup>
                      <CInputGroupText className="bg-light-custom bg-opacity-25 border-end-0 py-1 border-light-custom">
                        <CIcon icon={cilUser} style={{ color: 'var(--primary-500)' }} />
                      </CInputGroupText>
                      <CFormInput
                        name="email"
                        type="email"
                        placeholder="ejemplo@escueladanza.com"
                        className="input-premium border-start-0 py-1 bg-light-custom border-light-custom"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        autoComplete="email"
                        disabled={loading || backendStatus === 'error'}
                      />
                    </CInputGroup>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted-custom mb-1 ls-1">
                      Contraseña
                    </label>
                    <CInputGroup>
                      <CInputGroupText className="bg-light-custom bg-opacity-25 border-end-0 py-1 border-light-custom">
                        <CIcon icon={cilLockLocked} style={{ color: 'var(--primary-500)' }} />
                      </CInputGroupText>
                      <CFormInput
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="input-premium border-start-0 py-1 bg-light-custom border-light-custom"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        autoComplete="current-password"
                        disabled={loading || backendStatus === 'error'}
                      />
                    </CInputGroup>
                  </div>

                  <CButton
                    type="submit"
                    className="btn-premium w-100 py-2 mt-1 d-flex align-items-center justify-content-center fw-bold"
                    disabled={loading || backendStatus === 'error'}
                  >
                    {loading ? (
                      <>
                        <CSpinner component="span" size="sm" className="me-2" />
                        Autenticando...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilInput} className="me-2" />
                        INICIAR SESIÓN
                      </>
                    )}
                  </CButton>

                  <div className="text-center mt-3">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        navigate('/forgot-password')
                      }}
                      className="text-decoration-none small"
                      style={{ color: 'var(--primary-500)' }}
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                </CForm>
              </CCardBody>
              <div className="card-footer-accent"></div>
            </CCard>

            <div className="mt-3 p-3 bg-dark bg-opacity-25 rounded">
              <small className="text-white-50 d-block text-center">
                Backend: http://localhost:3001
              </small>
              <small className="text-white-50 d-block text-center mt-1">
                Estado: {backendStatus === 'connected' ? '🟢 Conectado' :
                  backendStatus === 'error' ? '🔴 Error' : '🟡 Conectando...'}
              </small>
            </div>

            <p className="text-center text-white-50 mt-3 small mb-0">
              &copy; {new Date().getFullYear()} Escuela Nacional de Danza.
            </p>
          </CCol>
        </CRow>
      </CContainer>

      {/* ✅ MODAL PARA ERROR DE CONTRASEÑA */}
      <CModal visible={visiblePassError} onClose={() => setVisiblePassError(false)} className="premium-modal" backdrop="static">
        <div className="modal-top-bar bg-warning"></div>
        <CModalHeader className="border-0 py-4 px-4 bg-transparent outline-none">
          <CModalTitle className="fw-bold d-flex align-items-center header-title-custom w-100">
            <div className="bg-orange-soft p-3 rounded-4 me-3">
              <CIcon icon={cilLockLocked} className="text-warning" size="xl" />
            </div>
            <div className="flex-grow-1">
              <h4 className="mb-0 fw-black header-title-custom ls-tight">Error de Seguridad</h4>
              <div className="small text-muted-custom fw-medium">Contraseña incorrecta detectada</div>
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4 pt-2">
          <div className="p-4 rounded-5 bg-light-custom bg-opacity-10 border border-light-custom border-opacity-20 mb-0 shadow-inner-soft">
            <p className="mb-0 text-center fw-medium">
              La contraseña ingresada no coincide con nuestros registros.
              Por favor, verifique sus datos e intente nuevamente.
            </p>
          </div>
        </CModalBody>
        <CModalFooter className="border-0 p-4 pt-1">
          <CButton variant="ghost" className="px-4 fw-bold text-muted-custom hover-lift shadow-none border-0" onClick={() => setVisiblePassError(false)}>
            CANCELAR
          </CButton>
          <CButton color="warning" className="btn-premium px-5 py-3 rounded-pill fw-bold ms-auto shadow-orange text-white" onClick={() => setVisiblePassError(false)}>
            <CIcon icon={cilLockLocked} className="me-2" />
            REINTENTAR
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ✅ MODAL PARA ERROR DE CORREO */}
      <CModal visible={visibleEmailError} onClose={() => setVisibleEmailError(false)} className="premium-modal" backdrop="static">
        <div className="modal-top-bar bg-danger"></div>
        <CModalHeader className="border-0 py-4 px-4 bg-transparent outline-none">
          <CModalTitle className="fw-bold d-flex align-items-center header-title-custom w-100">
            <div className="bg-red-soft p-3 rounded-4 me-3">
              <CIcon icon={cilXCircle} className="text-danger" size="xl" />
            </div>
            <div className="flex-grow-1">
              <h4 className="mb-0 fw-black header-title-custom ls-tight">Usuario no Encontrado</h4>
              <div className="small text-muted-custom fw-medium">Correo electrónico no registrado</div>
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4 pt-2">
          <div className="p-4 rounded-5 bg-light-custom bg-opacity-10 border border-light-custom border-opacity-20 mb-0 shadow-inner-soft">
            <p className="mb-0 text-center fw-medium">
              El correo electrónico ingresado no se encuentra en nuestra base de datos.
              Asegúrese de escribirlo correctamente.
            </p>
          </div>
        </CModalBody>
        <CModalFooter className="border-0 p-4 pt-1">
          <CButton variant="ghost" className="px-4 fw-bold text-muted-custom hover-lift shadow-none border-0" onClick={() => setVisibleEmailError(false)}>
            CANCELAR
          </CButton>
          <CButton color="danger" className="btn-premium px-5 py-3 rounded-pill fw-bold ms-auto shadow-orange text-white" style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => setVisibleEmailError(false)}>
            <CIcon icon={cilUser} className="me-2" />
            CERRAR
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ✅ MODAL PARA CUENTA INACTIVA */}
      <CModal visible={visibleInactiveError} onClose={() => setVisibleInactiveError(false)} className="premium-modal" backdrop="static">
        <div className="modal-top-bar bg-warning"></div>
        <CModalHeader className="border-0 py-4 px-4 bg-transparent outline-none">
          <CModalTitle className="fw-bold d-flex align-items-center header-title-custom w-100">
            <div className="bg-yellow-soft p-3 rounded-4 me-3">
              <CIcon icon={cilWarning} className="text-warning" size="xl" />
            </div>
            <div className="flex-grow-1">
              <h4 className="mb-0 fw-black header-title-custom ls-tight">Cuenta Inactiva</h4>
              <div className="small text-muted-custom fw-medium">Acceso restringido temporalmente</div>
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4 pt-2">
          <div className="p-4 rounded-5 bg-light-custom bg-opacity-10 border border-light-custom border-opacity-20 mb-3 shadow-inner-soft">
            <p className="mb-0 text-center fw-medium">
              {errorMessage || 'Tu cuenta está inactiva actualmente. Por favor, contacta al administrador del sistema para activar tu cuenta.'}
            </p>
          </div>
          <div className="p-3 rounded-4 bg-light-custom bg-opacity-10 border border-warning border-opacity-10">
            <small className="d-block mb-2 text-uppercase fw-bold ls-1 opacity-75">📞 Contacto de Soporte:</small>
            <div className="small">
              <div className="mb-1">• Teléfono: <span className="fw-bold text-warning">(123) 456-7890</span></div>
              <div className="mb-1">• Email: <span className="fw-bold text-warning">admin@escueladanza.com</span></div>
              <div>• Ubicación: <span className="fw-bold">Edificio Principal, 2do piso</span></div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter className="border-0 p-4 pt-1">
          <CButton variant="ghost" className="px-4 fw-bold text-muted-custom hover-lift shadow-none border-0" onClick={() => setVisibleInactiveError(false)}>
            CERRAR
          </CButton>
          <CButton color="warning" className="btn-premium px-5 py-3 rounded-pill fw-bold ms-auto shadow-orange text-white" onClick={handleContactAdmin}>
            <CIcon icon={cilShieldAlt} className="me-2" />
            CONTACTAR SOPORTE
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ✅ MODAL PARA ERRORES GENÉRICOS */}
      <CModal visible={visibleGenericError} onClose={() => setVisibleGenericError(false)} className="premium-modal" backdrop="static">
        <div className="modal-top-bar bg-secondary"></div>
        <CModalHeader className="border-0 py-4 px-4 bg-transparent outline-none">
          <CModalTitle className="fw-bold d-flex align-items-center header-title-custom w-100">
            <div className="bg-blue-soft p-3 rounded-4 me-3">
              <CIcon icon={cilInfo} className="text-info" size="xl" />
            </div>
            <div className="flex-grow-1">
              <h4 className="mb-0 fw-black header-title-custom ls-tight">Información del Sistema</h4>
              <div className="small text-muted-custom fw-medium">Notificación de proceso</div>
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4 pt-2">
          <div className="p-4 rounded-5 bg-light-custom bg-opacity-10 border border-light-custom border-opacity-20 mb-0 shadow-inner-soft">
            <p className="mb-0 text-center fw-medium">
              {errorMessage || 'Ocurrió un error al procesar la solicitud. Por favor intente más tarde.'}
            </p>
          </div>
        </CModalBody>
        <CModalFooter className="border-0 p-4 pt-1">
          <CButton color="secondary" className="btn-premium px-5 py-3 rounded-pill fw-bold ms-auto shadow-soft text-white" style={{ background: 'var(--neutral-600)', borderColor: 'var(--neutral-600)' }} onClick={() => setVisibleGenericError(false)}>
            ENTENDIDO
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Login