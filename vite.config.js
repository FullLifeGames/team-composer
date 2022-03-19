import path from "path";
import { defineConfig } from "vite";
import { createVuePlugin as Vue2 } from "vite-plugin-vue2";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import ScriptSetup from "unplugin-vue2-script-setup/vite";
import AutoImport from "unplugin-auto-import/vite";
import { visualizer } from "rollup-plugin-visualizer";

const config = defineConfig({
  resolve: {
    alias: {
      "@": `${path.resolve(__dirname, "src")}`,
    },
    dedupe: ["vue-demi"],
  },

  build: {
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "@pkmn/dex": ["@pkmn/dex"],
        },
      },
      plugins: [visualizer()],
    },
  },

  plugins: [
    Vue2(),
    ScriptSetup(),
    Components({
      resolvers: [
        IconsResolver({
          prefix: "",
        }),
      ],
      dts: "src/components.d.ts",
    }),
    Icons(),
    AutoImport({
      imports: ["@vue/composition-api", "vue-router", "@vueuse/core"],
      dts: "src/auto-imports.d.ts",
    }),
  ],

  server: {
    port: 3333,
    base: "./",
  },

  base: "./",
});

export default config;
