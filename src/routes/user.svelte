<script>
  import userRoutes from '/src/config/userRoutes';
  import {
    default as Router,
    replace as routeReplace,
    push as routePush
  } from 'svelte-spa-router';
</script>

<Router routes={userRoutes} />
