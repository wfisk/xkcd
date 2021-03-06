import _ from 'lodash';

import Entity from '../Entity';
import DrawingGizmo from '../gizmos/DrawingGizmo';
export default class Drawing extends Entity {
  constructor(scene, drawlist) {
    super();
    this.setScene(scene);

    // HACK: find proper way how to do deep clone
    if (drawlist == null) {
      drawlist = [];
    }
    this.drawlist = drawlist.map((call) => call.map((x) => _(x).clone()));

    this.drawingBones = this.skelet.addBones([
      ['HNDL', 0, 0, 'h'] // handle
    ]);
  }

  buildGizmo(root) {
    return (this.gizmo = new DrawingGizmo(this, root));
  }

  setPose(pose) {
    return this.skelet.setPose(pose, this.drawingBones);
  }

  getPose() {
    return this.skelet.getPose(this.drawingBones);
  }

  drawLayer(layer) {
    super.drawLayer(...arguments);

    const itemsToBeRendered = _(this.drawlist).filter(
      (item) => layer === item[0]
    );
    if (!itemsToBeRendered.length) {
      return;
    }

    this.openFrame(() => this.prepareFrame(this.skelet.bone('HNDL')));
    for (let item of Array.from(itemsToBeRendered)) {
      this.scene.renderer[item[1]].apply(this.scene.renderer, item.slice(2));
    }
    return this.closeFrame();
  }
}
