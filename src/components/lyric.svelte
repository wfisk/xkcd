<script>
  import {
    fade,
    fly
  } from 'svelte/transition';

  export let showWhen = false;
  export let hideWhen = false;

</script>

<style>
  .lyric {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 3rem;
    font-weight: bold;
  }

</style>

{#if showWhen && !hideWhen}
<div class="lyric" in:fade out:fly="{{ x: 1000, y: -500, duration: 300 }}" >
  <slot>Summy text</slot>
 </div>
 {/if}
