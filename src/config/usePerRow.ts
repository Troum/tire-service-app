import {computed} from "vue";
import {useDisplay} from "vuetify";

export function usePerRow () {
  const perRow = computed(() => {
    switch (useDisplay().name.value) {
      case "xs":
      case "sm":
        return 1
      case "md":
        return 2
      case 'lg':
        return 3
      default:
        return 4
    }
  })
  return perRow.value
}
