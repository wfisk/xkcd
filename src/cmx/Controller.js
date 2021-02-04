/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import Gizmo from './Gizmo';

let instanceNumber = 0;

export default class Controller {
  constructor(scenes) {
    if (scenes == null) {
      scenes = [];
    }
    this.scenes = scenes;
    this.instanceNumber = ++instanceNumber;
    this.undoStack = [];
    this.redoStack = [];
  }

  makeEditable() {
    for (let sceneModel of Array.from(this.scenes)) {
      const scene = sceneModel.view;
      scene.buildGizmos();
      $(scene.rootElement).addClass('cmx-editable');
    }

    return $('html').bind('click', (event) => {
      if (d3.select(event.target).parents('cmx-selected').length > 0) {
        return;
      }
      return this.unselectAll();
    });
  }

  unselectAll() {
    if (!this.previousSelection) {
      return;
    }
    this.previousSelection.unselect();
    this.previousSelection = undefined;
    $('.cmx-has-selected-gizmo').removeClass('cmx-has-selected-gizmo');
    return $('html').removeClass('cmx-active-selection');
  }

  registerUndo(fn) {
    return this.undoStack.push(fn);
  }

  undo() {
    if (!this.undoStack.length) {
      return;
    }
    const action = this.undoStack.pop();
    return action();
  }

  registerRedo(fn) {
    return this.redoStack.push(fn);
  }

  redo() {
    if (!this.redoStack.length) {
      return;
    }
    const action = this.redoStack.pop();
    return action();
  }
}
