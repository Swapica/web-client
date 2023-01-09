<template>
  <div class="my-orders-page">
    <created-orders />
    <expired-orders class="my-orders-page__expired-orders" />
  </div>
</template>

<script lang="ts" setup>
import CreatedOrders from '@/pages/MyOrders/CreatedOrders.vue'
import ExpiredOrders from '@/pages/MyOrders/ExpiredOrders.vue'
</script>

<style lang="scss" scoped>
.my-orders-page__expired-orders {
  margin-top: toRem(32.5);
}
</style>
