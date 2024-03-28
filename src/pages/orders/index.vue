<script setup lang="ts">

import {onBeforeMount, ref, inject, computed} from "vue";
import {useDisplay} from "vuetify";
import { OrderInterface } from "../../interfaces/OrderInterface";
import {useGradient} from "../../config/useGradient";

const http: any = inject('axios')
const orders = ref<any[]>([])
const itemsPerPage = ref<number>(useDisplay().mobile.value ? 4 : 10)

const summary = computed(() => {
  const lm = orders.value.filter((item: OrderInterface) => item.period === 'lm')
  const cw = orders.value.filter((item: OrderInterface) => item.period === 'cw')
  const cd = orders.value.filter((item: OrderInterface) => item.period === 'cd')

  return {
    lastMonth: lm.reduce((acc: any, curr: OrderInterface) => acc + curr.summary, 0),
    currentWeek: cw.reduce((acc: any, curr: OrderInterface) => acc + curr.summary, 0),
    today: cd.reduce((acc: any, curr: OrderInterface) => acc + curr.summary, 0),
  }
})
const onClickSeeAll = () => {
  itemsPerPage.value = itemsPerPage.value === 10 ? orders.value.length : useDisplay().mobile.value ? 4 : 10
}
const deleteOrder = (id: number) => {
  http.delete(`/auth/orders/${id}`)
    .then(() => {
      http.get('/auth/orders?all=true')
        .then((response: OrderInterface[]) => {
          orders.value = response
        })
    })
}
onBeforeMount(() => {
  http.get('/auth/orders?all=true')
    .then((response: OrderInterface[]) => {
      orders.value = response
    })
})

</script>

<template>
  <v-container fluid>
    <v-row>
      <template v-if="orders.length">
        <v-col cols="12" class="d-flex flex-column ga-1">
          <span class="text-body-1 font-weight-bold">
            Общая сумма:
          </span>
          <span>&mdash; день: {{ summary.today }} BYN</span>
          <span>&mdash; текущая неделя (до вчера): {{ summary.currentWeek }} BYN</span>
          <span>&mdash; предыдущий месяц: {{ summary.lastMonth }} BYN</span>
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
                  <v-sheet class="position-relative user-card" elevation="1">
                    <SeasonComponent :season="item.raw.season"/>
                    <v-btn class="position-absolute rounded-circle"
                            variant="flat"
                            @click="deleteOrder(item.raw.id)"
                            color="error"
                            style="bottom: 10px; right: 12px; z-index: 2; opacity: 1"
                            size="32">
                      <v-icon size="24">mdi-delete</v-icon>
                    </v-btn>
                    <strong style="top: 16px; left: 16px" class="position-absolute d-flex flex-column text-body-1">
                      <span>{{ item.raw.producer }}</span>
                      <span class="font-weight-medium">{{ item.raw.type }}</span>
                    </strong>
                    <v-img height="185"
                           class="d-flex flex-column align-baseline justify-end pb-4"
                           :gradient="`${useGradient(item.raw.season)}`">
                      <v-list-item
                        class="position-absolute px-4 py-4 w-100"
                        style="left: 0; bottom: 0"
                        :title="item.raw.user"
                        density="comfortable"
                        lines="three"
                      >
                        <template v-slot:title>
                          <div class="d-flex flex-column ga-0">
                            <span class="text-h6">{{ item.raw.user }}</span>
                            <small class="d-inline-block mt-n2 mb-1">{{ item.raw.ordered_with_all }}</small>
                          </div>
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
