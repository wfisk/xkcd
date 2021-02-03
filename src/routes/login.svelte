<script>
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

<template>
  {#if !$loggedIn}
    <button class="btn btn-primary" on:click={handleSignIn}>Sign in</button>
  {:else}
    <dl>
      <dt>Current User</dt>
      <dd>{$currentUser.displayName} ({$currentUser.uid})</dd>
    </dl>
    <button class="btn btn-warning" on:click={signOut}>Sign out</button>
  {/if}
</template>
