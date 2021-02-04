/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// http://stackoverflow.com/a/901144/84283
const getParameterByName = function(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regexS = "[\\?&]" + name + "=([^&#]*)";
  const regex = new RegExp(regexS);
  const results = regex.exec(window.location.search);
  if (results == null) {
    return "";
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
};

const getGistUrl = id => `https://api.github.com/gists/${id}`;

const initializeHelp = function() {
  const updateHelp = function() {
    if ($.cookie('help')==="hidden") {
      $("#help").css("display", "none");
      return $("#help-icon").css("display", "block");
    } else {
      $("#help").css("display", "block");
      return $("#help-icon").css("display", "none");
    }
  };

  updateHelp();
  $("#help .dismiss").on("click", function() {
    $.cookie('help', 'hidden', {expires: 30});
    return updateHelp();
  });
  return $("#help-icon .open").on("click", function() {
    $.cookie('help', 'shown', {expires: 30});
    return updateHelp();
  });
};

const updateControls = function() {
  if ((typeof cmxref !== 'undefined' && cmxref !== null ? cmxref.undoStack.length : undefined)>0) {
    $("#undo-button").attr("disabled", null);
  } else {
    $("#undo-button").attr("disabled", "disabled");
  }

  if ((typeof cmxref !== 'undefined' && cmxref !== null ? cmxref.redoStack.length : undefined)>0) {
    return $("#redo-button").attr("disabled", null);
  } else {
    return $("#redo-button").attr("disabled", "disabled");
  }
};

const initializeUndoRedo = function() {
  $("#undo-button").on("click", function() {
    if (typeof cmxref !== 'undefined' && cmxref !== null) {
      cmxref.undo();
    }
    return updateControls();
  });

  return $("#redo-button").on("click", function() {
    if (typeof cmxref !== 'undefined' && cmxref !== null) {
      cmxref.redo();
    }
    return updateControls();
  });
};

window.messageFromCMX = function(event, cmx) {
  switch (event) {
    case 'cmx:ready':
      window.cmxref = cmx;
      cmx.makeEditable();
      return updateControls();
  }
};

class Editor {

  constructor() {
    this.setupAce();

    this.$picker = $('#file-picker');
    this.$picker.on('change', event => {
      return this.selectFile(this.$picker.val());
    });

    this.$apply = $('#apply');
    this.$apply.on('click', () => {
      this.saveFile();
      return this.ace.focus();
    });
  }

  setupAce() {
    this.ace = ace.edit("editor");

    const config = require("ace/config");
    config.set("packaged",true);

    const path = "scripts/ace";
    config.set("modePath", path);
    config.set("themePath", path);

    this.ace.setTheme("ace/theme/chrome");
    this.ace.setShowPrintMargin(false);
    this.ace.setShowInvisibles(true);
    this.ace.setDisplayIndentGuides(false);
    this.ace.setShowFoldWidgets(false);

    const session = this.ace.getSession();
    session.setUseSoftTabs(true);
    session.setUseWrapMode(true);
    session.setTabSize(2);
    session.setFoldStyle("manual");
    session.setMode("ace/mode/html");

    return this.ace.commands.addCommand({
      name: 'Save Changes',
      bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
      exec: () => {
        this.saveFile();
        return true;
      }
    });
  }

  updateFromModel(model) {
    this.updateFilePicker(model);
    return this.selectFile(0);
  }

  updateFilePicker(model) {
    this.$picker.empty();
    this.files = [];
    let unit_index = 0;
    return (() => {
      const result = [];
      for (var unit of Array.from(model)) {
        unit_index++;
        result.push((() => {
          const result1 = [];
          for (let item of Array.from(unit.items)) {
            if (!item.content) { continue; }
            this.files.push(item);
            const title = `${this.files.length}. ${item.title()}`;
            result1.push(this.$picker.append($("<option/>").val(this.files.length-1).text(title)));
          }
          return result1;
        })());
      }
      return result;
    })();
  }

  fileTypeToAceMode(type) {
    return `ace/mode/${type}`;
  }

  setContent(content) {
    const pos = this.ace.getCursorPosition();
    this.ace.setValue(content, 1);
    return this.ace.moveCursorToPosition(pos);
  }

  saveFile() {
    let content = this.ace.getValue();
    const editor = this;

    const old = $(".stage-floater");

    const $stage = $("<iframe/>", {
      "class": "stage",
      frameborder: 0,
      allowTransparency: "true"
    }
    );

    const $floater = $("<div/>",
      {"class": "stage-floater"});

    $floater.append($stage);
    $("#stage-wrapper").prepend($floater);

    const oldScrollTop = old.find("iframe").contents().find('body').scrollTop();

    const doc = $stage.contents().get(0);
    doc.open();
    doc.write(content);
    doc.close();

    const setup = function() {
      let set;
      const throttle = fn => _.debounce(fn, 500);

      const win = $stage.get(0).contentWindow || __guard__($stage.get(0).contentDocument, x => x.defaultView);

      try {
        set = win.$(doc).find('body');
      } catch (e) {
        set = {length: 0};
      }
      if (set.length===0) { return false; }
      let invocations = 0;

      set.css("min-height", "1000px").scrollTop(oldScrollTop);
      setInterval(() => set.css("min-height", "")
      , 200);

      set.on('cmx:updated', throttle(function() {
        updateControls();
        invocations++;
        if (invocations===1) { return; }
        console.log("update code");

        const chunks = [];
        win.$(doc).find("scene").each(function() {
          const $scene = win.$(this);

          const model = $scene.data('cmx-model');
          model.serialize();

          const html = $('<div>').append($scene.clone()).html();
          return chunks.push(html);
        });

        content = editor.ace.getValue();
        const patched = content.replace(/<scene(.|[\r\n])+?\/scene>/mg, () => chunks.shift());

        return editor.setContent(patched);
      })
      );

      return true;
    };

    var interval = setInterval(function() {
      if (setup()) { return clearInterval(interval); }
    }
    , 50);

    return setTimeout(() => old.fadeOut(300, function() {
      return $(this).remove();
    })
    , 200);
  }
}

$(function() {
  Modernizr.Detectizr.detect();
  const env = Modernizr.Detectizr.device;
  if ((env.browserEngine === "webkit") || $.cookie("letmein")) {
    $(".supported").css("display", "block");
  } else {
    $("#pass-button").on("click", function() {
      $.cookie("letmein", "now!", {expires:30});
      return window.location.reload();
    });

    $(".unsupported").css("display", "block");
    return;
  }

  if (env.os === "mac") {
    $('#apply').append(" (CMD+S)");
  } else {
    $('#apply').append(" (CTRL+S)");
  }

  initializeHelp();
  initializeUndoRedo();
  updateControls();

  console.log("editor started");
  const editor = new Editor();
  window.cmxEditor = editor;

  let src = getParameterByName("src");

  let hash = "?";
  if (!src) {
    hash = window.location.hash.substring(1);
    if (hash) {
      src = getGistUrl(hash);
    } else {
      src = window.location.href+"sample.html";
    }
  }

  $(document).ajaxError(function(event, ...args) {
    $(".supported").css("display", "none");
    $(".error").css("display", "block");
    $('#error-response').text(args[0].responseText);
    $('#error-gist-number').text('#'+hash);
    $('#error-gist-link').attr('href', src).text(src);
    $('#error-gist-index-link').attr('href', `https://gist.github.com/${hash}`);

    return console.log("failed to fetch content", args);
  });

  console.log(`fetching ${src}...`);
  return $.get(src, function(content) {
    console.log("got", content);
    let target = src;
    if (typeof content === "object") {
      target = content.html_url;
      content = __guard__(content.files != null ? content.files["index.html"] : undefined, x => x.content);
    }

    $('#targetFile').attr('href', target).text(target);

    editor.setContent(content);
    editor.saveFile();
    console.log("editor ready");
    return $('#desk').css('display', 'block');
  });
});

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}