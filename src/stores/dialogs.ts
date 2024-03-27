import { defineStore } from 'pinia'

export const useDialogsStore = defineStore('dialogs', {
  state: () => {
    return {
      dialog: {
        otherEmployee: {
          show: false
        },
        editInfo: {
          show: false
        },
        editUser: {
          show: false
        },
        editType: {
          show: false
        }
      }
    }
  },
  getters: {
    getDialog: (state: any) => {
      return (dialog: string) => state.dialog[dialog]
    },
    getUser: (state: any) => {
      return state.user
    }
  },
  actions: {
    setDialog(dialog: string, data: any) {
      this.dialog[dialog] = data
    }
  }
})
