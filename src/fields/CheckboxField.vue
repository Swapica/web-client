<template>
  <label
    class="checkbox-field"
    :class="{
      'checkbox-field--disabled': disabled,
      'checkbox-field--checked': modelValue,
    }"
  >
    <input
      v-bind="$attrs"
      class="checkbox-field__input"
      type="checkbox"
      :checked="modelValue"
      :name="$attrs.name || label"
      :value="modelValue"
      :disabled="disabled"
      @change="onChange"
    />
    <div
      aria-hidden="true"
      class="checkbox-field__frame"
      :class="{ 'checkbox-field__frame--checked': modelValue }"
    />

    <div class="checkbox-field__content">
      <p class="checkbox-field__label">
        {{ label }}
      </p>
      <p class="checkbox-field__desc">
        {{ description }}
      </p>
    </div>
  </label>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    modelValue: boolean
    label?: string
    description?: string
    disabled?: boolean
  }>(),
  {
    label: '',
    description: ' ',
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement

  emit('update:modelValue', target.checked)
}
</script>

<style lang="scss" scoped>
.checkbox-field {
  cursor: pointer;
  display: grid;
  align-items: start;
  grid-template-columns: toRem(40) 1fr;
  grid-gap: toRem(8);
  position: relative;
  width: max-content;

  &--disabled {
    cursor: not-allowed;
    filter: grayscale(50);
    opacity: 0.5;
  }
}

.checkbox-field__input {
  position: absolute;
  width: toRem(1);
  height: toRem(1);
  margin: calc(#{toRem(1)} * -1);
  border: 0;
  padding: 0;
  white-space: nowrap;
  clip-path: inset(100%);
  clip: rect(0 0 0 0);
  overflow: hidden;
}

.checkbox-field__frame {
  display: flex;
  width: toRem(40);
  height: toRem(40);
  min-height: toRem(40);
  min-width: toRem(40);
  background: url('/backgrounds/checkbox-bg.svg');
  background-size: 100% 100%;

  .checkbox-field--checked & {
    background-image: url('/backgrounds/checkbox-checked-bg.svg');
  }
}

.checkbox-field__content {
  display: flex;
  flex-direction: column;
  gap: toRem(2);
  margin-top: toRem(5);
}

.checkbox-field__label {
  @include field-text;
}

.checkbox-field__desc {
  font-size: toRem(12);
  line-height: 1.2;
  color: var(--text-primary-main);
}
</style>
