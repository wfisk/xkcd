import _ from 'lodash';
import { select as d3Select } from 'd3';

import Drawable from './Drawable';
import EntityGizmo from './gizmos/EntityGizmo';
import Skelet from './Skelet';

export default class Entity extends Drawable {
  constructor(scene) {
    super();
    this.setScene(scene);

    this.skelet = new Skelet();
  }

  setFrame(t) {
    this.t = t;
  }

  getFrame() {
    // strip defaults and make the transformation human-readable
    const re = /\)([^ ])/;
    return _.trim(
      this.t
        .replace('translate(0,0)', '')
        .replace('rotate(0)', '')
        .replace('skewX(0)', '')
        .replace('scale(1,1)', '')
        .replace(re, ') $1')
    );
  }

  getEffectiveFrame() {
    const frame = [];
    const boneFrame = this.getAttachBoneFrame();
    if (boneFrame) {
      frame.push(boneFrame);
    }
    frame.push(this.t);
    return frame.join('');
  }

  getAttachBoneFrame() {
    let attachBone;
    if (this.attachBone && this.parentView.skelet) {
      attachBone = this.parentView.skelet.bone(this.attachBone);
    }
    return this.prepareFrame(attachBone);
  }

  openLayer(layer) {
    return this.openFrame(() => this.getEffectiveFrame(), {
      class: `cmx-entity cmx-${this.constructor.name.toLowerCase()}`,
      data: {
        entity: this
      }
    });
  }

  drawLayer(layer) {}
  // nothing to do here

  closeLayer(layer) {
    return this.closeFrame();
  }

  setAttachBone(boneName) {
    return (this.attachBone = boneName.toUpperCase());
  }

  buildGizmo(root) {
    return (this.gizmo = new EntityGizmo(this, root));
  }

  highlightBones(root, bones) {
    if (bones == null) {
      bones = [];
    }
    if (!root) {
      return;
    }
    return root.selectAll('.cmx-control').each(function (d, bone) {
      if (Array.from(bones).includes(d.name)) {
        return d3Select(this).classed('cmx-highlighted-bone', true);
      }
    });
  }

  unhighlightBones(root) {
    if (!root) {
      return;
    }
    return root.selectAll('.cmx-highlighted-bone').each(function (d, bone) {
      return d3Select(this).classed('cmx-highlighted-bone', false);
    });
  }
}
