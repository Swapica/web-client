<template>
  <div :class="selectFieldClasses">
    <label v-if="label" class="token-select__label">
      {{ label }}
    </label>
    <div ref="selectElement" class="token-select__select-wrp">
      <div class="token-select__select-head-wrp">
        <div class="token-select__select-head" @click="toggleDropdown">
          <div class="token-select__select-head-content">
            <template v-if="isDropdownOpen">
              <input-field
                ref="searchFieldRef"
                scheme="flat"
                :model-value="modelValue"
                @blur="emit('blur')"
              />
            </template>
            <template v-else>
              {{ selectedOption }}
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
      <transition name="token-select__select-dropdown">
        <div v-if="isDropdownOpen" class="token-select__select-dropdown-wrp">
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
              v-for="(option, idx) in valueOptions"
              :key="`[${idx}] ${option.value}`"
              @click="select(option.value)"
            >
              <img
                v-if="option.imageUrl"
                class="token-select__select-dropdown-item-icon"
                :src="option.imageUrl"
                :alt="option.label"
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

import { computed, nextTick, onMounted, ref, useAttrs } from 'vue'
import { useRouter } from '@/router'
import { onClickOutside } from '@vueuse/core'
import { InputField } from '@/fields'

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    valueOptions?: {
      label: string
      imageUrl?: string
      value: number | string
    }[]
    label?: string
    placeholder?: string
    errorMessage?: string
  }>(),
  {
    valueOptions: () => [],
    type: 'text',
    label: '',
    placeholder: ' ',
    errorMessage: '',
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

const selectedOption = computed(
  () =>
    props.valueOptions.find(i => i.value === props.modelValue)?.label ||
    props.modelValue,
)

const selectFieldClasses = computed(() => ({
  'token-select': true,
  'token-select--error': props.errorMessage,
  'token-select--open': isDropdownOpen.value,
  'token-select--disabled': isDisabled.value,
  'token-select--readonly': isReadonly.value,
}))

const toggleDropdown = () => {
  isDropdownOpen.value ? closeDropdown() : openDropdown()
}

const openDropdown = () => {
  if (isDisabled.value || isReadonly.value) return
  isDropdownOpen.value = true
  nextTick(() => {
    searchFieldRef.value?.inputRef.focus()
  })
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

  &--open {
    transform: translateY(-50%) rotate(180deg);
  }

  .token-select--error & {
    color: var(--field-error);
  }
}

.token-select__select-dropdown-wrp {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 110%;
  right: 0;
  width: 100%;
  max-height: 500%;
  z-index: $z-local-index;
  background: url('/backgrounds/select-field-dropdown-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(5) toRem(6);
}

.token-select__select-dropdown {
  overflow: hidden auto;
  width: calc(100% - #{toRem(5)});

  @include scrollbar;
}

.token-select__select-dropdown-enter-active {
  animation: dropdown var(--field-transition-duration);
}

.token-select__select-dropdown-leave-active {
  animation: dropdown var(--field-transition-duration) 0.1s reverse;
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: translateY(20%);
    max-height: 0;
  }

  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 500%;
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
}

.token-select__select-dropdown-item-icon {
  width: toRem(18);
  height: toRem(18);
  min-width: toRem(18);
  min-height: toRem(18);
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
}

.token-select__select-head-value-icon {
  width: toRem(18);
  height: toRem(18);
  min-width: toRem(18);
  min-height: toRem(18);
}
</style>