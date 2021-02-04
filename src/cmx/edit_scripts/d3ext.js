import { select as d3Select } from 'd3-selection';

// export function d3ext() {
//   d3.selection.prototype.parents = function (selector) {
//     const res = [];
//     let p = this.node();
//     while ((p = p.parentNode)) {
//       var klass;
//       try {
//         klass = d3.select(p).attr('class');
//       } catch (e) {}

//       if (!klass) {
//         continue;
//       }
//       const items = klass.split(' ');
//       if (Array.from(items).includes(selector)) {
//         res.push(p);
//       }
//     }
//   };
// }

export function d3Parents(selection, selector) {
  const result = [];
  let p = selection.node();
  while ((p = p.parentNode)) {
    var klass;
    try {
      klass = d3Select(p).attr('class');
    } catch (e) {}

    if (!klass) {
      continue;
    }
    const items = klass.split(' ');
    if (Array.from(items).includes(selector)) {
      result.push(p);
    }
  }
  return result;
}
