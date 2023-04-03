import { ProviderInternalErrors } from '@/enums'
import { i18n } from '@/localization'

export function handleProviderInternalError(errorMsg: string) {
  const { t } = i18n.global

  const insufficientFundsRegexp = new RegExp(
    /err: insufficient funds for gas/gm,
  )
  const insufficientFunds = insufficientFundsRegexp.exec(errorMsg)
  if (insufficientFunds) {
    return t('provider-internal-errors.insufficient-funds')
  }

  const errorValue = errorMsg.split(':')[2]?.trim()
  switch (errorValue) {
    case ProviderInternalErrors.notEnoughBalance:
      return t('provider-internal-errors.not-enough-balance')
    default:
      return t('provider-internal-errors.default')
  }
}
