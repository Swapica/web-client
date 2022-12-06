<template>
  <div class="no-data-message">
    <span class="no-data-message__message">
      {{ message }}
    </span>
    <template v-if="$slots.default">
      <slot />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'no-data-message',
  props: {
    message: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.no-data-message {
  display: grid;
  place-items: center;
  grid-gap: toRem(24);

  @include respond-to(tablet) {
    grid-gap: toRem(16);
  }
}

.no-data-message__message {
  color: var(--text-primary-dark);
  font-size: toRem(32);
  line-height: 1;
  text-align: center;

  @include respond-to(tablet) {
    font-size: toRem(20);
  }
}
</style>
