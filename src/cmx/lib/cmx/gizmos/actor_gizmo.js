/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
define(['cmx/gizmos/entity_gizmo'], function(EntityGizmo) {

  let ActorGizmo;
  return ActorGizmo = class ActorGizmo extends EntityGizmo {

    update() {
      super.update(...arguments);

      return this.ΔskeletonGizmo != null ? this.ΔskeletonGizmo.selectAll(".cmx-control")
        .attr("cx", bone => bone.x)
        .attr("cy", bone => bone.y)
        .style("display", bone => {
        }) : undefined;
    }

    build() {
      const base = super.build(...arguments);

      this.ΔskeletonGizmo = base.append("g").attr("class", "cmx-gizmo cmx-actor");

      const alignBone = bone => {
        let ud;
        if (bone.name === 'LLEG') { ud = this.entity.legs[0]; }
        if (bone.name === 'RLEG') { ud = this.entity.legs[1]; }
        if (bone.name === 'LARM') { ud = this.entity.arms[0]; }
        if (bone.name === 'RARM') { ud = this.entity.arms[1]; }
        const a = this.entity.skelet.bone(ud[0]);
        const b = this.entity.skelet.bone(ud[2]);
        bone.x = Math.round((a.x + b.x) / 2);
        bone.y = Math.round((a.y + b.y) / 2);
        return this.entity.update();
      };

      const resetBone = bone => {
        this.entity.skelet.moveBone(bone.name, 0, 0, true);
        return this.entity.throttledUpdate();
      };

      const doubleClick = bone => {
        d3.event.preventDefault();
        if (bone.type === "l") { return alignBone(bone); }
        if (bone.name === 'HNDL') { return resetBone(bone); }
      };

      const drag = d3.behavior.drag()
        .on("dragstart", bone => {
          this.controlUndoOpen("pose");
          return this.controlDragStart(bone);
      }).on("dragend", bone => {
          this.controlDragEnd(bone);
          return this.controlUndoClose();
        }).on("drag", bone => {
          this.entity.skelet.moveBone(bone.name, d3.event.dx, d3.event.dy, false);
          return this.entity.throttledUpdate();
      });

      const data = this.entity.skelet.bonesWithIndices(this.entity.actorBones);
      this.ΔskeletonGizmo.selectAll(".cmx-control")
        .data(data)
        .enter()
          .append("circle")
            .attr("class", bone => `cmx-control cmx-${bone.type}`)
            .attr("r", this.CONTROL_POINT_RADIUS)
            .on("dblclick", doubleClick)
            .call(drag);

      return this.ΔskeletonGizmo;
    }
  };
});