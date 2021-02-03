/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
export default class Bone {
  constructor(name, x, y, type) {
    this.name = name;
    this.x = x;
    this.y = y;
    if (type == null) {
      type = '';
    }
    this.type = type;
  }
}
