<template>
  <div class="order-list">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          class="order-list__error-msg"
          :message="$t('order-list.loading-error-msg')"
        />
      </template>
      <template v-else>
        <template v-if="list.length">
          <!-- data -->
        </template>
        <template v-else>
          <template v-if="$slots.noDataMsg">
            <slot name="noDataMsg" />
          </template>
        </template>
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ErrorMessage, Loader } from '@/common'
import { ref } from 'vue'
const isLoadFailed = ref(false)
const isLoaded = ref(true)
const list = ref([])
</script>

<style lang="scss" scoped>
.order-list {
  display: flex;
  flex: 1;
}

.order-list__error-msg {
  max-width: toRem(417);
  margin: 0 auto;

  @include respond-to(small) {
    max-width: toRem(245);
  }
}
</style>
