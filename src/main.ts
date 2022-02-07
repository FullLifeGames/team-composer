import Vue from "vue";
import { createApp, h } from "vue-demi";
import VueCompositionApi from "@vue/composition-api";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import App from "@/App.vue";

import "windi.css";
import router from "@/router";

Vue.use(VueCompositionApi);
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.config.productionTip = false;
Vue.config.devtools = true;

const app = createApp({
  router,
  render: () => h(App),
});

app.mount("#app");
