<script setup>
import { useCurrencyInput } from "vue-currency-input";
import {watch} from "vue";

const props = defineProps({
  modelValue: Number,
  title: {
    type: String,
    default: 'Цена за единицу'
  },
  placeholder: {
    type: String,
    default: 'Введите цену'
  },
  options: {
    type: Object,
    default: () => {
      return {
        currency: 'BYN'
      }
    }
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const { inputRef, formattedValue, setValue, setOptions } = useCurrencyInput(props.options, true);

watch(
  () => props.modelValue,
  (value) => {
    setValue(value)
  }
)

watch(
  () => props.options,
  (options) => {
    setOptions(options)
  }
)
</script>

<template>
  <v-text-field ref="inputRef" variant="outlined"
                density="comfortable"
                :label="title"
                :disabled="disabled"
                v-model.lazy="formattedValue"
                :placeholder="placeholder">
  </v-text-field>
</template>

<style scoped>

</style>
