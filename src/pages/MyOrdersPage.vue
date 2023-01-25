<template>
  <div
    class="my-orders-page"
    :class="{ 'my-orders-page--fixed-pading': isButtonFixed }"
  >
    <created-orders @is-button-fixed="isButtonFixed = $event" />
    <expired-orders class="my-orders-page__expired-orders" />
  </div>
</template>

<script lang="ts" setup>
import CreatedOrders from '@/pages/MyOrders/CreatedOrders.vue'
import ExpiredOrders from '@/pages/MyOrders/ExpiredOrders.vue'
import { ref } from 'vue'

const isButtonFixed = ref(false)
</script>

<style lang="scss" scoped>
.my-orders-page__expired-orders {
  margin-top: toRem(32.5);
}

.my-orders-page--fixed-pading {
  @include respond-to(tablet) {
    padding-bottom: toRem(104);
  }
}
</style>
