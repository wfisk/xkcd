/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import Model from '../Model';
import Bubble from '../entities/Bubble';

export default class BubbleModel extends Model {
  constructor(cmx) {
    super(cmx, {
      t: '',
      pose: '0,0|-20,10|-40,50|0,50|-20,90|-60,85',
      content: '<tspan x="0" y="0em">hello world</tspan>',
      attach: 'head'
    });
  }

  materialize(parent) {
    const o = new Bubble(parent.scene);
    o.setFrame(this.props['t']);
    o.setPose(this.unserializePose(this.props['pose']));
    o.setContent(this.props.content);
    o.setAttachBone(this.props.attach);
    parent.add(o);

    return super.materialize(o);
  }

  read() {
    this.props['t'] = this.view.getFrame();
    return (this.props['pose'] = this.serializePose(this.view.getPose()));
  }
}
