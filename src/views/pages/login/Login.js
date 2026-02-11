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
import { helpFetch } from '../../../api/helpFetch'

const api = helpFetch()

// FUNCIÓN PARA NORMALIZAR Y DETECTAR TIPOS DE ERROR
const detectErrorType = (response) => {
  // Normalizar el mensaje de error
  const msg = String(response.msg || response.message || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')  // Normalizar espacios múltiples

  console.log('🔍 Mensaje de error normalizado:', `"${msg}"`)

  // Patrones para detectar tipo de error
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
      'account is inactive', 'cuenta inactiva', 'activo ',  // ¡Importante! Maneja espacio al final
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

  // Verificar cada tipo de error
  for (const [type, keywords] of Object.entries(patterns)) {
    for (const keyword of keywords) {
      const normalizedKeyword = keyword.trim().toLowerCase()

      // Verificar coincidencia exacta o parcial
      if (
        msg === normalizedKeyword ||
        msg.includes(normalizedKeyword) ||
        // Caso especial para "activo " con espacio vs "activo"
        (normalizedKeyword === 'activo ' && (msg.includes('activo') || msg === 'activo'))
      ) {
        console.log(`✅ Error detectado como: ${type} (keyword: ${keyword})`)
        return type
      }
    }
  }

  // Si no se encuentra ningún patrón específico
  console.log('⚠️ Error no identificado, usando genérico')
  return 'generic'
}

// FUNCIÓN PARA VERIFICAR ESTADO DE CUENTA - VERSIÓN MEJORADA
const validateAccountStatus = (userData) => {
  if (!userData) {
    console.warn('❌ userData es null o undefined en validateAccountStatus')
    return false
  }

  // DEBUG: Mostrar todos los datos del usuario
  console.log('🔍 DEBUG validateAccountStatus - userData completo:', userData)
  console.log('📋 Propiedades del userData:', Object.keys(userData))

  // Buscar campo de estado en múltiples ubicaciones posibles
  let estadoEncontrado = ''

  // Lista de campos posibles (agregué más campos comunes)
  const posiblesCampos = [
    'estado',
    'status',
    'accountStatus',
    'account_status',
    'activo',
    'active',
    'cuenta_activa',
    'accountState',
    'state',
    'isActive',
    'is_active',
    'estado_cuenta',
    'account_status',
    'user_status',
    'is_enabled',
    'enabled'
  ]

  // Primero buscar en campos específicos
  for (const campo of posiblesCampos) {
    if (userData[campo] !== undefined && userData[campo] !== null && userData[campo] !== '') {
      estadoEncontrado = String(userData[campo])
      console.log(`✅ Campo de estado encontrado: "${campo}" = "${estadoEncontrado}"`)
      break
    }
  }

  // Si no encontramos en campos específicos, buscar en cualquier propiedad
  if (!estadoEncontrado) {
    console.log('⚠️ No se encontró campo específico, buscando en todas las propiedades...')

    // Buscar en todas las propiedades del objeto
    for (const [key, value] of Object.entries(userData)) {
      if (value !== null && value !== undefined && value !== '') {
        const valorStr = String(value).toLowerCase()

        // Si el valor contiene indicadores de estado
        if (valorStr.includes('activo') || valorStr.includes('active') ||
          valorStr.includes('inactivo') || valorStr.includes('inactive') ||
          valorStr === '1' || valorStr === '0' ||
          valorStr === 'true' || valorStr === 'false') {
          estadoEncontrado = String(value)
          console.log(`🔄 Estado encontrado en propiedad inesperada: "${key}" = "${estadoEncontrado}"`)
          break
        }
      }
    }
  }

  // Si aún no encontramos nada, verificar si el objeto tiene propiedades mínimas
  if (!estadoEncontrado) {
    console.log('⚠️ No se pudo determinar estado, asumiendo activo si tiene id y email')

    // Si el usuario tiene id y email, asumimos que está activo (para desarrollo)
    if (userData.id && userData.email) {
      console.log('✅ Usuario tiene id y email, asumiendo activo para desarrollo')
      return true // TEMPORAL: Para desarrollo, asumir activo
    }

    return false
  }

  // Normalizar el estado encontrado
  const estadoNormalizado = estadoEncontrado
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')  // Eliminar todos los espacios

  // Lista de estados considerados como "activos" (expandida)
  const activeStates = [
    'activo',
    'active',
    'habilitado',
    'enabled',
    '1',
    'true',
    'yes',
    'sí',
    'si',
    'activado',
    'habilitado',
    'enabled',
    'activa',
    'active'
  ]

  console.log('🔍 Estado normalizado:', `"${estadoNormalizado}"`)
  console.log('✅ ¿Es activo?', activeStates.includes(estadoNormalizado))

  return activeStates.includes(estadoNormalizado)
}

// FUNCIÓN PARA REDIRECCIÓN INTELIGENTE POR ROL
const getRedirectPathByRole = (roleName) => {
  const savedPath = localStorage.getItem('redirectAfterLogin')

  // Si hay una ruta guardada específica, usarla (solo si tiene permisos)
  if (savedPath && !savedPath.includes('/login')) {
    console.log('🎯 Intentando usar ruta guardada:', savedPath)

    // Verificar que la ruta guardada sea accesible para este rol
    const allowedPathsByRole = {
      'admin': ['/dashboard', '/inicio', '/admin', '/students', '/inscripcion', '/notas', '/boletin', '/horario', '/aulas'],
      'docente': ['/docente/inicio', '/notas', '/boletin', '/horario'],
      'estudiante': [], // ESTUDIANTE NO TIENE RUTAS PERMITIDAS
      'representante': ['/inicio', '/profile', '/boletin-estudiante', '/inscripcion', '/horario-estudiante']
    }

    const allowedPaths = allowedPathsByRole[roleName] || []
    const pathIsAllowed = allowedPaths.some(allowedPath =>
      savedPath.startsWith(allowedPath)
    )

    if (pathIsAllowed) {
      console.log('✅ Ruta guardada es accesible para este rol')
      localStorage.removeItem('redirectAfterLogin')
      return savedPath
    } else {
      console.log('❌ Ruta guardada NO es accesible para rol', roleName)
      localStorage.removeItem('redirectAfterLogin')
    }
  }

  // Redirección por defecto según rol
  switch (roleName) {
    case 'admin':
      console.log('⚙️ Redirigiendo ADMINISTRADOR a dashboard')
      return '/dashboard'

    case 'docente':
      console.log('📚 Redirigiendo DOCENTE a inicio docente')
      return '/docente/inicio'

    case 'estudiante':
      // ¡IMPORTANTE! Redirigir a página especial para estudiantes
      console.log('🎓 ESTUDIANTE NO TIENE ACCESO DIRECTO - Redirigiendo a inicio')
      return '/inicio' // O redirigir a una página especial

    case 'representante':
      console.log('👨‍👩‍👧‍👦 Redirigiendo REPRESENTANTE a inicio')
      return '/inicio'

    default:
      console.log('🔀 Redirigiendo a inicio por defecto')
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

  // Estados para modales de error
  const [visiblePassError, setVisiblePassError] = useState(false)
  const [visibleEmailError, setVisibleEmailError] = useState(false)
  const [visibleGenericError, setVisibleGenericError] = useState(false)
  const [visibleInactiveError, setVisibleInactiveError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Manejo de parámetros de URL
  const sessionExpired = searchParams.get('session') === 'expired'
  const logoutSuccess = searchParams.get('logout') === 'success'

  // Verificar conexión con el backend al cargar
  useEffect(() => {
    const checkBackend = async () => {
      try {
        console.log('🔍 Verificando conexión con backend...')
        const isConnected = await api.checkConnection()
        setBackendStatus(isConnected ? 'connected' : 'error')

        if (!isConnected) {
          console.error('❌ No se pudo conectar al backend')
        }
      } catch (error) {
        console.error('❌ Error verificando conexión:', error)
        setBackendStatus('error')
      }
    }
    checkBackend()
  }, [])

  // MEJORADO: Redirigir si ya está autenticado (con redirección inteligente)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken')
      const user = localStorage.getItem('user')

      if (!token || !user) {
        return false
      }

      try {
        const userData = JSON.parse(user)
        if (userData && userData.id) {
          return validateAccountStatus(userData)
        }
        return false
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        return false
      }
    }

    if (checkAuth()) {
      // Obtener datos del usuario para determinar redirección
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        const roleName = userData?.rol || 'estudiante'

        // Obtener la ruta de redirección inteligente
        const redirectPath = getRedirectPathByRole(roleName)
        console.log('🔀 Redirigiendo a:', redirectPath)

        // Limpiar la ruta almacenada
        localStorage.removeItem('redirectAfterLogin')

        navigate(redirectPath, { replace: true })
      } catch (error) {
        console.error('Error obteniendo datos de usuario:', error)
        navigate('/inicio', { replace: true })
      }
    } else {
      // Si la cuenta está inactiva o no autenticada, limpiar localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')

      // Guardar la ruta actual para redirigir después del login (si no es login)
      if (!location.pathname.includes('/login')) {
        localStorage.setItem('redirectAfterLogin', location.pathname + location.search)
      }
    }
  }, [navigate, location])

  // Limpiar parámetro de logout exitoso después de 5 segundos
  useEffect(() => {
    if (logoutSuccess) {
      const timer = setTimeout(() => {
        // Remover el parámetro de la URL sin recargar la página
        navigate('/login', { replace: true })
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [logoutSuccess, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Resetear todos los errores
    setVisiblePassError(false)
    setVisibleEmailError(false)
    setVisibleGenericError(false)
    setVisibleInactiveError(false)
    setErrorMessage('')

    // Validaciones básicas del frontend
    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('Por favor, completa todos los campos')
      setVisibleGenericError(true)
      setLoading(false)
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido')
      setVisibleGenericError(true)
      setLoading(false)
      return
    }

    try {
      console.log('📤 Enviando login...')

      // Intentar login con el BACKEND
      const response = await api.post('/api/users/login', {
        email: formData.email.trim(),
        password: formData.password
      })

      console.log('✅ Login response completa:', response)

      // DEBUG: Mostrar estructura completa de la respuesta
      console.log('🔍 INSOPECCIÓN COMPLETA DE LA RESPUESTA:')
      console.log('Tipo de respuesta:', typeof response)
      console.log('Es array?', Array.isArray(response))
      console.log('Claves principales:', Object.keys(response))

      // Mostrar estructura del objeto user si existe
      if (response.user) {
        console.log('👤 ESTRUCTURA DEL OBJETO USER:')
        console.log('Tipo:', typeof response.user)
        console.log('Claves:', Object.keys(response.user))
        console.log('Valores:', JSON.stringify(response.user, null, 2))
      }

      // 1. Primero verificar si la respuesta indica error
      if (response._ok === false || response.ok === false) {
        console.log('🔍 Respuesta no exitosa detectada')

        // Usar la función de detección de errores
        const errorType = detectErrorType(response)

        console.log('❌ Login fallido, tipo:', errorType, 'mensaje:', response.msg || response.message)

        // Manejar según el tipo de error detectado
        switch (errorType) {
          case 'password':
            setVisiblePassError(true)
            break
          case 'email':
            setVisibleEmailError(true)
            break
          case 'inactive':
            setErrorMessage(
              response.msg ||
              response.message ||
              'Tu cuenta está inactiva. Por favor, contacta al administrador.'
            )
            setVisibleInactiveError(true)
            break
          case 'unauthorized':
            setErrorMessage('No tienes permisos para acceder al sistema.')
            setVisibleGenericError(true)
            break
          case 'validation':
            setErrorMessage('Datos de inicio de sesión inválidos.')
            setVisibleGenericError(true)
            break
          default:
            setErrorMessage(response.msg || response.message || 'Error en el inicio de sesión')
            setVisibleGenericError(true)
        }
        setLoading(false)
        return
      }

      // 2. Verificar si es una respuesta exitosa
      if ((response.ok === true || response._ok === true) && response.accessToken && response.refreshToken) {
        console.log('🎯 Login exitoso, verificando estado de cuenta...')

        // Verificar estado de la cuenta antes de proceder
        const esActivo = validateAccountStatus(response.user)

        if (response.user && !esActivo) {
          console.warn('⚠️ Usuario marcado como INACTIVO por validateAccountStatus')
          console.log('📋 Propiedades del usuario recibido:', Object.keys(response.user))
          console.log('📊 Valores del usuario:', response.user)

          setErrorMessage('Tu cuenta está inactiva. Contacta al administrador.')
          setVisibleInactiveError(true)
          setLoading(false)
          return
        }

        // Login exitoso y cuenta activa
        console.log('✅ Cuenta ACTIVA, procediendo con login...')

        // 1. Mapear Id_rol a nombre de rol estandarizado (usando TUS nombres de BD)
        const roleMap = {
          1: 'admin',           // "Administrador" en tu BD
          2: 'docente',         // "Docente" en tu BD
          3: 'estudiante',      // "Estudiante" en tu BD
          4: 'representante'    // "Representante" en tu BD
        }

        const roleId = response.user.Id_rol
        const roleName = roleMap[roleId] || 'estudiante'
        const tipoRol = response.user.tipo_rol || 'Estudiante'

        console.log(`🔄 Mapeo de rol: Id_rol ${roleId} → ${roleName} (tipo_rol: ${tipoRol})`)

        // 2. Preparar objeto user con rol estandarizado
        const userWithRole = {
          ...response.user,
          rol: roleName,  // Añadir propiedad 'rol' estandarizada
          tipo_rol: tipoRol, // Mantener el original
          esAdmin: roleName === 'admin',
          esDocente: roleName === 'docente',
          esEstudiante: roleName === 'estudiante',
          esRepresentante: roleName === 'representante'
        }

        // 3. Guardar en localStorage
        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken)
        localStorage.setItem('user', JSON.stringify(userWithRole))

        console.log('🔑 Token guardado exitosamente')
        console.log('👤 Usuario guardado:', userWithRole)

        // 4. REDIRECCIÓN INTELIGENTE POR ROL (usando la nueva función)
        const redirectPath = getRedirectPathByRole(roleName)
        console.log('🚀 Redirigiendo a:', redirectPath)

        navigate(redirectPath, { replace: true })
      } else {
        // 3. Respuesta inesperada o mal formada
        console.error('❌ Respuesta inesperada del servidor:', response)
        setErrorMessage('Error inesperado del servidor. Intenta nuevamente.')
        setVisibleGenericError(true)
      }
    } catch (error) {
      console.error('❌ Error en login catch (error de red o excepción):', error)

      let message = 'Error de conexión con el servidor'
      let errorType = 'generic'

      // Ahora el error puede venir de la API (error.data) o ser un error de red
      if (error.data) {
        // Error estructurado del servidor
        const errorMsg = error.data.msg || error.data.message || error.data
        errorType = detectErrorType({ msg: errorMsg })
        message = errorMsg
      } else if (error.message) {
        // Error de red u otro error
        message = error.message

        // Verificar si es un error de conexión
        if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
          message = 'Error de conexión con el servidor. Verifica tu conexión a internet.'
        }
      }

      setErrorMessage(message)

      // Mostrar el modal correspondiente
      if (errorType === 'inactive') {
        setVisibleInactiveError(true)
      } else {
        setVisibleGenericError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRetryConnection = async () => {
    setBackendStatus('checking')
    try {
      const isConnected = await api.checkConnection()
      setBackendStatus(isConnected ? 'connected' : 'error')
    } catch {
      setBackendStatus('error')
    }
  }

  // Función para contacto con administrador
  const handleContactAdmin = () => {
    setVisibleInactiveError(false)
    alert('Por favor, contacta al administrador del sistema para activar tu cuenta.')
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

              {/* Estado de conexión con BACKEND */}
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
                {/* Mensaje cuando la sesión ha expirado */}
                {sessionExpired && (
                  <CAlert color="warning" className="mb-3 py-2">
                    <CIcon icon={cilWarning} className="me-2" />
                    Tu sesión ha expirado. Por favor, inicia sesión nuevamente.
                  </CAlert>
                )}

                {/* Mensaje cuando se cierra sesión exitosamente */}
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

                  {/* Enlace para recuperar contraseña */}
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

            {/* Información de desarrollo */}
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

      {/* Modal para error de contraseña */}
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

      {/* Modal para error de correo */}
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

      {/* Modal para cuenta inactiva */}
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

      {/* Modal para errores genéricos */}
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