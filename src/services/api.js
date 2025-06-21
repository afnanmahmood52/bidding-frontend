import axios from 'axios'

// console.log("process env", process.env)

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' }
})