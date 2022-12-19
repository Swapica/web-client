<template>
  <transition name="modal">
    <div v-show="isShown" class="modal">
      <div class="modal__pane" ref="modalPane">
        <slot :modal="{ close: closeModal }" />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const EVENTS = {
  updateIsShown: 'update:is-shown',
}

export default defineComponent({
  name: 'modal',
  props: {
    isShown: {
      type: Boolean,
      default: false,
    },
    isCloseByClickOutside: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const modalPane = ref<HTMLElement | undefined>()

    onMounted(() => {
      if (modalPane.value) {
        if (props.isCloseByClickOutside) {
          onClickOutside(modalPane, () => {
            closeModal()
          })
        }
      }
    })

    const closeModal = () => {
      emit(EVENTS.updateIsShown, false)
    }

    return {
      modalPane,

      closeModal,
    }
  },
})
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: vh(100);
  background: rgba(var(--black-rgb), 0.12);
  z-index: var(--z-index-modal);
}

.modal__pane {
  position: relative;
  background: url('/backgrounds/modal-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(24) toRem(48) toRem(50);
  display: flex;
  flex-flow: column nowrap;

  @include respond-to(tablet) {
    margin: 0 toRem(32);
    max-height: vh(80);
  }

  &:before {
    content: url('/images/pin.svg');
    display: block;
    width: toRem(46);
    height: toRem(54);
    position: absolute;
    top: toRem(-28);
    left: toRem(18.49);

    @include respond-to(700px) {
      left: toRem(-4);
    }
  }

  &:after {
    content: url('/images/pin.svg');
    display: block;
    width: toRem(46);
    height: toRem(54);
    position: absolute;
    top: toRem(-28);
    right: toRem(-2.34);
    transform: rotate(35deg);

    @include respond-to(700px) {
      right: toRem(-15.34);
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: 0.25s ease;
  transition-property: opacity, transform;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
