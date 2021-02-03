import { readable } from 'svelte/store';
import Question from '/src/models/Question';
import Quiz from '/src/models/Quiz';

let activeQuestion = readable(
  1,
  // Handle Subscribe
  function (set) {
    let quiz = Quiz.listen('default');

    let unsubscribeQuiz = quiz.subscribe(function (value) {
      let quiz = value;
      let activeQuestion = quiz ? quiz.activeQuestion : 1;
      set(activeQuestion);
    });
    return function () {
      unsubscribeQuiz();
    };
  }
);

export default activeQuestion;
