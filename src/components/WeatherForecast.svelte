<script>
  import { beforeUpdate } from 'svelte'
  import { LocationStore, WeatherStore, LoadAPIStore } from '../stores'
  import config from '../config'
  import WeatherCard from './WeatherCard.svelte'

  let weatherLocation = null
  let errorMsg = ''

  $: postCode = $LocationStore.postCode

  const loadWeather = async () => {
    // avoid unnecessary refetch
    if (weatherLocation && weatherLocation.postcode === postCode) return

    try {
      // set loading state
      LoadAPIStore.update(state => ({ ...state, weatherIsLoading: true }))

      const zip = `${postCode},JP`
      let url = 'http://api.openweathermap.org/geo/1.0/zip?'
      let params = new URLSearchParams({
        zip,
        appid: config.WEATHER_API_KEY,
      })

      // Get geolocation data from the weather api.
      // This additional api call is necessary due to using a free api key
      // Otherwise weather data could be retrieved directly
      let res = await fetch(url + params)
      if (res.status >= 400) throw new Error(res.statusText)

      const { lat, lon, name, zip: postcode } = await res.json()

      url = 'https://api.openweathermap.org/data/2.5/onecall?'
      params = new URLSearchParams({
        lat,
        lon,
        exclude: 'current,minutely,hourly,alerts',
        units: 'metric',
        appid: config.WEATHER_API_KEY,
      })

      // retrieve daily weather data
      res = await fetch(url + params)
      if (res.status >= 400) throw new Error(res.statusText)
      const forecast = await res.json()

      // update store with the forecast for 3 days
      WeatherStore.update(state => forecast.daily.slice(0, 3))

      weatherLocation = { postcode, name }

      // clear error message
      errorMsg = ''
    } catch (error) {
      errorMsg = `Unable to retrieve weather for ${postCode}: ${error.message}`
    } finally {
      // clear loading state
      LoadAPIStore.update(state => ({ ...state, weatherIsLoading: false }))
    }
  }

  beforeUpdate(loadWeather)
</script>

<section class="weather">
  {#if errorMsg}
    <h2 class="invalid weather-for">
      {errorMsg}
    </h2>
  {:else if weatherLocation}
    <h2 class="weather-for">
      Weather for {weatherLocation.postcode}, {weatherLocation.name}
    </h2>
  {/if}

  <h3 class="weather-sub">3-day forecast</h3>

  <div class="weather-forecast">
    <WeatherCard index={0} />
    <WeatherCard index={1} />
    <WeatherCard index={2} />
  </div>
</section>

<style>
  .weather {
    grid-area: weather;
    display: flex;
    flex-direction: column;
  }

  .weather-for {
    font-size: 28px;
    margin-top: 0;
    margin-bottom: 0.3em;
  }

  .weather-sub {
    font-size: 18px;
    font-weight: normal;
    margin-top: 0;
    margin-bottom: 1.3em;
  }

  .weather-forecast {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    .weather-forecast {
      gap: 1em;
    }

    .weather-for {
      font-size: 30px;
    }

    .weather-sub {
      font-size: 20px;
    }
  }
</style>
