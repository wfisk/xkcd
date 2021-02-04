/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import Model from '../Model';
import Scene from '../Scene';

export default class SceneModel extends Model {
  constructor(cmx) {
    super(cmx, {
      width: [250, 'int'],
      height: [350, 'int'],
      frame: [true, 'bool'],
      'margin-x': [10, 'int'],
      'margin-y': [20, 'int']
    });
  }

  applyDefaults(props) {
    super.applyDefaults(...arguments);

    if (props['margin'] !== undefined) {
      props['margin-x'] = props['margin'];
      props['margin-y'] = props['margin'];
    }

    return props;
  }

  materialize(where) {
    // const $wrapper = $('<div/>').attr('class', 'cmx-scene');
    let wrapper = document.createElement('div');
    wrapper.classList.add('cmx-scene');

    // const id = $(this.source).attr('id');
    const id = this.source.getAttribute('id');

    if (id) {
      // $wrapper.addClass(`cmx-user-${id}`);
      wrapper.classList.add(`cmx-user-${id}`);
    }
    // $where.after($wrapper);
    where.insertAdjacentElement('afterend', wrapper);

    const scene = new Scene(
      this.cmx,
      wrapper,
      this.props['width'],
      this.props['height'],
      this.props['frame'],
      this.props['margin-x'],
      this.props['margin-y']
    );
    super.materialize(scene);
    scene.drawScene();
    return scene;
  }
}
