<script>
  import quizRoutes from '/src/config/quizRoutes';
  import {
    default as Router,
    replace as routeReplace,
    push as routePush
  } from 'svelte-spa-router';
</script>

<Router routes={quizRoutes} />
