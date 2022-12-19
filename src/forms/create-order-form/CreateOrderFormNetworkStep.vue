<template>
  <form class="create-order-form-network-step" @submit.prevent>
    <select-field v-model="val" scheme="primary" :value-options="chains" />
    <select-field v-model="val" scheme="primary" :value-options="chains" />
  </form>
</template>

<script lang="ts" setup>
import { SelectField } from '@/fields'
import { useChainsStore } from '@/store'
import { computed, ref } from 'vue'

const val = ref('')

const chainStore = useChainsStore()
const chains = computed(() =>
  chainStore.chains.map(i => ({
    label: i.name,
    value: i.chain_params.chain_id,
    imageUrl: i.icon,
  })),
)
</script>

<style lang="scss" scoped></style>
