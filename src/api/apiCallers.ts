import { TxResposne } from '@/types'
import {
  AxiosStatic,
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios'
import { attachJsonApiUnpacker } from './apiInterceptors'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function makeApiCallers(axios: AxiosInstance) {
  const api = _cloneAxios(axios)
  attachJsonApiUnpacker(api)

  return {
    post<T = unknown, R = AxiosResponse<T>, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<R> {
      return api.post<T, R, D>(url, data, config)
    },

    patch<T = unknown, R = AxiosResponse<T>, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<R> {
      return api.patch<T, R, D>(url, data, config)
    },

    delete<T = unknown, R = AxiosResponse<T>, D = unknown>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<R> {
      return api.delete<T, R, D>(url, config)
    },

    get<T = unknown, R = AxiosResponse<T>, D = unknown>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<R> {
      return api.get<T, R, D>(url, config)
    },

    uploadFile<T = unknown, R = AxiosResponse<T>, D = File>(
      url: string,
      file: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<R> {
      return api.post<T, R, D>(url, file, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    approve(
      sender: string,
      chainId: string,
      tokenAddress: string,
      tokenType = 'erc20',
    ) {
      return api.post<TxResposne>('/v1/approve', {
        data: {
          sender,
          chain_id: chainId,
          token_address: tokenAddress,
          token_type: tokenType,
        },
      })
    },
  }
}

function _cloneAxios(axios: AxiosInstance) {
  return (axios as AxiosStatic).create()
}
