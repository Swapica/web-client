<template>
  <div class="pagination">
    <app-button
      class="pagination__item"
      scheme="default"
      type="button"
      :icon-right="$icons.arrowLeft"
      @click="handlePrevStep"
      :disabled="isFirstPage"
    />
    <span class="pagination__current-page">{{ formatPage(currentPage) }}</span>
    <template v-if="totalPages > 1">
      <div class="pagination__divider" />
      <span class="pagination__total-pages">{{ formatPage(totalPages) }}</span>
    </template>
    <app-button
      class="pagination__item"
      scheme="default"
      type="button"
      :icon-right="$icons.arrowRightFilled"
      @click="handleNextPage"
      :disabled="isLastPage"
    />
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'

import { computed } from 'vue'

const FIRST_PAGE_NUMBER = 1

const props = withDefaults(
  defineProps<{
    currentPage: number
    pageLimit?: number
    totalItems?: number
  }>(),
  {
    currentPage: 1,
    pageLimit: 5,
    totalItems: 0,
  },
)

const emit = defineEmits<{
  (e: 'update:current-page', value: number): void
}>()

const totalPages = computed(() => {
  return props.totalItems < props.pageLimit
    ? FIRST_PAGE_NUMBER
    : Math.ceil(props.totalItems / props.pageLimit)
})

const isFirstPage = computed(() => props.currentPage === FIRST_PAGE_NUMBER)
const isLastPage = computed(() => props.currentPage === totalPages.value)
const handleNextPage = () => {
  if (isLastPage.value) return
  emit('update:current-page', props.currentPage + 1)
}

const handlePrevStep = () => {
  if (isFirstPage.value) return
  emit('update:current-page', props.currentPage - 1)
}

const formatPage = (val: number) => {
  return val < 10 ? `0${val}` : val
}
if (props.currentPage > totalPages.value) {
  emit('update:current-page', totalPages.value)
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: toRem(12);
}

.pagination__item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: toRem(20);
  height: toRem(20);
  min-width: toRem(20);
  min-height: toRem(20);
}

.pagination__divider {
  color: var(--text-primary-light);
  font-size: toRem(16);

  &:after {
    content: '...';
  }
}

.pagination__total-pages {
  color: var(--text-primary-light);
  font-size: toRem(16);
}

.pagination__current-page {
  color: var(--text-primary-dark);
  font-size: toRem(16);
}
</style>
