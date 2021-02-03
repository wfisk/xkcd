/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
define(['cmx/model', 'cmx/entities/drawing'], function(Model, Drawing) {

  let DrawingModel;
  const DEFAULT_LAYER = 2;

  return DrawingModel = class DrawingModel extends Model {

    constructor() {
      this.defaults = {
        "t": "",
        "pose": "0,0",
        "drawlist": [[], "array"]
      };

      super(...arguments);
    }

    applyDefaults(props) {
      super.applyDefaults(...arguments);

      // this is our mini-parser for drawing's content
      if (props["content"]) {
        const list = [];
        const $parser = $("<div/>").html(props["content"]);
        $parser.children().each(function() {
          const $command = $(this);

          const collectOpts = function($el) {
            const res = {};
            for (let attr of Array.from($el.get(0).attributes)) {
              const key = attr.name.toLowerCase();
              const val = attr.value;
              res[key] = val;
            }

            return res;
          };

          const layer = parseInt($command.attr("layer") || DEFAULT_LAYER, 10);
          const action = $command.prop('tagName').toLowerCase();

          const cmd = [layer, action];
          switch (action) {
            case 'line':
              var points = [];
              $command.find("point").each(function() {
                const $point = $(this);
                const x = parseInt($point.attr("x") || 0, 10);
                const y = parseInt($point.attr("y") || 0, 10);
                return points.push([x, y]);});
              cmd.push(points);
              break;
          }

          cmd.push(collectOpts($command));

          return list.push(cmd);
        });

        props["drawlist"] = list;
      }

      return props;
    }

    materialize(parent) {
      const o = new Drawing(parent.scene, this.props["drawlist"]);
      o.setFrame(this.props["t"]);
      o.setPose(this.unserializePose(this.props["pose"]));
      parent.add(o);

      return super.materialize(o);
    }

    read() {
      this.props["t"] = this.view.getFrame();
      return this.props["pose"] = this.serializePose(this.view.getPose());
    }
  };
});
