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

type SCHEMES = 'primary' | 'secondary' | 'flat' | 'icon' | 'default'

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
  --button-icon-size: 1.2em;

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
  transition: var(--button-transition-duration) ease-out;
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
    background: url('/backgrounds/button-primary-bg.svg') no-repeat;
    padding: toRem(11) toRem(28) toRem(20) calc(toRem(25.38) + toRem(11.62));
    background-size: 100% 100%;

    &:disabled,
    &--disabled {
      padding: toRem(13) toRem(24) toRem(18) calc(toRem(19) + toRem(8));
      background: url('/backgrounds/button-disabled-bg.svg') no-repeat;
      background-size: 100% 100%;
    }

    &:not([disabled]):hover {
      padding: toRem(13) toRem(24) toRem(18) calc(toRem(19) + toRem(8));
      background: url('/backgrounds/button-primary-hover-bg.svg') no-repeat;
      background-size: 100% 100%;
    }
  }

  &--secondary {
    background: url('/backgrounds/button-secondary-bg.svg') no-repeat;
    padding: toRem(11) toRem(28) toRem(20) calc(toRem(25.38) + toRem(11.62));
    background-size: 100% 100%;

    &:disabled,
    &--disabled {
      padding: toRem(13) toRem(24) toRem(18) calc(toRem(19) + toRem(8));
      background: url('/backgrounds/button-disabled-bg.svg') no-repeat;
      background-size: 100% 100%;
    }

    &:not([disabled]):hover {
      padding: toRem(13) toRem(24) toRem(18) calc(toRem(19) + toRem(8));
      background: url('/backgrounds/button-secondary-hover-bg.svg') no-repeat;
      background-size: 100% 100%;
    }
  }

  &--flat {
    padding: toRem(11.5) toRem(12);
    position: relative;

    &:after {
      content: '';
      position: absolute;
      background: url('/backgrounds/button-underline.svg') no-repeat;
      background-size: 100% 100%;
      width: 0;
      height: toRem(6.5);
      left: 0;
      bottom: 0;
      transition: width 0.2s ease-in-out;
    }

    &:not([disabled]):hover {
      &:after {
        width: 100%;
      }
    }
  }
}

.app-button__icon-left,
.app-button__icon-right {
  height: var(--button-icon-size);
  width: var(--button-icon-size);
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
