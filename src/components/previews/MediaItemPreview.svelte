<script>
  import AudioPreview from "/src/components/previews/AudioPreview.svelte";
  import ImagePreview from "/src/components/previews/ImagePreview.svelte";
  import VideoPreview from "/src/components/previews/VideoPreview.svelte";

  export let mediaItem;
</script>

<template>
  {#if $mediaItem}
    {#if $mediaItem.mediaType === 'audio'}
      <AudioPreview {mediaItem} />
    {:else if $mediaItem.mediaType === 'image'}
      <ImagePreview {mediaItem} />
    {:else if $mediaItem.mediaType === 'video'}
      <VideoPreview {mediaItem} />
    {/if}
  {/if}
</template>
