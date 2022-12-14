<template>
  <div class="chain-selector">
    <dropdown class="chain-selector__dropdown">
      <template #head="{ dropdown }">
        <button class="chain-selector__header" @click="dropdown.toggle">
          <img
            class="chain-selector__dropdown-header-icon"
            :src="chainStore.selectedChain?.icon"
            :alt="chainStore.selectedChain?.name"
          />
          <span
            v-if="!isMediumWidth"
            class="chain-selector__dropdown-header-text"
          >
            {{ chainStore.selectedChain?.name || 'uknow' }}
          </span>
          <icon
            :class="[
              'chain-selector__dropdown-head-indicator',
              {
                'chain-selector__dropdown-head-indicator--open':
                  dropdown.isOpen,
              },
            ]"
            :name="$icons.arrowDown"
          />
        </button>
      </template>
      <template #default="{ dropdown }">
        <div class="chain-selector__dropdown-list-wrp">
          <div class="chain-selector__dropdown-list">
            <button
              v-for="item in chainStore.chains"
              :key="item.id"
              type="button"
              class="chain-selector__dropdown-item"
              @click="switchChain(item, dropdown)"
            >
              <img
                class="chain-selector__dropdown-list-icon"
                :src="item.icon"
                :alt="item.name"
              />
              <span class="chain-selector__dropdown-list-text">
                {{ item.name }}
              </span>
            </button>
          </div>
        </div>
      </template>
    </dropdown>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { Dropdown, Icon } from '@/common'
import { useChainsStore, useWeb3ProvidersStore } from '@/store'
import { ChainResposne } from '@/types'
import { storeToRefs } from 'pinia'
import { ErrorHandler } from '@/helpers'

const chainStore = useChainsStore()
const { provider } = storeToRefs(useWeb3ProvidersStore())

const { width: windowWidth } = useWindowSize()
const isMediumWidth = computed(
  () => windowWidth.value < WINDOW_BREAKPOINTS.xMedium,
)

const switchChain = async (
  chain: ChainResposne,
  dropdown: { close: () => void },
) => {
  try {
    if (provider.value.isConnected) {
      await provider.value.switchChain(chain.chain_params.chain_id)
    }
    chainStore.selectChain(chain.chain_params.chain_id)
    dropdown.close()
  } catch (e) {
    ErrorHandler.process(e)
  }
}

if (!provider.value.currentProvider) {
  chainStore.selectChain(chainStore.chains[0].chain_params.chain_id)
}
</script>
<style lang="scss" scoped>
.chain-selector__dropdown-list-wrp {
  background: url('/backgrounds/select-field-dropdown-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(6);
}

.chain-selector__dropdown-list {
  overflow: hidden auto;
  width: calc(100% - #{toRem(5)});
  max-height: toRem(99);

  @include scrollbar;
}

.chain-selector__dropdown-item {
  padding: toRem(4) toRem(8);
  color: var(--text-primary-main);
  display: grid;
  grid-template-columns: toRem(18) 1fr;
  gap: toRem(4);
  align-items: center;
  transition: color 0.3s;

  &:hover {
    color: var(--text-primary-dark);
  }
}

.chain-selector__dropdown-list-text {
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-align: left;
  text-overflow: ellipsis;
  font-size: toRem(14);
  line-height: 1;
}

.chain-selector__dropdown-list-icon {
  width: 100%;
  height: 100%;
}

.chain-selector__dropdown {
  /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
  :deep(.dropdown__body) {
    width: toRem(157);
  }
}

.chain-selector__dropdown-header-text {
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-align: left;
  text-overflow: ellipsis;
  font-size: toRem(18);
  line-height: 1;
}

.chain-selector__dropdown-header-icon {
  width: toRem(24);
  height: toRem(24);
}

.chain-selector__header {
  padding: toRem(8) toRem(12);
  color: var(--text-primary-dark);
  display: flex;
  gap: toRem(8);
  align-items: center;

  @include respond-to(xmedium) {
    gap: toRem(14);
  }
}

.chain-selector__dropdown-head-indicator {
  transition: transform 0.1s ease-in-out;
  width: toRem(18);
  height: toRem(18);
  min-width: toRem(18);
  min-height: toRem(18);

  &--open {
    transform: rotate(180deg);
  }
}
</style>
