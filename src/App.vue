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
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import AsideMenu from "./components/Menu/LeftAsideMenu/AsideMenu.vue";
import LoginPage from "./pages/Login.vue"; // Импортируем компонент логина

const router = useRouter();
const isAuthenticated = ref(false);

// Функция проверки токена
const checkAuth = () => {
  const token = localStorage.getItem("authToken");
  isAuthenticated.value = !!token; // Превращаем в boolean

  // Если нет токена и мы не на странице логина, перенаправляем
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

// Слушаем изменения localStorage (на случай выхода из другого окна)
const handleStorageChange = (event) => {
  if (event.key === "authToken") {
    checkAuth();
  }
};

// Слушаем custom event выхода
const handleLogoutEvent = () => {
  logout();
};

onMounted(() => {
  // Первоначальная проверка
  checkAuth();

  // Слушаем изменения в localStorage
  window.addEventListener("storage", handleStorageChange);

  // Слушаем custom event для выхода
  window.addEventListener("logout", handleLogoutEvent);
});

onUnmounted(() => {
  // Убираем слушатели
  window.removeEventListener("storage", handleStorageChange);
  window.removeEventListener("logout", handleLogoutEvent);
});

// Экспортируем функции для использования в дочерних компонентах
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
  overflow: hidden; /* Убираем скролл у основного контента */
}
</style>
