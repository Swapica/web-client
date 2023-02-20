import { AxiosResponseHeaders, AxiosRequestConfig } from 'axios'

declare module 'axios' {
  interface AxiosResponse<T = unknown, D = unknown> {
    data: T
    status: number
    statusText: string
    headers: AxiosResponseHeaders
    config: AxiosRequestConfig<D>
    request?: unknown
    links: Record<string, string>
    meta: Record<string, unknown>
  }
}
