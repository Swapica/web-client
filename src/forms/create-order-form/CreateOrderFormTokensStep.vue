<template>
  <form class="create-order-form-tokens-step" @submit.prevent="handleNext">
    <h4 class="create-order-form-tokens-step__title">
      {{ $t('create-order-form-tokens-step.title') }}
    </h4>
    <p class="create-order-form-tokens-step__desc">
      {{ $t('create-order-form-tokens-step.description') }}
    </p>

    <div class="create-order-form-tokens-step__content">
      <div class="create-order-form-tokens-step__token-wrp">
        <span v-if="!isTablet" class="create-order-form-tokens-step__token-lbl">
          {{ $t('create-order-form-tokens-step.token-to-sell-lbl') }}
        </span>
        <!-- eslint-disable-next-line prettier/prettier max-len -->
        <div class="create-order-form-tokens-step__token create-order-form-tokens-step__token-sell">
          <input-field
            v-model="form.amountSell"
            class="create-order-form-tokens-step__input"
            placeholder="0.0000"
            :error-message="getFieldErrorMessage('amountSell')"
            :is-error-message-shown="false"
            @blur="touchField('amountSell')"
          />
        </div>
        <p class="create-order-form-tokens-step__token-network">
          {{
            $t('create-order-form-tokens-step.token-network', {
              network: networkSell?.name,
            })
          }}
        </p>
      </div>
      <div class="create-order-form-tokens-step__token-wrp">
        <span v-if="!isTablet" class="create-order-form-tokens-step__token-lbl">
          {{ $t('create-order-form-tokens-step.token-to-buy-lbl') }}
        </span>
        <!-- eslint-disable-next-line prettier/prettier max-len -->
        <div class="create-order-form-tokens-step__token create-order-form-tokens-step__token-buy">
          <input-field
            v-model="form.amountBuy"
            class="create-order-form-tokens-step__input"
            placeholder="0.0000"
            :error-message="getFieldErrorMessage('amountBuy')"
            :is-error-message-shown="false"
            @blur="touchField('amountBuy')"
          />
        </div>
        <p class="create-order-form-tokens-step__token-network">
          {{
            $t('create-order-form-tokens-step.token-network', {
              network: networkBuy?.name,
            })
          }}
        </p>
      </div>
    </div>

    <div class="create-order-form-tokens-step__actions">
      <app-button
        class="create-order-form-tokens-step__action"
        :text="$t('create-order-form-tokens-step.back-btn')"
        scheme="secondary"
        @click="emit('back')"
      />
      <app-button
        class="create-order-form-tokens-step__action"
        :text="$t('create-order-form-tokens-step.next-btn')"
        scheme="primary"
        type="submit"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { InputField } from '@/fields'
import { useFormValidation } from '@/composables'
import { UseCreateOrderForm } from '@/types'
import { computed, toRefs } from 'vue'
import { required } from '@/validators'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'

const { width: windowWidth } = useWindowSize()

const props = defineProps<{
  former: UseCreateOrderForm
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
}>()

const isTablet = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.tablet)

const { form, networkBuy, networkSell } = toRefs(props.former)

const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
  form,
  {
    amountSell: { required },
    amountBuy: { required },
  },
)

const handleNext = () => {
  if (!isFormValid()) return
  emit('next')
}
</script>

<style lang="scss" scoped>
.create-order-form-tokens-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: toRem(564);
  width: 100%;
}

.create-order-form-tokens-step__title {
  margin: toRem(16) 0;

  @include respond-to(tablet) {
    margin: toRem(8) 0 toRem(12);
  }
}

.create-order-form-tokens-step__desc {
  margin-bottom: toRem(24);
  text-align: center;

  @include respond-to(tablet) {
    margin-bottom: toRem(12);
  }
}

.create-order-form-tokens-step__actions {
  margin-top: toRem(32);
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  gap: toRem(32);
  max-width: toRem(366);

  @include respond-to(tablet) {
    margin-top: toRem(12);
    gap: toRem(16);
  }
}

.create-order-form-tokens-step__content {
  display: grid;
  grid-template-columns: minmax(toRem(100), 1fr) minmax(toRem(100), 1fr);
  max-width: toRem(482);
  width: 100%;
}

.create-order-form-tokens-step__action {
  width: 100%;
}

.create-order-form-tokens-step__token-lbl {
  font-size: toRem(14);
  line-height: 1.2;
  color: var(--text-primary-main);
}

.create-order-form-tokens-step__token-network {
  font-size: toRem(14);
  line-height: 1.2;
  color: var(--text-primary-dark);

  @include respond-to(tablet) {
    font-size: toRem(12);
    line-height: 1;
  }
}

.create-order-form-tokens-step__token-sell {
  background: url('/backgrounds/order-1-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(5.85) toRem(25) toRem(8.2) toRem(14);
}

.create-order-form-tokens-step__token-buy {
  background: url('/backgrounds/order-2-bg.svg') no-repeat;
  background-size: 100% 100%;
  position: relative;
  left: toRem(-3);
  padding: toRem(5.85) toRem(19) toRem(8.2) toRem(20);
}

.create-order-form-tokens-step__token {
  display: flex;
  align-items: center;
  width: calc(100% + #{toRem(3)});
  margin: toRem(8) 0;

  @include respond-to(tablet) {
    margin-top: 0;
  }
}
</style>
