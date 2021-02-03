import Model from '/src/models/Model';

export default class User extends Model {
  static getCollectionId() {
    return 'users';
  }
}
