<!-- eslint-disable vue-i18n/no-raw-text -->
<template>
  <div class="automatic-claim-block">
    <checkbox-field
      :model-value="modelValue"
      :disabled="isDisabled"
      label="Automatic Claim"
      description="Pay with additional ETH and use a relayer."
      @update:model-value="emit('update:modelValue', $event)"
    />
    <div class="automatic-claim-block__claim-price">
      <p class="automatic-claim-block__claim-price-native">
        {{ '0.00159752 WETH' }}
      </p>
      <p class="automatic-claim-block__claim-price-usd">
        {{ '~ 2 USD' }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CheckboxField } from '@/fields'

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
  gap: toRem(10);
}

.automatic-claim-block__claim-price {
  display: flex;
  flex-direction: column;
  gap: toRem(2);
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
