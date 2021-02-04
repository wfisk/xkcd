import { select as d3Select } from 'd3-selection';

import Gizmo from '../Gizmo';

const MARKER_POS = 0;
const MARKER_ROT = 1;
const MARKER_SX = 2;
const MARKER_SY = 3;
const MARKER_SQ = 4;

export default class EntityGizmo extends Gizmo {
  constructor() {
    this.entityMarkers = [
      { kind: 'pos', val: [0, 0] },
      { kind: 'rot', val: 0 },
      { kind: 'sx', val: 1 },
      { kind: 'sy', val: 1 },
      { kind: 'sq', val: 0 }
    ];

    super(...arguments);
  }

  markerPosition(marker) {
    switch (marker.kind) {
      case 'pos':
        return { x: 0, y: 0 };
      case 'rot':
        return { x: 15, y: 15 };
      case 'sx':
        return { x: 10, y: 0 };
      case 'sy':
        return { x: 0, y: 10 };
      case 'sq':
        return { x: marker.val, y: -10 };
      default:
        throw 'unknown marker';
    }
  }

  decomposeFrame(frame) {
    const t = getTransformation(frame);

    this.entityMarkers[MARKER_POS].val[0] = t.translateX;
    this.entityMarkers[MARKER_POS].val[1] = t.translateY;
    this.entityMarkers[MARKER_ROT].val = t.rotate;
    this.entityMarkers[MARKER_SX].val = t.scaleX;
    this.entityMarkers[MARKER_SY].val = t.scaleY;

    return (this.entityMarkers[MARKER_SQ].val = t.skew);
  }

  composeFrame() {
    const round = function (v, p) {
      if (p == null) {
        p = 1;
      }
      return Math.round(v * p) / p;
    };

    const t = getTransformation('');
    t.translateX = round(this.entityMarkers[MARKER_POS].val[0]);
    t.translateY = round(this.entityMarkers[MARKER_POS].val[1]);
    t.rotate = round(this.entityMarkers[MARKER_ROT].val);
    t.scaleX = round(this.entityMarkers[MARKER_SX].val, 100);
    t.scaleY = round(this.entityMarkers[MARKER_SY].val, 100);
    t.skew = round(this.entityMarkers[MARKER_SQ].val);

    return transformationToString(t);
  }

  update() {
    if (this._delta_entityGizmo != null) {
      this._delta_entityGizmo
        .attr('transform', this.entity.getEffectiveFrame())
        .selectAll('.cmx-marker')
        .attr('transform', (marker) => {
          const pos = this.markerPosition(marker);
          return `translate(${pos.x},${pos.y})`;
        });
    }
    return this;
  }

