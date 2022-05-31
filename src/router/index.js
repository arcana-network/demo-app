import { createWebHistory, createRouter } from "vue-router";

const AppLogin = () => import("@/pages/AppLogin.vue");
const MyFiles = () => import("@/pages/MyFiles.vue");
const SharedWithMe = () => import("@/pages/SharedWithMe.vue");

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
    name: "Login",
    path: "/login",
    component: AppLogin,
  },
  {
    path: "/",
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

export default router;
