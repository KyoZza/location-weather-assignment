<script>
  import { beforeUpdate } from 'svelte'
  import { LocationStore, LoadAPIStore } from '../stores'
  import Card from './Card.svelte'
  import InfoRow from './InfoRow.svelte'

  let info = {}
  let errorMsg = ''

  $: location = $LocationStore

  const fetchInfo = async () => {
    // avoid unnecessary refetch
    if (!location || info['name'] === location.name) return

    try {
      // set loading state
      LoadAPIStore.update(state => ({ ...state, wikiIsLoading: true }))

      const url = 'https://ja.wikipedia.org/w/api.php?'
      let params = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: `${location.name + '_(' + location.city.name + ')'}`,
        srlimit: 50,
        format: 'json',
        origin: '*',
      })

      // fetch wikipedia pages about the location
      let res = await fetch(url + params)
      const searchResults = await res.json()
      // try to retrieve the correct wiki page from the result
      // unfortunately pages about the postcode don't all follow the same format
      // so, there are cases where the page can't be retrieved
      const filteredResult = searchResults.query.search.find(
        ({ title }) =>
          title === location.name ||
          title.includes(
            location.name.endsWith('町') ? location.name : location.name + '町'
          ) ||
          title === `${location.name} (${location.city.name})`
      )

      // search wiki for location
      params = new URLSearchParams({
        action: 'query',
        prop: 'revisions',
        pageids: filteredResult.pageid,
        rvslots: 'main',
        rvprop: 'content',
        format: 'json',
        formatversion: 2,
        origin: '*',
      })
      // fetch content of wiki page (based on previously retrieved page id)
      res = await fetch(url + params)
      const wiki_res = await res.json()
      const wiki_page = wiki_res.query.pages[0]

      const new_info = {}
      // set wiki page's source
      new_info[
        'wiki_src'
      ] = `https://ja.wikipedia.org/wiki/${wiki_page.title.replace(' ', '_')}`

      // retrieve some info about the location from the wiki page's content string
      wiki_page.revisions[0].slots.main.content
        .split('\n')
        // .slice(0, 60)
        .forEach(line => {
          if (line.startsWith('|')) {
            if (line.includes('population_total') || line.includes(' 人口 ')) {
              new_info['population'] = line.split(' ').pop()
            }
            if (line.includes(' 面積 ')) {
              new_info['area'] = parseFloat(line.split(' ').pop())
            }
            if (line.includes('registration_plate')) {
              new_info['registration_plate'] = line
                .split(' ')
                .pop()
                .split('|')
                .pop()
                .replace(']]', '')
            }
          }
        })

      new_info['prefecture'] = location.pref.name
      new_info['city'] = location.city.name
      new_info['name'] = location.name

      // clear error message
      errorMsg = ''
      info = new_info
    } catch (error) {
      errorMsg = 'Unable to retrieve data from Wikipedia for this location'
    } finally {
      // clear loading state
      LoadAPIStore.update(state => ({ ...state, wikiIsLoading: false }))
    }
  }

  beforeUpdate(fetchInfo)
</script>

<aside class="free-space">
  <Card noBorderRadius>
    <div class="info-container">
      <h2 class="info-header info-row">Location Details</h2>

      {#if errorMsg}
        <span>{errorMsg}</span>
      {:else}
        {#if info['name']}
          <InfoRow label="Location">{info['name']}</InfoRow>
        {/if}
        {#if info['city']}
          <InfoRow label="City">{info['city']}</InfoRow>
        {/if}
        {#if info['prefecture']}
          <InfoRow label="Prefecture">{info['prefecture']}</InfoRow>
        {/if}
        {#if info['registration_plate']}
          <InfoRow label="Number Plate">{info['registration_plate']}</InfoRow>
        {/if}
        {#if info['population']}
          <InfoRow label="Total Population">{info['population']}</InfoRow>
        {/if}
        {#if info['area']}
          <InfoRow label="Area">{info['area']}km<sup>2</sup></InfoRow>
        {/if}

        {#if info['wiki_src']}
          <small class="info-src">
            <a href={info['wiki_src']} target="_blank">Click here</a> for more information.
          </small>
        {/if}
      {/if}
    </div>
  </Card>
</aside>

<style>
  .free-space {
    grid-area: freespace;
  }

  .info-container {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 1em 1.5em;
  }

  .info-header {
    display: flex;
    font-size: 26px;
    margin-top: 0;
    margin-bottom: 1em;
  }

  .info-src {
    text-align: end;
    margin-top: 2.5em;
  }
</style>
