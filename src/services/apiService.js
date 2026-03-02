import axios from 'axios'
import { attachAuthInterceptor } from './tokenService'

/* =====================================================
   AXIOS INSTANCES
===================================================== */

// 🔓 Login / Renew
const authApi = axios.create({
  baseURL: 'https://portal.ip-one.com/AdsControlV2/',
  headers: { 'Content-Type': 'application/json' },
})

// 🔐 Protected API
const api = axios.create({
  baseURL: 'https://api.ip-one.com/AdsControlV2/',
  headers: { 'Content-Type': 'application/json' },
})

// ⭐ ใช้ interceptor กลาง
attachAuthInterceptor(api)

/* =====================================================
   AUTH
===================================================== */

export const loginUser = async (username, password) => {
  const res = await authApi.post('Ads/v1/Authentication', {
    username,
    password,
  })
  return res.data
}

/* =====================================================
   USER / BUSINESS API
===================================================== */

export const gUserAd = async () => {
  const res = await api.get('IP1Potal/v1/gUserAd')
  return res.data
}

export const loadUserAd = async () => {
  const res = await api.get('Ads/v1/loadUserAd')
  return res.data
}

export const getUser = async username => {
  const res = await api.post('Ads/v1/GetUser', { username })
  return res.data
}

export const changePassword = async (username, password) => {
  const res = await api.post('Ads/v1/ChangePassword', {
    username,
    password,
  })
  return res.data
}

export const UpdateMobile = async (username, mobile) => {
  const res = await api.post('Ads/v1/UpdateMobile', {
    username,
    mobile,
  })
  return res.data
}

/* =====================================================
   UPLOAD (token แนบอัตโนมัติ)
===================================================== */

export const uploadImage = async (file, empId) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('empId', empId)

  const res = await api.post(
    `IP1Potal/v1/uploadImage?empId=${empId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return res.data
}

/* =====================================================
   OTP
===================================================== */

export const sendOtp = async mobile => {
  const res = await api.post(
    `IP1Potal/v1/SendOtpRequest?msisdn=${mobile}`
  )
  return res.data
}

export const VerifyOtp = async (token, pin) => {
  const res = await api.post(
    'IP1Potal/v1/SendVerifyOtp',
    { token, pin }
  )
  return res.data
}

/* =====================================================
   JWT VALIDATION
===================================================== */

export const ValidateJwtToken = async () => {
  const accessToken = localStorage.getItem('accessTokenIpvOee')
  if (!accessToken) throw new Error('No access token')

  const res = await api.get(
    `Jwt/v1/ValidateJwtToken?token=${accessToken}`
  )
  return res.data
}