  build(root) {
    const base = super.build(...arguments);

    this._delta_entityGizmo = base
      .append('g')
      .attr('class', 'cmx-gizmo cmx-entity');

    const doubleClick = (marker) => {
      d3.event.preventDefault();

      switch (marker.kind) {
        case 'pos':
          marker.val = [0, 0];
          break;
        case 'rot':
          marker.val = 0;
          break;
        case 'sx':
          marker.val = 1;
          break;
        case 'sy':
          marker.val = 1;
          break;
        case 'sq':
          marker.val = 0;
          break;
      }

      this.entity.setFrame(this.composeFrame());
      return this.entity.throttledUpdate();
    };

    const drag = d3.behavior
      .drag()
      .base((target) => target.parentNode.parentNode)
      .on('dragstart', (bone) => {
        this.controlUndoOpen('frame');
        return this.controlDragStart(bone);
      })
      .on('dragend', (bone) => {
        this.controlDragEnd(bone);
        return this.controlUndoClose();
      })
      .on('drag', (marker) => {
        this.decomposeFrame(this.entity.getFrame());
        switch (marker.kind) {
          case 'pos':
            marker.val[0] += d3.event.dx;
            marker.val[1] += d3.event.dy;
            break;
          case 'rot':
            marker.val += d3.event.dx + d3.event.dy;
            break;
          case 'sx':
            marker.val += d3.event.dx * 0.1;
            break;
          case 'sy':
            marker.val += d3.event.dy * 0.1;
            break;
          case 'sq':
            marker.val += d3.event.dx;
            break;
        }
        this.entity.setFrame(this.composeFrame());
        return this.entity.throttledUpdate();
      });

    const renderMarker = function (marker) {
      const _delta_ = d3Select(this);

      const appendRect = (_delta_, x, y, w, h) =>
        _delta_
          .append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', w)
          .attr('height', h);

      const appendLine = (_delta_, x1, y1, x2, y2) =>
        _delta_
          .append('line')
          .attr('x1', x1)
          .attr('y1', y1)
          .attr('x2', x2)
          .attr('y2', y2);

      if (marker.kind !== 'rot') {
        appendRect(_delta_, -5, -5, 10, 10);
      }

      switch (marker.kind) {
        case 'pos': // draw cross
          appendLine(_delta_, -5, 0, 5, 0);
          return appendLine(_delta_, 0, -5, 0, 5);
        case 'rot': // draw arc with double arrows
          appendRect(_delta_, -10, -10, 15, 15);
          return _delta_
            .append('path')
            .attr('transform', 'translate(-8, -8)')
            .attr('d', 'M0,10 A10 10,0,0,0,10 0');
        case 'sx': // draw line with arrow
          return appendLine(_delta_, -5, 0, 5, 0);
        case 'sy': // draw line with arrow
          return appendLine(_delta_, 0, -5, 0, 5);
        case 'sq': // draw line with double arrows
          return appendLine(_delta_, -5, 0, 5, 0);
      }
    };

    const selection = this._delta_entityGizmo
      .selectAll('.cmx-marker')
      .data(this.entityMarkers)
      .enter()
      .append('g')
      .attr('class', (marker) => `cmx-control cmx-marker cmx-${marker.kind}`)
      .on('dblclick', doubleClick)
      .call(drag);
    selection.each(renderMarker);

    return this._delta_entityGizmo;
  }

  // see https://stackoverflow.com/questions/38224875/replacing-d3-transform-in-d3-v4
  getTransformation(transform) {
    // Create a dummy g for calculation purposes only. This will never
    // be appended to the DOM and will be discarded once this function
    // returns.
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Set the transform attribute to the provided string value.
    g.setAttributeNS(null, 'transform', transform);

    // consolidate the SVGTransformList containing all transformations
    // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
    // its SVGMatrix.
    var matrix = g.transform.baseVal.consolidate().matrix;

    // Below calculations are taken and adapted from the private function
    // transform/decompose.js of D3's module d3-interpolate.
    var { a, b, c, d, e, f } = matrix; // ES6, if this doesn't work, use below assignment
    // var a=matrix.a, b=matrix.b, c=matrix.c, d=matrix.d, e=matrix.e, f=matrix.f; // ES5
    var scaleX, scaleY, skewX;
    if ((scaleX = Math.sqrt(a * a + b * b))) (a /= scaleX), (b /= scaleX);
    if ((skewX = a * c + b * d)) (c -= a * skewX), (d -= b * skewX);
    if ((scaleY = Math.sqrt(c * c + d * d)))
      (c /= scaleY), (d /= scaleY), (skewX /= scaleY);
    if (a * d < b * c) (a = -a), (b = -b), (skewX = -skewX), (scaleX = -scaleX);
    return {
      translateX: e,
      translateY: f,
      rotate: (Math.atan2(b, a) * 180) / Math.PI,
      skewX: (Math.atan(skewX) * 180) / Math.PI,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  transformationToString(t) {
    result = '';

    t.translateX = t.translateX ? t.translateX : 0;
    t.translateY = t.translateY ? t.translateY : 0;
    t.scaleX = t.scaleX ? t.scaleX : 0;
    t.scaleY = t.scaleY ? t.scaleY : 0;

    if (t.translateX || t.translateY) {
      result = `${result} translate(${t.translateX},${t.translateY})`;
    }

    if (t.rotate) {
      result = `${result} rotate(${t.rotate})`;
    }

    if (t.skewX) {
      result = `${result} skewX(${t.skewX})`;
    }

    if (t.scaleX || t.scaleY) {
      result = `${result} scale(${t.scaleX},${t.scaleY})`;
    }

    return result;
  }
}
