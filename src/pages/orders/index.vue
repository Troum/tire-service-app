<script setup lang="ts">

import {onBeforeMount, ref, inject, computed} from "vue";
import {useDisplay} from "vuetify";
import { OrderInterface } from "../../interfaces/OrderInterface";

const http: any = inject('axios')
const orders = ref<any[]>([])
const itemsPerPage = ref<number>(useDisplay().mobile.value ? 4 : 10)

const summary = computed(() => {
  return orders.value.reduce((acc: any, curr: OrderInterface) => acc + curr.summary, 0)
})
const onClickSeeAll = () => {
  itemsPerPage.value = itemsPerPage.value === 10 ? orders.value.length : useDisplay().mobile.value ? 4 : 10
}

onBeforeMount(() => {
  http.get('/auth/orders?all=true')
    .then((response: OrderInterface[]) => {
      orders.value = response
    })
})

</script>

<template>
  <v-container fluid :class="{'fill-height': useDisplay().lgAndUp.value}">
    <v-row :class="{'fill-height': useDisplay().lgAndUp.value}">
      <template v-if="orders.length">
        <v-col cols="12">
          <span class="text-body-1 font-weight-bold">
            Общая сумма:
          </span>
          <span>{{ summary }} BYN</span>
        </v-col>
        <v-col cols="12">
          <v-data-iterator
            class="type-cards"
            :items="orders"
            :items-per-page="itemsPerPage"
          >
            <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
              <div class="w-100 font-weight-bold d-flex justify-space-between mb-4 align-center">
                <div class="d-flex align-center w-100 justify-end">
                  <template v-if="orders.length > 4">
                    <v-btn
                      class="me-8"
                      variant="tonal"
                      @click="onClickSeeAll"
                    >
                      <span class="text-none">Показать всех</span>
                    </v-btn>
                  </template>
                  <template v-if="orders.length > 4">
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
                    <strong style="top: 32px; left: 16px" class="position-absolute text-body-1">
                      {{ item.raw.producer }}
                    </strong>
                    <v-img height="175"
                           class="d-flex flex-column align-baseline justify-end pb-4"
                           :gradient="`to top right, rgba(255, 255, 255, .1), rgba( 125, 87, 278, .15)`">
                      <v-list-item
                        class="position-absolute px-4 py-4 w-100"
                        style="left: 0; bottom: 0"
                        :title="item.raw.user"
                        density="comfortable"
                        lines="three"
                      >
                        <template v-slot:title>
                          <strong class="text-h6">
                            {{ item.raw.user }}
                          </strong>
                        </template>
                        <template v-slot:subtitle>
                          <span class="text-body-1 font-weight-medium">
                            {{ item.raw.income }} BYN
                          </span>
                        </template>
                        <span class="font-weight-light">{{ item.raw.date }}</span>
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
          <span>В системе нет заказов.</span>
          <RouterLink to="/create">Создать</RouterLink>
        </v-col>
      </template>
    </v-row>
  </v-container>
  <EditUserDialog />
</template>

<style scoped lang="scss">

</style>
