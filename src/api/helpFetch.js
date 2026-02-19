// helpFetch.js - VERSIÓN INTELIGENTE CON DETECCIÓN DE ERRORES 🧠
export const helpFetch = () => {
  const URL = import.meta.env.VITE_API_URL || 'https://endanza-backend.onrender.com'

  // Función para limpiar endpoints con doble /api
  const cleanEndpoint = (endpoint) => {
    // Si el endpoint tiene /api/api al inicio, lo corregimos
    if (endpoint.includes('/api/api')) {
      const cleaned = endpoint.replace(/\/api\/api/g, '/api');
      console.warn(`⚠️ Detectado doble /api: "${endpoint}" → corregido a "${cleaned}"`);
      return cleaned;
    }
    return endpoint;
  };

  const customFetch = async (endpoint, options = {}) => {
    // Limpiar el endpoint antes de usarlo
    const cleanEndpointPath = cleanEndpoint(endpoint);
    
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

    console.log(`🌐 ${options.method} ${URL}${cleanEndpointPath}`)

    try {
      const response = await fetch(`${URL}${cleanEndpointPath}`, options)
      
      console.log(`📡 Response status: ${response.status}`)
      
      const text = await response.text()
      
      if (!text || text.trim() === '') {
        return { ok: response.ok, _ok: response.ok, _status: response.status }
      }
      
      let data
      try {
        data = JSON.parse(text)
      } catch (jsonError) {
        data = { text, ok: response.ok, _ok: response.ok, _status: response.status }
      }
      
      if (!data._ok) data._ok = response.ok
      if (!data._status) data._status = response.status
      
      return data
      
    } catch (error) {
      console.error(`❌ Network error:`, error.message)
      return {
        ok: false,
        message: 'Error de conexión con el servidor',
        _ok: false,
        _status: 0
      }
    }
  }

  const get = (endpoint, options = {}) => customFetch(endpoint, { ...options, method: 'GET' })
  const post = (endpoint, body, options = {}) => customFetch(endpoint, { ...options, method: 'POST', body })
  const put = (endpoint, body, options = {}) => customFetch(endpoint, { ...options, method: 'PUT', body })
  const del = (endpoint, options = {}) => customFetch(endpoint, { ...options, method: 'DELETE' })

  const checkConnection = async () => {
    try {
      // También limpiamos aquí por si acaso
      const response = await customFetch('/api/health', { method: 'GET' });
      return response.ok
    } catch (error) {
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
    URL 
  }
}