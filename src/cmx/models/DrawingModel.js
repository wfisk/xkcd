/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import Model from '../Model';
import Drawing from '../entities/Drawing';

const DEFAULT_LAYER = 2;

export default class DrawingModel extends Model {
  constructor(cmx) {
    super(cmx, {
      t: '',
      pose: '0,0',
      drawlist: [[], 'array']
    });
  }

  applyDefaults(props) {
    super.applyDefaults(...arguments);

    // this is our mini-parser for drawing's content
    if (props['content']) {
      const list = [];
      // const $parser = $('<div/>').html(props['content']);
      let parser = document.createElement('div');
      parser.innerHTML = props['content'];

      // $parser.children().each(function () {
      for (let child of Array.from(parser.children)) {
        // const $command = $(this);

        const collectOpts = function (el) {
          const res = {};
          for (let attr of Array.from(el.attributes)) {
            const key = attr.name.toLowerCase();
            const val = attr.value;
            res[key] = val;
          }

          return res;
        };

        const layer = parseInt(
          child.getAttribute('layer') || DEFAULT_LAYER,
          10
        );
        const action = child.tagName.toLowerCase();

        const cmd = [layer, action];
        switch (action) {
          case 'line':
            var points = [];

            child.querySelectorAll('point');

            // $command.find('point').each(function () {
            for (let point of Array.from(child.querySelectorAll('point'))) {
              // const $point = $(this);
              const x = parseInt(point.getAttribute('x') || 0, 10);
              const y = parseInt(point.getAttribute('y') || 0, 10);
              return points.push([x, y]);
            }
            cmd.push(points);
            break;
        }

        cmd.push(collectOpts(child));

        return list.push(cmd);
      }

      props['drawlist'] = list;
    }

    return props;
  }

  materialize(parent) {
    const o = new Drawing(parent.scene, this.props['drawlist']);
    o.setFrame(this.props['t']);
    o.setPose(this.unserializePose(this.props['pose']));
    parent.add(o);

    return super.materialize(o);
  }

  read() {
    this.props['t'] = this.view.getFrame();
    return (this.props['pose'] = this.serializePose(this.view.getPose()));
  }
}
