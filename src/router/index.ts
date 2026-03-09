import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const modules = import.meta.glob("@/pages/**/*.vue", { eager: true });

const titleMap: Record<string, string> = {
  HomePage: "首页",
  ProjectListPage: "项目列表",
  UploadPage: "文件上传",
  ResultPage: "处理结果",
  TemplatePage: "模板下载",
};

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/MainLayout.vue"),
    children: [] as RouteRecordRaw[],
    meta: { requiresAuth: true },
  },
];

const pagesDir = modules as Record<string, any>;

for (const path in pagesDir) {
  const component = pagesDir[path].default;
  const fileName = path.split("/").pop()?.replace(".vue", "") || "";

  if (fileName === "LoginPage") {
    routes.push({
      path: "/login",
      name: "login",
      component,
      meta: { title: "登录", showInNav: false },
    });
    continue;
  }

  if (fileName === "DashboardPage") {
    routes[0].children!.push({
      path: "/dashboard",
      name: "dashboard",
      component,
      meta: { requiresAuth: true, title: "控制台" },
    });
    continue;
  }

  let routePath = "/" + fileName.toLowerCase().replace("page", "");
  let routeName = fileName.toLowerCase().replace("page", "");
  let metaTitle = titleMap[fileName] || fileName.replace("Page", "");

  if (fileName === "index") {
    routePath = "/home";
    routeName = "index";
    metaTitle = "首页";
  }

  if (fileName.startsWith("[") && fileName.endsWith("]")) {
    const param = fileName.slice(1, -1);
    routePath = `/${param}`;
    routeName = param;
    metaTitle = param;
  }

  const route: RouteRecordRaw = {
    path: routePath,
    name: routeName,
    component,
    meta: {
      title: metaTitle,
      showInNav: fileName !== "HomePage" && fileName !== "ResultPage",
      requiresAuth: true,
    },
  };

  if (!routes[0].children!.some((r) => r.path === routePath)) {
    routes[0].children!.push(route);
  }
}

routes[0].children!.sort((a, b) => {
  const order: Record<string, number> = {
    "/home": 0,
    "/template": 1,
    "/upload": 2,
    "/projectlist": 3,
    "/result": 4,
  };
  return (order[a.path] ?? 99) - (order[b.path] ?? 99);
});

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.path === "/login" && isAuthenticated) {
    next("/home");
    return;
  }

  if (to.path === "/") {
    if (isAuthenticated) {
      next("/home");
      return;
    } else {
      next("/login");
      return;
    }
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
    return;
  }

  document.title = (to.meta.title as string) || "Frontend Demo";
  next();
});

export default router;
