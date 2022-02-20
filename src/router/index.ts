import Vue from "vue";
import type { RouteConfig } from "vue-router";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import TeamEvaluator from "@/views/TeamEvaluator.vue";
import DraftLeagueApplication from "@/views/DraftLeagueApplication.vue";

Vue.use(VueRouter);

export const routes: RouteConfig[] = [
  {
    path: "/",
    name: "Home",
    // NOTE: you can also apply meta information
    // meta: {authRequired: false }
    component: Home,
    // NOTE: you can also lazy-load the component
    // component: () => import("@/views/About.vue")
  },
  {
    path: "/team-evaluator",
    name: "TeamEvaluator",
    // NOTE: you can also apply meta information
    // meta: {authRequired: false }
    component: TeamEvaluator,
    // NOTE: you can also lazy-load the component
    // component: () => import("@/views/About.vue")
  },
  {
    path: "/draft-league-application",
    name: "DraftLeagueApplication",
    // NOTE: you can also apply meta information
    // meta: {authRequired: false }
    component: DraftLeagueApplication,
    // NOTE: you can also lazy-load the component
    // component: () => import("@/views/About.vue")
  },
];

const router = new VueRouter({
  routes,
});

export default router;
