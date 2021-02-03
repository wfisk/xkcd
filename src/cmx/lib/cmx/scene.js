/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
define(['cmx/drawable', 'cmx/renderer', 'cmx/overlay', 'cmx/gizmo'], function(Drawable, Renderer, Overlay, Gizmo) {

  let Scene;
  return Scene = (function() {
    Scene = class Scene extends Drawable {
      static initClass() {
  
        this.prototype.announceUpdate = _.throttle(this.prototype.triggerUpdateEvent, 2000);
      }

      constructor(cmx, rootElement, width, height, frame, marginX, marginY) {
        this.cmx = cmx;
        this.rootElement = rootElement;
        if (width == null) { width = 300; }
        this.width = width;
        if (height == null) { height = 400; }
        this.height = height;
        if (frame == null) { frame = true; }
        this.frame = frame;
        if (marginX == null) { marginX = 20; }
        this.marginX = marginX;
        if (marginY == null) { marginY = 20; }
        this.marginY = marginY;
        super(this);
        this.renderer = new Renderer(this.rootElement, this.width, this.height, this.marginX, this.marginY);
        this;
      }

      drawScene() {
        this.renderer.Δlayers.selectAll("g").remove();
        const layers = [ // from top to bottom
          d3.select(document.createElementNS(d3.ns.prefix.svg, "g")).attr("class", "cmx-layer cmx-layer-0"), // special non-zoomable layer, goes on top of frame
          d3.select(document.createElementNS(d3.ns.prefix.svg, "g")).attr("class", "cmx-layer cmx-layer-1"),
          d3.select(document.createElementNS(d3.ns.prefix.svg, "g")).attr("class", "cmx-layer cmx-layer-2")
        ];

        return (() => {
          const result = [];
          for (var start = layers.length-1, layerId = start, asc = start <= 0; asc ? layerId <= 0 : layerId >= 0; asc ? layerId++ : layerId--) {
            var Δlayer;
            if ((layerId === 0) && this.frame) {
              const Δg = d3.select(document.createElementNS(d3.ns.prefix.svg, "g"));
              Δg.attr("class", "cmx-layer cmx-layer-frame");
              Δlayer = Δg.append("g");
              Δlayer.attr("class", "cmx-pseudo-entity cmx-frame");
              this.renderer.Δlayers.node().appendChild(Δlayer.node().parentNode);
              this.drawFrame(Δlayer);
            }

            Δlayer = layers[layerId];
            this.renderer.Δlayers.node().appendChild(Δlayer.node());

            result.push((() => {
              const result1 = [];
              for (let view of Array.from(this.subviews)) {
                const Δentity = d3.select(document.createElementNS(d3.ns.prefix.svg, "g")).attr("class", "cmx-entity-tree");
                Δlayer.node().appendChild(Δentity.node());
                view.draw(layerId);
                result1.push(this.renderer.draw(Δentity));
              }
              return result1;
            })());
          }
          return result;
        })();
      }

      triggerUpdateEvent() {
        return $(this.rootElement).trigger("cmx:updated");
      }

      buildGizmos() {
        this.overlay = new Overlay(this.rootElement, this.width, this.height, this.marginX, this.marginY);

        super.buildGizmos(this.overlay.Δgizmos);

        return this.renderer.Δlayers.selectAll(".cmx-entity")
          .on("click", function(event) {
            const gizmo = __guard__(this.cmx != null ? this.cmx.entity : undefined, x => x.gizmo);
            if (gizmo) {
              gizmo.select();
              return d3.event.stopPropagation();
            }
        });
      }


      drawFrame(Δwhere) {
        const thickness = 0;

        const frame = [
          [thickness, thickness],
          [this.width - thickness, thickness],
          [this.width - thickness, this.height - thickness],
          [thickness, this.height - thickness],
          [thickness, thickness]
        ];
        this.renderer.line(frame);
        return this.renderer.draw(Δwhere);
      }
    };
    Scene.initClass();
    return Scene;
  })();
});
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}