<script>
  import { WeatherStore } from '../stores'

  export let index

  $: forecast = $WeatherStore[index]
  $: date = getDate()

  $: getDate = () => {
    if (!forecast) return {}

    // convert timestamp
    const date = new Date(forecast.dt * 1000)

    return {
      dateString: date.toLocaleDateString('ja-JP').replaceAll('/', '-'),
      day: date.toDateString().split(' ')[0],
    }
  }

  const capitalizeLabel = weatherLabel => {
    const capitalizedWords = []

    // capitalize each word
    weatherLabel.split(' ').forEach(word => {
      const cWord = word[0].toUpperCase() + word.slice(1)
      capitalizedWords.push(cWord)
    })

    return capitalizedWords.join(' ')
  }
</script>

<div class="weather-card">
  {#if forecast}
    <img
      class="weather-icon"
      src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
      alt="weather-icon"
    />

    <time class="weather-date weather-row" datetime={date.dateString}>
      <span>{date.dateString}</span>
      <span>{date.day}</span>
    </time>
    <div class="weather-row weather-label">
      {capitalizeLabel(forecast.weather[0].description)}
    </div>
    <div class="weather-row">
      <span class="temp"
        >Max: <span class="temp-max">{forecast.temp.max} °C</span></span
      >
      <span class="temp"
        >Min: <span class="temp-min">{forecast.temp.min} °C</span></span
      >
    </div>
  {/if}
</div>

<style>
  .weather-card {
    background: rgb(16, 25, 51);
    background: linear-gradient(
      350deg,
      rgba(16, 25, 51, 1) 0%,
      rgb(99 119 193) 36%,
      rgba(31, 47, 99, 1) 100%
    );
    border-radius: inherit;
    padding: 0.6em 0.4em;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    border-radius: 0;
  }

  .weather-card:hover {
    opacity: 0.9;
  }

  .weather-icon {
    width: 66px;
    height: 66px;
  }

  .weather-label {
    font-weight: bold;
    font-size: 18px !important;
    min-height: 48px;
    text-align: center;
  }

  .weather-row {
    margin-bottom: 0.7em;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    font-size: 15px;
  }

  .temp {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    text-align: center;
  }

  .temp-min {
    color: #50d3ff;
  }
  .temp-max {
    color: #e7351a;
  }
  .temp-min,
  .temp-max {
    font-weight: bold;
  }

  @media (min-width: 1024px) {
    .temp {
      flex-direction: row;
    }
    .temp-min,
    .temp-max {
      font-weight: bold;
      margin-left: 0.5em;
    }
  }
  @media (min-width: 768px) {
    .weather-card {
      border-radius: 1em;
      box-shadow: var(--box-shadow);
      padding: 1em 1.5em;
    }
    .weather-icon {
      width: 100px;
      height: 100px;
    }
    .weather-date {
      font-size: 17px;
    }
    .weather-row {
      justify-content: space-evenly;
      flex-direction: row;
      font-size: 16px;
    }
    .weather-label {
      font-size: 20px !important;
      min-height: 0;
    }
  }
</style>
