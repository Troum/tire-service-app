<script setup lang="ts">
import {inject} from "vue";
import {toTypedSchema} from "@vee-validate/yup";
import * as yup from "yup";
import {useForm} from "vee-validate";
import {SizeRequest} from "../../requests/SizeRequest";

const http: any = inject('axios')
const schema = toTypedSchema(
  yup.object({
    size: yup
      .number()
      .typeError('Поле должно содержать число')
      .required('Поле является обязательным'),
  })
)
const {defineField, handleSubmit, resetField} = useForm({
  validationSchema: schema
})
const vuetifyConfig = (state) => ({
  props: {
    'error-messages': state.errors,
  },
})
const [size, sizeProps] = defineField('size', vuetifyConfig);

const onSubmit = handleSubmit((values: SizeRequest) => {
  http.post('/auth/sizes', values)
    .then(() => {
      resetField('size')
    })
});
</script>

<template>
  <v-form @submit="onSubmit">
    <v-card class="flex-fill" min-width="320">
      <v-card-title>Добавление размера</v-card-title>
      <v-card-text class="d-flex flex-wrap ga-4">
        <v-text-field variant="outlined" density="comfortable"
                      v-model="size"
                      v-bind="sizeProps"
                      label="Размер шины"
                      placeholder="Введите размер"></v-text-field>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="tonal" color="secondary" type="submit">Добавить</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<style scoped lang="scss">

</style>
