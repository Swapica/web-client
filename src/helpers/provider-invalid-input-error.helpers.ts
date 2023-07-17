import { ProviderInvalidInputErrors } from '@/enums'
import { i18n } from '@/localization'

export function handleProviderInvalidInputError(errorMsg: string) {
  const { t } = i18n.global
  const errorValue = errorMsg.split(':')[2]?.trim() || errorMsg
  switch (errorValue) {
    case ProviderInvalidInputErrors.notEnoughBalance:
      return t('provider-invalid-input-errors.not-enough-balance')
    default:
      return t('provider-invalid-input-errors.default')
  }
}
