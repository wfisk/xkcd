const sveltePreprocess = require('svelte-preprocess');
module.exports = {
  preprocess: sveltePreprocess({
    typescript: false // for typescript, use the typescript examples!
  })
};
