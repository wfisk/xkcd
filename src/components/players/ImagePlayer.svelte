<script>
  export let mediaItem;
  export let onEnded;
  import { onMount } from 'svelte';

  $: mediaFile = mediaItem
    ? mediaItem.parent.listenMediaFile(mediaItem.fileName)
    : rxOf(null);

  onMount(function () {
    if (onEnded) {
      onEnded();
    }
  });
</script>

<template>
  <h2>Image Player</h2>

  {#if !mediaItem}
    Loading...
  {:else if $mediaFile && $mediaFile.url}
    <div style="display:flex; justify-content:center;">
      <img alt="media" src={$mediaFile.url} />
    </div>
  {/if}
</template>

<style>
  img {
    max-width: 100%;
  }
</style>
