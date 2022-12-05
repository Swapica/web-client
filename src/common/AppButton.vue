<template>
  <template v-if="route">
    <router-link
      class="app-button"
      :class="buttonClasses"
      v-bind="$attrs"
      :to="route"
    >
      <icon v-if="iconLeft" class="app-button__icon-left" :name="iconLeft" />
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconRight" class="app-button__icon-right" :name="iconRight" />
    </router-link>
  </template>
  <template v-else-if="href">
    <a class="app-button" :class="buttonClasses" v-bind="$attrs" :href="href">
      <icon v-if="iconLeft" class="app-button__icon-left" :name="iconLeft" />
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconRight" class="app-button__icon-right" :name="iconRight" />
    </a>
  </template>
  <template v-else>
    <button
      class="app-button"
      :class="buttonClasses"
      v-bind="$attrs"
      :disabled="isDisabled"
      :type="$attrs.type || 'button'"
    >
      <icon v-if="iconLeft" class="app-button__icon-left" :name="iconLeft" />
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconRight" class="app-button__icon-right" :name="iconRight" />
    </button>
  </template>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'

import { computed, useAttrs } from 'vue'
import { LocationAsRelativeRaw } from 'vue-router'
import { ICON_NAMES } from '@/enums'

type SCHEMES = 'primary' | 'secondary' | 'icon' | 'default'

const props = withDefaults(
  defineProps<{
    text?: string
    scheme?: SCHEMES
    route?: LocationAsRelativeRaw
    href?: string
    iconLeft?: ICON_NAMES
    iconRight?: ICON_NAMES
  }>(),
  {
    text: '',
    scheme: 'default',
    route: undefined,
    href: '',
    iconLeft: undefined,
    iconRight: undefined,
  },
)

const attrs = useAttrs()

const isDisabled = computed((): boolean =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const buttonClasses = computed(() =>
  [
    'app-button',
    `app-button--${props.scheme}`,
    ...(isDisabled.value ? ['app-button--disabled'] : []),
  ].join(' '),
)
</script>

<style lang="scss" scoped>
.app-button {
  --button-transition-duration: 0.2s;

  outline: 0;
  font-family: var(--app-font-family);
  margin: 0;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  display: grid;
  width: min-content;
  grid: auto / auto-flow max-content;
  align-items: center;
  justify-content: center;
  transition: var(--button-transition-duration) ease-in;
  transition-property: padding;
  text-decoration: none;
  color: var(--text-primary-dark);

  &:disabled,
  &--disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.5;
  }

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    text-decoration: none;
    transition-timing-function: ease-out;
  }

  &--primary {
    background: url('/fields/button-primary-bg.svg') no-repeat;
    padding: toRem(11) toRem(28) toRem(20) calc(toRem(25.38) + toRem(11.62));
    min-width: toRem(180);
    background-size: 100% 100%;

    &:disabled,
    &--disabled {
      padding: toRem(13) toRem(24) toRem(18) calc(toRem(19) + toRem(8));
      background: url('/fields/button-disabled-bg.svg') no-repeat;
      background-size: 100% 100%;
    }

    &:not([disabled]):hover {
      padding: toRem(13) toRem(24) toRem(18) calc(toRem(19) + toRem(8));
      background: url('/fields/button-primary-hover-bg.svg') no-repeat;
      background-size: 100% 100%;
    }
  }

  &--secondary {
    background: url('/fields/button-secondary-bg.svg') no-repeat;
    padding: toRem(11) toRem(28) toRem(20) calc(toRem(25.38) + toRem(11.62));
    min-width: toRem(180);
    background-size: 100% 100%;

    &:disabled,
    &--disabled {
      padding: toRem(13) toRem(24) toRem(18) calc(toRem(19) + toRem(8));
      background: url('/fields/button-disabled-bg.svg') no-repeat;
      background-size: 100% 100%;
    }

    &:not([disabled]):hover {
      padding: toRem(13) toRem(24) toRem(18) calc(toRem(19) + toRem(8));
      background: url('/fields/button-secondary-hover-bg.svg') no-repeat;
      background-size: 100% 100%;
    }
  }
}

.app-button__icon-left,
.app-button__icon-right {
  height: 1.2em;
  width: 1.2em;
}

.app-button__text {
  color: inherit;
  font: inherit;
  pointer-events: none;
  word-break: break-all;
  min-width: 0;

  @include text-ellipsis;
}
</style>
