import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";

import { BootstrapVueNextResolver } from "./src/util/bootstrapVueResolver";

const config = defineConfig({
  resolve: {
    alias: {
      "@": `${path.resolve(__dirname, "src")}`
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
          "bootstrap-vue-next": ["bootstrap-vue-next"],
        },
      },
    },
  },

  plugins: [
    vue(),
    Components({
      resolvers: [
        BootstrapVueNextResolver(),
        IconsResolver(),
      ],
      dts: "src/components.d.ts",
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true
    }),
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
