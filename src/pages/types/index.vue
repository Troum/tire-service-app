<script setup lang="ts">

import {onBeforeMount, ref, inject, onMounted} from "vue";
import {useDialogsStore} from "../../stores/dialogs";
import {TypeInterface} from "../../interfaces/TypeInterface";
import {useDisplay} from "vuetify";


const http: any = inject('axios')
const echo: any = inject('echo')
const types = ref<TypeInterface[]>([])
const itemsPerPage = ref<number>(useDisplay().mobile.value ? 4 : 15)
const dialogsStore = useDialogsStore()
const width = ref<number>(100)
const onClickSeeAll = () => {
  itemsPerPage.value = itemsPerPage.value === 15 ? types.value.length : useDisplay().mobile.value ? 4 : 15
}

const openDialog = (type: TypeInterface) => {
  dialogsStore.setDialog('editType', {show: true, type: type})
}

onBeforeMount(() => {
  http.get('/auth/types')
    .then((response: TypeInterface[]) => {
      types.value = response
    })
})

onMounted(() => {
  echo.channel('update')
    .listen('.update.type.list', (data: any[]) => {
      types.value = data
    })
})

</script>

<template>
  <v-container fluid :class="{'fill-height': useDisplay().lgAndUp.value}">
    <v-row :class="{'fill-height': useDisplay().lgAndUp.value}">
      <template v-if="types.length">
        <v-col cols="12">
          <v-data-iterator
            class="type-cards"
            :items="types"
            :items-per-page="itemsPerPage"
          >
            <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
              <div class="w-100 font-weight-bold d-flex justify-space-between mb-4 align-center">
                <div class="d-flex align-center w-100 justify-end">
                  <template v-if="types.length > 4">
                    <v-btn
                      class="me-8"
                      variant="tonal"
                      @click="onClickSeeAll"
                    >
                      <span class="text-none">Показать всех</span>
                    </v-btn>
                  </template>
                  <template v-if="types.length > 4">
                    <div class="d-inline-flex">
                      <v-btn
                        :disabled="page === 1"
                        class="me-2"
                        icon="mdi-arrow-left"
                        size="small"
                        variant="tonal"
                        @click="prevPage"
                      ></v-btn>

                      <v-btn
                        :disabled="page === pageCount"
                        icon="mdi-arrow-right"
                        size="small"
                        variant="tonal"
                        @click="nextPage"
                      ></v-btn>
                    </div>
                  </template>
                </div>
              </div>
            </template>

            <template v-slot:default="{ items }">
              <v-row>
                <v-col
                  v-for="(item, i) in items"
                  :key="i"
                  cols="12"
                  sm="6"
                  xl="3"
                >
                  <v-sheet class="position-relative user-card">
                    <SeasonComponent :season="item.raw.season"/>
                    <v-img height="60"
                           class="d-flex flex-column align-baseline justify-end pb-4"
                           :gradient="`to top right, rgba(255, 255, 255, .1), rgba( 125, 87, 278, .15)`">
                      <v-btn class="position-absolute rounded-circle pa-0"
                             style="top: 16px; left: 16px; z-index: 2"
                             color="warning"
                             @click="openDialog(item.raw)"
                             variant="tonal" height="32" min-width="32">
                        <v-icon size="sm">mdi-pencil</v-icon>
                      </v-btn>
                      <v-list-item
                        class="position-absolute text-center px-4 py-4 w-100"
                        style="z-index: 1; left: 50%; top: 50%; transform: translate(-50%, -50%)"
                        :width="width"
                        :title="item.raw.type"
                        density="comfortable"
                        lines="three"
                      >
                        <template v-slot:title>
                          <strong class="text-h5">
                            {{ item.raw.type }}
                          </strong>
                        </template>
                      </v-list-item>
                    </v-img>
                  </v-sheet>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12" style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
               class="position-absolute d-flex flex-column justify-center align-center align-lg-center mx-auto my-lg-auto">
          <span>В системе нет типов.</span>
          <RouterLink to="/create">Создать</RouterLink>
        </v-col>
      </template>
    </v-row>
  </v-container>
  <EditTypeDialog />
</template>

<style scoped lang="scss">

</style>
