<script setup lang="ts">
import {inject, defineProps} from "vue";
import {toTypedSchema} from "@vee-validate/yup";
import * as yup from "yup";
import {useForm} from "vee-validate";
import {UserRequest} from "../../requests/UserRequest";

defineProps({
  roles: {
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

const http: any = inject('axios')
const schema = toTypedSchema(
  yup.object({
    name: yup
      .string()
      .required('Поле является обязательным'),
    email: yup
      .string()
      .required('Поле является обязательным')
      .email('Поле должно содержать валидный e-mail'),
    password: yup
      .string()
      .required('Поле является обязательным')
      .min(6, 'Минимальная длина пароля - 6 символов'),
    role_id: yup
      .number()
      .required('Поле является обязательным'),
    place_id: yup
      .number()
      .required('Поле является обязательным')
  })
)
const {defineField, handleSubmit, resetForm} = useForm({
  validationSchema: schema,
  initialValues: {
    role_id: 2,
    place_id: 1
  }
})
const vuetifyConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
})
const [name, nameProps] = defineField('name', vuetifyConfig);
const [email, emailProps] = defineField('email', vuetifyConfig);
const [password, passwordProps] = defineField('password', vuetifyConfig);
const [role_id, roleProps] = defineField('role_id', vuetifyConfig);
const [place_id, placeIdProps] = defineField('place_id', vuetifyConfig);

const onSubmit = handleSubmit((values: UserRequest) => {
  http.post('/auth/users', values)
    .then(() => {
      resetForm()
    })
});
</script>

<template>
  <v-form @submit="onSubmit">
    <v-card class="flex-fill" min-width="320">
      <v-card-title>Добавление пользователя</v-card-title>
      <v-card-text class="d-flex flex-wrap ga-4">
        <v-text-field variant="outlined" density="comfortable"
                      class="w-100"
                      v-model="name"
                      v-bind="nameProps"
                      label="Имя пользователя"
                      placeholder="Введите имя"></v-text-field>
        <v-text-field variant="outlined" density="comfortable"
                      class="w-100"
                      type="email"
                      v-model="email"
                      v-bind="emailProps"
                      label="E-mail пользователя"
                      placeholder="Введите e-mail"></v-text-field>
        <v-text-field variant="outlined" density="comfortable"
                      class="w-100"
                      type="password"
                      v-model="password"
                      v-bind="passwordProps"
                      label="Пароль пользователя"
                      placeholder="Введите пароль"></v-text-field>
        <v-select variant="outlined"
                  class="w-100"
                  density="comfortable"
                  placeholder="Выберите место работы"
                  v-model="place_id"
                  v-bind="placeIdProps"
                  no-data-text="Данных нет"
                  item-value="id"
                  item-title="name"
                  :items="places"></v-select>
        <v-select variant="outlined"
                  class="w-100"
                  density="comfortable"
                  placeholder="Выберите роль"
                  v-model="role_id"
                  v-bind="roleProps"
                  item-value="id"
                  item-title="name"
                  :items="roles"></v-select>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="tonal" color="secondary" type="submit">Добавить</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<style scoped lang="scss">

</style>
