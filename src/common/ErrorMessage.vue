<template>
  <div class="error-message">
    <p class="error-message__message">
      {{ message }}
    </p>
    <icon class="error-message__icon" :name="iconName" />
  </div>
</template>

<script lang="ts">
import { Icon } from '@/common'

import { ICON_NAMES } from '@/enums'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'error-message',
  components: { Icon },
  props: {
    message: {
      type: String,
      required: true,
    },
    iconName: {
      type: String as PropType<ICON_NAMES>,
      default: ICON_NAMES.cry,
    },
  },
})
</script>

<style lang="scss" scoped>
.error-message {
  display: grid;
  place-items: center;
  grid-gap: toRem(32);

  @include respond-to(tablet) {
    grid-gap: toRem(16);
  }
}

.error-message__icon {
  color: var(--text-primary-dark);
  width: toRem(88);
  height: toRem(68);

  @include respond-to(tablet) {
    width: toRem(61);
    height: toRem(47);
  }
}

.error-message__message {
  color: var(--text-primary-dark);
  font-size: toRem(32);
  line-height: 1;
  text-align: center;

  @include respond-to(tablet) {
    font-size: toRem(20);
  }
}
</style>
