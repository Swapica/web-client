<template>
  <div class="collapse" ref="rootEl">
    <div class="collapse__head-wrp">
      <template v-if="$slots.head">
        <slot
          name="head"
          :collapse="{
            isOpen: isCollapseOpen,
            toggle: toggleCollapse,
            open: openCollapse,
            close: closeCollapse,
          }"
        />
      </template>
      <template v-else>
        <button @click="toggleCollapse" class="collapse__head">
          <span class="collapse__head-title">{{ title }}</span>
          <icon
            class="collapse__head-icon"
            :class="{ 'collapse__head-icon--opened': isCollapseOpen }"
            :name="$icons.arrowDown"
          />
        </button>
      </template>
    </div>
    <transition
      name="collapse__body-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <div v-show="isCollapseOpen" class="collapse__body-wrp">
        <template v-if="$slots.default">
          <slot
            :collapse="{
              isOpen: isCollapseOpen,
              toggle: toggleCollapse,
              open: openCollapse,
              close: closeCollapse,
            }"
          />
        </template>
        <template v-else>
          <div class="collapse__body">
            <p>{{ description }}</p>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useRouter } from '@/router'
import { Icon } from '@/common'

export default defineComponent({
  name: 'collapse',
  components: {
    Icon,
  },
  props: {
    isOpenedByDefault: {
      type: Boolean,
      default: false,
    },
    isCloseByClickOutside: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const rootEl = ref<HTMLElement | null>(null)
    const isCollapseOpen = ref(props.isOpenedByDefault)
    const router = useRouter()

    router.afterEach(() => {
      closeCollapse()
    })

    onMounted(() => {
      if (rootEl.value) {
        if (props.isCloseByClickOutside) {
          onClickOutside(rootEl, () => {
            closeCollapse()
          })
        }
      }
    })

    const toggleCollapse = () => {
      isCollapseOpen.value ? closeCollapse() : openCollapse()
    }
    const closeCollapse = () => {
      isCollapseOpen.value = false
    }
    const openCollapse = () => {
      isCollapseOpen.value = true
    }

    const setHeightCSSVar = (element: HTMLElement) => {
      element.style.setProperty(
        '--collapse-body-height',
        `${element.scrollHeight}px`,
      )
    }

    return {
      rootEl,
      isCollapseOpen,
      toggleCollapse,
      openCollapse,
      closeCollapse,
      setHeightCSSVar,
    }
  },
})
</script>

<style lang="scss" scoped>
.collapse__body-wrp {
  overflow: hidden;
}

.collapse__head {
  background: url('/backgrounds/collapse-head-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(13.5) toRem(34) toRem(13.5) toRem(15);
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

.collapse__head-icon {
  width: toRem(20);
  height: toRem(20);
  position: absolute;
  right: toRem(14);
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.1s ease-in-out;
  color: var(--field-text);

  &--opened {
    transform: translateY(-50%) rotate(180deg);
  }
}

.collapse__body {
  margin-top: toRem(4);
  background: url('/backgrounds/collapse-body-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(12) toRem(14) toRem(14) toRem(20);
}

.collapse__body-transition-enter-active {
  animation: collapse-frame-keyframes 0.25s ease-in-out;
}

.collapse__body-transition-leave-active {
  animation: collapse-frame-keyframes 0.25s ease-in-out reverse;
}

@keyframes collapse-frame-keyframes {
  from {
    height: 0;
  }

  to {
    height: var(--collapse-body-height);
  }
}
</style>
