import { createWebHistory, createRouter } from "vue-router";

import MyFiles from "../pages/MyFiles.vue";
import SharedWithMe from "../pages/SharedWithMe.vue";
import TrashBin from "../pages/TrashBin.vue";
import AppLogin from "../pages/AppLogin.vue";

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
});

export default router;
