/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import Entity from '../Entity';
import LabelGizmo from '../gizmos/LabelGizmo';

export default class Label extends Entity {
  constructor(scene, content) {
    super(scene);

    this.labelBones = this.skelet.addBones([
      ['HNDL', 0, 0, 'h'], // handle
      ['TEXT', -60, 0, 't'] // text origin
    ]);

    this.skelet.addStructure({
      HNDL: ['TEXT']
    });

    this.setContent(content);
  }

  buildGizmo(root) {
    return (this.gizmo = new LabelGizmo(this, root));
  }

  setPose(pose) {
    return this.skelet.setPose(pose, this.labelBones);
  }

  getPose() {
    return this.skelet.getPose(this.labelBones);
  }

  setContent(content) {
    this.content = content;
  }

  drawText() {
    const f = (bone) => ` ${bone.x},${bone.y}`;
    this.register(
      this.scene.renderer.openGroup({
        t: () => `translate (${f(this.skelet.bone('TEXT'))})`
      })
    );
    this.register(this.scene.renderer.text(this.content, { border: true }));
    return this.register(this.scene.renderer.closeGroup());
  }

  drawLayer(layer) {
    super.drawLayer(...arguments);

    if (layer === 0) {
      return this.drawText();
    }
  }
}
