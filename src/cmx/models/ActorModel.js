import Model from '../Model';
import Actor from '../entities/Actor';

export default class ActorModel extends Model {
  constructor(cmx) {
    super(cmx, {
      t: '',
      pose:
        '0,0|0,106|0,90|0,80|0,70|0,50|-10,30|-10,0|10,30|10,0|-10,70|-10,50|10,70|10,50'
    });
  }

  materialize(parent) {
    const o = new Actor(parent.scene);
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
