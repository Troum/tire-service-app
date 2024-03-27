export function useGetColor(amount: number) {
  switch (true) {
    case amount < 3:
      return 'error'
    case amount === 3:
      return 'warning'
    default:
      return 'success'
  }
}
