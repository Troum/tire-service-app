<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {computed, inject, ref, watch, defineEmits} from "vue";
import {useDialogsStore} from "../stores/dialogs";

const emits = defineEmits(['update:employee'])

const http: any = inject('axios')
const dialogsStore = useDialogsStore()
const { getDialog } = storeToRefs(dialogsStore)
const users = ref<any>()
const employeeId = ref<number>()

const closeDialog = () => {
  dialogsStore.setDialog('otherEmployee', {show: false})
}

const choose = () => {
  emits('update:employee', employeeId.value)
  employeeId.value = null
}

const dialog = computed({
  get: () => {
    return getDialog.value('otherEmployee')
  },
  set: (value: boolean) => {
    dialogsStore.setDialog('otherEmployee', {show: value})
  }
})
watch(dialog, () => {
  if (dialog.value?.show) {
    http.get('/auth/users')
      .then((response: any) => {
        users.value = response
      })
  }
})
</script>

<template>
<v-dialog min-width="35%" v-model="dialog.show" @update:model-value="closeDialog">
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <span>Выберите сотрудника</span>
      <v-btn icon="mdi-close" @click="closeDialog"></v-btn>
    </v-card-title>
    <v-card-text>
      <v-select :items="users"
                v-model="employeeId"
                @update:model-value="choose()"
                placeholder="Имя сотрудника"
                density="comfortable"
                variant="outlined"
                item-value="id"
                item-title="name"></v-select>
    </v-card-text>
  </v-card>
</v-dialog>
</template>

<style scoped lang="scss">

</style>
