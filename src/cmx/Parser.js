import _ from 'lodash';

import ActorModel from './models/ActorModel';
import BubbleModel from './models/BubbleModel';
import DrawingModel from './models/DrawingModel';
import LabelModel from './models/LabelModel';
import SceneModel from './models/SceneModel';

const defaultModels = {};
defaultModels['ActorModel'] = ActorModel;
defaultModels['BubbleModel'] = BubbleModel;
defaultModels['DrawingModel'] = DrawingModel;
defaultModels['LabelModel'] = LabelModel;
defaultModels['SceneModel'] = SceneModel;

export default class Parser {
  constructor(cmx, models) {
    this.cmx = cmx;
    if (models == null) {
      models = defaultModels;
    }
    this.models = models;

    this.elementToCmxModel = new WeakMap();
  }

  createFrame() {
    this.$frame = $('<iframe>', {
      class: 'cmx-parser',
      frameborder: 0,
      style: 'display:none'
    });

    this.$frame.appendTo('body');
    return (this.doc = this.$frame.contents().get(0));
  }

  writeContent(markup) {
    this.doc.open();
    this.doc.write(markup);
    return this.doc.close();
  }

  parseMarkup(markup) {
    this.createFrame();
    this.writeContent(markup);
    return this.parseDoc(this.doc);
  }

  lookupModelClass(modelName) {
    return this.models[`${modelName}Model`];
  }

  collectProps(el) {
    const res = {};

    // special content attribute captures innerHTML
    let content = el.innerHTML;
    if (content) {
      res['content'] = content;
    }

    // attributes may be applied via CSS content property
    // content = _.str.trim( $el.css('content'), " \t\n'");
    content = _.trim(getComputedStyle(el)['content'], " \t\n'");

    if (content && content !== 'none') {
      // Firefox returns "none"
      if (content[0] !== '{') {
        content = `{${content}}`;
      }
      try {
        const params = JSON.parse(content); // TODO: use some non-strict parser for JSON-like data
        // $.extend(res, params);
        Object.assign(res, params);
      } catch (e) {
        // console.error(e);
      }
    }

    // collect native attributes
    for (let attr of Array.from(el.attributes)) {
      const key = attr.name.toLowerCase();
      const val = attr.value;
      res[key] = val;
    }

    return res;
  }

  parseElement(el) {
    // let model = $el.data('cmx-model');
    // let model = el.dataset['cmx-model'];
    let model = this.elementToCmxModel.get(el);

    if (!model) {
      // const tag = _.str.classify( $el.prop('tagName').toLowerCase());
      // const tag = _.str.classify(el.tagName.toLowerCase());

      const tag = _.upperFirst(_.camelCase(el.tagName.toLowerCase()));

      const modelClass = this.lookupModelClass(tag);
      if (!modelClass) {
        // console.error "Unknown cmx tag encountered at ", $el[0]
        return;
      }

      model = new modelClass(this.cmx);
      model.source = el;

      // $el.data('cmx-model', model);
      // el.dataset['cmx-model'] = model;
      this.elementToCmxModel.set(el, model);
    }

    const props = this.collectProps(el);
    model.set(props);
    return model;
  }

  parseDoc(doc) {
    var walk = (el) => {
      const model = this.parseElement(el);

      for (let child of Array.from(el.children)) {
        const childModel = walk(child);
        if (!childModel) {
          continue;
        }
        childModel.parent = model;
        model.children.push(childModel);
      }

      return model;
    };

    const res = [];

    // for (let scene of Array.from($doc.find('scene'))) {
    for (let scene of Array.from(doc.querySelectorAll('scene'))) {
      // const $scene = $(scene);
      const sceneModel = walk(scene);
      sceneModel.source = scene;
      res.push(sceneModel);
    }

    this.cmx.scenes = res;
    return res;
  }
}
