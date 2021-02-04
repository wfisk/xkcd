import cmx from '../cmx';

/**
 * publishEvent
 */
export function publishEvent(name) {
  console.log(`${name}`);

  // $('body').trigger(name, cmx);
  let event = new CustomEvent(name, { detail: cmx });
  document.querySelector('body').dispatchEvent(event);

  return __guardMethod__(parent, 'messageFromCMX', (o) =>
    o.messageFromCMX(name, cmx)
  );
}

/**
 * loadWebFonts
 */
export function loadWebFonts(continuation) {
  let alreadyCalled = false;

  window.WebFontConfig = {
    custom: {
      families: ['xkcd']
    },
    active() {
      alreadyCalled = true;
      return typeof continuation === 'function' ? continuation() : undefined;
    }
  };

  const wf = document.createElement('script');
  wf.src = '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);

  // for some reason webfont loader does not work on Firefox/Mac when called from IFRAME
  const checkIfLoaderIsBroken = function () {
    if (!alreadyCalled) {
      return typeof continuation === 'function' ? continuation() : undefined;
    }
  };

  return setTimeout(checkIfLoaderIsBroken, 2000);
}

/**
 * launch
 */
export function launch() {
  cmx.previousCmx = window.cmx;
  window.cmx = cmx;

  publishEvent('cmx:launched');
  const parser = new cmx.Parser(cmx);
  const sceneModels = parser.parseDoc(document.querySelector('body'));

  for (let sceneModel of Array.from(sceneModels)) {
    // const $scene = $(sceneModel.source);
    const scene = sceneModel.source;
    // console.log(`model for #${$scene.attr('id')}:`, this);
    console.log(`model for ${scene}`);
    sceneModel.debugReport(2);
    sceneModel.materialize(scene);
  }

  return publishEvent('cmx:ready');
}

// publishEvent("cmx:loaded");

// // underscore.string could be loaded before underscore, force mixing here
// underscore.string = (underscore.str = underscoreString);

// // extend d3 with convenience functions
// d3ext();

// // note: without fonts being fully loaded we would get wrong metrics for label frames
// return loadWebFonts(launch);
function __guardMethod__(obj, methodName, transform) {
  if (
    typeof obj !== 'undefined' &&
    obj !== null &&
    typeof obj[methodName] === 'function'
  ) {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}
