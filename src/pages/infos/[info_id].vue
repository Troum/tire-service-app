<script setup lang="ts">
import _ from "lodash"
import {computed, inject, onBeforeMount, onBeforeUnmount, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {InfoInterface} from "../../interfaces/InfoInterface";
import {useGetColor} from "../../composables/useGetColor";
import SeasonComponent from "../../components/SeasonComponent.vue";
import {toTypedSchema} from "@vee-validate/yup";
import * as yup from "yup";
import {useForm} from "vee-validate";
import {OrderRequest} from "../../requests/OrderRequest";
import {useDisplay} from "vuetify";
import {useDialogsStore} from "../../stores/dialogs";
import {useAppStore} from "../../stores/app";

const route = useRoute()

const {info_id} = route.params
const dialogsStore = useDialogsStore()
const employeeId = ref<number | null>(null)
const info = ref<InfoInterface>({})
const http: any = inject('axios')
const echo: any = inject('echo')
const loading = ref<boolean>(false)

const schema = toTypedSchema(
  yup.object({
    amount: yup
      .number()
      .typeError('Поле должно содержать число')
      .required('Поле является обязательным')
  })
)
const {defineField, handleSubmit, resetForm} = useForm({
  initialValues: {
    amount: 0
  },
  validationSchema: schema
})
const vuetifyConfig = (state) => ({
  props: {
    'error-messages': state.errors,
  },
})
const selectedForScan = ref<string[]>([])
const [amount, amountProps] = defineField('amount', vuetifyConfig);

const onSubmit = handleSubmit((values: OrderRequest) => {

  if (selected.value.length !== amount.value) {
    useAppStore().setAlert({
      show: true,
      message: 'Количество выбранных к сканированию шин не может быть меньше количества в заказе',
      type: 'warning'
    })

  } else {
    loading.value = true
    values.selected = selected.value

    values.info_id = info.value.id
    values.amount = amount.value

    if (!_.isNull(employeeId.value)) {
      values.employee_id = employeeId.value
    }

    http.post('/auth/orders', values)
        .then(() => {
          resetForm({values: {amount: 0}})
          loading.value = false
          employeeId.value = null
        })
        .catch(() => loading.value = false)
  }

});

const openDialog = () => {
  dialogsStore.setDialog('otherEmployee', {show: true})
}

const closeAfterChoose = (employee_id: number) => {
  employeeId.value = employee_id
  dialogsStore.setDialog('otherEmployee', {show: false})
  onSubmit()
}
const loadInfo = () => {
  http.get(`/auth/infos/${info_id}`)
    .then((response: InfoInterface) => {
      info.value = response
    })
}

const selectQrCode = (toggle: any, qrId: string) => {
  toggle()
  selectedForScan.value.push(qrId)
}

const selected = computed((): string[] => {
  return Array.from(selectedForScan.value)
})

onBeforeMount(() => {
  loadInfo()
})

onBeforeUnmount(() => {
  echo.leave()
})

watch(info, (value) => {
  if (value) {
    echo.channel(`info.${value.id}.update`)
      .listen(`.updated.info`, () => {
        loadInfo()
      })
  }
})

</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="6">
        <v-card class="pa-0 d-flex">
          <v-card-text class="position-relative pa-4">
            <v-row>
              <v-col cols="3">
                <template v-if="useDisplay().width.value > 768">
                  <v-img max-height="320" :src="info.image ?? info.image_url"></v-img>
                </template>
                <template v-if="useDisplay().width.value < 768">
                  <v-img max-height="320" :src="info.image ?? info.image_url"></v-img>
                </template>
              </v-col>
              <v-col cols="9">
                <v-card-title class="text-wrap px-0">{{ info.name }}</v-card-title>
                <v-card-subtitle class="d-flex align-center justify-space-between px-0">
                  <div>
                    <span class="text-body-1 font-weight-bold">Цена:&nbsp;</span>
                    <span>{{ info.price }} BYN</span>
                  </div>
                  <v-chip :color="useGetColor(info.amount)" variant="elevated">{{ info.amount }}</v-chip>
                </v-card-subtitle>
                <SeasonComponent :season="info.type?.season"/>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6">
        <v-form @submit="onSubmit">
          <v-card variant="flat" color="transparent" class="pa-0">
            <v-card-text>
              <v-number-input
                v-model="amount"
                v-bind="amountProps"
                :max="info.amount"
                :min="0"
                :reverse="false"
                controlVariant="split"
                label="Выберите количество шин"
                :hideInput="false"
                inset
                variant="outlined"
              >
              </v-number-input>
              <div>
                <p class="text-h6 text-lg-h5"><span class="font-weight-bold">Размер:&nbsp;</span>{{ info.type?.size.size }}</p>
                <p class="text-h6 text-lg-h5"><span class="font-weight-bold">Тип:&nbsp;</span>{{ info.type?.type }}</p>
                <p class="text-h6 text-lg-h5"><span class="font-weight-bold">Производитель:&nbsp;</span>{{ info.name }}</p>
                <p class="text-h6 text-lg-h5"><span class="font-weight-bold">Цена:&nbsp;</span>{{ info.price }} BYN x {{ amount }}
                  = {{ info.price * amount }} BYN</p>
              </div>
            </v-card-text>
            <v-card-actions class="px-2 d-flex align-baseline flex-column ga-4 pr-6">
              <v-btn :loading="loading" :disabled="amount === 0 || loading" block variant="tonal" type="submit">
                Оформить лично
              </v-btn>
              <v-btn :loading="loading" @click="openDialog" :disabled="amount === 0 || loading" block variant="tonal"
                     color="secondary" type="button">
                Оформить сменой
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
    <template v-if="info?.qr_code_images">
      <v-col>
        <v-row>
          <v-col cols="12">
            <span class="text-body-1 font-weight-bold">QR(s):&nbsp;</span>
          </v-col>
          <v-col cols="12">
            <v-item-group selected-class="bg-light-green-accent-1"
                          :multiple="true">
              <v-row class="d-flex align-center flex-wrap">
                <template v-for="(item, index) of info?.qr_code_images" :key="index">
                  <v-col cols="12" lg="2" xl="3">
                    <v-item v-slot="{ selectedClass, toggle }">
                      <v-card @click="selectQrCode(toggle, item.id)" :class="selectedClass">
                        <v-card-text class="d-flex justify-center align-center fill-height">
                          <div v-html="item.code"></div>
                        </v-card-text>
                      </v-card>
                    </v-item>
                  </v-col>
                </template>
              </v-row>
            </v-item-group>
          </v-col>
        </v-row>
      </v-col>
    </template>
    <OtherEmployeeDialog @update:employee="closeAfterChoose"/>
  </v-container>
</template>

<style scoped lang="scss">

</style>
