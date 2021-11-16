<script>
  export let label
</script>

<div class="info-row">
  <span class="info-row-key">{label}</span>
  <span class="info-row-value"><slot /></span>
</div>

<style>
  .info-row {
    display: flex;
    justify-content: space-between;
    margin: 0.5em 0;
  }

  .info-row-key {
    font-weight: bold;
  }
</style>
