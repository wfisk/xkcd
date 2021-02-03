import { get } from 'svelte/store';

import { wrap as routeWrap } from 'svelte-spa-router/wrap';

import route__quiz__quizId from '/src/routes/quiz/[quizId]/index.svelte';
import route__quiz from '/src/routes/quiz/index.svelte';
import route__quiz__not_found from '/src/routes/quiz/not-found.svelte';

import { loggedIn } from '/src/services/firebase';

const routes = {
  '/quiz/:quizId': route__quiz__quizId,

  '/quiz': routeWrap({
    component: route__quiz,
    conditions: () => true
  }),

  '*': route__quiz__not_found
};

export default routes;
