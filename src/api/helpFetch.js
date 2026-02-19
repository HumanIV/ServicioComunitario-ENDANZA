// helpFetch.js - VERSIÓN SIMPLE Y CORRECTA ✅
export const helpFetch = () => {
  const URL = import.meta.env.VITE_API_URL || 'https://endanza-backend.onrender.com'

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

    console.log(`🌐 ${options.method} ${URL}${endpoint}`)

    try {
      const response = await fetch(`${URL}${endpoint}`, options)
      
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
      const response = await fetch(`${URL}/api/health`)
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