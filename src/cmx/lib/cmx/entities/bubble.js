/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
define(['cmx/entity', 'cmx/gizmos/bubble_gizmo'], function(Entity, BubbleGizmo) {

  let Bubble;
  return Bubble = class Bubble extends Entity {

    constructor(scene, content) {
      super(scene);

      // define initial pose
      // p - positional point
      // c - control point
      // h - handle
      this.bubbleBones = this.skelet.addBones([
        ['HNDL',   0,    0, "h"], // handle
        ['LINE', -20,   10, "p"], // line = start - c1 - c2 - end
        ['LCP1', -40,   50, "c"],
        ['LCP2',   0,   50, "c"],
        ['LEND', -20,   90, "p"],
        ['TEXT', -80,  130, "t"], // text origin
      ]);

      this.skelet.addStructure({
        'HNDL': ['LINE', 'LCP1', 'LCP2', 'LEND', 'TEXT'],
        'LEND': ['LCP2'],
        'LINE': ['LCP1']});

      this.setContent(content);
    }

    buildGizmo(root) {
      return this.gizmo = new BubbleGizmo(this, root);
    }

    setPose(pose) {
      return this.skelet.setPose(pose, this.bubbleBones);
    }

    getPose() {
      return this.skelet.getPose(this.bubbleBones);
    }

    setContent(content) {
      this.content = content;
    }

    drawLine() {
      const bone = name => this.skelet.bone(name);

      // smooth bezier with two control points
      const bodyPath = () => {
        const f = n => ` ${bone(n).x},${bone(n).y}`;
        return `M${f('LINE')} C${f('LCP1')}${f('LCP2')}${f('LEND')}`;
      };
      return this.register(this.scene.renderer.path((() => bodyPath()), {"stroke-width":2}));
    }

    drawText() {
      const f = bone => ` ${bone.x},${bone.y}`;
      this.register(this.scene.renderer.openGroup({t: (() => `translate (${f(this.skelet.bone('TEXT'))})`)}));
      this.register(this.scene.renderer.text(this.content));
      return this.register(this.scene.renderer.closeGroup());
    }

    drawLayer(layer) {
      super.drawLayer(...arguments);

      if (layer === 2) { this.drawLine(); }
      if (layer === 1) { return this.drawText(); }
    }
  };
});