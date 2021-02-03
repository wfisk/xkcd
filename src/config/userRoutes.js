import { get } from 'svelte/store';

import { wrap as routeWrap } from 'svelte-spa-router/wrap';

// import route__media_item from '/src/routes/media-item.svelte';
import route__not_found from '/src/routes/not-found.svelte';
// import route__question from '/src/routes/question.svelte';
import route__session from '/src/routes/session.svelte';

import route__quizzes from '/src/routes/quizzes/index.svelte';
import route__quizzes__quizId from '/src/routes/quizzes/[quizId]/index.svelte';
// import route__quizzes__quizId__questions from '/src/routes/quizzes/[quizId]/questions.svelte';
import route__quizzes__quizId__questions__questionId from '../routes/quizzes/[quizId]/questions/[questionId]/index.svelte';
import route__quizzes__quizId__questions__questionId__mediaItems__mediaItemId from '../routes/quizzes/[quizId]/questions/[questionId]/media-items/[mediaItemId]/index.svelte';

import { loggedIn } from '/src/services/firebase';

const routes = {
  '/quizzes/:quizId/questions/:questionId/media-items/:mediaItemId': routeWrap({
    component: route__quizzes__quizId__questions__questionId__mediaItems__mediaItemId,
    conditions: () => true
  }),

  '/quizzes/:quizId/questions/:questionId': routeWrap({
    component: route__quizzes__quizId__questions__questionId,
    conditions: () => true
  }),

  '/quizzes/:quizId': route__quizzes__quizId,

  '/quizzes': routeWrap({
    component: route__quizzes,
    conditions: () => true
  }),

  '/session': route__session,

  '/': routeWrap({
    component: route__quizzes,
    conditions: () => true
  }),

  '*': route__not_found
};

export default routes;
