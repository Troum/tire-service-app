<script lang="ts" setup>
import {useAbilityTo, isLoggedIn} from '@/composables/ability.js'
import {computed, inject, ref} from "vue";
import {useAdminAbilities} from "../config/useAdminAbilities";
import {useRoute, useRouter} from "vue-router";
import {useAppStore} from "../stores/app";
import {useDisplay} from "vuetify";

const route = useRoute()
const http: any = inject('axios')
const router = useRouter()
const menu = ref<any[]>([
  {
    title: 'Создать',
    route: '/create',
    permissions: ['all']
  },
  {
    title: 'Типы',
    route: '/types',
    permissions: ['all']
  },
  {
    title: 'Информация',
    route: '/infos',
    permissions: ['all']
  },
  {
    title: 'История заказов',
    route: '/orders',
    permissions: ['orders.all', 'all']
  },
  {
    title: 'Пользователи',
    route: '/users',
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

function logout() {
  http.post('/auth/logout')
    .then(() => {
      useAppStore().setUser(null, null)
    })
    .then(() => {
      router.push({path: '/login'})
    })
}

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
              <v-btn to="/sizes" variant="outlined" color="secondary">
                <template v-if="isLastStep">
                  <span>Новый заказ</span>
                </template>
                <template v-else>
                  <span>Оформить заказ</span>
                </template>
              </v-btn>
            </template>
          </div>
          <v-btn variant="tonal" color="error" @click="logout" append-icon="mdi-exit-to-app">Выйти</v-btn>
        </div>
      </v-app-bar>
    </template>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>
