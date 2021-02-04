/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import Drawable from './Drawable';

// cached values between controlUndoOpen - controlUndoClose
let initialUndoValue = undefined;
let undoEval = undefined;

export default class Gizmo extends Drawable {
  static CONTROL_POINT_RADIUS = 3;

  constructor(entity, root) {
    this.entity = entity;
    super();
    this.setScene(this.entity.scene);
    this.entity.gizmo = this;
    this.leafGizmo = this.build(root);
  }

  build(root) {
    return (this._delta_rootGizmo = root
      .append('g')
      .attr('class', 'cmx-gizmo root'));
  }

  controlDragStart(bone) {
    $(this.scene.rootElement).addClass('cmx-something-is-being-dragged');
    this.entity.highlightBones(
      this._delta_skeletonGizmo,
      this.entity.skelet.affectedBones(bone.name)
    );
    return $('html').addClass('cmx-force-move-cursor');
  }

  controlDragEnd(bone) {
    $(this.scene.rootElement).removeClass('cmx-something-is-being-dragged');
    this.entity.unhighlightBones(this._delta_skeletonGizmo);
    return $('html').removeClass('cmx-force-move-cursor');
  }

  controlUndoOpen(what, ...params) {
    const getter = 'get' + _.upperFirst(_.camelCase(what));
    const setter = 'set' + _.upperFirst(_.camelCase(what));

    undoEval = (val) => {
      if (val) {
        return this.entity[setter].call(this.entity, val);
      } else {
        return this.entity[getter].apply(this.entity, params);
      }
    };

    return (initialUndoValue = undoEval());
  }

  controlUndoClose() {
    const finalUndoValue = undoEval();
    return ((original, modified, evaluator) => {
      var action = () => {
        evaluator(original);
        this.entity.throttledUpdate();
        return this.scene.cmx.registerRedo(() => {
          evaluator(modified);
          this.entity.throttledUpdate();
          return this.scene.cmx.registerUndo(action);
        });
      };
      return this.scene.cmx.registerUndo(action);
    })(initialUndoValue, finalUndoValue, undoEval);
  }

  unselect() {
    this._delta_entityGizmo.classed('cmx-selected', false);
    return this._delta_entityGizmo
      .select('.cmx-force-unselected')
      .classed('cmx-force-unselected', false);
  }

  select() {
    this.scene.cmx.unselectAll();
    this._delta_entityGizmo.classed('cmx-selected', true);
    this._delta_entityGizmo
      .select('.root')
      .classed('cmx-force-unselected', true);
    $(this.scene.rootElement).addClass('cmx-has-selected-gizmo');
    $('html').addClass('cmx-active-selection');
    return (this.scene.cmx.previousSelection = this);
  }
}
