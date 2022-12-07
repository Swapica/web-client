<script lang="ts" setup>
import {
  AppButton,
  Modal,
  ErrorMessage,
  NoDataMessage,
  Loader,
  Icon,
  Collapse,
} from '@/common'
import { InputField, SelectField } from '@/fields'
import LoginForm from '@/forms/LoginForm.vue'

import { reactive, ref } from 'vue'
import { Bus } from '@/helpers'
import { ICON_NAMES } from '@/enums'

const isModalShown = ref<boolean>(false)
const form = reactive({
  chbValue: false,
  inputValue: '',
  selectValue: '',
  textareaValue: '',
})

const handleClick = () => {
  alert('some string')
}

const throwBusSuccess = () => {
  Bus.success('Success')
}

const throwBusError = () => {
  Bus.error('Error')
}
</script>

<template>
  <div class="ui-kit-page">
    <section class="ui-kit-page__buttons">
      <app-button
        :icon-right="$icons.user"
        scheme="primary"
        :text="'router, border-rounded, icon'"
        :route="{ name: $routes.uiKit }"
      />
      <app-button
        modification="border-circle"
        scheme="secondary"
        :text="'href, border-circle'"
        href="https://www.youtube.com/"
        target="_blank"
      />
      <app-button
        scheme="secondary"
        :text="'Alert, icon-first'"
        :icon-left="$icons.user"
        @click="handleClick"
        disabled
      />
      <app-button
        scheme="flat"
        :text="'Bus.success, success'"
        @click="throwBusSuccess"
      />
      <app-button
        scheme="flat"
        :text="'Bus.error, error'"
        @click="throwBusError"
      />

      <app-button scheme="primary" disabled :text="'flat, small'" />
      <app-button :icon-right="$icons.user" />
    </section>
    <section class="ui-kit-page__inputs">
      <select-field
        v-model="form.selectValue"
        scheme="primary"
        :label="'Label'"
        :placeholder="'select placeholder'"
        :value-options="[
          { label: 'Value 1', value: '1' },
          { label: 'Value 2', value: '2' },
          { label: 'Value 3', value: '3' },
          { label: 'Value 4', value: '4' },
          { label: 'Value 5', value: '5' },
          { label: 'Value 6', value: '6' },
          { label: 'Value 7', value: '7' },
        ]"
        :error-message="form.selectValue === '7' ? 'error for number 7' : ''"
      />
      <select-field
        v-model="form.selectValue"
        scheme="primary"
        :label="'Custom select'"
        :placeholder="'select placeholder'"
        :value-options="[
          { label: 'Value 1', value: '1', icon: ICON_NAMES.arrowDown },
          { label: 'Value 2', value: '2' },
          { label: 'Value 3', value: '3' },
          { label: 'Value 4', value: '4' },
          { label: 'Value 5', value: '5' },
          { label: 'Value 6', value: '6' },
          { label: 'Value 7', value: '7' },
        ]"
      >
      </select-field>
      <select-field
        v-model="form.selectValue"
        scheme="primary"
        :error-message="$t('ui-kit-page.some-error-message')"
        :label="'Custom select'"
        :placeholder="'select placeholder'"
      >
        <template #head>
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }"
          >
            <icon
              :name="$icons.user"
              :style="{ width: '18px', height: '18px' }"
            />
            {{
              [
                { label: 'Value 1', value: '1' },
                { label: 'Value 2', value: '2' },
                { label: 'Value 3', value: '3' },
                { label: 'Value 4', value: '4' },
                { label: 'Value 5', value: '5' },
                { label: 'Value 6', value: '6' },
                { label: 'Value 7', value: '7' },
              ].find(item => item.value === form.selectValue)?.label
            }}
          </div>
        </template>
        <template #default="{ selectField }">
          <app-button
            v-for="(items, idx) in [
              { label: 'Value 1', value: '1' },
              { label: 'Value 2', value: '2' },
              { label: 'Value 3', value: '3' },
              { label: 'Value 4', value: '4' },
              { label: 'Value 5', value: '5' },
              { label: 'Value 6', value: '6' },
              { label: 'Value 7', value: '7' },
            ]"
            :key="idx"
            :text="items.label"
            :style="{ width: '100%', hoverOpacity: '0.5' }"
            scheme="default"
            :icon-left="$icons.user"
            @click="selectField.select(items.value)"
          />
        </template>
      </select-field>
    </section>
    <section class="ui-kit-page__inputs">
      <input-field
        v-model="form.inputValue"
        :label="'label'"
        :placeholder="$t('ui-kit-page.some-placeholder')"
      />
      <input-field
        v-model="form.inputValue"
        :label="$t('ui-kit-page.some-label')"
        :placeholder="$t('ui-kit-page.some-placeholder')"
        disabled
      />
      <input-field
        v-model="form.inputValue"
        :label="$t('ui-kit-page.some-label')"
        :error-message="$t('ui-kit-page.some-error-message')"
        :placeholder="$t('ui-kit-page.some-placeholder')"
      />
    </section>
    <section class="ui-kit-page__form">
      <login-form />
    </section>
    <section class="ui-kit-page__common">
      <error-message :message="$t('ui-kit-page.loading-error-msg')" />
      <no-data-message :message="$t('ui-kit-page.no-data-msg')">
        <app-button
          :icon-right="$icons.user"
          scheme="primary"
          :text="'router'"
          :route="{ name: $routes.uiKit }"
        />
      </no-data-message>
      <loader />
      <collapse
        class="ui-kit-page__collapse"
        title="ewfewfefew"
        description="elkwfjelwkjfelkwjfklewjflkwjfl"
      >
      </collapse>
      <app-button
        :text="$t('ui-kit-page.modal-btn')"
        @click="isModalShown = true"
      />
      <modal v-model:is-shown="isModalShown">
        <template #default="{ modal }">
          <app-button
            @click="modal.close"
            :icon-right="$icons.user"
            scheme="default"
            modification="default"
            size="default"
            color="default"
          />
        </template>
      </modal>
      <div class="ui-kit-page__icons">
        <icon :name="$icons.user" />
        <icon :name="$icons.arrowDown" />
        <icon :name="$icons.arrowLeft" />
        <icon :name="$icons.arrowRight" />
        <icon :name="$icons.arrowUp" />
        <icon :name="$icons.arrowDownFilled" />
        <icon :name="$icons.arrowLeftFilled" />
        <icon :name="$icons.arrowRightFilled" />
        <icon :name="$icons.arrowUpFilled" />
        <icon :name="$icons.close" />
        <icon :name="$icons.menu" />
        <icon :name="$icons.link" />
        <icon :name="$icons.check" />
        <icon :name="$icons.error" />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.ui-kit-page {
  display: grid;
  grid-gap: toRem(50);
  padding-bottom: toRem(200);
}

.ui-kit-page__buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: toRem(32);
}

.ui-kit-page__inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: toRem(32);
}

.ui-kit-page__common {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: toRem(56);
}

.ui-kit-page__collapse {
  width: 100%;
}

.ui-kit-page__collapse-btn {
  width: 100%;
}

.ui-kit-page__collapse-body {
  font-size: toRem(24);
}

.ui-kit-page__icons {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, toRem(24));
  grid-gap: toRem(24);

  & > * {
    width: toRem(24);
    height: toRem(24);
  }
}

.ui-kit-page__input-icon {
  max-width: toRem(24);
  max-height: toRem(24);
}
</style>
