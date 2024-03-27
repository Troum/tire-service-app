<script setup lang="ts">
import {inject, onBeforeMount, onBeforeUnmount, onMounted, ref} from "vue";
import {SizeInterface} from "../../interfaces/SizeInterface";
import {TypeInterface} from "../../interfaces/TypeInterface";
import {RoleInterface} from "../../interfaces/RoleInterface";
import {PlaceInterface} from "../../interfaces/PlaceInterface";
import {useDisplay} from "vuetify";

const sizes = ref<SizeInterface[]>([])
const types = ref<TypeInterface[]>([])
const roles = ref<RoleInterface[]>([])
const places = ref<PlaceInterface[]>([])
const seasons = ref<string[]>([])

const http: any = inject('axios')
const echo: any = inject('echo')

onBeforeMount(() => {

  http.get('/auth/sizes')
    .then(() => {
      http.get('/auth/places')
        .then((response: PlaceInterface[]) => {
          places.value = response
        })
    })
    .then((response: SizeInterface[]) => {
      sizes.value = response
    })
    .then(() => {
      http.get('/auth/seasons')
        .then((response: string[]) => {
          seasons.value = response
        })
    })
    .then(() => {
      http.get('/auth/types')
        .then((response: TypeInterface[]) => {
          types.value = response
        })
    })
    .then(() => {
      http.get('/auth/roles')
        .then((response: RoleInterface[]) => {
          roles.value = response
        })
    })
})
onMounted(() => {
  echo.channel('update')
    .listen('.update.size.list', (data: SizeInterface[]) => {
      sizes.value = data
    })
    .listen('.update.type.list', (data: TypeInterface[]) => {
      types.value = data
    })
    .listen('.update.place.list', (data: PlaceInterface[]) => {
      places.value = data
    })
})
onBeforeUnmount(() => {
  echo.leave('update')
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="d-flex flex-column flex-lg-row align-baseline justify-start ga-4">
        <div class="d-flex flex-column ga-4" :style="{width: useDisplay().mobile.value ? '100%': '50%'}">
          <AddPlaceForm />
          <AddSizeForm/>
          <AddTypeForm :sizes="sizes" :seasons="seasons"/>
        </div>
        <div class="d-flex flex-column ga-4" :style="{width: useDisplay().mobile.value ? '100%': '50%'}">
          <AddInfoForm :types="types" :places="places"/>
          <AddUserForm :roles="roles" :places="places"/>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">

</style>
