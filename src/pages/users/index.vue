<script setup lang="ts">

import {onBeforeMount, ref, inject, onMounted} from "vue";
import {InfoInterface} from "../../interfaces/InfoInterface";
import {useDialogsStore} from "../../stores/dialogs";
import {useDisplay} from "vuetify";
import NotFoundCreateComponent from "../../components/forms/NotFoundCreateComponent.vue";


const http: any = inject('axios')
const echo: any = inject('echo')
const users = ref<any[]>([])
const itemsPerPage = ref<number>(4)
const dialogsStore = useDialogsStore()
const width = ref<number>(100)
const onClickSeeAll = () => {
  itemsPerPage.value = itemsPerPage.value === 4 ? users.value.length : 4
}

const openDialog = (user: any) => {
  dialogsStore.setDialog('editUser', {show: true, user: user})
}

const sold = (history: InfoInterface[]) => {
  return history.reduce((acc: any, curr: any) => acc + curr.amount, 0)
}

onBeforeMount(() => {
  http.get('/auth/users?edit=true')
    .then((response: any[]) => {
      users.value = response
    })
})

onMounted(() => {
  echo.channel('update')
    .listen('.update.user.list', (data: any[]) => {
      users.value = data
    })
})

</script>

<template>
  <v-container fluid :class="{'fill-height': useDisplay().lgAndUp.value}">
    <v-row :class="{'fill-height': useDisplay().lgAndUp.value}">
      <template v-if="users.length">
        <v-col cols="12">
          <v-data-iterator
            :items="users"
            :items-per-page="itemsPerPage"
          >
            <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
              <div class="w-100 font-weight-bold d-flex justify-space-between mb-4 align-center">
                <div class="d-flex align-center w-100 justify-end">
                  <template v-if="users.length > 4">
                    <v-btn
                      class="me-8"
                      variant="tonal"
                      @click="onClickSeeAll"
                    >
                      <span class="text-none">Показать всех</span>
                    </v-btn>
                  </template>
                  <template v-if="users.length > 4">
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
                  md="4"
                  xl="3"
                >
                  <v-sheet class="position-relative" elevation="1">
                    <v-img height="175"
                           class="d-flex flex-column align-baseline justify-end pb-4"
                           :gradient="`to top right, rgba(255, 255, 255, .1), rgba( 125, 87, 278, .15)`">
                      <v-btn class="position-absolute rounded-circle pa-0"
                             style="top: 16px; right: 16px"
                             color="warning"
                             @click="openDialog(item.raw)"
                             variant="tonal" height="32" min-width="32">
                        <v-icon size="sm">mdi-pencil</v-icon>
                      </v-btn>
                      <v-list-item
                        class="position-absolute px-4 py-4 w-100"
                        style="left: 0; bottom: 0"
                        :title="item.raw.name"
                        density="comfortable"
                        lines="three"
                      >
                        <template v-slot:title>
                          <strong class="text-h6">
                            {{ item.raw.name }}
                          </strong>
                        </template>
                        <template v-slot:subtitle>
                          <small>{{ item.raw.email }}</small>
                        </template>
                        <div class="d-flex justify-space-between align-center">
                          <small>Продано:</small>
                          <small>{{ sold(item.raw.history) }}</small>
                        </div>
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
        <NotFoundCreateComponent message="В системе нет пользователей."/>
      </template>
    </v-row>
  </v-container>
  <EditUserDialog />
</template>

<style scoped lang="scss">

</style>
