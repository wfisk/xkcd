/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
export default class View {
  constructor(scene) {
    this.scene = scene;
    this.subviews = [];
  }

  add(view) {
    view.parentView = this;
    this.subviews.push(view);
    return view;
  }
}
