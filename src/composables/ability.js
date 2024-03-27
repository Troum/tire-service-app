import {useAppStore} from "../stores/app";
import _ from "lodash"

export function useAbilityTo (actions) {
  return actions.some(v => useAppStore().permissions.includes(v))
}

export function isLoggedIn () {
  return !_.isNull(useAppStore().authToken)
}
