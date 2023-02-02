import { createApp, h } from "vue";
import { BootstrapVueNext } from "bootstrap-vue-next";
// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";

import App from "@/App.vue";

import useEmitter from "./plugins/emitter";
const emitter = useEmitter();

import createCustomRouter from "@/router";

const app = createApp({
  render: () => h(App),
});

app.use(createCustomRouter(emitter));
app.use(BootstrapVueNext);

app.config.globalProperties.productionTip = false;
app.config.globalProperties.devtools = true;
app.config.globalProperties.emitter = emitter;

app.mount("#app");
