<script setup lang="ts">
import {defineProps, inject} from "vue"
import {toTypedSchema} from "@vee-validate/yup";
import * as yup from "yup";
import {useForm} from "vee-validate";
import {InfoRequest} from "../../requests/InfoRequest";

defineProps({
  types: {
    type: Array,
    default: () => {
      return []
    }
  },
  places: {
    type: Array,
    default: () => {
      return []
    }
  }
})
const seasonIcon = (season: string) => {
  switch (season) {
    case 'w':
      return 'mdi-snowflake'
    case 's':
      return 'mdi-white-balance-sunny'
    case 'a':
      return 'mdi-sun-snowflake'
    default:
      return ''
  }
}
const http: any = inject('axios')
const schema = toTypedSchema(
  yup.object({
    type_id: yup.number().required('Поле является обязательным'),
    place_id: yup.number().required('Поле является обязательным'),
    name: yup.string().required('Поле является обязательным'),
    amount: yup.number().typeError('Поле должно содержать число').required('Поле является обязательным'),
    price: yup.number().typeError('Поле должно быть ценой').required('Поле является обязательным'),
    image_url: yup.string().default('https://cdn-icons-png.freepik.com/256/13507/13507737.png'),
    codes: yup.string().default(''),
  })
)
const {defineField, handleSubmit, resetForm} = useForm({
  initialValues: {
    price: 0
  },
  validationSchema: schema
})
const vuetifyConfig = (state) => ({
  props: {
    'error-messages': state.errors,
  },
})
const [type_id, typeIdProps] = defineField('type_id', vuetifyConfig);
const [place_id, placeIdProps] = defineField('place_id', vuetifyConfig);
const [name, nameProps] = defineField('name', vuetifyConfig);
const [image_url, imageUrlProps] = defineField('image_url', vuetifyConfig);
const [codes, codesProps] = defineField('codes', vuetifyConfig);
const [amount, amountProps] = defineField('amount', vuetifyConfig);
const [price, priceProps] = defineField('price', vuetifyConfig);

const onSubmit = handleSubmit((values: InfoRequest) => {
  http.post('/auth/infos', values)
    .then(() => {
      resetForm({values: {price: 0}})
    })
});

</script>

<template>
  <v-form @submit="onSubmit">
    <v-card class="flex-fill" min-width="320">
      <v-card-title>Добавление информацию</v-card-title>
      <v-card-text class="d-flex flex-wrap ga-4">
        <v-select variant="outlined"
                  class="w-100"
                  density="comfortable"
                  placeholder="Выберите сервис размещения"
                  v-model="place_id"
                  v-bind="placeIdProps"
                  no-data-text="Данных нет"
                  item-value="id"
                  item-title="name"
                  :items="places"></v-select>
        <v-select variant="outlined"
                  class="w-100"
                  density="comfortable"
                  placeholder="Выберите тип"
                  v-model="type_id"
                  v-bind="typeIdProps"
                  no-data-text="Данных нет"
                  item-value="id"
                  item-title="type"
                  :items="types">
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :append-icon="seasonIcon(item.raw.season)"></v-list-item>
          </template>
        </v-select>
        <v-text-field class="w-100" variant="outlined" density="comfortable"
                      v-model="name"
                      v-bind="nameProps"
                      label="Название производителя"
                      placeholder="Введите название"></v-text-field>
        <v-text-field class="w-100" variant="outlined" density="comfortable"
                      v-model="amount"
                      v-bind="amountProps"
                      label="Количество в наличии"
                      placeholder="Введите количество"></v-text-field>
        <PriceComponent v-model="price" v-bind="priceProps"/>
        <v-text-field class="w-100" variant="outlined" density="comfortable"
                      v-model="image_url"
                      v-bind="imageUrlProps"
                      label="Ссылка на изображение"
                      placeholder="Вставьте ссылку"></v-text-field>
        <v-text-field class="w-100" variant="outlined" density="comfortable"
                      v-model="codes"
                      v-bind="codesProps"
                      label="Хэш-ключи для идентификации шин (вводите через запятую в соответствии с количеством)"
                      placeholder="Вставьте хэш-ключ"></v-text-field>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="tonal" color="secondary" type="submit">Добавить</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<style scoped lang="scss">

</style>
