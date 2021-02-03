/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

let EntityGizmo;
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
    const t = d3.transform(frame);
    this.entityMarkers[MARKER_POS].val[0] = t.translate[0];
    this.entityMarkers[MARKER_POS].val[1] = t.translate[1];
    this.entityMarkers[MARKER_ROT].val = t.rotate;
    this.entityMarkers[MARKER_SX].val = t.scale[0];
    this.entityMarkers[MARKER_SY].val = t.scale[1];
    return (this.entityMarkers[MARKER_SQ].val = t.skew);
  }

  composeFrame() {
    const round = function (v, p) {
      if (p == null) {
        p = 1;
      }
      return Math.round(v * p) / p;
    };

    const t = d3.transform();
    t.translate[0] = round(this.entityMarkers[MARKER_POS].val[0]);
    t.translate[1] = round(this.entityMarkers[MARKER_POS].val[1]);
    t.rotate = round(this.entityMarkers[MARKER_ROT].val);
    t.scale[0] = round(this.entityMarkers[MARKER_SX].val, 100);
    t.scale[1] = round(this.entityMarkers[MARKER_SY].val, 100);
    t.skew = round(this.entityMarkers[MARKER_SQ].val);
    return t.toString();
  }

  update() {
    if (this.ΔentityGizmo != null) {
      this.ΔentityGizmo
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

    this.ΔentityGizmo = base.append('g').attr('class', 'cmx-gizmo cmx-entity');

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
      const Δ = d3.select(this);

      const appendRect = (Δ, x, y, w, h) =>
        Δ
          .append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', w)
          .attr('height', h);

      const appendLine = (Δ, x1, y1, x2, y2) =>
        Δ
          .append('line')
          .attr('x1', x1)
          .attr('y1', y1)
          .attr('x2', x2)
          .attr('y2', y2);

      if (marker.kind !== 'rot') {
        appendRect(Δ, -5, -5, 10, 10);
      }

      switch (marker.kind) {
        case 'pos': // draw cross
          appendLine(Δ, -5, 0, 5, 0);
          return appendLine(Δ, 0, -5, 0, 5);
        case 'rot': // draw arc with double arrows
          appendRect(Δ, -10, -10, 15, 15);
          return Δ
            .append('path')
            .attr('transform', 'translate(-8, -8)')
            .attr('d', 'M0,10 A10 10,0,0,0,10 0');
        case 'sx': // draw line with arrow
          return appendLine(Δ, -5, 0, 5, 0);
        case 'sy': // draw line with arrow
          return appendLine(Δ, 0, -5, 0, 5);
        case 'sq': // draw line with double arrows
          return appendLine(Δ, -5, 0, 5, 0);
      }
    };

    const selection = this.ΔentityGizmo
      .selectAll('.cmx-marker')
      .data(this.entityMarkers)
      .enter()
      .append('g')
      .attr('class', (marker) => `cmx-control cmx-marker cmx-${marker.kind}`)
      .on('dblclick', doubleClick)
      .call(drag);
    selection.each(renderMarker);

    return this.ΔentityGizmo;
  }
}
