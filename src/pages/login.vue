<script lang="ts" setup>
import {toTypedSchema} from "@vee-validate/yup";
import * as yup from "yup"
import {useForm} from "vee-validate";
import {LoginRequest} from "../requests/LoginRequest";
import {LoginResponse} from "../interfaces/LoginResponse";
import {inject} from "vue";
import {useAppStore} from "../stores/app";
import {useRouter} from "vue-router";

const router = useRouter()
const appStore = useAppStore()
const http: any = inject('axios')
const schema = toTypedSchema(
  yup.object({
    email: yup.string().required('Поле является обязательным').email('Поле должно быть валидным e-mail адресом'),
    password: yup.string().required('Поле является обязательным')
  })
)
const { defineField, handleSubmit } = useForm({
  validationSchema: schema
})
const vuetifyConfig = (state) => ({
  props: {
    'error-messages': state.errors,
  },
})
const [email, emailProps] = defineField('email', vuetifyConfig);
const [password, passwordProps] = defineField('password', vuetifyConfig);

const onSubmit = handleSubmit((values: LoginRequest) => {
  http.post('/login', values).then((response: LoginResponse) => {
    appStore.setUser(response.user, response.token)
      .then(() => {
        router.push({path: '/sizes'})
      })
  })
});
</script>
<template>
  <v-container class="fill-height login-background" fluid>
    <v-row class="fill-height">
      <v-col cols="11" lg="5" class="d-flex justify-center align-center mx-auto">
        <v-form class="flex-fill" @submit="onSubmit">
          <v-card color="brown-lighten-5">
            <div class="pa-6 d-flex justify-center">
              <v-img :max-width="200" src="@/assets/logos/svg/logo-no-background.svg"></v-img>
            </div>
            <v-card-text>
              <v-text-field type="email"
                            v-model="email"
                            v-bind="emailProps"
                            clearable
                            label="Введите e-mail для входа"
                            placeholder="E-mail"
                            variant="outlined"
                            class="mb-4"
                            density="comfortable"></v-text-field>
              <v-text-field type="password"
                            v-model="password"
                            v-bind="passwordProps"
                            clearable
                            label="Введите пароль для входа"
                            placeholder="Пароль"
                            variant="outlined"
                            density="comfortable"></v-text-field>
            </v-card-text>
            <v-card-actions class="d-flex justify-center px-4 pb-6">
              <v-btn type="submit" block variant="tonal" density="default">Войти в систему</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped>
.login-background {
  background-image: linear-gradient(60deg, rgba(233, 236, 241, 0.84) 0%, rgba(190, 210, 232, 0.9) 100%);
}
</style>
