<script>
  import AudioPlayer from "/src/components/players/AudioPlayer.svelte";
  import ImagePlayer from "/src/components/players/ImagePlayer.svelte";
  import VideoPlayer from "/src/components/players/VideoPlayer.svelte";

  export let mediaItem;
  export let onEnded;
</script>

<template>
  {#if mediaItem.mediaType === 'audio'}
    <AudioPlayer {mediaItem} {onEnded} />
  {:else if mediaItem.mediaType === 'image'}
    <ImagePlayer {mediaItem} {onEnded} />
  {:else if mediaItem.mediaType === 'video'}
    <VideoPlayer {mediaItem} />
  {/if}
</template>
