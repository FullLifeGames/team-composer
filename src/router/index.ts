import Vue from "vue";
import type { RouteConfig } from "vue-router";
import VueRouter from "vue-router";
import HomePage from "@/views/HomePage.vue";

Vue.use(VueRouter);

export const routes: RouteConfig[] = [
  {
    path: "/",
    name: "HomePage",
    // NOTE: you can also apply meta information
    // meta: {authRequired: false }
    component: HomePage,
    // NOTE: you can also lazy-load the component
    // component: () => import("@/views/About.vue")
  },
  {
    path: "/generator/",
    name: "League",
    // NOTE: you can also apply meta information
    // meta: {authRequired: false }
    component: () => import("@/views/TeamGenerator.vue"),
    // NOTE: you can also lazy-load the component
    // component: () => import("@/views/About.vue")
  },
  {
    path: "/league/:league",
    name: "LeagueSelected",
    // NOTE: you can also apply meta information
    // meta: {authRequired: false }
    component: () => import("@/views/TeamGenerator.vue"),
    // NOTE: you can also lazy-load the component
    // component: () => import("@/views/About.vue")
  },
  {
    path: "/mon-filter",
    name: "MonFilterStart",
    // NOTE: you can also apply meta information
    // meta: {authRequired: false }
    component: () => import("@/views/MonFilter.vue"),
    // NOTE: you can also lazy-load the component
    // component: () => import("@/views/About.vue")
  },
  {
    path: "/mon-filter/:league",
    name: "MonFilter",
    // NOTE: you can also apply meta information
    // meta: {authRequired: false }
    component: () => import("@/views/MonFilter.vue"),
    // NOTE: you can also lazy-load the component
    // component: () => import("@/views/About.vue")
  },
  {
    path: "/team-evaluator",
    name: "TeamEvaluator",
    // NOTE: you can also apply meta information
    // meta: {authRequired: false }
    component: () => import("@/views/TeamEvaluator.vue"),
    // NOTE: you can also lazy-load the component
    // component: () => import("@/views/About.vue")
  },
  {
    path: "/draft-league-application",
    name: "DraftLeagueApplication",
    // NOTE: you can also apply meta information
    // meta: {authRequired: false }
    component: () => import("@/views/DraftLeagueApplication.vue"),
    // NOTE: you can also lazy-load the component
    // component: () => import("@/views/About.vue")
  },
];

const router = new VueRouter({
  routes,
});

import $eventHub from "@/components/eventHub";

router.beforeEach((to, from, next) => {
  if (typeof to.matched[0]?.components.default === "function") {
    $eventHub.$emit("asyncComponentLoading", to); // Start progress bar
  }
  next();
});

router.beforeResolve((to, from, next) => {
  next();
  $eventHub.$emit("asyncComponentLoaded"); // Stop progress bar
});

export default router;
