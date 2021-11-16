import { writable } from 'svelte/store'
import { Oaza } from 'jp-zipcode-lookup'

export const LocationStore = writable({
  postCode: '160-0022',
  ...Oaza.byZipcode('1600022')[0],
})

export const WeatherStore = writable([])

export const LoadAPIStore = writable({
  weatherIsLoading: false,
  wikiIsLoading: false,
})
