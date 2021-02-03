import {
  backIn,
  backInOut,
  backOut,
  bounceIn,
  bounceInOut,
  bounceOut,
  circIn,
  circInOut,
  circOut,
  cubicIn,
  cubicInOut,
  cubicOut,
  elasticIn,
  elasticInOut,
  elasticOut,
  expoIn,
  expoInOut,
  expoOut,
  quadIn,
  quadInOut,
  quadOut,
  quartIn,
  quartInOut,
  quartOut,
  quintIn,
  quintInOut,
  quintOut,
  sineIn,
  sineInOut,
  sineOut
} from 'svelte/easing';


import { crossfade } from "svelte/transition";
const [send, receive] = crossfade({
  easing: quartOut,
  duration(d){ return Math.sqrt(d * 1000)},

  fallback(node, params) {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;
    return {
      duration: 10000,
      easing: quartOut,
      css: t => `
                transform: ${transform} scale(${t});
                opacity: ${t}
            `
    };
  }
});

export { send, receive };
