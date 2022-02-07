import Vue from 'vue'
import { createApp, h } from 'vue-demi'
import VueCompositionApi from '@vue/composition-api'
import App from '@/App.vue'

import 'windi.css'
import router from '@/router'
import { parseFile, stringsToSpecies } from './util/oldParsingLogic';
import { generateTeam } from './util/algorithm'

Vue.use(VueCompositionApi)

Vue.config.productionTip = false
Vue.config.devtools = true

const generation = 8;

async function test() {
  const parsedMons = await parseFile();

  console.log(await generateTeam(generation, stringsToSpecies(generation, parsedMons), [2, 2, 3, 2, 2], 1));
}

test();

const app = createApp({
  router,
  render: () => h(App),
})

app.mount('#app')
