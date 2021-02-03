const svite = require('svite');
const sviteConfig = {
  hot: true, // boolean or options object for svelte-hmr
  useTransformCache: false // boolean
};
module.exports = {
  // if you provide a svite plugin here, svite cli will use it instead of initializing one for you
  plugins: [svite(sviteConfig)],
  // if you don't use svite cli, you should provide rollupDedupe option, otherwise you risk duplicate svelte instances and errors
  rollupDedupe: [
    'svelte/animate',
    'svelte/easing',
    'svelte/internal',
    'svelte/motion',
    'svelte/store',
    'svelte/transition',
    'svelte'
  ],
  optimizeDeps: {
    include: [
      'exceljs',
      'howler',
      'lodash',
      'lodash/debounce',
      'lodash.tonumber'
    ]
  }
};
