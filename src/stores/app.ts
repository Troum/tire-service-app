import { defineStore } from 'pinia'
// @ts-ignore
export const useAppStore = defineStore('app', {
  state: () => {
    return {
      user: null,
      token: null,
      theme: null,
      alert: {
        show: false
      }
    }
  },
  persist: true,
  getters: {
    authToken: (state: any) => {
      return state.token
    },
    permissions: (state: any): any[] => {
      if (state.user) {
        return state.user?.roles.flatMap((role: any) => {
          return role.permissions.map((permission: any) => {
            return permission
          })
        })
      }
      return []
    },
    getAlert: (state: any) => {
      return state.alert
    },
    getUser: (state: any) => {
      return state.user
    },
    getTheme: (state: any) => {
      return state.theme
    }
  },
  actions: {
    async setUser(user: any, token: string) {
      this.user = user
      this.token = token
    },
    setAlert(alert: any) {
      this.alert = alert
    },
    setTheme(theme: string) {
      this.theme = theme
    }
  }
})
