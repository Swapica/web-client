import { ProviderInternalErrors } from '@/enums'
import { i18n } from '@/localization'

export function handleProviderInternalError(errorMsg: string) {
  const { t } = i18n.global
  const errorValue = errorMsg.split(':')[2]?.trim()
  switch (errorValue) {
    case ProviderInternalErrors.notEnoughBalance:
      return t('provider-internal-errors.not-enough-balance')
    default:
      return t('provider-internal-errors.default')
  }
}
