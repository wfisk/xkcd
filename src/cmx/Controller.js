import { select as d3Select } from 'd3-selection';

import Gizmo from './Gizmo';
import { d3Parents } from './edit_scripts/d3ext';
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

      // $(scene.rootElement).addClass('cmx-editable');
      const el = document.querySelector(scene.rootElement);
      el.classList.add('cmx-editable');
    }

    // $('html').bind('click', (event) => {
    document.addEventListener('click', (event) => {
      const parents = d3Parents(d3Select(event.target), 'cmx-selected');

      // if (d3.select(event.target).parents('cmx-selected').length > 0) {
      if (parents.length > 0) {
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

    // $('.cmx-has-selected-gizmo').removeClass('cmx-has-selected-gizmo');
    document
      .querySelectorAdd('.cmx-has-selected-gizmo')
      .forEach((it) => it.classList.remove('cmx-has-selected-gizmo'));

    // return $('html').removeClass('cmx-active-selection');
    return document.body.classList.remove('cmx-active-selection');
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
