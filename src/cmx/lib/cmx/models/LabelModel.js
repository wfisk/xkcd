/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import Model from '../Model';
import Label from '../entities/Label';

export default class LabelModel extends Model {
  constructor() {
    this.defaults = {
      t: '',
      pose: '0,-10|0,0',
      content: '<tspan x="0" y="0em">hello world</tspan>'
    };
    super(...arguments);
  }

  materialize(parent) {
    const o = new Label(parent.scene);
    o.setFrame(this.props['t']);
    o.setPose(this.unserializePose(this.props['pose']));
    o.setContent(this.props.content);
    parent.add(o);

    return super.materialize(o);
  }

  read() {
    this.props['pose'] = this.serializePose(this.view.getPose());
    return (this.props['t'] = this.view.getFrame());
  }
}
