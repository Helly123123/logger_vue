<template>
  <div class="container" v-if="isAuthenticated">
    <AsideMenu />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>

  <!-- Показываем страницу логина если не авторизован -->
  <LoginPage v-else />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import AsideMenu from "./components/Menu/LeftAsideMenu/AsideMenu.vue";
import LoginPage from "./pages/Login.vue";

const router = useRouter();
const isAuthenticated = ref(false);

// Функция проверки токена
const checkAuth = () => {
  const token = localStorage.getItem("authToken");
  isAuthenticated.value = !!token;

  // Если есть токен и мы на странице логина, перенаправляем на logs
  if (token && router.currentRoute.value.path === "/login") {
    router.push("/logs");
  }

  // Если нет токена и мы не на странице логина, перенаправляем на логин
  if (!token && router.currentRoute.value.path !== "/login") {
    router.push("/login");
  }
};

// Функция выхода
const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  isAuthenticated.value = false;
  router.push("/login");
};

// Слушаем изменения localStorage
const handleStorageChange = (event) => {
  if (event.key === "authToken") {
    checkAuth();
  }
};

// Слушаем custom event выхода
const handleLogoutEvent = () => {
  logout();
};

// Следим за изменениями маршрута
watch(
  () => router.currentRoute.value.path,
  () => {
    checkAuth();
  }
);

onMounted(() => {
  checkAuth();
  window.addEventListener("storage", handleStorageChange);
  window.addEventListener("logout", handleLogoutEvent);
});

onUnmounted(() => {
  window.removeEventListener("storage", handleStorageChange);
  window.removeEventListener("logout", handleLogoutEvent);
});

defineExpose({
  checkAuth,
  logout,
});
</script>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  padding: 0;
  margin: 0;
  font-family: "Montserrat", sans-serif;
}

.main-content {
  flex: 1;
  background-color: #f8fafc;
  font-family: "Montserrat", sans-serif;
  overflow: hidden;
}
</style>
