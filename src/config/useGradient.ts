export function useGradient (season: string) {
  switch (season) {
    case 'w':
      return 'to top right, rgba(255, 255, 255, .1), rgba( 125, 87, 278, .15)'
    case 's':
      return 'to top right, rgba(255, 255, 255, .1), rgba( 227, 114, 27, .75)'
    case 'a':
      return 'to top right, rgba(125, 87, 278, .15), rgba(125, 87, 278, .35), rgba( 227, 114, 27, .85)'
    default:
      return ''
  }
}
