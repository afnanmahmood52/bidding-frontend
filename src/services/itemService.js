import { api } from './api'

export const getAllItems = async () => {
  const res = await api.get('/items')
  return res.data
}

export const createItem = async (data) => {
  const res = await api.post('/items', data)
  return res.data
}