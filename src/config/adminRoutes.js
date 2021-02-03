import { get } from 'svelte/store';

import { wrap as routeWrap } from 'svelte-spa-router/wrap';

import route__admin__quizzes__quizId__questions__questionId__mediaItems__mediaItemId from '../routes/admin/quizzes/[quizId]/questions/[questionId]/media-items/[mediaItemId]/index.svelte';
import route__admin__quizzes__quizId__questions__questionId from '../routes/admin/quizzes/[quizId]/questions/[questionId]/index.svelte';
import route__admin__quizzes__quizId from '/src/routes/admin/quizzes/[quizId]/index.svelte';
import route__admin__quizzes from '/src/routes/admin/quizzes/index.svelte';
import route__admin from '/src/routes/admin/index.svelte';
import route__admin__not_found from '/src/routes/admin/not-found.svelte';

import { loggedIn } from '/src/services/firebase';

const routes = {
  '/admin/quizzes/:quizId/questions/:questionId/media-items/:mediaItemId': routeWrap(
    {
      component: route__admin__quizzes__quizId__questions__questionId__mediaItems__mediaItemId,
      conditions: () => true
    }
  ),

  '/admin/quizzes/:quizId/questions/:questionId': routeWrap({
    component: route__admin__quizzes__quizId__questions__questionId,
    conditions: () => true
  }),

  '/admin/quizzes/:quizId': route__admin__quizzes__quizId,

  '/admin/quizzes': routeWrap({
    component: route__admin__quizzes,
    conditions: () => true
  }),

  '/admin': routeWrap({
    component: route__admin,
    conditions: () => true
  }),

  '*': route__admin__not_found
};

export default routes;
