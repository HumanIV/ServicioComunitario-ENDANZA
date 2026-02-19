// helpFetch.js
export const helpFetch = () => {
  // Usa la variable de entorno si está disponible, fallback a localhost
  // Quitar trailing slash y también quitar /api del final si viene en la env var
  const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001')
    .replace(/\/+$/, '')       // quitar slash(es) finales
    .replace(/\/api\/+$/, '') // quitar /api final si existe

  /**
   * Normaliza la URL COMPLETA para evitar rutas duplicadas tipo /api/api/...
   * Opera sobre la URL final (BASE_URL + endpoint) para cubrir todos los casos:
   *   - VITE_API_URL con /api al final + endpoint con /api → /api/api → /api
   *   - VITE_API_URL sin /api + endpoint sin /api → agrega /api una sola vez
   */
  const normalizeUrl = (base, endpoint) => {
    // Asegurarse que el endpoint empiece con /
    const ep = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

    // Combinar
    let fullUrl = `${base}${ep}`

    // Colapsar dobles slashes que no sean parte de http:// o https://
    fullUrl = fullUrl.replace(/(https?:\/\/[^/]+)(.*)/,
      (_, origin, path) => origin + path.replace(/\/\/+/g, '/')
    )

    // Colapsar /api/api (o más) a un solo /api
    fullUrl = fullUrl.replace(/(https?:\/\/[^/]+)((\/api)+)(.*)/, (_, origin, apis, _last, rest) => {
      return `${origin}/api${rest}`
    })

    // Asegurarse que la ruta incluya /api antes del primer segmento real
    fullUrl = fullUrl.replace(/(https?:\/\/[^/]+)(\/(?!api))/,
      (_, origin, start) => `${origin}/api${start}`
    )

    return fullUrl
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

    const fullUrl = normalizeUrl(BASE_URL, endpoint)

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