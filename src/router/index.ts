import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../components/Layout/index.vue"),
      children: [
        {
          path: "/markdownEditor",
          component: () => import("../views/VueDemo/markdownEditor/index.vue"),
        },
        {
          path: "/getData",
          component: () => import("../views/VueDemo/getData/index.vue"),
        },
        {
          path: "/grid",
          component: () => import("../views/VueDemo/grid/index.vue"),
        },
        {
          path: "/treeView",
          component: () => import("../views/VueDemo/treeView/index.vue"),
        },
        {
          path: "/svg",
          component: () => import("../views/VueDemo/svg/index.vue"),
        },
        {
          path: "/transitionList",
          component: () => import("../views/VueDemo/transitionList/index.vue"),
        },
        {
          path: "/transitionModal",
          component: () => import("../views/VueDemo/transitionModal/index.vue"),
        },
        {
          path: "/TodoMVC",
          component: () => import("../views/VueDemo/TodoMVC/index.vue"),
        },
        {
          path: "/chunkFile",
          component: () => import("../views/CommonDemo/chunkFile/index.vue"),
        },
        {
          path: "/split",
          component: () => import("../views/CommonDemo/splitter/index.vue"),
        },
      ],
    },
  ],
});

export default router;
