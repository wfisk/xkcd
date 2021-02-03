<script>
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
  } from "sveltestrap";


  export let mediaItem;

  let displayed = false;



  function handle_cancel() {

  }

  function handle_confirm() {

  }

  function handleAudioFile_input() {

  }

  function handleImageFile_input() {

  }

</script>


<template>

  <Modal isOpen={displayed}>
    <ModalHeader toggle={handle_cancel}>Media Item</ModalHeader>
    <ModalBody>
      <div class="form-group">
        <label for="media-type">Media Type</label>
        <select class="form-control" id="media-type" bind:value={mediaItem.mediaType}>
          <option value="image">Image</option>
          <option disabled>_________</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
        </select>

      </div>

      {#if mediaItem.mediaType === 'audio'}
        <div class="form-group">
          <label for="audio-file">Upload mp3 file</label>
          <input type="file" class="form-control" id="audio-file" on:input={handleAudioFile_input}>
        </div>
      {/if}

      {#if mediaItem.mediaType === 'image'}
        <div class="form-group">
          <label for="image-file">Upload image file</label>
          <input type="file" class="form-control" id="image-file" on:input={handleImageFile_input}>
        </div>
      {/if}
    
      {#if mediaItem.mediaType === 'video'}
        <div class="form-group">
          <label for="video-url">URL</label>
          <input class="form-control" id="video-url" bind:value={mediaItem.videoUrl}>
        </div>
      {/if}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={handle_confirm}>
        OK
      </Button>
      <Button color="secondary" on:click={handle_cancel}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>

</template>
