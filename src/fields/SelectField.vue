<script lang="ts" setup>
import { Icon } from '@/common'

import {
  computed,
  getCurrentInstance,
  onMounted,
  ref,
  useAttrs,
  watch,
} from 'vue'
import { useRouter } from '@/router'
import { onClickOutside } from '@vueuse/core'
import { ICON_NAMES } from '@/enums'
import { useI18n } from 'vue-i18n'

type SCHEMES = 'primary'
type SIZES = 'medium' | 'default'

const props = withDefaults(
  defineProps<{
    scheme?: SCHEMES
    size?: SIZES
    modelValue: string | number
    valueOptions?: {
      label: string
      icon?: ICON_NAMES
      imageUrl?: string
      value: number | string
    }[]
    label?: string
    placeholder?: string
    errorMessage?: string
    isErrorMessageShown?: boolean
    isNeedAllOption?: boolean
    allOptionIcon?: ICON_NAMES
  }>(),
  {
    scheme: 'primary',
    size: 'default',
    valueOptions: () => [],
    type: 'text',
    label: '',
    placeholder: ' ',
    errorMessage: '',
    isErrorMessageShown: true,
    isNeedAllOption: false,
    allOptionIcon: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
}>()

const attrs = useAttrs()
const { t } = useI18n({ useScope: 'global' })

const selectElement = ref<HTMLDivElement>()

const isDropdownOpen = ref(false)
const uid = getCurrentInstance()?.uid

const router = useRouter()

router.afterEach(() => {
  closeDropdown()
})

const isDisabled = computed(() =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const isReadonly = computed(() =>
  ['', 'readonly', true].includes(attrs.readonly as string | boolean),
)

const isLabelActive = computed(() => isDropdownOpen.value || !!props.modelValue)

const options = computed(() => [
  ...(props.isNeedAllOption
    ? [
        {
          value: '',
          label: t('select-field.all-lbl'),
          ...(props.allOptionIcon && { icon: props.allOptionIcon }),
        },
      ]
    : []),
  ...props.valueOptions,
])

const selectedOption = computed(() =>
  options.value.find(i => i.value === props.modelValue),
)

const selectFieldClasses = computed(() => ({
  'select-field': true,
  'select-field--error': props.errorMessage,
  'select-field--open': isDropdownOpen.value,
  'select-field--disabled': isDisabled.value,
  'select-field--readonly': isReadonly.value,
  'select-field--label-active': isLabelActive.value,
  [`select-field--${props.scheme}`]: true,
  [`select-field--${props.size}`]: true,
}))

const setHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--field-error-msg-height',
    `${element.scrollHeight}px`,
  )
}

const setDropdownHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--dropdown-body-height',
    `${element.scrollHeight}px`,
  )
}

const toggleDropdown = () => {
  isDropdownOpen.value ? closeDropdown() : openDropdown()
}

const openDropdown = () => {
  if (isDisabled.value || isReadonly.value) return

  isDropdownOpen.value = true
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const select = (value: string | number) => {
  if (isDisabled.value || isReadonly.value) return

  emit('update:modelValue', value)
  closeDropdown()
}

onMounted(() => {
  if (selectElement.value) {
    onClickOutside(selectElement, () => {
      closeDropdown()
    })
  }
})

watch(
  () => props.modelValue,
  () => {
    closeDropdown()
  },
)
</script>

<template>
  <div
    :class="selectFieldClasses"
    :title="errorMessage && !isErrorMessageShown ? errorMessage : ''"
  >
    <label
      v-if="label"
      class="select-field__label"
      :for="`select-field--${uid}`"
    >
      {{ label }}
    </label>
    <div ref="selectElement" class="select-field__select-wrp">
      <div class="select-field__select-head-wrp">
        <button
          type="button"
          class="select-field__select-head"
          @click="toggleDropdown"
        >
          <template v-if="$slots.head && !!modelValue">
            <slot
              name="head"
              :select-field="{
                select,
                isOpen: isDropdownOpen,
                close: closeDropdown,
                open: openDropdown,
                toggle: toggleDropdown,
              }"
            />
          </template>
          <template v-else>
            <template v-if="modelValue || isNeedAllOption">
              <div class="select-field__select-head-value">
                <icon
                  v-if="selectedOption?.icon"
                  class="select-field__select-head-value-icon"
                  :name="selectedOption?.icon"
                />
                <img
                  v-if="selectedOption?.imageUrl"
                  class="select-field__select-head-value-icon"
                  :src="selectedOption?.imageUrl"
                  :alt="selectedOption?.label"
                />
                <span class="select-field__select-head-text">
                  {{ selectedOption?.label }}
                </span>
              </div>
            </template>
            <template v-else-if="!label">
              <span class="select-field__placeholder">
                {{ props.placeholder }}
              </span>
            </template>
          </template>
          <icon
            :class="[
              'select-field__select-head-indicator',
              {
                'select-field__select-head-indicator--open': isDropdownOpen,
              },
            ]"
            :name="$icons.arrowDown"
          />
        </button>
      </div>
      <transition
        name="select-field__select-dropdown"
        @enter="setDropdownHeightCSSVar"
        @before-leave="setDropdownHeightCSSVar"
      >
        <div v-if="isDropdownOpen" class="select-field__select-dropdown-wrp">
          <div class="select-field__select-dropdown">
            <template v-if="$slots.default">
              <slot
                :select-field="{
                  select,
                  isOpen: isDropdownOpen,
                  close: closeDropdown,
                  open: openDropdown,
                  toggle: toggleDropdown,
                }"
              />
            </template>
            <template v-else-if="options.length">
              <button
                :class="[
                  'select-field__select-dropdown-item',
                  {
                    'select-field__select-dropdown-item--active':
                      modelValue === option.value,
                  },
                ]"
                type="button"
                v-for="(option, idx) in options"
                :key="`[${idx}] ${option.value}`"
                @click="select(option.value)"
              >
                <icon
                  v-if="option.icon"
                  class="select-field__select-dropdown-item-icon"
                  :name="option.icon"
                />
                <img
                  v-if="option.imageUrl"
                  class="select-field__select-dropdown-item-icon"
                  :src="option.imageUrl"
                  :alt="option.label"
                />
                <span class="select-field__select-dropdown-item-text">
                  {{ option.label }}
                </span>
              </button>
            </template>
          </div>
        </div>
      </transition>
    </div>
    <transition
      name="select-field__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <span
        v-if="errorMessage && isErrorMessageShown"
        class="select-field__err-msg"
      >
        {{ errorMessage }}
      </span>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.select-field {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;

  &--disabled,
  &--readonly {
    opacity: 0.5;
    pointer-events: none;
  }
}

