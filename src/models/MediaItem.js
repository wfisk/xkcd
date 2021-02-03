import Model from '/src/models/Model';

export default class MediaItem extends Model {
  static getCollectionId() {
    return 'media-items';
  }

  constructor(...args) {
    super(...args);

    if (this.mediaType === 'audio') {
      this.lyrics || (this.lyrics = []);
    }
  }
}
