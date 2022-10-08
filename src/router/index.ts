import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import HomePage from "@/views/HomePage.vue";
import type { EventType, Emitter } from "mitt";

const createCustomRouter = (emitter: Emitter<Record<EventType, unknown>>) => {
  const routes: RouteRecordRaw[] = [
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

  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  });

  router.beforeEach((to, from, next) => {
    if (typeof to.matched[0]?.components?.default === "function") {
      emitter.emit("asyncComponentLoading", to); // Start progress bar
    }
    next();
  });

  router.beforeResolve((to, from, next) => {
    next();
    emitter.emit("asyncComponentLoaded"); // Stop progress bar
  });

  return router;
};

export default createCustomRouter;
