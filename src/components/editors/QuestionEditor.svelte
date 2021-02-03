<script>
  import debounce from 'lodash-es/debounce';
  import { of as rxOf } from 'rxjs';
  import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
  } from 'sveltestrap';
  import Fa from 'svelte-fa';
  import { faCheck } from '@fortawesome/free-solid-svg-icons';
  import { faTimes } from '@fortawesome/free-solid-svg-icons';
  import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

  import MediaItemModal from '/src/components/modals/MediaItemModal.svelte';
  import MediaFile from '/src/models/MediaFile';
  import Question from '/src/models/Question';

  export let question;

  let mediaItems;
  let mediaType = 'image';
  let audioFile;
  let audioFileContent;
  let audioFileName;
  let imageFileContent;
  let imageFileName;
  let videoName;
  let videoUrl;

  let isOpen = false;
  let modalIsOpen = false;

  $: console.log({ question });

  $: mediaItems = $question ? $question.listenMediaItems() : rxOf([]);
  $: questionOptions = $question ? $question.options || [] : [];

  /* Handlers */

  function handleAddMediaItemModalCancel() {
    modalIsOpen = false;
  }

  async function handleAddMediaItemModalConfirm() {
    let mediaItemProps = {
      mediaType
    };
    let mediaFileProps = {};
    let fileName;

    if (mediaType === 'audio') {
      fileName = extractFileName(audioFileName);
      mediaItemProps.fileName = fileName;

      mediaFileProps.id = fileName;
      mediaFileProps.url = audioFileContent;
    }

    if (mediaType === 'image') {
      fileName = extractFileName(imageFileName);
      mediaItemProps.fileName = fileName;

      mediaFileProps.id = fileName;
      mediaFileProps.url = imageFileContent;
    }

    if (mediaType === 'video') {
      mediaItemProps.fileName = videoName;
      mediaItemProps.url = videoUrl;
    }

    $question.addMediaItem(mediaItemProps);

    if (mediaType === 'audio' || mediaType === 'image') {
      $question.addMediaFile(mediaFileProps);
    }

    modalIsOpen = false;
  }

  /* Handlers - Audio File */
  async function handleAudioFileInput(event) {
    audioFileContent = await toBase64(event.target.files[0]);
    audioFileName = event.target.value;
  }

  /* Handlers - Image File */
  async function handleImageFileInput(event) {
    imageFileContent = await toBase64(event.target.files[0]);
    imageFileName = event.target.value;
  }

  /* Handlers - Media Item */

  function handleDeleteMediaItemClick(event, mediaItem) {
    MediaFile.deleteById(mediaItem.fileName, {
      parent: mediaItem.parent
    });
    mediaItem.delete();
  }

  /* Handlers - Option */

  function handleAddOptionClick(event) {
    let optionIndex = $question.options.length;
    let optionValue = String.fromCharCode(65 + optionIndex);
    let options = [
      ...$question.options,
      {
        text: `Option ${optionValue}`,
        value: optionValue,
        correct: false
      }
    ];

    $question.update({
      options: options
    });
  }

  function handleDeleteOptionClick(event) {
    $question.update({
      options: $question.options.slice(0, -1)
    });
  }

  function handleOptionCorrectChange(event, option) {
    $question.options.forEach((it) => (it.correct = false));
    option.correct = event.target.checked;
    $question.update({
      options: $question.options
    });
  }

  const handleOptionTextInput = debounce(function (event, option) {
    option.text = event.target.value;
    $question.update({
      options: $question.options
    });
  }, 300);

  /* Handlers - Question */

  const handleQuestionTextInput = debounce(function (event) {
    // $question.text = event.target.value;
    $question.update({
      text: event.target.value
    });
  }, 300);

  const handleQuestionAnsweredChange = debounce(function (event) {
    $question.update({
      answered: event.target.checked
    });
  }, 300);

  /* Utilities */

  function extractFileName(filePath) {
    return filePath.split('\\').pop().split('/').pop();
  }

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
</script>

