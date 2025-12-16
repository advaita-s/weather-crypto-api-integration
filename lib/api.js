// frontend/lib/api.js
import axios from 'axios'

const BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

const instance = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  // optional timeout
  timeout: 15000
})

// helper to read token robustly (handles raw string or JSON-stored token)
function getAccessToken() {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('token')
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      return parsed.access || parsed.token || parsed.access_token || null
    }
  } catch (e) {
    // not JSON, assume raw token string
  }
  return raw
}

// request interceptor: attach Authorization if request config has auth:true or headers.__auth
instance.interceptors.request.use(config => {
  const wantAuth = config.auth === true || (config.headers && config.headers.__auth)
  if (wantAuth) {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // remove helper header if present
    if (config.headers && config.headers.__auth) delete config.headers.__auth
  }
  return config
}, err => Promise.reject(err))

// centralized response handler — unwrap data or throw richer error
async function handle(req) {
  try {
    const res = await req
    return res
  } catch (err) {
    // normalize error to throw an object with response field (axios keeps this)
    throw err
  }
}

export default {
  get: (url, opts = {}) => handle(instance.get(url, opts)),
  post: (url, data, opts = {}) => handle(instance.post(url, data, opts)),
  patch: (url, data, opts = {}) => handle(instance.patch(url, data, opts)),
  delete: (url, opts = {}) => handle(instance.delete(url, opts))
}
