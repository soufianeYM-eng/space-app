import axios from 'axios'
import { TokenManager } from '@/managers/token-manager/token.manager'
import { useRouter } from 'vue-router'

const router = useRouter()
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor - Handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear it
      TokenManager.clearToken()
      // Redirect to login page
      router.push({ name: 'Login' })
    }
    return Promise.reject(error)
  },
)

export default api
