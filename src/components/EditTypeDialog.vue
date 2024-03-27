<script setup lang="ts">
import {toTypedSchema} from "@vee-validate/yup";
import * as yup from "yup";
import {useForm} from "vee-validate";
import {InfoRequest} from "../requests/InfoRequest";
import {computed, inject, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useDialogsStore} from "../stores/dialogs";
import {SizeInterface} from "../interfaces/SizeInterface";
import {useSeasons} from "../config/useSeasons";
import {TypeInterface} from "../interfaces/TypeInterface";

const http: any = inject('axios')
const sizes = ref<SizeInterface[]>([])
const seasons = ref<string[]>([])
const dialogsStore = useDialogsStore()
const { getDialog } = storeToRefs(dialogsStore)

const schema = toTypedSchema(
  yup.object({
    size_id: yup.number().required('Поле является обязательным'),
    hidden: yup.boolean(),
    season: yup.string().required('Поле является обязательным'),
    type: yup.string().required('Поле является обязательным'),
  })
)

const dialog = computed({
  get: () => {
    return getDialog.value('editType')
  },
  set: (value: boolean) => {
    dialogsStore.setDialog('editType', {show: value})
  }
})

const {defineField, handleSubmit, resetForm, meta} = useForm({
  validationSchema: schema
})
const vuetifyConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
})

const [size_id, sizeIdProps] = defineField('size_id', vuetifyConfig);
const [season, seasonProps] = defineField('season', vuetifyConfig);
const [type, typeProps] = defineField('type', vuetifyConfig);
const [hidden, hiddenProps] = defineField('hidden', vuetifyConfig);

const onSubmit = handleSubmit((values: TypeInterface) => {
  http.patch(`/auth/types/${dialog.value.type.id}`, values)
    .then(() => {
      dialogsStore.setDialog('editType', {show: false})
    })
});

watch(dialog, () => {
  if (dialog.value.show) {
    http.get(`/auth/sizes`)
      .then((response: SizeInterface[]) => {
        sizes.value = response
      })
      .then(() => {
        http.get(`/auth/seasons`)
          .then((response: string[]) => {
            seasons.value = response
          })
      })
      .then(() => {
        type.value = dialog.value.type.type
        hidden.value = dialog.value.type.hidden
        size_id.value = dialog.value.type.size?.id
        season.value = dialog.value.type.season
      })
  }
})

</script>

<template>
  <v-dialog
    @update:model-value="() => resetForm()"
    v-model="dialog.show"
    max-width="600"
  >
    <v-form @submit="onSubmit">
      <v-card class="flex-fill" min-width="320">
        <v-card-title>Изменение типа</v-card-title>
        <v-card-text class="d-flex flex-wrap ga-4">
          <v-text-field class="w-100" variant="outlined" density="comfortable"
                        v-model="type"
                        v-bind="typeProps"
                        label="Измените тип шины"
                        placeholder="Тип шины"></v-text-field>
          <v-select variant="outlined"
                    class="w-100"
                    density="comfortable"
                    placeholder="Измените размер"
                    v-model="size_id"
                    v-bind="sizeIdProps"
                    item-value="id"
                    item-title="size"
                    :items="sizes"></v-select>
          <v-select variant="outlined"
                    class="w-100"
                    density="comfortable"
                    placeholder="Измените сезонность"
                    v-model="season"
                    v-bind="seasonProps"
                    :item-title="(item: string) => useSeasons(item).title"
                    :item-value="(item: string) => useSeasons(item).value"
                    :items="seasons"></v-select>
          <v-switch inset v-model="hidden" v-bind="hiddenProps">
            <template v-slot:label>
              <template v-if="hidden">Отсутствует</template>
              <template v-else>Наличествует</template>
            </template>
          </v-switch>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn :disabled="!meta.touched"
                 variant="tonal"
                 color="secondary"
                 type="submit">Изменить</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<style scoped lang="scss">

</style>
