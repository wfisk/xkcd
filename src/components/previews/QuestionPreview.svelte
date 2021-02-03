<script>
  import { onMount } from 'svelte';
  // import { Howler, Howl } from "howler";
  import { from as rxFrom, of as rxOf, timer as rxTimer } from 'rxjs';
  import { switchMap, startWith } from 'rxjs/operators';
  import { fade, fly } from 'svelte/transition';
  import Lyric from '/src/components/lyric.svelte';
  import MediaItemPlayer from '/src/components/players/MediaItemPlayer.svelte';

  // All providers are named {ProviderName}Provider.
  // import { Player, FileProvider, YouTubeProvider } from '@vime/svelte';
  import {
    Player as VimePlayer,
    Video as VimeVideo,
    Ui as VimeUi
  } from '@vime/svelte';
  export let question;

  let mediaItemEnded = false;

  $: mediaItems = $question ? $question.listenMediaItems() : rxOf([]);

  // Vime Player
  let player;
  let audioPlayer;
  let videoPlayer;

  // const providers = [FileProvider, YouTubeProvider];

  function updateVideoPlayer() {
    if (videoPlayer) {
      videoPlayer.useNativeCaptions = false;
      videoPlayer.useNativeControls = false;
      videoPlayer.useNativeView = false;
    }
  }

  function handleMediaItemEnded() {
    mediaItemEnded = true;
  }
</script>

<template>
  {#if $question}
    <h1>Question {$question.questionIndex}</h1>

    {#each $mediaItems as mediaItem}
      <MediaItemPlayer {mediaItem} onEnded={handleMediaItemEnded} />
    {/each}

    {#if $question.image}Question Image{/if}

    {#if $question.video}
      <VimePlayer controls bind:this={videoPlayer}>
        <VimeVideo crossOrigin="" poster="https://media.vimejs.com/poster.png">
          <!-- These are passed directly to the underlying HTML5 `<video>` element. -->
          <!-- Why `data-src`? Lazy loading, you can always use `src` if you prefer.  -->
          <source data-src={$question.video.url} type="video/mp4" />
          <track default kind="captions" />
        </VimeVideo>

        <!-- ... -->
      </VimePlayer>
    {/if}

    {#if !$mediaItems.length || mediaItemEnded}
      <p class="question">{$question.text}</p>

      <ol class="options">
        {#each $question.options as option}
          <li
            class="option"
            class:active={$question.reveal_answer && option.correct}>
            {option.text}
          </li>
        {/each}
      </ol>
    {/if}
  {/if}
</template>

<style>
  h1 {
    margin-bottom: 1rem;
  }

  :global(.lyrics .lyric:last-child) {
    color: red;
  }

  h1 {
    margin-bottom: 1rem;
  }

  .question {
    background-color: #5a6dba;
    border-radius: 0.5rem;
    color: white;
    font-size: 3rem;
    font-weight: normal;
    padding: 0.5rem 1rem;
  }

  .options {
    list-style-type: upper-alpha;
  }

  .option {
    font-size: 3rem;
    font-weight: bold;
    margin-left: 3rem;
  }

  .option.active {
    color: red;
  }
</style>
