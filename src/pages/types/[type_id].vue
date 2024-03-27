<script setup lang="ts">
import {onBeforeMount, ref, inject} from "vue";
import {useRoute} from "vue-router";
import {InfoInterface} from "../../interfaces/InfoInterface";
import {useGetColor} from "../../composables/useGetColor";
import {useDisplay} from "vuetify";
import {usePerRow} from "../../config/usePerRow";

const route = useRoute()

const { type_id } = route.params

const infos = ref<InfoInterface[]>([])
const http: any = inject('axios')

onBeforeMount(() => {
  http.get(`/auth/infos?type_id=${type_id}`)
    .then((response: InfoInterface[]) => {
      infos.value = response
    })
})
</script>

<template>
  <v-container fluid :class="{'fill-height': useDisplay().lgAndUp.value}">
    <v-row :class="{'fill-height': useDisplay().lgAndUp.value}">
      <v-col cols="12" class="d-flex flex-wrap justify-center align-center justify-lg-start align-lg-stretch ga-4 mx-auto my-auto">
        <template v-for="info of infos" :key="info.id">
          <v-card :to="`/infos/${info.id}`"
                  class="pa-0"
                  :style="useDisplay().width.value > 768 ? 'display: grid; grid-template-columns: 80px calc(100% - 80px)' : ''"
                  :min-width="`calc(100% / ${usePerRow()} - 8px)`"
                  :max-width="`calc(100% / ${usePerRow()} - 8px)`">
            <template v-if="useDisplay().width.value > 768">
              <v-avatar rounded="0" size="80" class="fill-height d-flex align-center bg-white">
                <v-img :src="info.image"></v-img>
              </v-avatar>
            </template>
            <v-card-text class="position-relative d-flex flex-column justify-space-between fill-height pa-4">
              <template v-if="useDisplay().width.value < 768">
                <v-img :src="info.image"></v-img>
              </template>
              <v-card-title class="text-wrap">{{ info.name }}</v-card-title>
              <v-card-subtitle class="d-flex align-center justify-space-between">
                <div>
                  <span class="text-body-1 font-weight-bold">Цена:&nbsp;</span>
                  <span>{{ info.price }} BYN</span>
                </div>
                <v-chip :color="useGetColor(info.amount)" variant="elevated">{{ info.amount }}</v-chip>
              </v-card-subtitle>
            </v-card-text>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">

</style>
