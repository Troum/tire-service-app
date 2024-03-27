<script setup lang="ts">
import {onBeforeMount, ref, inject} from "vue";
import {useRoute} from "vue-router";
import {TypeInterface} from "../../interfaces/TypeInterface";
import SeasonComponent from "../../components/SeasonComponent.vue";
import {usePerRow} from "../../config/usePerRow";
import {useDisplay} from "vuetify";

const route = useRoute()

const { size_id } = route.params
const { size } = route.query

const types = ref<TypeInterface[]>([])
const http: any = inject('axios')

onBeforeMount(() => {
  http.get(`/auth/types?size_id=${size_id}`)
    .then((response: TypeInterface[]) => {
      types.value = response
    })
})
</script>

<template>
  <v-container fluid :class="{'fill-height': useDisplay().lgAndUp.value}">
    <v-row :class="{'fill-height': useDisplay().lgAndUp.value}">
      <template v-if="types.length">
        <v-col cols="12" class="d-flex flex-wrap justify-center justify-lg-start align-center ga-4 mx-auto my-auto">
          <template v-for="type of types" :key="type.id">
            <v-card :to="`/types/${type.id}?size=${size}&type=${type.type}`"
                    height="240" :min-width="`calc(100% / ${usePerRow()} - 8px)`"
                    :max-width="`calc(100% / ${usePerRow} - 8px)`">
              <v-card-text class="position-relative d-flex justify-center align-center fill-height">
                <span class="text-h4">{{ type.type }}</span>
                <SeasonComponent :season="type.season"/>
              </v-card-text>
            </v-card>
          </template>
        </v-col>
      </template>
      <template v-else>
        <NotFoundCreateComponent message="Шины данного размера закончились"/>
      </template>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">

</style>
