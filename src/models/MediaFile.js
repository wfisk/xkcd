import Model from '/src/models/Model';

export default class MediaFile extends Model {
  static getCollectionId() {
    return 'media-files';
  }
}
