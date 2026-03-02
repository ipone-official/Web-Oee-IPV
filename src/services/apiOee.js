import axios from 'axios'
import { attachAuthInterceptor } from './tokenService'

/* =====================================================
   AXIOS INSTANCE
===================================================== */

const api = axios.create({
  baseURL: 'https://api.ip-one.com/Api-IPVOEE/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ⭐ ใช้ refresh / logout logic กลาง
attachAuthInterceptor(api)

/* =====================================================
   OEE API
===================================================== */

export const gReasonMaster = async () => {
  const res = await api.get('OEE/v1/gReasonMaster')
  return res.data
}

export const gProblemMaster = async () => {
  const res = await api.get('OEE/v1/gProblemMaster')
  return res.data
}

export const iReasonMaster = async payload => {
  const res = await api.post('OEE/v1/InsertReasonMaster', payload)
  return res.data
}

export const dReasonMaster = async payload => {
  const res = await api.post('OEE/v1/DeleteReasonMaster', payload)
  return res.data
}

export const iProblemMaster = async payload => {
  const res = await api.post('OEE/v1/InsertProblemMaster', payload)
  return res.data
}

export const dProblemMaster = async payload => {
  const res = await api.post('OEE/v1/DeleteProblemMaster', payload)
  return res.data
}

export const gMachines = async () => {
  const res = await api.get('OEE/v1/GetMachines')
  return res.data
}

export const gLineProcess = async () => {
  const res = await api.get('OEE/v1/GetLineProcessAll')
  return res.data
}

export const gManPowerStd = async () => {
  const res = await api.get('OEE/v1/gManPowerStd')
  return res.data
}

export const pManPowerStd = async payload => {
  const res = await api.post('OEE/v1/pManPowerStd', payload)
  return res.data
}

export const gComplains = async () => {
  const res = await api.get('OEE/v1/gComplains')
  return res.data
}

export const gComplainsByID = async (lineProcessID, materialCode) => {
  const res = await api.get(
    `OEE/v1/gComplains?lineProcessID=${lineProcessID}&materialCode=${materialCode}&isActive=Y`
  )
  return res.data
}

export const DeleteComplains = async payload => {
  const res = await api.post('OEE/v1/DeleteComplains', payload)
  return res.data
}

export const InsertComplains = async payload => {
  const res = await api.post('OEE/v1/InsertComplains', payload)
  return res.data
}

export const gMaterialBySpeed = async () => {
  const res = await api.get('OEE/v1/gMaterialBySpeed')
  return res.data
}

export const pInsertSpeedStd = async payload => {
  const res = await api.post('OEE/v1/InsertSpeedStd', payload)
  return res.data
}

export const gSpeedStd = async () => {
  const res = await api.get('OEE/v1/GetSpeedStd')
  return res.data
}

export const gFilms = async () => {
  const res = await api.get('OEE/v1/GetFilms')
  return res.data
}

export const gLineProcessUse = async () => {
  const res = await api.get('OEE/v1/GetLineProcess')
  return res.data
}

export const gTProcessListBy = async payload => {
  const res = await api.post('OEE/v1/GetTProcessListBy', payload)
  return res.data
}

export const gProductionOrders = async lineProcessID => {
  const res = await api.get(
    `OEE/v1/GetProductionOrder?lineProcessID=${lineProcessID}`
  )
  return res.data
}

export const gMaterialMaster = async lineProcessID => {
  const res = await api.get(
    `OEE/v1/GetMaterialMaster?lineProcessID=${lineProcessID}`
  )
  return res.data
}

export const pTProcessList = async payload => {
  const res = await api.post('OEE/v1/InsertProcessList', payload)
  return res.data
}

export const pDeletedTProcessList = async payload => {
  const res = await api.post('OEE/v1/DeleteProcessList', payload)
  return res.data
}

export const gReasonDamage = async () => {
  const res = await api.get('OEE/v1/GetReasonDamage')
  return res.data
}

export const gReasonDetailByID = async processID => {
  const res = await api.get(
    `OEE/v1/GetReasonDetailByID?processID=${processID}`
  )
  return res.data
}

export const gProblemDetailByID = async processID => {
  const res = await api.get(
    `OEE/v1/GetProblemDetailByID?processID=${processID}`
  )
  return res.data
}

export const gProblemByID = async lineProcessID => {
  const res = await api.get(
    `OEE/v1/GetProblems?lineProcessID=${lineProcessID}`
  )
  return res.data
}

export const pUpdateDetailProcessList = async payload => {
  const res = await api.post(
    'OEE/v1/InsertDetailReasonAndProblem',
    payload
  )
  return res.data
}