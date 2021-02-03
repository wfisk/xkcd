<script>
  import {
    default as Router,
    replace as routeReplace,
    push as routePush
  } from 'svelte-spa-router';
  import Headroom from 'svelte-headroom';
  import Fa from 'svelte-fa';
  import { faHome } from '@fortawesome/free-solid-svg-icons';
  import { faPowerOff } from '@fortawesome/free-solid-svg-icons';

  import routes from '/src/config/routes';
  import { loggedIn, signOut } from '/src/services/firebase';

  import { auth, googleProvider } from '/src/services/firebase';

  $: userLoggedIn = $loggedIn;
  $: console.log({ $loggedIn });

  function handleHome() {
    routePush('/');
  }

  async function handleLogout() {
    await signOut();
    routePush('/login');
  }

  function handleRouterFailed(event) {
    console.error({
      event
    });
    routeReplace('/admin/quizzes');
  }
</script>

<template>
  <div class="container-fluid" style="height: 100%;">
    {#if $loggedIn == null}
      <p>Loading...</p>
    {:else}
      <Router {routes} on:conditionsFailed={handleRouterFailed} />
    {/if}
  </div>
</template>

<style global lang="scss">
  body {
    height: 100vh;
  }

  header {
    background-color: darkblue;
    height: 60px;
    opacity: 0.2;
    z-index: 1;
  }
</style>
