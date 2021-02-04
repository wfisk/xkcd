/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

export default function d3ext() {
  return function () {
    d3.selection.prototype.parents = function (selector) {
      const res = [];
      let p = this.node();
      while ((p = p.parentNode)) {
        var klass;
        try {
          klass = d3.select(p).attr('class');
        } catch (e) {}

        if (!klass) {
          continue;
        }
        const items = klass.split(' ');
        if (Array.from(items).includes(selector)) {
          res.push(p);
        }
      }

      export default res;
    };
  };
}
