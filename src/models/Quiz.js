import { map, startWith } from 'rxjs/operators';
import Model from '/src/models/Model';
import Question from '/src/models/Question';

export default class Quiz extends Model {
  static async findAll({ parent = null, order = '' } = {}) {
    let result = await super.findAll({ parent: parent, order: order });

    if (order === 'name') {
      result = result.pipe(
        map((items) =>
          items.sort((a, b) =>
            a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
          )
        )
      );
    }

    return result;
  }

  static getCollectionId() {
    return 'quizzes';
  }

  addQuestion(props) {
    Question.add(props, { parent: this });
  }

  listenQuestion(id) {
    return Question.listen(id, { parent: this });
  }

  listenQuestions(options = {}) {
    return Question.listenAll({
      order: 'questionIndex',
      ...options,
      parent: this
    });
  }
}
