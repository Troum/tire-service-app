<script setup lang="ts">
import {inject, onBeforeMount, ref} from "vue";
import {toTypedSchema} from "@vee-validate/yup";
import * as yup from "yup";
import {useForm} from "vee-validate";
import {DatamatrixRequest} from "../../requests/DatamatrixRequest";
import {DatamatrixResponse} from "../../interfaces/responses/DatamatrixResponse";
import {DatamatrixInterface} from "../../interfaces/DatamatrixInterface";

const dataMatrices = ref<DatamatrixInterface[]>([])

const headers = [
  {
    title: "#", value: "id", align: "start", sortable: false,
  },
  {
    title: "Название", value: "tireName", align: "start", sortable: false,
  },
  {
    title: "Скачать", value: "url", align: "start", sortable: false
  },
  {
    title: "Действия", value: "actions", align: "start", sortable: false
  }
]

const http: any = inject('axios')
const echo: any = inject('echo')
const schema = toTypedSchema(
    yup.object({
      tireName: yup.string().required('Поле является обязательным'),
      codes: yup.string().required('Поле является обязательным')
    })
)
const {defineField, handleSubmit, resetField} = useForm({
  validationSchema: schema
})
const vuetifyConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
})
const [tireName, tireNameProps] = defineField('tireName', vuetifyConfig);
const [codes, codesProps] = defineField('codes', vuetifyConfig);
const isLoading = ref(false)
const onSubmit = handleSubmit((values: DatamatrixRequest) => {

  http.post('/auth/datamatrix', values).then((response: DatamatrixResponse) => {
    resetField('tireName')
    resetField('codes')
    echo.channel(`datamatrix.${response.id}`)
        .listen('.datamatrix.created', () => {
          getData()
        })
  })
});
const getData = () => {
  isLoading.value = true
  http.get('/auth/datamatrix')
      .then((response: DatamatrixInterface[]) => {
        setTimeout(() => {
          isLoading.value = false
          dataMatrices.value = response
        }, 3000)
      })
}
const deleteItem = (id: number) => {
  http.delete(`/auth/datamatrix/${id}`)
      .then((response: DatamatrixInterface[]) => {
        dataMatrices.value = response
      })
}
onBeforeMount(() => {
  getData()
})
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height">
      <v-col cols="12" lg="6" class="mx-auto">
        <v-form validate-on="submit lazy" @submit.prevent="onSubmit">
          <v-card color="transparent" class="flex-fill">
            <v-card-text>
              <v-text-field type="email"
                            v-model="tireName"
                            v-bind="tireNameProps"
                            clearable
                            label="Введите название шины"
                            placeholder="Название"
                            variant="outlined"
                            class="mb-4"
                            density="comfortable"></v-text-field>
              <v-textarea v-model="codes"
                          v-bind="codesProps"
                          clearable
                          label="Введите коды"
                          hint="Коды нужно вводить через запятую"
                          placeholder="Код"
                          variant="outlined"
                          density="comfortable"></v-textarea>
            </v-card-text>
            <v-card-actions class="d-flex justify-center px-4 pb-6">
              <v-btn type="submit" variant="tonal" color="primary" density="default">Создать архив изображений</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
      <v-col cols="12" lg="6" class="d-flex justify-center align-start">
        <v-card class="flex-fill">
          <v-card-title class="d-flex justify-end align-center">
            <v-btn color="success" size="small" @click="getData">Обновить данные <v-icon icon="mdi-update"></v-icon></v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
                :loading="isLoading"
                loading-text="Загружаем данные"
                :headers="headers"
                :items="dataMatrices"
                no-data-text="Данных пока нет"
                items-per-page-text="На странице"
                item-key="name">
              <template #item.url="{ item }">
                <v-btn _target="blank" color="primary" size="small" :href="item.url">Скачать архив</v-btn>
              </template>
              <template #item.actions="{ item }">
                <v-btn size="32" icon="mdi-delete" _target="blank" color="error" @click="deleteItem(item.id)"></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">

</style>
