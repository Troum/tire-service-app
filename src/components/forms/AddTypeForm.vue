<script setup lang="ts">
import {useSeasons} from "../../config/useSeasons";
import {inject} from "vue";
import {toTypedSchema} from "@vee-validate/yup";
import * as yup from "yup";
import {useForm} from "vee-validate";
import {TypeRequest} from "../../requests/TypeReques";

defineProps({
  sizes: {
    type: Array,
    default: () => {
      return []
    }
  },
  seasons: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const http: any = inject('axios')
const schema = toTypedSchema(
  yup.object({
    size_id: yup.number().required('Поле является обязательным'),
    season: yup.string().required('Поле является обязательным'),
    type: yup.string().required('Поле является обязательным'),
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
const [size_id, sizeIdProps] = defineField('size_id', vuetifyConfig);
const [season, seasonProps] = defineField('season', vuetifyConfig);
const [type, typeProps] = defineField('type', vuetifyConfig);

const onSubmit = handleSubmit((values: TypeRequest) => {
  http.post('/auth/types', values)
    .then(() => {
      resetForm()
    })
});
</script>

<template>
  <v-form @submit="onSubmit">
    <v-card class="flex-fill" min-width="320">
      <v-card-title>Добавление типа</v-card-title>
      <v-card-text class="d-flex flex-wrap ga-4">
        <v-select variant="outlined"
                  class="w-100"
                  density="comfortable"
                  placeholder="Выберите размер"
                  v-model="size_id"
                  v-bind="sizeIdProps"
                  item-value="id"
                  item-title="size"
                  :items="sizes"></v-select>
        <v-text-field variant="outlined" density="comfortable"
                      v-model="type"
                      v-bind="typeProps"
                      label="Тип шины"
                      placeholder="Введите тип"></v-text-field>
        <v-select variant="outlined"
                  v-model="season"
                  v-bind="seasonProps"
                  class="w-100"
                  density="comfortable"
                  placeholder="Выберите сезонность"
                  :item-title="(item: string) => useSeasons(item).title"
                  :item-value="(item: string) => useSeasons(item).value"
                  :items="seasons"></v-select>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="tonal" color="secondary" type="submit">Добавить</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<style scoped lang="scss">

</style>
