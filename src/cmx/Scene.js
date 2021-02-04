import { namespace as d3Namespace, select as d3Select } from 'd3-selection';

import Drawable from './Drawable';
import Renderer from './Renderer';
import Overlay from './Overlay';
import Gizmo from './Gizmo';

export default class Scene extends Drawable {
  static initClass() {
    this.prototype.announceUpdate = _.throttle(
      this.prototype.triggerUpdateEvent,
      2000
    );
  }

  constructor(cmx, rootElement, width, height, frame, marginX, marginY) {
    super();
    this.setScene(this);

    this.cmx = cmx;
    this.rootElement = rootElement;
    if (width == null) {
      width = 300;
    }
    this.width = width;
    if (height == null) {
      height = 400;
    }
    this.height = height;
    if (frame == null) {
      frame = true;
    }
    this.frame = frame;
    if (marginX == null) {
      marginX = 20;
    }
    this.marginX = marginX;
    if (marginY == null) {
      marginY = 20;
    }
    this.marginY = marginY;

    this.renderer = new Renderer(
      this.rootElement,
      this.width,
      this.height,
      this.marginX,
      this.marginY
    );
    this;
  }

  drawScene() {
    this.renderer._delta_layers.selectAll('g').remove();
    const layers = [
      // from top to bottom
      d3Select(document.createElementNS(d3Namespace('svg').space, 'g')).attr(
        'class',
        'cmx-layer cmx-layer-0'
      ), // special non-zoomable layer, goes on top of frame
      d3Select(document.createElementNS(d3Namespace('svg').space, 'g')).attr(
        'class',
        'cmx-layer cmx-layer-1'
      ),
      d3Select(document.createElementNS(d3Namespace('svg').space, 'g')).attr(
        'class',
        'cmx-layer cmx-layer-2'
      )
    ];

    return (() => {
      const result = [];
      for (
        var start = layers.length - 1, layerId = start, asc = start <= 0;
        asc ? layerId <= 0 : layerId >= 0;
        asc ? layerId++ : layerId--
      ) {
        var _delta_layer;
        if (layerId === 0 && this.frame) {
          const _delta_g = d3Select(
            document.createElementNS(d3Namespace('svg').space, 'g')
          );
          _delta_g.attr('class', 'cmx-layer cmx-layer-frame');
          _delta_layer = _delta_g.append('g');
          _delta_layer.attr('class', 'cmx-pseudo-entity cmx-frame');
          this.renderer._delta_layers
            .node()
            .appendChild(_delta_layer.node().parentNode);
          this.drawFrame(_delta_layer);
        }

        _delta_layer = layers[layerId];
        this.renderer._delta_layers.node().appendChild(_delta_layer.node());

        result.push(
          (() => {
            const result1 = [];
            for (let view of Array.from(this.subviews)) {
              const _delta_entity = d3Select(
                document.createElementNS(d3Namespace('svg').space, 'g')
              ).attr('class', 'cmx-entity-tree');
              _delta_layer.node().appendChild(_delta_entity.node());
              view.draw(layerId);
              result1.push(this.renderer.draw(_delta_entity));
            }
            return result1;
          })()
        );
      }
      return result;
    })();
  }

  triggerUpdateEvent() {
    return $(this.rootElement).trigger('cmx:updated');
  }

  buildGizmos() {
    this.overlay = new Overlay(
      this.rootElement,
      this.width,
      this.height,
      this.marginX,
      this.marginY
    );

    super.buildGizmos(this.overlay._delta_gizmos);

    return this.renderer._delta_layers
      .selectAll('.cmx-entity')
      .on('click', function (event) {
        const gizmo = __guard__(
          this.cmx != null ? this.cmx.entity : undefined,
          (x) => x.gizmo
        );
        if (gizmo) {
          gizmo.select();
          return event.stopPropagation();
        }
      });
  }

  drawFrame(_delta_where) {
    const thickness = 0;

    const frame = [
      [thickness, thickness],
      [this.width - thickness, thickness],
      [this.width - thickness, this.height - thickness],
      [thickness, this.height - thickness],
      [thickness, thickness]
    ];
    this.renderer.line(frame);
    return this.renderer.draw(_delta_where);
  }
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