<template>
  {#if $question}
    <h2>Question Editor</h2>
    <hr />

    <!-- Media Items -->
    <h3>Media Items</h3>

    <ul class="list-group">
      {#each $mediaItems as mediaItem}
        <li
          class="list-group-item d-flex justify-content-between
            align-items-center">
          <a href="#/{$question.getDocumentPath()}/media-items/{mediaItem.id}">
            {mediaItem.fileName}
          </a>
          <button
            class="btn btn-sm btn-light"
            on:click={(event) => handleDeleteMediaItemClick(event, mediaItem)}>
            <Fa icon={faTrashAlt} />
          </button>
        </li>
      {/each}
    </ul>

    <Button color="danger" on:click={() => (modalIsOpen = true)}>
      Add Media Item
    </Button>
    <hr />

    <!-- Text -->
    <h3>Text</h3>
    <div class="form-group">
      <label for="question-text">Question Text</label>
      <input
        class="form-control"
        id="question-text"
        value={$question.text}
        on:input={handleQuestionTextInput} />
    </div>

    <div class="form-group form-check">
      <input
        type="checkbox"
        class="form-check-input"
        id="question-answered"
        checked={$question.answered}
        on:change={handleQuestionAnsweredChange} />
      <label class="form-check-label" for="question-answered">Answered</label>
    </div>
    <hr />

    <!-- Options -->
    <h3>Options</h3>

    {#each $question.options as option}
      <div class="form-group form-row">
        <div class="col-sm-8">
          <label for="option-text-{option.value}" class="small">Option
            {option.value}</label>
          <input
            class="form-control"
            id="option-text-{option.value}"
            value={option.text}
            on:input={(event) => handleOptionTextInput(event, option)} />
        </div>
        <div class="col-sm-2" />
        <div class="col-sm-2">
          <span class="small">Correct?</span>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              id="option-correct-{option.value}"
              name="option-correct"
              value={option.correct}
              checked={option.correct}
              on:change={(event) => handleOptionCorrectChange(event, option)} />
            <label class="form-check-label" for="option-correct-{option.value}">
              {#if option.correct}
                <Fa icon={faCheck} color="#57AF80" />
              {:else}
                <Fa icon={faTimes} color="#E03A4C" />
              {/if}
            </label>
          </div>
        </div>
      </div>
    {/each}

    <button class="btn btn-primary" on:click={handleAddOptionClick}>Add Option</button>

    <button class="btn btn-warning" on:click={handleDeleteOptionClick}>Delete
      Option</button>
  {/if}

  <Modal isOpen={modalIsOpen}>
    <ModalHeader toggle={handleAddMediaItemModalCancel}>
      Add Media Item
    </ModalHeader>
    <ModalBody>
      <div class="form-group">
        <label for="media-type">Media Type</label>
        <select class="form-control" id="media-type" bind:value={mediaType}>
          <option value="audio">Audio</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>

      {#if mediaType === 'audio'}
        <div class="form-group">
          <label for="audio-file">Upload mp3 file</label>
          <input
            type="file"
            class="form-control"
            id="audio-file"
            on:input={handleAudioFileInput} />
        </div>
      {/if}

      {#if mediaType === 'image'}
        <div class="form-group">
          <label for="image-file">Upload image file</label>
          <input
            type="file"
            class="form-control"
            id="image-file"
            on:input={handleImageFileInput} />
        </div>
      {/if}

      {#if mediaType === 'video'}
        <div class="form-group">
          <label for="video-name">Name</label>
          <input class="form-control" id="video-name" bind:value={videoName} />
        </div>
        <div class="form-group">
          <label for="video-url">URL</label>
          <input class="form-control" id="video-url" bind:value={videoUrl} />
        </div>
      {/if}
    </ModalBody>
    <ModalFooter>
      <Button
        color="primary"
        on:click={(event) => handleAddMediaItemModalConfirm(event, mediaType)}>
        OK
      </Button>
      <Button color="secondary" on:click={handleAddMediaItemModalCancel}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
</template>

<style>
  .form-check,
  .form-check .form-check-input,
  .form-check .form-check-label {
    cursor: pointer;
  }
</style>
