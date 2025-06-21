import { api } from './api'

export async function getAllItems(page = 1, limit = 9) {
  const res = await api.get(`/items?page=${page}&limit=${limit}`);
  return res.data;
}

export const createItem = async (data) => {
  const res = await api.post('/items', data)
  return res.data
}