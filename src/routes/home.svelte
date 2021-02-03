<script>
  import { slide } from 'svelte/transition';
  import { slideX } from '/src/lib/transitions/slideX';
  import { quintOut } from 'svelte/easing';
  import { loggedIn, signInWithPopup, signOut } from '/src/services/firebase';
  import { push as routePush } from 'svelte-spa-router';

  import currentUser from '/src/stores/currentUser';

  async function handleSignIn(event) {
    try {
      const userCredential = await signInWithPopup();
      routePush('/admin/quizzes');
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="row" style="height: 100%">
  <div
    class="bg-danger text-white d-flex flex-column justify-content-center display-1 align-items-center flex-shrink-1"
    style="width: 33.3333%;"
    transition:slideX={{ delay: 250, duration: 1000, easing: quintOut }}>
    Quizzes
  </div>
  <div class="p-3 flex-grow-1">
    <div class="d-flex justify-content-end">
      <button class="btn btn-danger" on:click={handleSignIn}>Sign In</button>
    </div>
  </div>

  <div style="background-color: var(--orange-050);">Moscow</div>
  <div style="background-color: var(--orange-100);">Moscow</div>
  <div style="background-color: var(--orange-200);">Moscow</div>
  <div style="background-color: var(--orange-300);">Moscow</div>
  <div style="background-color: var(--orange-400);">Moscow</div>
  <div style="background-color: var(--orange-500);">Moscow</div>
  <div style="background-color: var(--orange-600);">Moscow</div>
  <div style="background-color: var(--orange-700);">Moscow</div>
  <div style="background-color: var(--orange-800);">Moscow</div>
  <div style="background-color: var(--orange-900);">Moscow</div>
  <div style="background-color: var(--orange-950);">Moscow</div>
</div>

<style lang="scss">
</style>
