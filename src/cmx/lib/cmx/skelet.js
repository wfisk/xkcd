/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import Bone from './Bone';

export default class Skelet {
  constructor(bonedefs) {
    if (bonedefs == null) {
      bonedefs = [];
    }
    this.bones = [];
    this.addBones(bonedefs);

    this.structure = {};
  }

  addBones(bonedefs) {
    if (bonedefs == null) {
      bonedefs = [];
    }
    const list = [];
    for (let args of Array.from(bonedefs)) {
      this.bones.push(new Bone(...Array.from(args || [])));
      list.push(this.bones.length - 1);
    } // push bone index
    return list;
  }

  addStructure(defs) {
    if (defs == null) {
      defs = {};
    }
    return (() => {
      const result = [];
      for (let arg in defs) {
        const val = defs[arg];
        result.push((this.structure[arg] = val));
      }
      return result;
    })();
  }

  boneIndex(name) {
    for (let i = 0; i < this.bones.length; i++) {
      const bone = this.bones[i];
      if (name === bone.name) {
        return i;
      }
    }
    return null;
  }

  bone(name) {
    const index = this.boneIndex(name);
    return this.bones[index];
  }

  bonesWithIndices(boneIndices) {
    return boneIndices.map((index) => {
      return this.bones[index];
    });
  }

  moveBone(boneNames, dx, dy, absolute) {
    if (absolute == null) {
      absolute = false;
    }
    if (!_.isArray(boneNames)) {
      boneNames = [boneNames];
    }

    return (() => {
      const result = [];
      for (var boneName of Array.from(boneNames)) {
        var bone = this.boneIndex(boneName);

        dx = Math.round(dx);
        dy = Math.round(dy);

        var mx = this.bones[bone].x;
        var my = this.bones[bone].y;

        if (absolute) {
          this.bones[bone].x = dx;
          this.bones[bone].y = dy;
        } else {
          this.bones[bone].x += dx;
          this.bones[bone].y += dy;
        }

        mx -= this.bones[bone].x;
        my -= this.bones[bone].y;

        var affectedBones = this.affectedBones(boneName, false);
        result.push(
          (() => {
            const result1 = [];
            for (boneName of Array.from(affectedBones)) {
              bone = this.boneIndex(boneName);

              this.bones[bone].x -= mx;
              result1.push((this.bones[bone].y -= my));
            }
            return result1;
          })()
        );
      }
      return result;
    })();
  }

  affectedBones(boneNames, addSelf) {
    if (addSelf == null) {
      addSelf = true;
    }
    if (!_.isArray(boneNames)) {
      boneNames = [boneNames];
    }

    let res = [];
    for (let boneName of Array.from(boneNames)) {
      const a = this.structure[boneName];
      if (a) {
        res = res.concat(a);
      }
    }

    if (addSelf) {
      res.concat(boneNames);
    }
    return _.uniq(res);
  }

  getPose(boneIndices) {
    const pose = [];
    for (let boneIndex of Array.from(boneIndices)) {
      const bone = this.bones[boneIndex];
      if (!bone) {
        continue;
      }
      pose.push([bone.x, bone.y]);
    }
    return pose;
  }

  setPose(pose, boneIndices) {
    return (() => {
      const result = [];
      for (let i = 0; i < pose.length; i++) {
        const point = pose[i];
        const index = boneIndices[i];
        if (index === undefined) {
          continue;
        }
        if (index >= this.bones.length) {
          continue;
        }
        this.bones[index].x = point[0];
        result.push((this.bones[index].y = point[1]));
      }
      return result;
    })();
  }
}
