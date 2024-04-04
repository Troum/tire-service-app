<script setup lang="ts">
import {defineProps} from "vue"

defineProps({
  season: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <template v-if="season.includes('w')">
    <v-icon class="position-absolute"
            color="blue"
            style="top: 10px; right: 12px; z-index: 2; filter: drop-shadow(0 0 0.75rem rgba(0,0,0,.145))"
            size="32">mdi-snowflake</v-icon>
  </template>
  <template v-if="season.includes('s')">
    <v-icon class="position-absolute"
            color="#FFCC33"
            style="top: 10px; right: 12px; z-index: 2; filter: drop-shadow(0 0 0.75rem rgba(0,0,0,.145))"
            size="32">mdi-white-balance-sunny</v-icon>
  </template>
  <template v-if="season.includes('a')">
    <v-icon class="position-absolute"
            color="secondary"
            style="top: 10px; right: 12px; z-index: 2; filter: drop-shadow(0 0 0.75rem rgba(0,0,0,.145))"
            size="32">mdi-sun-snowflake</v-icon>
  </template>
</template>

<style scoped lang="scss">

</style>
