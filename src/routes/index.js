import { createRouter, createWebHistory } from "vue-router";
import LogsPage from "@/pages/Logs.vue";
import LoginPage from "@/pages/Login.vue";

const routes = [
  {
    path: "/logs",
    name: "Logs",
    component: LogsPage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },

  {
    path: "/",
    redirect: "/logs", // или другой маршрут по умолчанию
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
