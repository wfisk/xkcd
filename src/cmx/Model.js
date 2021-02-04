import _ from 'lodash';

export default class Model {
  constructor(cmx, defaults) {
    this.cmx = cmx;
    this.defaults = defaults;
    this.children = [];
    this.props =
      typeof this.applyDefaults === 'function'
        ? this.applyDefaults({})
        : undefined;
    this.mutableProps = ['t', 'pose']; // props editable via Gizmo UI
  }

  set(props) {
    // apply defaults
    props =
      typeof this.applyDefaults === 'function'
        ? this.applyDefaults(props)
        : undefined;

    // filter unknown properties
    props = _.pick(props, _.keys(this.defaults));

    // coerce possible string values to known types
    props =
      typeof this.coerceTypes === 'function'
        ? this.coerceTypes(props)
        : undefined;

    // apply to self
    return _.extend(this.props, props);
  }

  // TODO: notification event triggering here?

  unserializePose(poseString) {
    const items = poseString.split('|');
    return items.map((pair) =>
      pair.split(',').map((numString) => parseFloat(numString))
    );
  }

  serializePose(pose) {
    const pairs = pose.map((pair) => pair.join(','));
    return pairs.join('|');
  }

  computeDefaults() {
    const defaults = {};
    for (let key in this.defaults) {
      let val = this.defaults[key];
      if (_.isArray(val)) {
        val = val[0];
      }
      defaults[key] = val;
    }
    return defaults;
  }

  applyDefaults(props) {
    const defaults = this.computeDefaults();
    _.defaults(props, defaults);
    return props;
  }

  coerceTypes(props) {
    const res = {};
    for (let key in props) {
      var val = props[key];
      const def = this.defaults[key];
      if (def === undefined) {
        continue;
      }
      var type = def[1] || 'string';
      res[key] = (() => {
        switch (type) {
          case 's':
          case 'string':
            return '' + val;
          case 'i':
          case 'int':
            return parseInt(val, 10) || 0;
          case 'f':
          case 'float':
            return parseFloat(val) || 0.0;
          case 'a':
          case 'array':
            return val; // TODO: validate array structure
          case 'b':
          case 'bool':
            if (_.isString(val)) {
              return val.match(/^(true|1|yes)$/i) !== null;
            } else {
              return !!val;
            }
          default:
            return val;
        }
      })();
    }

    return res;
  }

  read() {}

  writeProps(props, $source) {
    const defaults = this.computeDefaults();
    return (() => {
      const result = [];
      const object = _.pick(props, this.mutableProps);
      for (let prop in object) {
        const val = object[prop];
        if (val === defaults[prop]) {
          result.push($source.removeAttr(prop));
        } else {
          result.push($source.attr(prop, val));
        }
      }
      return result;
    })();
  }

  serialize() {
    this.read();
    this.writeProps(this.props, $(this.source));

    for (let child of Array.from(this.children)) {
      child.serialize();
    }
    return this;
  }

  materialize(newborn) {
    for (let child of Array.from(this.children)) {
      child.materialize(newborn);
    }
    return (this.view = newborn);
  }

  debugReport(indent, logger) {
    if (indent == null) {
      indent = 0;
    }
    if (logger == null) {
      logger = console;
    }
    const indenting = __range__(0, indent, false)
      .map(() => ' ')
      .join('');
    const displayableProps = _.clone(this.props);
    // collapse content if it is a multi-line string
    if (
      _.isString(displayableProps['content']) &&
      displayableProps['content'].indexOf('\n') !== -1
    ) {
      displayableProps['content'] = '...';
    }
    logger.log(`${indenting}${this.constructor.name}`, displayableProps);

    return Array.from(this.children).map((child) =>
      child.debugReport(indent + 2, logger)
    );
  }
}

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
