<script>
  export let noBorderRadius = false
  export let noBackgroundColor = false
</script>

<div
  class="card"
  style={`${noBorderRadius ? 'border-radius: 0;' : ''}${
    noBackgroundColor ? 'background-color: none;' : ''
  }`}
>
  <slot />
</div>

<style>
  .card {
    border-radius: 1em;
    background-color: var(--background-sec-color);
    box-shadow: var(--box-shadow);
  }
</style>
