<script setup lang="ts">
import {toTypedSchema} from "@vee-validate/yup";
import * as yup from "yup";
import {useForm} from "vee-validate";
import {InfoRequest} from "../requests/InfoRequest";
import {computed, inject, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useDialogsStore} from "../stores/dialogs";
import {RoleInterface} from "../interfaces/RoleInterface";

const http: any = inject('axios')
const roles = ref<RoleInterface[]>([])
const dialogsStore = useDialogsStore()
const { getDialog } = storeToRefs(dialogsStore)

const schema = toTypedSchema(
  yup.object({
    role_id: yup.number(),
    name: yup.string().required('Поле является обязательным'),
    email: yup.string().required('Поле является обязательным').email('Поле должно содержать валидный e-mail')
  })
)

const dialog = computed({
  get: () => {
    return getDialog.value('editUser')
  },
  set: (value: boolean) => {
    dialogsStore.setDialog('editUser', {show: value})
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

const [name, nameProps] = defineField('name', vuetifyConfig);
const [email, emailProps] = defineField('email', vuetifyConfig);
const [role_id, roleIdProps] = defineField('role_id', vuetifyConfig);

const onSubmit = handleSubmit((values: InfoRequest) => {
  http.patch(`/auth/users/${dialog.value.user.id}`, values)
    .then(() => {
      dialogsStore.setDialog('editUser', {show: false})
    })
});

watch(dialog, () => {
  if (dialog.value.show) {
    http.get(`/auth/roles`)
      .then((response: RoleInterface[]) => {
        roles.value = response
      })
      .then(() => {
        name.value = dialog.value.user.name
        role_id.value = dialog.value.user.roles[0].id
        email.value = dialog.value.user.email
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
        <v-card-title>Изменение данных</v-card-title>
        <v-card-text class="d-flex flex-wrap ga-4">
          <v-text-field class="w-100" variant="outlined" density="comfortable"
                        v-model="name"
                        v-bind="nameProps"
                        label="Измените имя работника"
                        placeholder="Имя работника"></v-text-field>
          <v-text-field class="w-100" variant="outlined" density="comfortable"
                        type="email"
                        v-model="email"
                        v-bind="emailProps"
                        label="Измените e-mail работника"
                        placeholder="E-mail работника"></v-text-field>
          <v-select variant="outlined"
                    class="w-100"
                    density="comfortable"
                    placeholder="Выберите роль"
                    v-model="role_id"
                    v-bind="roleIdProps"
                    item-value="id"
                    item-title="name"
                    :items="roles"></v-select>
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
