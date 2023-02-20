import Jsona from 'jsona'
import { AxiosInstance, AxiosResponse } from 'axios'
import { StatusCodes } from '@/api/apiEnums'

export function attachJsonApiUnpacker(axios: AxiosInstance): void {
  const jsona = new Jsona()
  axios.interceptors.response.use((success): AxiosResponse => {
    if (success.status === StatusCodes.noContent) return success
    success.links = success?.data?.links
    success.meta = success?.data?.meta
    success.data = jsona.deserialize(success.data)
    return success
  })
}
