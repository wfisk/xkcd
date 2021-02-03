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

  import MediaItemModal from '/src/components/modals/MediaItemModal.svelte';
  import Question from '/src/models/Question';

  export let question;

  let mediaItems;
  let mediaType = 'image';
  let audioFile;
  let audioFileContent;
  let audioFileName;
  let imageFileContent;
  let imageFileName;
  let videoUrl;

  let isOpen = false;
  let modalIsOpen = false;

  $: mediaItems = $question ? $question.listenMediaItems() : rxOf([]);
  $: questionOptions = $question ? $question.options || [] : [];

  function addMediaItemModal_cancel() {
    modalIsOpen = false;
  }

  async function addMediaItemModal_confirm() {
    let props = {
      mediaType
    };

    if (mediaType === 'audio') {
      props.fileName = audioFileName;
      props.value = audioFileContent;
    }

    if (mediaType === 'image') {
      props.fileName = imageFileName;
      props.value = imageFileContent;
    }

    if (mediaType === 'video') {
      props.fileName = videoUrl;
      props.value = videoUrl;
    }

    $question.addMediaItem(props);

    modalIsOpen = false;
  }

  async function handleAudioFile_input(event) {
    audioFileContent = await toBase64(event.target.files[0]);
    audioFileName = event.target.value;
  }

  async function handleImageFile_input(event) {
    imageFileContent = await toBase64(event.target.files[0]);
    imageFileName = event.target.value;
  }

  const handleQuestionTextInput_input = debounce(function (event) {
    // $question.text = event.target.value;
    $question.update({
      text: event.target.value
    });
  }, 300);

  const handleQuestionrevealAnswer_change = debounce(function (event) {
    $question.update({
      reveal_answer: event.target.checked
    });
  }, 300);

  const handleInputOption_input = debounce(function (event, option) {
    console.log({
      event,
      option
    });

    option.text = event.target.value;
    $question.update({
      options: $question.options
    });
  }, 300);

  const handleAudioUrlInput_input = debounce(function (event) {
    $question.update({
      audio: {
        ...$question.audio,
        url: event.target.value
      }
    });
  }, 300);

  async function handleAudioFileInput_input(event) {
    console.log(event);
    if (event.target.files) {
      let fileContent = await toBase64(event.target.files[0]);
      $question.update({
        audio: {
          ...$question.audio,
          file: fileContent
        }
      });
    }
  }

  const handleVideoUrlInput_input = debounce(function (event) {
    $question.update({
      video: {
        ...$question.video,
        url: event.target.value
      }
    });
  }, 300);

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  function handleAddOption_click(event) {
    let optionIndex = $question.options.length;
    let optionValue = String.fromCharCode(65 + optionIndex);
    let options = [
      ...$question.options,
      {
        text: `Option ${optionValue}`,
        value: optionValue,
        selected: false
      }
    ];

    $question.update({
      options: options
    });
  }

  function handleDeleteOption_click(event) {
    $question.update({
      options: $question.options.slice(0, -1)
    });
  }

  function handleDeleteAudio_click(event) {
    let props = {
      ...$question
    };
    delete props.id;
    delete props.audio;
    $question.update({
      audio: null
    });
  }

  function handleDeleteImage_click(event) {
    $question.update({
      image: null
    });
  }

  function handleDeleteVideo_click(event) {
    $question.update({
      video: null
    });
  }

  function handleAddAudio_click(event) {
    let props = {
      ...$question,
      audio: {
        url: '???'
      }
    };
    delete props.id;
    $question.update({
      audio: {
        url: '???'
      }
    });
  }

  function handleAddImage_click(event) {
    let props = {
      ...$question,
      image: {
        url: '???'
      }
    };
    delete props.id;
    $question.update(props);
  }

  function handleAddVideo_click(event) {
    let props = {
      ...$question,
      video: {
        url: '???'
      }
    };
    delete props.id;
    $question.update(props);
  }
</script>

