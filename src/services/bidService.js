import { api } from './api'

export const getBidsForItem = async (itemId) => {
  const res = await api.get(`/bids/${itemId}`)
  return res.data
}

export const placeBid = async (data) => {
  const res = await api.post('/bids', data)
  return res.data
}