.select-field__label {
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

.select-field__select-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
}

.select-field__select-head-wrp {
  position: relative;
  width: 100%;
  height: 100%;
}

.select-field__select-head {
  background: url('/backgrounds/select-field-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(10) toRem(16);
  padding-right: toRem(40);
  text-align: left;
  width: 100%;
  height: 100%;
  min-height: toRem(44);
  position: relative;

  @include field-text;

  transition-property: color;

  .select-field--medium & {
    font-size: toRem(18);
    padding: toRem(7.5) toRem(12);
    padding-right: toRem(32);
    min-height: toRem(32);
  }

  .select-field--open.select-field--primary & {
    background: url('/backgrounds/select-field-hover-bg.svg') no-repeat;
    background-size: 100% 100%;
  }

  .select-field--error.select-field--primary & {
    background: url('/backgrounds/select-field-error-bg.svg') no-repeat;
    background-size: 100% 100%;
    color: var(--field-error);
    -webkit-text-fill-color: var(--field-error);
  }
}

.select-field__placeholder {
  font: inherit;
  opacity: 0.25;

  @include field-placeholder;
}

.select-field__select-head-indicator {
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: toRem(16);
  transform: translateY(-50%);
  transition: transform 0.1s ease-in-out;
  width: toRem(20);
  height: toRem(20);
  color: var(--field-text);

  &--open {
    transform: translateY(-50%) rotate(180deg);
  }

  .select-field--error.select-field--primary & {
    color: var(--field-error);
  }
}

.select-field__select-dropdown-wrp {
  position: absolute;
  top: 105%;
  right: 0;
  width: 100%;
  z-index: var(--z-index-select);
  background: url('/backgrounds/select-field-dropdown-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(6);
}

.select-field__select-dropdown {
  overflow: hidden auto;
  width: calc(100% - #{toRem(5)});
  max-height: toRem(188);

  @include scrollbar;
}

.select-field__select-dropdown-enter-active {
  overflow: hidden;
  animation: dropdown var(--field-transition-duration);
}

.select-field__select-dropdown-leave-active {
  overflow: hidden;
  animation: dropdown var(--field-transition-duration) 0.1s reverse;
}

@keyframes dropdown {
  from {
    height: 0;
  }

  to {
    height: var(--dropdown-body-height);
  }
}

.select-field__select-dropdown-item {
  text-align: left;
  width: 100%;
  padding: toRem(8) toRem(12);
  color: var(--text-primary-main);
  display: flex;
  align-items: center;
  gap: toRem(8);

  &:hover {
    color: var(--text-primary-dark);
  }

  &--active {
    color: var(--text-primary-dark);
  }
}

.select-field__select-dropdown-item-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-field__select-dropdown-item-icon {
  width: toRem(24);
  height: toRem(24);
  min-width: toRem(24);
  min-height: toRem(24);
}

.select-field__select-head-value {
  display: flex;
  align-items: center;
  gap: toRem(8);
}

.select-field__select-head-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-field__select-head-value-icon {
  width: toRem(24);
  height: toRem(24);
  min-width: toRem(24);
  min-height: toRem(24);
}

.select-field__err-msg {
  @include field-error;
}

.select-field__err-msg-transition-enter-active {
  animation: fade-down var(--field-transition-duration);
}

.select-field__err-msg-transition-leave-active {
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
