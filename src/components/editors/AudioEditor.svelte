<script>
  import debounce from "lodash-es/debounce";
  import { EMPTY } from "rxjs";
  import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
  } from "sveltestrap";

  import { toBase64 } from "/src/lib/base/utilities";

  export let mediaItem;

  let audioFile;
  let audioFileContent;
  let audioFileName;

  let isOpen = false;
  let modalIsOpen = false;

  $: question = $mediaItem ? $mediaItem.parent : rxOf(null);

  async function handleAudioFile_input(event) {
    audioFileContent = await toBase64(event.target.files[0]);
    audioFileName = event.target.value;
  }

  function handleLyricAdd(event) {
    let lyricIndex = $mediaItem.lyrics.length + 1;
    let lyrics = [
      ...$mediaItem.lyrics,
      {
        text: `Lyric ${lyricIndex}`,
        lyricIndex: lyricIndex,
        start: 0,
        end: 0
      }
    ];

    $mediaItem.update({
      lyrics
    });
  }

  function handleLyricDelete(event) {
    $mediaItem.update({
      lyrics: $mediaItem.lyrics.slice(0, -1)
    });
  }

  const handleLyricText = debounce(function (event, lyric) {
    lyric.text = event.target.value;
    $mediaItem.update({
      lyrics: $mediaItem.lyrics
    });
  }, 300);

  const handleLyricStart = debounce(function (event, lyric) {
    let newStart = Number(event.target.value);
    if (!isNaN(newStart)) {
      lyric.start = newStart;
      $mediaItem.update({
        lyrics: $mediaItem.lyrics
      });
    }
  }, 300);

  const handleLyricEnd = debounce(function (event, lyric) {
    let newEnd = Number(event.target.value);
    if (!isNaN(newEnd)) {
      lyric.end = newEnd;
      $mediaItem.update({
        lyrics: $mediaItem.lyrics
      });
    }
  }, 300);
</script>

<template>
  {#if $mediaItem}
    <h1>Audio Editor</h1>

    {$mediaItem.fileName}

    <h2>Lyrics</h2>

    {#each $mediaItem.lyrics as lyric}
      <div class="form-group form-row">
        <div class="col-sm-8">
          <label
            for="mediaItem-lyric-text-{lyric.lyricIndex}"
            class="small">Text</label>
          <input
            class="form-control"
            id="mediaItem-lyric-text-{lyric.lyricIndex}"
            value={lyric.text}
            on:input={(event) => handleLyricText(event, lyric)} />
        </div>
        <div class="col-sm-2">
          <label
            for="mediaItem-lyric-start-{lyric.lyricIndex}"
            class="small">Start</label>
          <input
            type="number"
            class="form-control"
            id="mediaItem-lyric-add-at-{lyric.lyricIndex}"
            value={lyric.start}
            on:input={(event) => handleLyricStart(event, lyric)} />
        </div>
        <div class="col-sm-2">
          <label
            for="mediaItem-lyric-end-{lyric.lyricIndex}"
            class="small">End</label>
          <input
            type="number"
            class="form-control"
            id="mediaItem-lyric-end-{lyric.lyricIndex}"
            value={lyric.end}
            on:input={(event) => handleLyricEnd(event, lyric)} />
        </div>
      </div>
    {/each}

    <button class="btn btn-primary" on:click={handleLyricAdd}>Add Lyric</button>

    <button class="btn btn-warning" on:click={handleLyricDelete}>Delete Lyric</button>
  {/if}
</template>

<style>
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
