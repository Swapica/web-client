<template>
  <button class="copy-button" type="button" @click="copy">
    <slot />
    <p v-if="isTooltipShown" class="copy-button__copy-tooltip">
      {{ $t('copy-button.copied-message') }}
    </p>
  </button>
</template>
<script lang="ts" setup>
import { copyToClipboard, ErrorHandler } from '@/helpers'
import { ref } from 'vue'

const props = defineProps<{
  text: string
}>()
const isTooltipShown = ref(false)

const copy = async () => {
  try {
    await copyToClipboard(props.text)
    isTooltipShown.value = true

    setTimeout(() => {
      isTooltipShown.value = false
    }, 500)
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}
</script>
<style lang="scss" scoped>
.copy-button {
  position: relative;
}

.copy-button__copy-tooltip {
  position: absolute;
  bottom: 100%;
  left: 0;
  display: flex;
  font-size: toRem(14);
  justify-content: center;
  width: 100%;
  color: var(--text-primary-dark);
}
</style>
