<script>
  export let mediaItem;

  let mediaFile = mediaItem.parent.listenMediaFile(mediaItem.fileName);
</script>

<template>
  <h2>Audio Player</h2>
  {mediaItem.fileName}

  {#if !$mediaFile}
    <p>Loading...</p>
  {:else}
    <p>Loaded!</p>
  {/if}
</template>
