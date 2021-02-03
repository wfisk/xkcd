/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
define(['cmx/entity', 'cmx/gizmos/actor_gizmo'], function(Entity, ActorGizmo) {

  let Actor;
  return Actor = (function() {
    Actor = class Actor extends Entity {
      static initClass() {
        this.prototype.HEAD_RADIUS = 16;
      }

      constructor(scene, pose) {
        super(scene);

        // define initial pose
        // p - positional point
        // n - normal definition
        // c - control point
        // l - positional point with reset feature
        // h - handle
        this.actorBones = this.skelet.addBones([
          ['HNDL',   0,   0, "h"], // handle
          ['HEAD',   0, 106, "n"], // head
          ['NECK',   0,  90, "p"], // body = neck - c1 - c2 - hips
          ['BDC1',   0,  80, "c"],
          ['BDC2',   0,  70, "c"],
          ['HIPS',   0,  50, "p"],
          ['LLEG', -10,  30, "l"], // left leg
          ['LFOT', -10,   0, "p"],
          ['RLEG',  10,  30, "l"], // right leg
          ['RFOT',  10,   0, "p"],
          ['LARM', -10,  70, "l"], // left arm
          ['LHND', -10,  50, "p"],
          ['RARM',  10,  70, "l"], // right arm
          ['RHND',  10,  50, "p"],
        ]);

        // define skeleton
        this.skelet.addStructure({
          'NECK': ['LARM', 'LHND', 'RARM', 'RHND', 'HEAD', 'BDC1'],
          'HIPS': ['LLEG', 'LFOT', 'RLEG', 'RFOT', 'BDC2'],
          'LARM': ['LHND'],
          'RARM': ['RHND'],
          'LLEG': ['LFOT'],
          'RLEG': ['RFOT'],
          'HNDL': ['HEAD', 'NECK', 'BDC1', 'BDC2', 'HIPS', 'LLEG', 'LFOT', 'RLEG', 'RFOT', 'LARM', 'LHND', 'RARM', 'RHND']});

        // recognize legs and arms
        this.legs = [
          ['HIPS', 'LLEG', 'LFOT'], // left
          ['HIPS', 'RLEG', 'RFOT'] // right
        ];
        this.arms = [
          ['NECK', 'LARM', 'LHND'], // left
          ['NECK', 'RARM', 'RHND'] // right
        ];

        // define some heads
        const standardHead = () => {
          return this.scene.renderer.circle(this.HEAD_RADIUS, {t:`translate(0, ${this.HEAD_RADIUS})`});
        };

        this.heads = {
          "normal"() {
            return standardHead();
          },
          "line"() {
            standardHead();
            return this.scene.renderer.line([[0, 20], [0, 40]]);
          }
        };

        this.head = "normal";

        if (pose) { this.setPose(pose); }
      }

      buildGizmo(root) {
        return this.gizmo = new ActorGizmo(this, root);
      }

      setPose(pose) {
        return this.skelet.setPose(pose, this.actorBones);
      }

      getPose() {
        return this.skelet.getPose(this.actorBones);
      }

      drawBody() {
        const bone = name => this.skelet.bone(name);

        // smooth bezier with two control points
        const bodyPath = () => {
          const f = n => ` ${bone(n).x},${bone(n).y}`;
          return `M${f('NECK')} C${f('BDC1')}${f('BDC2')}${f('HIPS')}`;
        };
        return this.register(this.scene.renderer.path((() => bodyPath())));
      }

      drawHead() {
        const bone = name => this.skelet.bone(name);

        // TODO: heads should be customizable in the future
        this.openFrame((() => this.prepareFrame(bone('NECK'), bone('HEAD'))));
        this.heads[this.head].apply(this);
        return this.closeFrame();
      }

      drawLegs() {
        const bonePos = name => {
          const bone = this.skelet.bone(name);
          return [bone.x, bone.y];
        };

        this.register(this.scene.renderer.line((() => this.legs[0].map(bonePos))));
        return this.register(this.scene.renderer.line((() => this.legs[1].map(bonePos))));
      }

      drawArms() {
        const bonePos = name => {
          const bone = this.skelet.bone(name);
          return [bone.x, bone.y];
        };

        this.register(this.scene.renderer.line((() => this.arms[0].map(bonePos))));
        return this.register(this.scene.renderer.line((() => this.arms[1].map(bonePos))));
      }

      drawLayer(layer) {
        super.drawLayer(...arguments);

        if (layer === 2) { this.drawHead(); }
        if (layer === 2) { this.drawBody(); }
        if (layer === 2) { this.drawArms(); }
        if (layer === 2) { return this.drawLegs(); }
      }
    };
    Actor.initClass();
    return Actor;
  })();
});