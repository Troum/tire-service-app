<script setup lang="ts">
import {toTypedSchema} from "@vee-validate/yup";
import * as yup from "yup";
import {useForm} from "vee-validate";
import {InfoRequest} from "../requests/InfoRequest";
import {computed, inject, watch} from "vue";
import {storeToRefs} from "pinia";
import {useDialogsStore} from "../stores/dialogs";

const http: any = inject('axios')
const dialogsStore = useDialogsStore()
const {getDialog} = storeToRefs(dialogsStore)

const schema = toTypedSchema(
  yup.object({
    amount: yup.number().typeError('Поле должно содержать число').required('Поле является обязательным'),
    price: yup.number().typeError('Поле должно быть ценой').required('Поле является обязательным'),
    codes: yup
        .string()
        // @ts-ignore
        .when('amount', (amount: number, schema) => {
          if (amount > 0) {
            return schema
                .required('Поле является обязательным, если количество больше 0')
                .typeError('Поле должно содержать хэш/хэши');
          }
          return schema.notRequired();
        })
  })
)

const dialog = computed({
  get: () => {
    return getDialog.value('editInfo')
  },
  set: (value: boolean) => {
    dialogsStore.setDialog('editInfo', {show: value})
  }
})

const {defineField, handleSubmit, resetForm, meta} = useForm({
  validationSchema: schema
})
const vuetifyConfig = (state) => ({
  props: {
    'error-messages': state.errors,
  },
})

const [amount, amountProps] = defineField('amount', vuetifyConfig);
const [price, priceProps] = defineField('price', vuetifyConfig);
const [codes, codesProps] = defineField('codes', vuetifyConfig);

const onSubmit = handleSubmit((values: InfoRequest) => {
  http.patch(`/auth/infos/${dialog.value.info.id}`, values)
    .then(() => {
      dialogsStore.setDialog('editInfo', {show: false})
    })
});

watch(dialog, () => {
  if (dialog.value.show) {
    price.value = dialog.value.info.price
    amount.value = dialog.value.info.amount
    codes.value = dialog.value.info.amount > 0 ? dialog.value.info.qr_code_images.map((item: {
      id: string,
      code: string
    }) => item.code).join(',') : dialog.value.info.codes
  }
})
</script>

<template>
  <v-dialog
    @update:model-value="resetForm"
    v-model="dialog.show"
    max-width="600"
  >
    <v-form @submit="onSubmit">
      <v-card class="flex-fill" min-width="320">
        <v-card-title>Изменение информацию</v-card-title>
        <v-card-text class="d-flex flex-wrap ga-4">
          <v-text-field class="w-100" variant="outlined" density="comfortable"
                        v-model="amount"
                        v-bind="amountProps"
                        label="Измените количество в наличии"
                        placeholder="Введите количество"></v-text-field>
          <PriceComponent v-model="price" v-bind="priceProps"/>
          <template v-if="amount > 0">
            <v-text-field class="w-100" variant="outlined" density="comfortable"
                          v-model="codes"
                          v-bind="codesProps"
                          label="Введите хэши для шин"
                          placeholder="Введите хэши"></v-text-field>
          </template>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn :disabled="!meta.touched" variant="tonal" color="secondary" type="submit">Изменить</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<style scoped lang="scss">

</style>
