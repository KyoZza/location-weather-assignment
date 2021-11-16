<script>
  import {
    Map,
    FreeSpace,
    WeatherForecast,
    SearchBar,
    Loading,
  } from './components'
  import { LoadAPIStore } from './stores'
</script>

<main>
  <SearchBar />
  <WeatherForecast />
  <Map />
  <FreeSpace />

  {#if $LoadAPIStore.weatherIsLoading || $LoadAPIStore.wikiIsLoading}
    <Loading />
  {/if}
</main>

<style>
  main {
    display: grid;
    position: relative;
    grid-template:
      'searchbar ' auto
      'weather' auto
      'map' auto
      'freespace' auto / 1fr;
    gap: 2em;
    padding: 1em;
    width: 100%;
    box-sizing: border-box;
  }

  @media (min-width: 1024px) {
    main {
      max-width: 1024px;
    }
  }
  @media (min-width: 768px) {
    main {
      grid-template:
        'searchbar searchbar' auto
        'weather weather' auto
        'map freespace' auto / 1fr 1fr;
    }
  }
</style>
