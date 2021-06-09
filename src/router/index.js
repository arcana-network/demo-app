import { createWebHistory, createRouter } from "vue-router";
import store from "../store";

import MyFiles from "../pages/MyFiles.vue";
import SharedWithMe from "../pages/SharedWithMe.vue";
import TrashBin from "../pages/TrashBin.vue";
import AppLogin from "../pages/AppLogin.vue";

// const store = useStore();
const routes = [
  {
    name: "My Files",
    path: "/my-files",
    component: MyFiles,
  },
  {
    name: "Shared With Me",
    path: "/shared-with-me",
    component: SharedWithMe,
  },
  {
    name: "Bin",
    path: "/bin",
    component: TrashBin,
  },
  {
    name: "Login",
    path: "/login",
    component: AppLogin,
  },
  {
    name: "/",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (to.name !== "Login") {
    if (!store.getters.publicKey || !store.getters.privateKey) {
      router.replace({ name: "Login" });
    }
  }
  return next();
});

export default router;
