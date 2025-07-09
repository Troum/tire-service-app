<script lang="ts" setup>
import {useAbilityTo, isLoggedIn} from '../composables/ability.js'
import {computed, inject, onMounted, ref} from "vue";
import {useAdminAbilities} from "../config/useAdminAbilities";
import {useRoute, useRouter} from "vue-router";
import {useAppStore} from "../stores/app";
import {useDisplay, useTheme} from 'vuetify'

const appStore = useAppStore()
const route = useRoute()
const http: any = inject('axios')
const router = useRouter()
const menu = ref<any[]>([
  {
    title: 'Создать',
    icon: 'mdi-pencil',
    route: '/create',
    permissions: ['all']
  },
  {
    title: 'Типы',
    icon: 'mdi-view-list-outline',
    route: '/types',
    permissions: ['all']
  },
  {
    title: 'Информация',
    icon: 'mdi-exclamation',
    route: '/infos',
    permissions: ['all']
  },
  {
    title: 'История заказов',
    icon: 'mdi-history',
    route: '/orders',
    permissions: ['orders.all', 'all']
  },
  {
    title: 'Пользователи',
    icon: 'mdi-account-group',
    route: '/users',
    permissions: ['all']
  },
  {
    title: 'Работа с DataMatrix',
    icon: 'mdi-qrcode',
    route: '/datamatrix',
    permissions: ['all']
  }
])
const loggedIn = computed(() => {
  return isLoggedIn()
})
const isNotOnSizes = computed(() => {
  return route.name !== '/sizes/'
})

const isLastStep = computed(() => {
  return route.name === '/infos/[info_id]'
})

const currentTheme = computed(() => {
  return appStore.getTheme
})

const theme = useTheme()

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  appStore.setTheme(theme.global.name.value)
}

function logout() {
  http.post('/auth/logout')
    .then(() => {
      appStore.setUser(null, null)
    })
    .then(() => {
      router.push({path: '/login'})
    })
}

onMounted(() => {
  if (currentTheme.value) {
    theme.global.name.value = currentTheme.value
  }
})

</script>
<template>
  <v-app>
    <AlertComponent/>
    <template v-if="loggedIn">
      <v-app-bar>
        <div class="d-flex justify-space-between align-center w-100 px-3">
          <div class="d-flex justify-start align-center ga-3">
            <template v-if="useAbilityTo(useAdminAbilities)">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-menu"
                    variant="plain"
                    color="primary"
                    v-bind="props"
                  >
                  </v-btn>
                </template>
                <v-list>
                  <template v-for="(item, index) in menu" :key="index">
                    <template v-if="useAbilityTo(item.permissions)">
                      <v-list-item
                        :prepend-icon="item.icon"
                        :to="item.route"
                        :value="index"
                      >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </template>
                  </template>
                </v-list>
              </v-menu>
            </template>
            <template v-if="isNotOnSizes">
              <template v-if="useDisplay().mobile.value">
                <v-btn style="opacity: 1"
                       icon="mdi-plus"
                       to="/sizes"
                       variant="plain"
                       color="secondary"></v-btn>
              </template>
              <template v-else>
                <v-btn to="/sizes" variant="outlined" color="secondary">
                  <template v-if="isLastStep">
                    <span>Новый заказ</span>
                  </template>
                  <template v-else>
                    <span>Оформить заказ</span>
                  </template>
                </v-btn>
              </template>
            </template>
          </div>
          <div class="d-flex align-center justify-start ga-4">
            <v-btn :icon="theme.global.current.value.dark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
                   variant="plain"
                   style="opacity: 1"
                   @click="toggleTheme"></v-btn>
            <template v-if="useDisplay().mobile.value">
              <v-btn variant="plain"
                     style="opacity: 1"
                     color="error"
                     @click="logout"
                     icon="mdi-exit-to-app"></v-btn>
            </template>
            <template v-else>
              <v-btn variant="tonal"
                     color="error"
                     @click="logout"
                     append-icon="mdi-exit-to-app">Выйти</v-btn>
            </template>
          </div>
        </div>
      </v-app-bar>
    </template>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>
