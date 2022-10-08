import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";
import { visualizer } from "rollup-plugin-visualizer";

import { BootstrapVueResolver } from "unplugin-vue-components/resolvers";

const config = defineConfig({
  resolve: {
    alias: {
      "@": `${path.resolve(__dirname, "src")}`,
      vue: '@vue/compat'
    },
  },

  build: {
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "@pkmn/dex": ["@pkmn/dex"],
          "@pkmn/dex/build/learnsets.min.js": [
            "@pkmn/dex/build/learnsets.min.js",
          ],
          "bootstrap-vue": ["bootstrap-vue"],
        },
      },
      plugins: [visualizer()],
    },
  },

  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 3
          }
        }
      }
    }),
    Components({
      resolvers: [
        BootstrapVueResolver(),
        IconsResolver({
          prefix: "",
        }),
      ],
      dts: "src/components.d.ts",
    }),
    Icons(),
    AutoImport({
      imports: ["vue", "vue-router", "@vueuse/core"],
      dts: "src/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
      }
    }),
  ],

  server: {
    port: 3333,
    base: "./",
  },

  base: "./",
});

export default config;
