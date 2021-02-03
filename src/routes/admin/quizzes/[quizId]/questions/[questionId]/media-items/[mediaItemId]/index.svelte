<script>
  import { of as rxOf } from 'rxjs';

  import MediaItemEditor from '/src/components/editors/MediaItemEditor.svelte';
  import MediaItemPreview from '/src/components/previews/MediaItemPreview.svelte';
  import Quiz from '/src/models/Quiz';

  export let params = {};

  let quiz = Quiz.listen(params.quizId);
  $: question = $quiz ? $quiz.listenQuestion(params.questionId) : rxOf(null);
  $: mediaItem = $question
    ? $question.listenMediaItem(params.mediaItemId)
    : rxOf(null);
</script>

<template>
  {#if $mediaItem}
    <div class="row">
      <div class="col border-right bg-light">
        <a href="#/">Quizzes</a>
        /
        <a href="#/admin/quizzes/{$quiz.id}">{$quiz.name}</a>
        /
        <a
          href="#/admin/quizzes/{$quiz.id}/questions/{$question.id}"
          class="question-text">{$question.text}</a>
        <MediaItemEditor {mediaItem} />
      </div>
      <div class="col">
        <MediaItemPreview {mediaItem} />
      </div>
    </div>
  {/if}
</template>

<style>
  .question-text {
    max-width: 24ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
