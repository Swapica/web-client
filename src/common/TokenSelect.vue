<template>
  <div :class="selectFieldClasses">
    <label v-if="label" class="token-select__label">
      {{ label }}
    </label>
    <div ref="selectElement" class="token-select__select-wrp">
      <div class="token-select__select-head-wrp">
        <div class="token-select__select-head" @click="toggleDropdown">
          <div class="token-select__select-head-content">
            <template v-if="isHeadIconShown">
              <img
                v-if="selectedOption?.imageUrl"
                class="token-select__head-item-icon"
                :src="selectedOption.imageUrl"
                :alt="selectedOption.label"
              />
              <icon
                v-else
                class="token-select__head-item-icon"
                :name="selectedOption?.icon || $icons.user"
              />
            </template>
            <template v-if="isInputShown">
              <input-field
                class="token-select__select-head-input"
                ref="searchFieldRef"
                scheme="flat"
                v-model="searchValue"
                :disabled="attrs.disabled"
                @click.stop
                @blur="emit('blur')"
              />
            </template>
            <template v-else>
              <span class="token-select__select-head-text">
                {{ headLabel }}
              </span>
            </template>
          </div>
          <icon
            :class="[
              'token-select__select-head-indicator',
              {
                'token-select__select-head-indicator--open': isDropdownOpen,
              },
            ]"
            :name="$icons.arrowDown"
          />
        </div>
      </div>
      <transition
        name="token-select__select-dropdown"
        @enter="setDropdownHeightCSSVar"
        @before-leave="setDropdownHeightCSSVar"
      >
        <div
          v-if="isDropdownOpen && optionList.length"
          class="token-select__select-dropdown-wrp"
        >
          <div class="token-select__select-dropdown">
            <button
              :class="[
                'token-select__select-dropdown-item',
                {
                  'token-select__select-dropdown-item--active':
                    modelValue === option.value,
                },
              ]"
              type="button"
              v-for="(option, idx) in optionList"
              :key="`[${idx}] ${option.value}`"
              @click="select(option.label)"
            >
              <img
                v-if="option.imageUrl"
                class="token-select__select-dropdown-item-icon"
                :src="option.imageUrl"
                :alt="option.label"
              />
              <icon
                v-else-if="option.icon"
                class="select-field__select-dropdown-item-icon"
                :name="option.icon"
              />
              <span class="token-select__select-dropdown-item-text">
                {{ option.label }}
              </span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'

import { computed, nextTick, onMounted, ref, useAttrs, watch } from 'vue'
import { useRouter } from '@/router'
import { onClickOutside } from '@vueuse/core'
import { InputField } from '@/fields'
import {
  cropAddress,
  ErrorHandler,
  isEthAddress,
  loadTokenInfo,
} from '@/helpers'
import debounce from 'lodash/debounce'
import { ICON_NAMES } from '@/enums'

type SIZES = 'big' | 'default'

const props = withDefaults(
  defineProps<{
    modelValue: string
    valueOptions?: {
      label: string
      imageUrl?: string
      icon?: ICON_NAMES
      value: string
    }[]
    label?: string
    placeholder?: string
    errorMessage?: string
    rpcUrl?: string
    isHeadIconShown?: boolean
    size?: SIZES
    emitEmptyValueOnStartSearch?: boolean
  }>(),
  {
    valueOptions: () => [],
    type: 'text',
    label: '',
    placeholder: ' ',
    errorMessage: '',
    rpcUrl: '',
    isHeadIconShown: false,
    emitEmptyValueOnStartSearch: false,
    size: 'default',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
  (e: 'blur'): void
}>()

const attrs = useAttrs()

const selectElement = ref<HTMLDivElement>()
const searchFieldRef = ref<typeof InputField>()

const isDropdownOpen = ref(false)
const searchValue = ref(
  props.valueOptions.find(i => i.value === props.modelValue)?.label ??
    props.modelValue,
)
const optionList = ref(props.valueOptions)
const isInputShown = ref(false)

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

const headLabel = computed(() => {
  return isEthAddress(searchValue.value)
    ? cropAddress(searchValue.value, 3, 4)
    : searchValue.value
})

const selectedOption = computed(() =>
  props.valueOptions.find(
    i =>
      i.value.toLowerCase() === searchValue.value.toLowerCase() ||
      i.label.toLowerCase() === searchValue.value.toLowerCase(),
  ),
)

const selectFieldClasses = computed(() => ({
  'token-select': true,
  'token-select--error': props.errorMessage,
  'token-select--open': isDropdownOpen.value,
  'token-select--disabled': isDisabled.value,
  'token-select--readonly': isReadonly.value,
  [`token-select--${props.size}`]: true,
}))

const toggleDropdown = () => {
  isDropdownOpen.value ? closeDropdown() : openDropdown()
}

const openDropdown = () => {
  if (isDisabled.value || isReadonly.value) return
  isDropdownOpen.value = true
  isInputShown.value = true
  nextTick(() => {
    searchFieldRef.value?.inputRef.focus()
  })
}

const closeDropdown = () => {
  isDropdownOpen.value = false
  isInputShown.value = false
}

const select = (value: string) => {
  searchValue.value = value
  closeDropdown()
}

const getOptionList = () => {
  const regex = new RegExp(searchValue.value.trim(), 'i')

  optionList.value = searchValue.value
    ? props.valueOptions.filter(i => regex.test(i.label) || regex.test(i.value))
    : props.valueOptions
}

const handleSearch = async () => {
  try {
    if (props.emitEmptyValueOnStartSearch) {
      emit('update:modelValue', '')
    }
    let address = ''
    if (selectedOption.value) {
      address = selectedOption?.value?.value
    } else if (isEthAddress(searchValue.value)) {
      if (!props.rpcUrl) return
      const data = await loadTokenInfo(props.rpcUrl, searchValue.value)
      if (data.symbol) {
        address = searchValue.value
      }
    }
    emit('update:modelValue', address)
  } catch (e) {
    emit('update:modelValue', '')
    ErrorHandler.processWithoutFeedback(false)
  }
}

const setDropdownHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--dropdown-body-height',
    `${element.scrollHeight}px`,
  )
}

