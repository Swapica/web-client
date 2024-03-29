import {
  required as _required,
  email as _email,
  minLength as _minLength,
  maxLength as _maxLength,
  maxValue as _maxValue,
  sameAs as _sameAs,
} from '@vuelidate/validators'
import { ValidationRule } from '@vuelidate/core'
import { Ref } from 'vue'
import { createI18nMessage, MessageProps } from '@vuelidate/validators'
import { get } from 'lodash-es'
import { i18n } from '@/localization'
import { ChainResposne } from '@/types'

const { t } = i18n.global || i18n

const messagePath = ({ $validator }: MessageProps) =>
  `validations.field-error_${$validator}`

const withI18nMessage = createI18nMessage({ t, messagePath })

export const required = <ValidationRule>withI18nMessage(_required)

export const email = <ValidationRule>withI18nMessage(_email)

export const minLength = (length: number): ValidationRule =>
  <ValidationRule>withI18nMessage(_minLength(length))

export const maxLength = (length: number): ValidationRule =>
  <ValidationRule>withI18nMessage(_maxLength(length))

export const maxValue = (value: number | string): ValidationRule =>
  <ValidationRule>withI18nMessage(_maxValue(value))

export const sameAs = (field: Ref): ValidationRule => {
  return <ValidationRule>withI18nMessage(_sameAs(field, get(field, '_key')))
}

export const amount = <ValidationRule>(
  withI18nMessage(
    (value: number | string) => Boolean(+value) && Number(value) > 0,
  )
)

export const sameTokenInSameNetwork = (
  networkSell: ChainResposne,
  networkBuy: ChainResposne,
  tokenAddr: Ref,
): ValidationRule => {
  return <ValidationRule>withI18nMessage(value => {
    if (networkBuy.id !== networkSell.id) return true
    return value !== tokenAddr.value
  })
}