<template>
  {#if $question}
    <h2>Question Editor</h2>

    <div class="form-group">
      <label for="question-text">Question Text</label>
      <input
        class="form-control"
        id="question-text"
        value={$question.text}
        on:input={handleQuestionTextInput_input} />
    </div>

    <div class="form-group form-check">
      <input
        type="checkbox"
        class="form-check-input"
        id="question-reveal-answer"
        checked={$question.reveal_answer}
        on:change={handleQuestionrevealAnswer_change} />
      <label class="form-check-label" for="question-reveal-answer">Reveal Answer</label>
    </div>

    <h3>Options</h3>
    {#each $question.options as option}
      <div class="form-group">
        <label for="question-option-{option.value}">Option
          {option.value}</label>
        <input
          class="form-control"
          id="question-option-{option.value}"
          value={option.text}
          on:input={(event) => handleInputOption_input(event, option)} />
      </div>
    {/each}

    <button class="btn btn-primary" on:click={handleAddOption_click}>Add Option</button>

    <button class="btn btn-warning" on:click={handleDeleteOption_click}>Delete
      Option</button>

    <hr />

    <h3>Add Media</h3>

    <Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>
      <DropdownToggle caret>Add ...</DropdownToggle>
      <DropdownMenu>
        {#if !$question.audio}
          <DropdownItem on:click={handleAddAudio_click}>Add Audio</DropdownItem>
        {/if}

        {#if !$question.image}
          <DropdownItem on:click={handleAddImage_click}>Add Image</DropdownItem>
        {/if}

        {#if !$question.video}
          <DropdownItem on:click={handleAddVideo_click}>Add Video</DropdownItem>
        {/if}
      </DropdownMenu>
    </Dropdown>
    <hr />

    <!-- Question Audio -->
    {#if $question.audio}
      <h3>Audio</h3>
      <div class="form-group">
        <label for="audio-url">URL</label>
        <input
          class="form-control"
          id="audio-url"
          value={$question.audio.url}
          on:input={handleAudioUrlInput_input} />
      </div>

      <div class="form-group">
        <label for="audio-file">Upload mp3 file</label>
        <input
          type="file"
          class="form-control"
          id="audio-file"
          on:input={handleAudioFileInput_input} />
      </div>

      <button class="btn btn-warning" on:click={handleDeleteAudio_click}>Delete
        Audio</button>
      <hr />
    {/if}

    <!-- Question Image -->
    {#if $question.image}
      <button class="btn btn-warning" on:click={handleDeleteImage_click}>Delete
        Image</button>
      <hr />
    {/if}

    <!-- Question Video -->
    {#if $question.video}
      <div class="form-group">
        <label for="video-url">URL</label>
        <input
          class="form-control"
          id="video-url"
          value={$question.video.url}
          on:input={handleVideoUrlInput_input} />
      </div>

      <button class="btn btn-warning" on:click={handleDeleteVideo_click}>Delete
        Video</button>
      <hr />
    {/if}

    <hr />

    <h3>Media Items</h3>

    <ul class="list-group">
      {#each $mediaItems as mediaItem}
        <li
          class="list-group-item d-flex justify-content-between
            align-items-center">
          <a href="#{$question.getDocumentPath()}/media-items/{mediaItem.id}">
            {mediaItem.fileName}
          </a>
          <span
            class="badge badge-primary badge-pill">{mediaItem.mediaType}</span>
        </li>
      {/each}
    </ul>

    <Button color="danger" on:click={() => (modalIsOpen = true)}>
      Add Media Item
    </Button>
  {/if}

  <Modal isOpen={modalIsOpen}>
    <ModalHeader toggle={addMediaItemModal_cancel}>Add Media Item</ModalHeader>
    <ModalBody>
      <div class="form-group">
        <label for="media-type">Media Type</label>
        <select class="form-control" id="media-type" bind:value={mediaType}>
          <option value="image">Image</option>
          <option disabled>_________</option>
          <option value="audio">Audio</option>
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
            on:input={handleAudioFile_input} />
        </div>
      {/if}

      {#if mediaType === 'image'}
        <div class="form-group">
          <label for="image-file">Upload image file</label>
          <input
            type="file"
            class="form-control"
            id="image-file"
            on:input={handleImageFile_input} />
        </div>
      {/if}

      {#if mediaType === 'video'}
        <div class="form-group">
          <label for="video-url">URL</label>
          <input class="form-control" id="video-url" bind:value={videoUrl} />
        </div>
      {/if}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={addMediaItemModal_confirm}>OK</Button>
      <Button color="secondary" on:click={addMediaItemModal_cancel}>
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
