<script setup lang="ts">
import {onBeforeMount, ref, inject} from "vue";
import {SizeInterface} from "../../interfaces/SizeInterface";
import {PlaceInterface} from "../../interfaces/PlaceInterface";
import {useDisplay} from "vuetify";
import {usePerRow} from "../../config/usePerRow";
import NotFoundCreateComponent from "../../components/forms/NotFoundCreateComponent.vue";

const sizes = ref<SizeInterface[]>([])
const places = ref<PlaceInterface[]>([])
const http: any = inject('axios')

onBeforeMount(() => {
  http.get('/auth/sizes')
    .then((response: SizeInterface[]) => {
      sizes.value = response
    })
    .then(() => {
      http.get('/auth/places')
        .then((response: PlaceInterface[]) => {
          places.value = response
        })
    })
})
</script>

<template>
  <v-container fluid :class="{'fill-height': useDisplay().lgAndUp.value}">
    <v-row :class="{'fill-height': useDisplay().lgAndUp.value}">
      <v-col cols="12" class="d-flex flex-wrap justify-center justify-lg-start align-lg-center ga-4 mx-auto my-lg-auto">
        <v-row class="d-flex flex-row ga-4">
          <template v-for="place of places" :key="place.id">
            <v-col cols="12" lg="6">
              <v-sheet class="d-flex flex-column ga-0 pa-4 rounded-sm">
                <span class="font-weight-bold text-h6 mb-4">{{ place.name }}, {{ place.address }}</span>
                <span class="font-weight-bold">Общее количество зимних шин: {{ place.seasons.winter }}</span>
                <span class="font-weight-bold">Общее количество летних шин: {{ place.seasons.summer }}</span>
                <span class="font-weight-bold">Общее количество всесезонных шин: {{ place.seasons.summer }}</span>
              </v-sheet>
            </v-col>
          </template>
        </v-row>
      </v-col>
      <template v-if="sizes.length">
        <v-col cols="12" class="d-flex flex-wrap justify-center justify-lg-start align-lg-center mx-auto my-lg-auto">
          <v-row class="ma-0 pa-0">
            <template v-for="size of sizes" :key="size.id">
              <v-col cols="12" md="6" lg="3">
                <v-card :to="`/sizes/${size.id}?size=${parseInt(size.size)}`"
                        height="240">
                  <v-card-text class="d-flex justify-center align-center fill-height">
                    <span class="text-h3">{{ size.size }}</span>
                  </v-card-text>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-col>
      </template>
      <template v-else>
        <NotFoundCreateComponent message="В системе нет размеров."/>
      </template>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">

</style>
