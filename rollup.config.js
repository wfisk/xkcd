import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";

import alias from "@rollup/plugin-alias";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import autoPreprocess from "svelte-preprocess";
import buble from "rollup-plugin-buble";
import sizes from "rollup-plugin-sizes";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "/src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js"
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write("public/build/bundle.css");
      },
      preprocess: autoPreprocess({
        scss: {
          includePaths: ["node_modules", "src"]
        }
      })
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"]
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    alias({
      resolve: [".js", ".json", ".scss", ".svelte"],
      entries: [{ find: /^\/src/, replacement: __dirname + "/src" }]
    }),
    json(),
    postcss(),

    buble({
      objectAssign: "Object.assign",
      transforms: {
        asyncAwait: false,
        forOf: false
      }
    }),
    sizes()
  ],

  watch: {
    clearScreen: false
  },

  //see https://github.com/d3/d3-selection/issues/168
  onwarn: function (warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    if (warning.code === "EVAL") return;
    warn(warning);
  }
};

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true
        });
      }
    }
  };
}
