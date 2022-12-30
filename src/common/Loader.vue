<template>
  <div class="loader">
    <p v-if="message" class="loader__message">
      {{ message }}
    </p>
    <spinner />
  </div>
</template>

<script lang="ts" setup>
import Spinner from '@/common/loader/Spinner.vue'
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: '',
  },
)
</script>

<style lang="scss" scoped>
.loader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: toRem(20);
  width: 100%;

  @include respond-to(tablet) {
    gap: toRem(16);
  }
}

.loader__message {
  color: var(--text-primary-dark);
  font-size: toRem(32);
  line-height: 1;
  text-align: center;

  @include respond-to(tablet) {
    font-size: toRem(20);
  }
}
</style>
