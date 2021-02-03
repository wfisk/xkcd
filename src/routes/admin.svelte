<script>
  import AdminNavbar from '/src/components/navbars/AdminNavbar.svelte';
  import adminRoutes from '/src/config/adminRoutes';
  import {
    default as Router,
    replace as routeReplace,
    push as routePush
  } from 'svelte-spa-router';
</script>

<AdminNavbar />

<Router routes={adminRoutes} />
