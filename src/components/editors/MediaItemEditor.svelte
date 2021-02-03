<script>
  import AudioEditor from "/src/components/editors/AudioEditor.svelte";
  import ImageEditor from "/src/components/editors/ImageEditor.svelte";
  import VideoEditor from "/src/components/editors/VideoEditor.svelte";

  export let mediaItem;
</script>

<template>
  {#if $mediaItem}
    {#if $mediaItem.mediaType === 'audio'}
      <AudioEditor {mediaItem} />
    {:else if $mediaItem.mediaType === 'image'}
      <ImageEditor {mediaItem} />
    {:else if $mediaItem.mediaType === 'video'}
      <VideoEditor {mediaItem} />
    {/if}
  {/if}
</template>
