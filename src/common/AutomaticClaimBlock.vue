<!-- eslint-disable vue-i18n/no-raw-text -->
<template>
  <tooltip
    class="automatic-claim-block"
    :class="{
      'automatic-claim-block--disabled': isDisabled,
    }"
    :title="$t('automatic-claim-block.tooltip-title')"
    :message="$t('automatic-claim-block.tooltip-msg')"
    :is-show-tooltip="isDisabled"
  >
    <checkbox-field
      :model-value="modelValue"
      :disabled="isDisabled"
      :label="$t('automatic-claim-block.label')"
      :description="$t('automatic-claim-block.description')"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <div class="automatic-claim-block__claim-price">
      <p class="automatic-claim-block__claim-price-native">
        {{ `${formatAmount(0.00159752, 18)} WETH` }}
      </p>
      <p class="automatic-claim-block__claim-price-usd">
        {{ `~ ${formatAmount(2, 2)} USD` }}
      </p>
    </div>
  </tooltip>
</template>

<script lang="ts" setup>
import { CheckboxField } from '@/fields'
import { formatAmount } from '@/helpers'
import { Tooltip } from '@/common'

withDefaults(
  defineProps<{
    modelValue: boolean
    isDisabled?: boolean
  }>(),
  {
    isDisabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<style lang="scss" scoped>
.automatic-claim-block {
  max-width: toRem(482);
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: toRem(10);

  /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
  :deep(.tooltip__content) {
    left: 60%;
    transform: translateX(-60%);
  }
}

.automatic-claim-block__claim-price {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-end;
  gap: toRem(2);

  .automatic-claim-block--disabled & {
    opacity: 0.5;
  }
}

.automatic-claim-block__claim-price-native {
  font-size: toRem(16);
  line-height: 1.2;
  text-align: right;
  color: var(--text-primary-dark);
}

.automatic-claim-block__claim-price-usd {
  font-size: toRem(12);
  line-height: 1.2;
  text-align: right;
  color: var(--text-primary-main);
}
</style>
