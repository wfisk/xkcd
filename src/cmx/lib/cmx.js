/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
define([
  'cmx/controller',
  'cmx/model',
  'cmx/view',
  'cmx/drawable',
  'cmx/xkcd',
  'cmx/bone',
  'cmx/skelet',
  'cmx/scene',
  'cmx/entity',
  'cmx/gizmo',
  'cmx/renderer',
  'cmx/overlay',
  'cmx/parser',
  'cmx/entities/actor',
  'cmx/entities/bubble',
  'cmx/entities/drawing',
  'cmx/entities/label',
  'cmx/gizmos/entity_gizmo',
  'cmx/gizmos/actor_gizmo',
  'cmx/gizmos/bubble_gizmo',
  'cmx/gizmos/drawing_gizmo',
  'cmx/gizmos/label_gizmo',
  'cmx/models/scene_model',
  'cmx/models/actor_model',
  'cmx/models/bubble_model',
  'cmx/models/drawing_model',
  'cmx/models/label_model'
], function(...classes) {

  // build CMX instance...
  const cmx = new (classes[0]); // Controller
  // mix all constructors into cmx
  for (let klass of Array.from(classes)) {
    cmx[klass.name] = klass;
  }
  return cmx;
});