<script setup lang="ts">
import {defineProps} from "vue"

defineProps({
  carType: {
    type: String,
    default: 'sedan',
    validator(value: string) {
      return [
        'micro',
        'hatchback',
        'vagon',
        'liftback',
        'sedan',
        'coupe',
        'limousine',
        'muscle-car',
        'cabriolet',
        'roadster',
        'targa',
        'sport-car',
        'super-car',
        'suv',
        'crossover',
        'pickup',
        'cargo-van',
        'van',
        'minivan',
        'minibus',
        'campervan',
        'bus',
        'mini-truck',
        'truck',
        'tractor-truck'
      ].includes(value)
    }
  }
})
</script>

<template>
  <div :class="`icon icon-${carType}`"></div>
</template>

<style scoped lang="scss">
@import "@/assets/styles/components/car_type/index.css";
</style>
