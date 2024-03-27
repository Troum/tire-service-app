<script setup lang="ts">
import _ from "lodash"
import {onBeforeMount, ref, inject, computed, onMounted} from "vue";
import {InfoInterface} from "../../interfaces/InfoInterface";
import {useSeasons} from "../../config/useSeasons";
import NotFoundCreateComponent from "../../components/forms/NotFoundCreateComponent.vue";
import {useDialogsStore} from "../../stores/dialogs";
import {useDisplay} from "vuetify";

const http: any = inject('axios')
const echo: any = inject('echo')
const infos = ref<InfoInterface[]>([])
const seasons = ref<string[]>([])
const season = ref<string | null>(null)
const itemsPerPage = ref<number>(useDisplay().mobile.value ? 4 : 10)
const dialogsStore = useDialogsStore()

const onClickSeeAll = () => {
  itemsPerPage.value = itemsPerPage.value === 10 ? infos.value.length : useDisplay().mobile.value ? 4 : 10
}

const filterInfos = (filter: string) => {
  season.value = filter
}

const openDialog = (info: InfoInterface) => {
  dialogsStore.setDialog('editInfo', {show: true, info: info})
}

onBeforeMount(() => {
  http.get('/auth/infos')
    .then((response: InfoInterface[]) => {
      infos.value = response
    })
    .then(() => {
      http.get('/auth/seasons')
        .then((response: string[]) => {
          seasons.value = response
        })
    })
})

onMounted(() => {
  echo.channel('update')
    .listen('.update.info.list', (data: InfoInterface[]) => {
      infos.value = data
    })
})

const seasonFilters = computed(() => {
  return seasons.value.map((season: string) => {
    return {
      title: useSeasons(season).title,
      value: useSeasons(season).value,
    }
  })
})

const infosItems = computed(() => {
  if (!_.isNull(season.value)) {
    return infos.value.filter((info: InfoInterface) => {
      return info.type.season === season.value
    })
  }
  return infos.value
})

</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height">
      <template v-if="infos.length">
        <v-col cols="12">
          <v-data-iterator
            :items="infosItems"
            :items-per-page="itemsPerPage"
          >
            <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
              <div class="w-100 font-weight-bold d-flex justify-space-between mb-4 align-center">
                <div class="d-flex align-center w-100 justify-start ga-4">
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        variant="tonal"
                        prepend-icon="mdi-filter"
                        v-bind="props"
                      >
                        Фильтр сезонов
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(item, index) in seasonFilters"
                        :key="index"
                        :value="item.value"
                        @click="filterInfos(item.value)"
                      >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <template v-if="season">
                    <v-chip color="secondary" @click:close="() => season = null"
                            closable>{{ useSeasons(season).title }}
                    </v-chip>
                  </template>
                </div>
                <div class="d-flex align-center w-100 justify-end">
                  <template v-if="infosItems.length > 4">
                    <v-btn
                      class="me-8"
                      variant="tonal"
                      @click="onClickSeeAll"
                    >
                      <span class="text-none">Показать все</span>
                    </v-btn>
                  </template>
                  <template v-if="infosItems.length > 4">
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
                  <v-sheet>
                    <v-img
                      :gradient="`to top right, rgba(255, 255, 255, .1), rgba( 125, 125, 125, .15)`"
                      :src="item.raw.image ?? item.raw.image_url"
                      height="150"
                    >
                      <SeasonComponent :season="item.raw.type?.season"/>
                      <v-btn class="position-absolute rounded-circle pa-0" style="top: 16px; left: 16px"
                             color="warning"
                             @click="openDialog(item.raw)"
                             variant="tonal" height="32" min-width="32">
                        <v-icon size="sm">mdi-pencil</v-icon>
                      </v-btn>
                    </v-img>

                    <v-list-item
                      :title="item.raw.name"
                      density="comfortable"
                    >
                      <template v-slot:title>
                        <strong class="text-h6">
                          {{ item.raw.name }}
                        </strong>
                      </template>
                    </v-list-item>

                    <v-table class="text-caption" density="compact">
                      <tbody>
                      <tr align="right">
                        <th>Цена:</th>

                        <td>{{ item.raw.price }} BYN</td>
                      </tr>

                      <tr align="right">
                        <th>Количество:</th>

                        <td>{{ item.raw.amount }}</td>
                      </tr>
                      </tbody>
                    </v-table>
                  </v-sheet>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>
        </v-col>
      </template>
      <template v-else>
        <NotFoundCreateComponent message="В системе нет информации."/>
      </template>
    </v-row>
  </v-container>
  <EditInfoDialog/>
</template>

<style scoped lang="scss">

</style>
