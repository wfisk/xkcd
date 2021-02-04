/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import Xkcd from './XKCD';

// magic evaluator
const ξ = function (thing, fn) {
  let lastVal = undefined;
  return function () {
    let val = thing;
    while (_.isFunction(val)) {
      val = val();
    }
    if (_.isEqual(val, lastVal)) {
      return val;
    }
    if (typeof fn === 'function') {
      fn(val);
    }
    return (lastVal = val);
  };
};

// execute a render call (call properties are bound to this)
var render = function (Δroot, back, Δbefore) {
  if (back == null) {
    back = false;
  }
  if (!this.updaters) {
    this.updaters = [];
  }

  // dynamic props can be updated later via update() call
  const dynamic = (prop, updater) => {
    if (prop === undefined) {
      return;
    }
    const evaluator = ξ(prop, updater);
    this.updaters.push(evaluator);
    return evaluator;
  };

  if (this.type === 'close group') {
    return d3.select(Δroot.node().parentNode);
  }

  let Δel = Δroot;
  if (Δbefore) {
    Δel = Δel.insert('g', Δbefore);
  }
  Δel = Δel.append('g');
  if (this['class']) {
    Δel.attr('class', this['class']);
  }
  if (this['data']) {
    Δel.property('cmx', this['data']);
  }
  dynamic(this['t'], function (val) {
    if (val) {
      return Δel.attr('transform', val);
    }
  });

  // grouping
  if (this.type === 'open group') {
    return Δel;
  }

  // render text
  if (this.type === 'text') {
    let Δtext;
    Δel = Δel.append('g').attr('transform', 'scale(1, -1)'); // flip y
    if (back) {
      Δtext = Δel.append('text').attr('class', 'cmx-text');
      const textUpdater = dynamic(this['text'], (val) => Δtext.html(val));
      dynamic(this['stroke-width'], function (val) {
        if (val) {
          return Δtext.style('stroke-width', val);
        }
      });
      dynamic(this['bgcolor'], function (val) {
        if (val) {
          return Δtext.style('stroke', val);
        }
      });

      if (this['border']) {
        textUpdater(); // this is needed for getBBox call
        const bbox = Δtext.node().getBBox();
        const ex = this['border-extrude-x'] || 8;
        const ey = this['border-extrude-y'] || 3;
        const polyline = {
          type: 'polyline',
          points: [
            [bbox.x - ex, bbox.y - ey],
            [bbox.x + bbox.width + ex, bbox.y - ey],
            [bbox.x + bbox.width + ex, bbox.y + bbox.height + ey],
            [bbox.x - ex, bbox.y + bbox.height + ey]
          ],
          class: 'cmx-text-border',
          fill: this['border-fill'],
          'stroke-width': this['border-stroke-width'],
          stroke: this['border-stroke'],
          bgcolor: this['border-bgcolor'],
          closed: true
        };
        render.call(polyline, Δel);
        this.updaters.push(() =>
          Array.from(polyline.updaters).map((updater) => updater())
        );
      }
    } else {
      // front
      Δtext = Δel.append('text').attr('class', 'cmx-text');
      dynamic(this['text'], (val) => Δtext.html(val));
    }
    return Δroot;
  }

  // render polyline
  const xl = this['xl'] || [0, 200];
  const yl = this['yl'] || [0, 200];
  const line = this['line'] || d3.svg.line();
  const magnitude = this['magnitude'] || 0.003;

  const xkcd = new XKCD();

  const xkcdInterpolator = (pts) => {
    let res = xkcd.render(pts, xl, yl, magnitude);
    if (this['fill'] || this.closed) {
      res += 'Z';
    }
    return res;
  };

  const backInterpolator = (pts) => {
    // two decimal places "should be enough for everyone"
    const r = (num) => Math.round(num * 100) / 100;
    const result = pts.map((d) => [r(d[0]), r(d[1])]);
    return result.join('L');
  };

  const Δpath = Δel.append('path').attr('class', 'cmx-path');
  dynamic(this['fill'], function (val) {
    if (val) {
      return Δpath.style('fill', val);
    }
  });
  if (back) {
    dynamic(this['back-stroke-width'], function (val) {
      if (val) {
        return Δpath.style('stroke-width', val);
      }
    });
    dynamic(this['back-stroke'], function (val) {
      if (val) {
        return Δpath.style('stroke', val);
      }
    });
    dynamic(this['points'], (val) =>
      Δpath.attr('d', line.interpolate(backInterpolator)(val))
    );
  } else {
    dynamic(this['stroke-width'], function (val) {
      if (val) {
        return Δpath.style('stroke-width', val);
      }
    });
    dynamic(this['stroke'], function (val) {
      if (val) {
        return Δpath.style('stroke', val);
      }
    });
    dynamic(this['points'], (val) =>
      Δpath.attr('d', line.interpolate(xkcdInterpolator)(val))
    );
  }

  return Δroot;
};

