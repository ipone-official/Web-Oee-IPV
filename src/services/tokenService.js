import axios from 'axios'
import router from '@/router'
import eventBus from '@/plugins/eventBus'

let isRefreshing = false
let refreshPromise = null

/* =====================================================
   TOKEN UTIL
===================================================== */

export function isTokenNearExpiration() {
  const token = localStorage.getItem('accessTokenIpvOee')
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)
    return payload.exp - now < 300 // < 5 นาที
  } catch {
    return true
  }
}

/* =====================================================
   LOGOUT
===================================================== */

export function handleLogout() {
  localStorage.removeItem('accessTokenIpvOee')
  localStorage.removeItem('refreshTokenIpvOee')

  eventBus.emit('auth:session-expired')
  router.replace({ name: 'Login' })
}

/* =====================================================
   REFRESH TOKEN
===================================================== */

async function refreshAccessToken() {
  if (isRefreshing) {
    return refreshPromise
  }

  isRefreshing = true

  const refreshToken = localStorage.getItem('refreshTokenIpvOee')
  if (!refreshToken) {
    throw new Error('No refresh token')
  }

refreshPromise = axios.post(
  'https://portal.ip-one.com/AdsControlV2/Ads/v1/RenewToken',
  `"${refreshToken}"`, // ⭐ ใส่ quote เอง
  {
    headers: {
      'Content-Type': 'application/json',
    },
    transformRequest: [(data) => data], // ⭐ ปิด axios auto transform
  }
)
.then(res => {
  const newAccessToken = res.data.accessToken
  localStorage.setItem('accessTokenIpvOee', newAccessToken)
  return newAccessToken
})
.finally(() => {
  isRefreshing = false
})

  return refreshPromise
}

/* =====================================================
   ATTACH INTERCEPTOR
===================================================== */

export function attachAuthInterceptor(apiInstance) {
  // REQUEST
  apiInstance.interceptors.request.use(async config => {
    let token = localStorage.getItem('accessTokenIpvOee')
    if (!token) return config

    if (isTokenNearExpiration()) {
      try {
        token = await refreshAccessToken()
      } catch (e) {
        handleLogout()
        return Promise.reject(e)
      }
    }

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }

    return config
  })

  // RESPONSE
apiInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const newToken = await refreshAccessToken()

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`

        return apiInstance(originalRequest)
      } catch (e) {
        handleLogout()
        return Promise.reject(e)
      }
    }

    return Promise.reject(error)
  }
)
}