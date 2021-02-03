/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
define(['cmx/entity', 'cmx/gizmos/drawing_gizmo'], function(Entity, DrawingGizmo) {

  let Drawing;
  return Drawing = class Drawing extends Entity {

    constructor(scene, drawlist) {
      // HACK: find proper way how to do deep clone
      if (drawlist == null) { drawlist = []; }
      this.drawlist = drawlist.map(call => call.map(x => _(x).clone()));
      super(scene);

      this.drawingBones = this.skelet.addBones([
        ['HNDL',   0,    0, "h"], // handle
      ]);
    }

    buildGizmo(root) {
      return this.gizmo = new DrawingGizmo(this, root);
    }

    setPose(pose) {
      return this.skelet.setPose(pose, this.drawingBones);
    }

    getPose() {
      return this.skelet.getPose(this.drawingBones);
    }

    drawLayer(layer) {
      super.drawLayer(...arguments);

      const itemsToBeRendered = _(this.drawlist).filter(item => layer === item[0]);
      if (!itemsToBeRendered.length) { return; }

      this.openFrame((() => this.prepareFrame(this.skelet.bone('HNDL'))));
      for (let item of Array.from(itemsToBeRendered)) {
        this.scene.renderer[item[1]].apply(this.scene.renderer, item.slice(2));
      }
      return this.closeFrame();
    }
  };
});
