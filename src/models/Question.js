import { map as rxMap } from 'rxjs/operators';

import Model from '/src/models/Model';
import MediaFile from '/src/models/MediaFile';
import MediaItem from '/src/models/MediaItem';

export default class Question extends Model {
  static getCollectionId() {
    return 'questions';
  }

  constructor(...args) {
    super(...args);

    this.options || (this.options = []);
  }

  addMediaFile(props) {
    MediaFile.add(props, { parent: this });
  }

  addMediaItem(props) {
    MediaItem.add(props, { parent: this });
  }

  listenMediaFile(id) {
    return MediaFile.listen(id, { parent: this });
  }

  listenMediaItem(id) {
    return MediaItem.listen(id, { parent: this });
  }

  async mediaFiles(options = {}) {
    return MediaFile.findAll({ ...options, parent: this });
  }

  listenMediaItems(options = {}) {
    return MediaItem.listenAll({ ...options, parent: this }).pipe(
      rxMap((items) =>
        items.sort(function (a, b) {
          let MEDIA_TYPE_TO_MEDIA_VALUE = {
            audio: 3,
            image: 1,
            video: 2
          };

          let a_mediaValue = MEDIA_TYPE_TO_MEDIA_VALUE[a.mediaType];
          let b_mediaValue = MEDIA_TYPE_TO_MEDIA_VALUE[b.mediaType];
          let result = a_mediaValue - b_mediaValue;
          if (result === 0) {
            result = a.id.localeCompare(b.id);
          }

          return result;
        })
      )
    );
  }
}
