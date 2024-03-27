export function useSeasons (key: string) {
  const seasons = {
    w: {
      title: 'Зимние',
      value: 'w'
    },
    s: {
      title: 'Летние',
      value: 's'
    },
    a: {
      title: 'Всесезонные',
      value: 'a'
    }
  }
  return seasons[key]
}
