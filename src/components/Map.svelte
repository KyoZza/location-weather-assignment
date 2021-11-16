<script>
  import { LocationStore } from '../stores'
  import config from '../config'

  // Source for the embedded map
  $: mapSrc =
    'https://www.google.com/maps/embed/v1/place?' +
    new URLSearchParams({
      key: config.MAPS_API_KEY,
      q: $LocationStore.postCode + ',Japan',
    })
</script>

<section class="map">
  <iframe
    title="map"
    width="100%"
    height="400"
    style="border:0"
    loading="lazy"
    allowfullscreen
    src={mapSrc}
  />
</section>

<style>
  .map {
    grid-area: map;
  }
</style>
