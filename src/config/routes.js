import { get } from 'svelte/store';
import { wrap as routeWrap } from 'svelte-spa-router/wrap';

import route__admin from '/src/routes/admin.svelte';
import route__home from '/src/routes/home.svelte';
import route__login from '/src/routes/login.svelte';
import route__not_found from '/src/routes/not-found.svelte';
import route__quiz from '/src/routes/quiz.svelte';

import { loggedIn } from '/src/services/firebase';

const routes = {
  '/admin/*': routeWrap({
    component: route__admin,
    conditions: () => true
  }),

  '/admin': routeWrap({
    component: route__admin,
    conditions: () => true
  }),

  '/login': route__login,

  '/quiz/*': routeWrap({
    component: route__quiz,
    conditions: () => true
  }),

  '/quiz': routeWrap({
    component: route__quiz,
    conditions: () => true
  }),

  '/': routeWrap({
    component: route__home,
    conditions: () => true
  }),

  '*': route__not_found
};

export default routes;
