<script lang="ts" setup>
import { BN } from '@/utils'
import { computed, getCurrentInstance, useAttrs, useSlots } from 'vue'

type INPUT_TYPES = 'text' | 'number' | 'password'

type SCHEMES = 'primary' | 'secondary'

const props = withDefaults(
  defineProps<{
    scheme?: SCHEMES
    modelValue: string | number
    label?: string
    placeholder?: string
    type?: INPUT_TYPES
    errorMessage?: string
  }>(),
  {
    scheme: 'primary',
    type: 'text',
    label: '',
    placeholder: ' ',
    errorMessage: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
}>()

const attrs = useAttrs()

const slots = useSlots()

const uid = getCurrentInstance()?.uid

const isNumberType = computed(() => props.type === 'number')

const min = computed((): string => (attrs?.min as string) || '')
const max = computed((): string => (attrs?.max as string) || '')

const isDisabled = computed(() =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const isReadonly = computed(() =>
  ['', 'readonly', true].includes(attrs.readonly as string | boolean),
)

const listeners = computed(() => ({
  input: (event: Event) => {
    const eventTarget = event.target as HTMLInputElement
    if (isNumberType.value) {
      eventTarget.value = normalizeRange(normalizeNumber(eventTarget.value))
    }
    if (props.modelValue === eventTarget.value) return

    emit('update:modelValue', eventTarget.value)
  },
}))

const inputClasses = computed(() =>
  [
    ...(slots.nodeLeft ? ['input-field--node-left'] : []),
    ...(slots.nodeRight ? ['input-field--node-right'] : []),
    ...(isDisabled.value ? ['input-field--disabled'] : []),
    ...(isReadonly.value ? ['input-field--readonly'] : []),
    ...(props.errorMessage ? ['input-field--error'] : []),
    `input-field--${props.scheme}`,
  ].join(' '),
)

const inputType = computed(() => {
  return 'text'
})

const normalizeNumber = (value: string) => {
  return isNaN(Number(value)) ? props.modelValue : value
}

const normalizeRange = (value: string | number): string => {
  let result = value

  if (min.value && new BN(value).compare(min.value) < 0) {
    result = min.value
  } else if (max.value && new BN(value).compare(max.value) > 0) {
    result = max.value
  }

  return result as string
}

const setHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--field-error-msg-height',
    `${element.scrollHeight}px`,
  )
}
</script>

<template>
  <div class="input-field" :class="inputClasses">
    <label v-if="label" :for="`input-field--${uid}`" class="input-field__label">
      {{ label }}
    </label>
    <div class="input-field__input-wrp">
      <div v-if="$slots.nodeLeft" class="input-field__node-left-wrp">
        <slot name="nodeLeft" />
      </div>
      <input
        class="input-field__input"
        :id="`input-field--${uid}`"
        v-bind="$attrs"
        v-on="listeners"
        autocomplete="off"
        :value="modelValue"
        :placeholder="placeholder || ' '"
        :tabindex="isDisabled || isReadonly ? -1 : $attrs.tabindex"
        :type="inputType"
        :min="min"
        :max="max"
        :disabled="isDisabled || isReadonly"
      />

      <div v-if="$slots.nodeRight" class="input-field__node-right-wrp">
        <slot name="nodeRight" />
      </div>
    </div>
    <transition
      name="input-field__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <span v-if="errorMessage" class="input-field__err-msg">
        {{ errorMessage }}
      </span>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
$z-index-side-nodes: 1;

.input-field {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;

  &--disabled,
  &--readonly {
    opacity: 0.5;
  }
}

.input-field__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;

  @include field-label;

  transition-property: all;

  .select-field--error & {
    color: var(--field-error);
  }
}

.input-field__input-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
}

.input-field__input {
  border: none;

  @include field-text;

  transition-property: color;

  &::-webkit-input-placeholder {
    @include field-placeholder;
  }

  &::-moz-placeholder {
    @include field-placeholder;
  }

  &:-moz-placeholder {
    @include field-placeholder;
  }

  &:-ms-input-placeholder {
    @include field-placeholder;
  }

  &::placeholder {
    @include field-placeholder;
  }

  // Hide number arrows
  &[type='number'] {
    -moz-appearance: textfield;

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .input-field--primary & {
    padding: toRem(5) toRem(8) toRem(4);
    background: url('/backgrounds/input-bg.svg');
    background-size: 100% 100%;
  }

  .input-field--node-left & {
    padding-left: toRem(32);
  }

  .input-field--node-right & {
    padding-right: toRem(32);
  }

  .input-field--error.input-field--primary & {
    background: url('/backgrounds/input-error-bg.svg');
    background-size: 100% 100%;
  }

  &:not([disabled]):focus {
    .input-field--primary & {
      background: url('/backgrounds/input-hover-bg.svg');
      background-size: 100% 100%;
    }
  }
}

.input-field__node-left-wrp {
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: toRem(8);
  transform: translateY(-50%);
  color: inherit;
  max-height: 100%;
  z-index: $z-index-side-nodes;
}

.input-field__node-right-wrp {
  position: absolute;
  top: 50%;
  right: toRem(8);
  transform: translateY(-50%);
  color: inherit;
  z-index: $z-index-side-nodes;
}

.input-field__icon {
  width: toRem(18);
  height: toRem(18);
}

.input-field__err-msg {
  @include field-error;
}

.input-field__err-msg-transition-enter-active {
  animation: fade-down var(--field-transition-duration);
}

.input-field__err-msg-transition-leave-active {
  animation: fade-down var(--field-transition-duration) reverse;
}

@keyframes fade-down {
  from {
    height: 0;
  }

  to {
    height: var(--field-error-msg-height);
  }
}
</style>
