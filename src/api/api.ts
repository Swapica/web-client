import axios, { AxiosRequestConfig } from 'axios'
import { makeApiCallers } from './apiCallers'
import { config } from '@/config'

const axiosConfig: AxiosRequestConfig = {
  baseURL: config.API_URL,
  timeout: 60 * 1000, // 1 minute
  headers: {
    'Content-Type': 'application/vnd.api+json',
  },
}
const api = axios.create(axiosConfig)
const callers = makeApiCallers(api)

export { api, callers }
