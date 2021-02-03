/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import View from './View';

export default class Drawable extends View {
  static throttledUpdate = _.throttle(this.prototype.update, 50);

  constructor(scene) {
    this.renderCalls = [];
    super(scene);
  }

  register(renderCall) {
    this.renderCalls.push(renderCall);
    return renderCall;
  }

  draw(layer) {
    if (typeof this.openLayer === 'function') {
      this.openLayer(layer);
    }
    if (typeof this.drawLayer === 'function') {
      this.drawLayer(layer);
    }
    for (let view of Array.from(this.subviews)) {
      view.draw(layer);
    }
    return typeof this.closeLayer === 'function'
      ? this.closeLayer(layer)
      : undefined;
  }

  prepareFrame(framePos, frameRot) {
    const r = (num) => Math.round(num);
    const f = (p) => `${r(p.x)},${r(p.y)}`;
    const frame = [];
    if (framePos) {
      frame.push(`translate(${f(framePos)})`);
    }

    if (frameRot && framePos) {
      // point framePos defines position
      // vector framePos -> frameRot defines rotation

      const vecAngle = function (x, y) {
        const len = Math.sqrt(x * x + y * y);
        const dot = x / len;
        const rad = Math.acos(dot);
        let angle = rad * (360 / (2 * Math.PI)) - 90;
        if (y < 0) {
          angle = 180 - angle;
        }
        return [angle, len];
      };

      const vx = frameRot.x - framePos.x;
      const vy = frameRot.y - framePos.y;
      const [angle, len] = Array.from(vecAngle(vx, vy));
      frame.push(`rotate(${r(angle)})`);
    }

    return frame.join('');
  }

  openFrame(frame, opts) {
    if (opts == null) {
      opts = {};
    }
    opts['t'] = frame;
    return this.register(this.scene.renderer.openGroup(opts));
  }

  closeFrame() {
    return this.scene.renderer.closeGroup();
  }

  buildGizmo(root) {
    return { leafGizmo: root };
  }

  buildGizmos(root) {
    const newRoot =
      typeof this.buildGizmo === 'function' ? this.buildGizmo(root) : undefined;

    return (() => {
      const result = [];
      for (let view of Array.from(this.subviews)) {
        if (typeof view.buildGizmos === 'function') {
          view.buildGizmos(newRoot.leafGizmo);
        }
        result.push(view.gizmo.update());
      }
      return result;
    })();
  }

  update() {
    if (this.gizmo != null) {
      this.gizmo.update();
    }
    for (let call of Array.from(this.renderCalls)) {
      call.update();
    }

    this.updateDependants();
    this.scene.announceUpdate();
    return this;
  }

  updateDependants() {
    for (let view of Array.from(this.subviews)) {
      view.update();
    }
    return this;
  }
}
