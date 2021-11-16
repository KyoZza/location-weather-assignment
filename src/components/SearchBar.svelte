<script>
  import { LocationStore } from '../stores'
  import { Oaza } from 'jp-zipcode-lookup'

  let postCode
  let invalid = false

  const handleSubmit = () => {
    const [location] = Oaza.byZipcode(postCode.replace('-', ''))

    invalid = !location
    // exit if user input is invalid
    if (invalid) return

    // update store with new location
    LocationStore.update(state => ({ ...location, postCode }))

    // clear input field
    postCode = ''
  }

  const handleInput = () => {
    // reset invalid state on input
    if (invalid) invalid = false

    // format post code
    if (postCode.length >= 4 && !isNaN(postCode)) {
      postCode = postCode.slice(0, 3) + '-' + postCode.slice(3)
    }
  }
</script>

<section class="searchbar">
  <form
    class={`searchbar-form ${invalid ? 'invalid' : ''}`}
    on:submit|preventDefault={handleSubmit}
  >
    <div class="searchbar-input-wrapper">
      <label
        class={`searchbar-input-label ${invalid ? 'invalid' : ''}`}
        for="postcode">Post Code</label
      >
      <input
        id="postcode"
        class="searchbar-input"
        bind:value={postCode}
        on:input={handleInput}
        placeholder="Enter post code..."
        required
        minlength="8"
        maxlength="8"
      />
    </div>
    <button class="searchbar-btn" disabled={invalid}>Search</button>
  </form>
  {#if invalid}
    <small class="invalid invalid-message">
      Please enter an existing japanese post code.
    </small>
  {/if}
</section>

<style>
  .searchbar {
    width: 100%;
    grid-area: searchbar;
    position: relative;
    padding-bottom: 0.3em;
  }

  .searchbar-form {
    display: flex;
  }

  .searchbar-input-wrapper {
    background-color: var(--input-bg-color);
    position: relative;
    flex-grow: 1;
    padding: 0.8em 1em;
    border: 1px solid var(--border-color);
    border-top-left-radius: 0.5em;
    border-bottom-left-radius: 0.5em;
  }

  .searchbar-input-wrapper:focus-within {
    outline: auto -webkit-focus-ring-color;
  }

  .searchbar-input-label {
    background-color: var(--background-color);
    position: absolute;
    top: -8px;
    left: 16px;
    font-size: 12px;
    padding: 0 0.5em;
    border-radius: 8px;
  }

  .searchbar-input {
    background-color: #0000;
    color: var(--font-color);
    width: 100%;
    padding: 0;
    margin: 0;
    border: none;
  }

  .searchbar-input:focus {
    outline: none;
  }

  .invalid .searchbar-input-wrapper {
    border-color: var(--error);
  }

  .invalid-message {
    position: absolute;
    bottom: -1.1em;
    left: 0.6em;
  }

  .searchbar-btn {
    background-color: var(--border-color);
    color: var(--font-color);
    margin: 0;
    padding: 0 1em;
    border: none;
    border-radius: 0;
    border-top-right-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
    cursor: pointer;
  }

  @media (min-width: 768px) {
    .searchbar-input-wrapper {
      max-width: 1024px;
      padding: 1em 2em;
    }

    .searchbar-btn {
      min-width: 140px;
    }
  }
</style>
