import { createApp, h } from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import App from "@/App.vue";

import useEmitter from "./plugins/emitter";
const emitter = useEmitter();

import createCustomRouter from "@/router";

const app = createApp({
  render: () => h(App),
});

app.use(createCustomRouter(emitter));
app.use(BootstrapVue);
app.use(IconsPlugin);
app.config.globalProperties.productionTip = false;
app.config.globalProperties.devtools = true;
app.config.globalProperties.emitter = emitter;

app.mount("#app");
