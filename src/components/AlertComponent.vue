<script setup lang="ts">
import {computed, watch} from "vue";
import {useAppStore} from "../stores/app";

const appStore = useAppStore()

const alert = computed({
  get: () => {
    return appStore.getAlert
  },
  set: (value: any) => {
    appStore.setAlert({show: value})
  }
})

const runTimeout = () => setTimeout(() => appStore.setAlert({show: false}), 5000)

watch(alert, () => {
  runTimeout()
})

</script>

<template>
  <transition transition="slide-x-transition">
    <v-alert style="z-index: 9999;" class="position-fixed w-100"
             v-model="alert.show" :type="alert.type" closable>
      {{ alert.message }}
    </v-alert>
  </transition>
</template>

<style scoped lang="scss">

</style>
