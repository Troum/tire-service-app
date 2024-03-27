<script setup lang="ts">
import {inject} from "vue";
import {toTypedSchema} from "@vee-validate/yup";
import * as yup from "yup";
import {useForm} from "vee-validate";
import {PlaceRequest} from "../../requests/PlaceRequest";
import {useDisplay} from "vuetify";

const http: any = inject('axios')
const schema = toTypedSchema(
  yup.object({
    address: yup
      .string()
      .required('Поле является обязательным'),
    name: yup
      .string()
      .required('Поле является обязательным')
  })
)
const {defineField, handleSubmit, resetForm} = useForm({
  validationSchema: schema
})
const vuetifyConfig = (state) => ({
  props: {
    'error-messages': state.errors,
  },
})
const [address, addressProps] = defineField('address', vuetifyConfig);
const [name, nameProps] = defineField('name', vuetifyConfig);

const onSubmit = handleSubmit((values: PlaceRequest) => {
  http.post('/auth/places', values)
    .then(() => {
      resetForm()
    })
});
</script>

<template>
  <v-form @submit="onSubmit">
    <v-card class="flex-fill" min-width="320">
      <v-card-title>Добавление сервиса</v-card-title>
      <v-card-text class="d-flex flex-wrap ga-4">
        <v-text-field variant="outlined" density="comfortable"
                      :style="{width: useDisplay().mobile.value ? '100%': '50%'}"
                      v-model="name"
                      v-bind="nameProps"
                      label="Название сервиса"
                      placeholder="Введите название сервиса"></v-text-field>
        <v-text-field variant="outlined" density="comfortable"
                      :style="{width: useDisplay().mobile.value ? '100%': '50%'}"
                      v-model="address"
                      v-bind="addressProps"
                      label="Адрес сервиса"
                      placeholder="Введите адрес сервиса"></v-text-field>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="tonal" color="secondary" type="submit">Добавить</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<style scoped lang="scss">

</style>
