<script>
  import { of as rxOf } from 'rxjs';
  import Lyric from '/src/components/lyric.svelte';

  export let mediaItem;

  let audio;
  let currentTime;
  let duration;

  $: mediaFile = $mediaItem
    ? $mediaItem.parent.listenMediaFile($mediaItem.fileName)
    : rxOf(null);

  function handleAudioTimeUpdate() {
    currentTime = audio.currentTime.toFixed(2);
    duration = audio.duration.toFixed(2);
  }
</script>

<template>
  {#if !$mediaItem}
    Loading...
  {:else}
    <h1>Audio Preview</h1>

    {#if $mediaFile && $mediaFile.url}
      <audio
        controls
        src={$mediaFile.url}
        bind:this={audio}
        on:timeupdate={handleAudioTimeUpdate}>
        <track default kind="captions" />
      </audio>

      <div>{currentTime} / {duration}</div>
    {/if}

    <div class="lyrics">
      {#each $mediaItem.lyrics as lyric}
        <Lyric
          showWhen={currentTime > lyric.start}
          hideWhen={currentTime > lyric.end}>
          {lyric.text}
        </Lyric>
      {/each}
    </div>
  {/if}
</template>

<style>
  h1 {
    margin-bottom: 1rem;
  }

  :global(.lyrics .lyric:last-child) {
    color: red;
  }
</style>
