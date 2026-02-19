// helpFetch.js
export const helpFetch = () => {
  // Usa la variable de entorno si está disponible, fallback a localhost
  const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '')

  /**
   * Normaliza el endpoint para evitar rutas duplicadas tipo /api/api/...
   * - Elimina slashes dobles (//)
   * - Si detecta /api/api colapsa a un solo /api
   * - Si el endpoint no empieza con /api, agrega /api automáticamente
   */
  const normalizeEndpoint = (endpoint) => {
    // Asegurarse de que empiece con /
    let normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

    // Colapsar dobles slashes (excepto en http://)
    normalized = normalized.replace(/\/\/+/g, '/')

    // Colapsar /api/api... a /api
    normalized = normalized.replace(/^(\/api)+/, '/api')

    // Si no empieza con /api, agregar el prefijo
    if (!normalized.startsWith('/api')) {
      normalized = `/api${normalized}`
    }

    return normalized
  }

  const customFetch = async (endpoint, options = {}) => {
    options.method = options.method || 'GET'

    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    const token = localStorage.getItem('accessToken')
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`
    }

    options.headers = {
      ...defaultHeaders,
      ...(options.headers || {}),
    }

    if (options.body) {
      options.body = JSON.stringify(options.body)
    }

    const normalizedEndpoint = normalizeEndpoint(endpoint)
    const fullUrl = `${BASE_URL}${normalizedEndpoint}`

    console.log(`🌐 ${options.method} ${fullUrl}`)

    try {
      const response = await fetch(fullUrl, options)

      console.log(`📡 Response status: ${response.status} ${response.statusText}`)

      const text = await response.text()

      if (!text || text.trim() === '') {
        console.log('✅ Response vacía')
        return { ok: response.ok, _ok: response.ok, _status: response.status }
      }

      let data
      try {
        data = JSON.parse(text)
        console.log(`✅ JSON Response:`, data)
      } catch (jsonError) {
        console.log(`⚠️ Response no es JSON:`, text)
        data = { text, ok: response.ok, _ok: response.ok, _status: response.status }
      }

      if (!data._ok) data._ok = response.ok
      if (!data._status) data._status = response.status
      if (!data._statusText) data._statusText = response.statusText

      return data
    } catch (error) {
      console.error(`❌ Network error:`, error.message)
      return {
        ok: false,
        message: 'Error de conexión con el servidor',
        _ok: false,
        _status: 0,
        _statusText: 'Network Error',
      }
    }
  }

  const get = (endpoint, options = {}) => customFetch(endpoint, { ...options, method: 'GET' })
  const post = (endpoint, body, options = {}) => customFetch(endpoint, { ...options, method: 'POST', body })
  const put = (endpoint, body, options = {}) => customFetch(endpoint, { ...options, method: 'PUT', body })
  const del = (endpoint, options = {}) => customFetch(endpoint, { ...options, method: 'DELETE' })

  const checkConnection = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/health`)
      if (response.ok) {
        const data = await response.json()
        console.log('🔌 Backend connected:', data.message)
        return true
      }
      return false
    } catch (error) {
      console.error('🔌 Connection check failed:', error)
      return false
    }
  }

  return {
    get,
    post,
    put,
    delete: del,
    customFetch,
    checkConnection,
    URL: BASE_URL,
  }
}