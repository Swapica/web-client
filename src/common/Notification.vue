<template>
  <div class="notification">
    <icon class="notification__icon" :name="iconName" />
    <div class="notification__details">
      <h4 class="notification__title">
        {{ title }}
      </h4>
      <p class="notification__message">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Icon } from '@/common'

import { defineComponent, PropType } from 'vue'
import { ICON_NAMES } from '@/enums'

export default defineComponent({
  name: 'notification',
  components: { Icon },
  props: {
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,
    },
    iconName: {
      type: String as PropType<ICON_NAMES>,
      default: ICON_NAMES.check,
    },
  },
})
</script>

<style lang="scss">
@import 'vue-toastification/src/scss/index';

.Vue-Toastification__toast {
  border-radius: 0;
  box-shadow: none;
  margin-bottom: 0;
  padding: toRem(13) toRem(66) toRem(13) toRem(17);
  min-width: toRem(345);

  &--success {
    background: url('/backgrounds/notification-success-bg.svg') no-repeat;
    background-size: 100% 100%;
  }

  &--error {
    background: url('/backgrounds/notification-error-bg.svg') no-repeat;
    background-size: 100% 100%;
  }

  &--warning {
    background: var(--warning-dark);
  }

  &--info {
    background: var(--primary-main);
  }
}

.Vue-Toastification__container.top-right {
  padding: 0;
  right: toRem(-50);
}

.notification {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: toRem(8);
}

.notification .notification__icon {
  max-width: toRem(24);
  max-height: toRem(24);
}

.notification__details {
  display: grid;
  grid-gap: toRem(4);
  width: 100%;
  margin-top: toRem(4);
}

.notification__title {
  color: var(--text-primary-dark);
}

.notification__message {
  color: var(--text-primary-main);
  font-size: toRem(12);
  line-height: 1;
}
</style>
