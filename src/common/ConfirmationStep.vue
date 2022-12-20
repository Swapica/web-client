<template>
  <div class="confirmation-step">
    <h4 class="confirmation-step__title">
      {{ title || $t('confirmation-step.title') }}
    </h4>
    <loader class="confirmation-step__loader" />

    <template v-if="$slots.description">
      <slot name="description" />
    </template>
    <template v-else>
      <p class="confirmation-step__desc">
        {{ description || t('confirmation-step.description') }}
      </p>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { Loader } from '@/common'

const { t } = useI18n({ useScope: 'global' })

withDefaults(
  defineProps<{
    title: string
    description?: string
  }>(),
  {
    title: '',
    description: '',
  },
)
</script>

<style lang="scss" scoped>
.confirmation-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: toRem(564);
  width: 100%;
}

.confirmation-step__title {
  margin: toRem(16) 0;

  @include respond-to(tablet) {
    margin: toRem(12) 0 toRem(16);
  }
}

.confirmation-step__desc {
  margin-top: toRem(16);
  text-align: center;
}

.confirmation-step__loader {
  width: toRem(81);
  height: toRem(81);
}
</style>