onMounted(() => {
  if (selectElement.value) {
    onClickOutside(selectElement, () => {
      closeDropdown()
    })
  }
})

watch(
  searchValue,
  debounce(() => {
    getOptionList()
    handleSearch()
  }, 500),
  { immediate: true },
)

watch(
  () => attrs.disabled,
  () => closeDropdown(),
)
</script>

<style lang="scss" scoped>
$z-local-index: 2;

.token-select {
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

.token-select__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;

  @include field-label;

  transition-property: all;

  .token-select--error & {
    color: var(--field-error);
  }
}

.token-select__select-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
}

.token-select__select-head-wrp {
  position: relative;
  width: 100%;
  height: 100%;
}

.token-select__select-head {
  background: url('/backgrounds/select-field-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(4) toRem(24) toRem(3) toRem(8);
  text-align: left;
  width: 100%;
  height: 100%;
  min-height: toRem(24);
  position: relative;

  @include field-text;

  font-size: toRem(18);
  transition-property: color;

  .token-select--big & {
    font-size: toRem(16);
    min-height: toRem(44);
    padding: toRem(10) toRem(36) toRem(10) toRem(16);
  }

  .token-select--open & {
    background: url('/backgrounds/select-field-hover-bg.svg') no-repeat;
    background-size: 100% 100%;
  }

  .token-select--error & {
    background: url('/backgrounds/select-field-error-bg.svg') no-repeat;
    background-size: 100% 100%;
    color: var(--field-error);
    -webkit-text-fill-color: var(--field-error);
  }
}

.token-select__placeholder {
  font: inherit;
  opacity: 0.25;

  @include field-placeholder;
}

.token-select__select-head-indicator {
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: toRem(8);
  transform: translateY(-50%);
  transition: transform 0.1s ease-in-out;
  width: toRem(16);
  height: toRem(16);
  color: var(--field-text);

  .token-select--big & {
    width: toRem(20);
    height: toRem(20);
    right: toRem(16);
  }

  &--open {
    transform: translateY(-50%) rotate(180deg);
  }

  .token-select--error & {
    color: var(--field-error);
  }
}

.token-select__select-dropdown-wrp {
  position: absolute;
  top: 110%;
  right: 0;
  width: 100%;
  z-index: $z-local-index;
  background: url('/backgrounds/select-field-dropdown-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(5) toRem(6);

  .token-select--big & {
    top: 105%;
    padding: toRem(6);
  }
}

.token-select__select-dropdown {
  overflow: hidden auto;
  width: calc(100% - #{toRem(5)});
  max-height: toRem(188);

  @include scrollbar;
}

.token-select__select-dropdown-enter-active {
  overflow: hidden;
  animation: dropdown var(--field-transition-duration);
}

.token-select__select-dropdown-leave-active {
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

.token-select__select-dropdown-item {
  text-align: left;
  width: 100%;
  padding: toRem(4) toRem(8);
  color: var(--text-primary-main);
  display: flex;
  align-items: center;
  gap: toRem(4);

  .token-select--big & {
    padding: toRem(8) toRem(12);
    gap: toRem(8);
  }

  &:hover {
    color: var(--text-primary-dark);
  }

  &--active {
    color: var(--text-primary-dark);
  }
}

.token-select__select-dropdown-item-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: toRem(14);
  position: relative;
  top: toRem(1);

  .token-select--big & {
    font-size: toRem(16);
  }
}

.token-select__select-dropdown-item-icon {
  width: toRem(18);
  height: toRem(18);
  min-width: toRem(18);
  min-height: toRem(18);

  .token-select--big & {
    width: toRem(24);
    height: toRem(24);
    min-width: toRem(24);
    min-height: toRem(24);
  }
}

.token-select__select-head-value {
  display: flex;
  align-items: center;
  gap: toRem(4);
}

.token-select__select-head-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: toRem(18);
  line-height: toRem(17.5);

  .token-select--big & {
    font-size: toRem(16);
    line-height: toRem(15.5);
  }
}

.token-select__select-head-content {
  height: toRem(17);
  display: flex;
  align-items: center;
  gap: toRem(4);
  position: relative;
  top: toRem(1);

  .token-select--big & {
    gap: toRem(8);
    height: auto;
  }
}

.token-select__head-item-icon {
  width: toRem(18);
  height: toRem(18);
  min-width: toRem(18);
  min-height: toRem(18);

  .token-select--big & {
    width: toRem(24);
    height: toRem(24);
    min-width: toRem(24);
    min-height: toRem(24);
  }
}

.token-select__select-head-input {
  overflow: hidden;

  .token-select--big & {
    /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
    :deep(.input-field__input) {
      font-size: toRem(16);
    }
  }
}
</style>