export default class Renderer {
  constructor(root, width, height, marginX, marginY) {
    this.width = width;
    this.height = height;
    if (marginX == null) {
      marginX = 20;
    }
    this.marginX = marginX;
    if (marginY == null) {
      marginY = 20;
    }
    this.marginY = marginY;
    this.calls = [];
    const fullWidth = this.width + 2 * this.marginX;
    const fullHeight = this.height + 2 * this.marginY;

    this.Δsvg = d3.select(root).append('svg').attr('class', 'cmx-canvas');
    this.Δsvg.attr('width', fullWidth).attr('height', fullHeight); // svg canvas
    this.Δel = this.Δsvg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.marginX + ', ' + this.marginY + ')'
      ) // implement margin
      .append('g')
      .attr('transform', 'translate(0, ' + this.height + ') scale(1, -1)'); // flip y
    this.Δlayers = this.Δel.append('g').attr('class', 'cmx-layers');
  }

  draw(Δelement) {
    let item;
    if (!Δelement) {
      Δelement = this.Δlayers.append('g').attr('class', 'static');
    }

    // draw background line
    let Δ = Δelement.append('g').attr('class', 'cmx-back');
    for (item of Array.from(this.calls)) {
      Δ = render.call(item, Δ, true);
    }

    // draw foreground line
    Δ = Δelement.append('g').attr('class', 'cmx-front');
    for (item of Array.from(this.calls)) {
      Δ = render.call(item, Δ, false);
    }

    // collect all updaters and wrap them into one updater() function
    for (item of Array.from(this.calls)) {
      item.update = function () {
        if (!this.updaters) {
          return;
        }
        return Array.from(this.updaters).map((update) => update());
      };
    }

    // call initial update on all items
    for (item of Array.from(this.calls)) {
      item.update();
    }

    // empty the queue
    this.calls = [];

    return Δelement;
  }

  pushCall(type, opts) {
    if (opts == null) {
      opts = {};
    }
    opts['type'] = type;
    this.calls.push(opts);
    return opts;
  }

  openGroup(opts) {
    if (opts == null) {
      opts = {};
    }
    return this.pushCall('open group', opts);
  }

  closeGroup(opts) {
    if (opts == null) {
      opts = {};
    }
    return this.pushCall('close group', opts);
  }

  text(text, opts) {
    if (opts == null) {
      opts = {};
    }
    opts['text'] = text;
    return this.pushCall('text', opts);
  }

  line(points, opts) {
    if (opts == null) {
      opts = {};
    }
    opts['points'] = points;
    return this.pushCall('polyline', opts);
  }

  circle(radius, opts) {
    if (opts == null) {
      opts = {};
    }
    const N = opts['N'] || 20;
    const R = opts['radians'] || 2 * Math.PI;
    const angle = d3.scale
      .linear()
      .domain([0, N - 1])
      .range([0, R]);
    const l = d3.svg.line
      .radial()
      .interpolate('basis')
      .tension(0)
      .radius(radius)
      .angle((d, i) => angle(i));
    return this.path(l(d3.range(N)), opts);
  }

  path(spec, opts) {
    if (opts == null) {
      opts = {};
    }
    const lazyEvaluation = () => {
      let lastPoints;
      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      d3.select(path).attr('d', spec);

      // sample the path
      const len = path.getTotalLength();
      const points = [];

      const delta = 1.0;
      let t = 0.0;
      while (t < len) {
        const p = path.getPointAtLength(t);
        points.push([p.x, p.y]);
        t += delta;
      }

      const p1 = path.getPointAtLength(len);
      points.push([p1.x, p1.y]);

      // reduce points
      const precision = 10 * (Math.PI / 180); // 10 degrees tollerance
      const minLen = 0.1;

      const norm = function (v) {
        const l = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        if (l < minLen) {
          return;
        }
        return [v[0] / l, v[1] / l];
      };

      const flat = function (a, m, b) {
        const va = norm([m[0] - a[0], m[1] - a[1]]);
        const vb = norm([m[0] - b[0], m[1] - b[1]]);
        if (!va || !vb) {
          return true;
        }
        let dot = va[0] * vb[0] + va[1] * vb[1];
        if (dot > 1.0) {
          dot = 1.0;
        }
        if (dot < -1.0) {
          dot = -1.0;
        }
        const angle = Math.acos(dot);
        return Math.abs(angle - Math.PI) < precision;
      };

      const points2 = [points[0]];
      let i = 1;
      while (i < points.length - 1) {
        const left = points2[points2.length - 1];
        const mid = points[i];
        const right = points[i + 1];
        if (!flat(left, mid, right)) {
          points2.push(mid);
        }
        i++;
      }

      // add last point
      points2.push(points[points.length - 1]);
      // reduce last 3 points
      if (points2.length >= 3) {
        if (
          flat(
            points2[points2.length - 3],
            points2[points2.length - 2],
            points2[points2.length - 1]
          )
        ) {
          points2.splice(points2.length - 2, 1);
        }
      }

      return (lastPoints = points2);
    };

    return this.line(lazyEvaluation, opts);
  }
}
