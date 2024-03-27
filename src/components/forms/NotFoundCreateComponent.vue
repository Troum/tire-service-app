<script setup lang="ts">
import {defineProps} from "vue"

defineProps(['message', 'route'])

</script>

<template>
  <v-col cols="12" style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
         class="position-absolute d-flex flex-column justify-center align-center align-lg-center mx-auto my-lg-auto">
    <span>{{ message }}</span>
    <RouterLink :to="route ?? '/create'">Создать</RouterLink>
  </v-col>
</template>

<style scoped lang="scss">

</style>
