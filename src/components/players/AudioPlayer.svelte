<script>
  import { of as rxOf } from 'rxjs';
  import Lyric from '/src/components/lyric.svelte';

  export let mediaItem;
  export let onEnded;

  let audio;
  let currentTime;
  let duration;
  let ended;

  $: mediaFile = mediaItem
    ? mediaItem.parent.listenMediaFile(mediaItem.fileName)
    : rxOf(null);

  function handleAudioTimeUpdate() {
    currentTime = audio.currentTime.toFixed(2);
    duration = audio.duration.toFixed(2);

    if (!ended && audio.ended && onEnded) {
      onEnded();
    }
    ended = audio.ended;
  }
</script>

<template>
  {#if !mediaItem}
    Loading...
  {:else}
    {#if $mediaFile && $mediaFile.url}
      <audio
        controls
        src={$mediaFile.url}
        bind:this={audio}
        on:timeupdate={handleAudioTimeUpdate}>
        <track default kind="captions" />
      </audio>
    {/if}

    <div class="lyrics">
      {#each mediaItem.lyrics as lyric}
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
  :global(.lyrics .lyric:last-child) {
    color: red;
  }
</style>
