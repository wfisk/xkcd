/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
define(['cmx/model', 'cmx/scene'], function(Model, Scene) {

  let SceneModel;
  return SceneModel = class SceneModel extends Model {

    constructor() {
      this.defaults = {
        "width": [250, "int"],
        "height": [350, "int"],
        "frame": [true, "bool"],
        "margin-x": [10, "int"],
        "margin-y": [20, "int"]
      };

      super(...arguments);
    }

    applyDefaults(props) {
      super.applyDefaults(...arguments);

      if (props["margin"] !== undefined) {
        props["margin-x"] = props["margin"];
        props["margin-y"] = props["margin"];
      }

      return props;
    }

    materialize($where) {
      const $wrapper = $("<div/>").attr('class', 'cmx-scene');
      const id = $(this.source).attr("id");
      if (id) { $wrapper.addClass(`cmx-user-${id}`); }
      $where.after($wrapper);

      const scene = new Scene(this.cmx, $wrapper.get(0), this.props["width"], this.props["height"], this.props["frame"], this.props["margin-x"], this.props["margin-y"]);
      super.materialize(scene);
      scene.drawScene();
      return scene;
    }
  };
});
