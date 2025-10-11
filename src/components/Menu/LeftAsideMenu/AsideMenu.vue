<template>
  <!-- Кнопка для открытия меню на мобильных -->
  <button
    class="sidebar-toggle"
    @click="toggleSidebar"
    :class="{ active: isSidebarOpen }"
    v-if="isMobile"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  </button>

  <!-- Затемняющий фон -->
  <div
    class="sidebar-overlay"
    :class="{ active: isSidebarOpen && isMobile }"
    @click="closeSidebar"
  ></div>

  <!-- Боковое меню -->
  <aside
    class="server-sidebar"
    :class="{
      'mobile-open': isSidebarOpen,
      'mobile-hidden': !isSidebarOpen && isMobile,
    }"
  >
    <div class="sidebar-header">
      <h1>Серверы и домены</h1>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="header-icon"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>

      <!-- Кнопка закрытия для мобильных -->
      <button class="close-sidebar" @click="closeSidebar" v-if="isMobile">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <nav class="server-nav">
      <div
        v-for="(server, index) in servers"
        :key="index"
        class="server-section"
      >
        <div class="server-header" @click="toggleServer(index)">
          <div class="server-name-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="server-icon"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <h2 class="server-name">{{ server.name }}</h2>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="chevron-icon"
            :class="{ rotated: server.isOpen }"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        <transition name="domain-list">
          <ul v-if="server.isOpen" class="domain-list">
            <li
              v-for="(domain, domainIndex) in server.domains"
              :key="domainIndex"
              class="domain-item"
              @click="goToLogsPage(server.name, domain, $event)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="domain-icon"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path
                  d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                ></path>
              </svg>
              <span>{{ domain }}</span>
            </li>
          </ul>
        </transition>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

// Инициализация router
const router = useRouter();

// Состояние для мобильного меню
const isMobile = ref(false);
const isSidebarOpen = ref(false);

// Данные серверов
const servers = ref([
  {
    name: "frontend_vue",
    domains: [
      "chatserv.apitter.com",
      "mwi.apitter.com",
      "ctacrew.apitter.com",
      "app.chatserv.ru",
      "app.whatsapi.ru",
      "app2.touch-api.com",
    ],
    isOpen: false,
  },
  {
    name: "be_pay",
    domains: ["whatsApi", "touchApi", "chatserv", "chatcrew", "mwi"],
    isOpen: false,
  },
  {
    name: "be_auth",
    domains: ["whatsApi", "touchApi", "chatserv", "chatcrew", "mwi"],
    isOpen: false,
  },
]);

// Проверка размера экрана
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768;
  if (!isMobile.value) {
    isSidebarOpen.value = true; // Всегда открыто на десктопе
  } else {
    isSidebarOpen.value = false; // Закрыто по умолчанию на мобильных
  }
};

// Переключение сайдбара
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Закрытие сайдбара
const closeSidebar = () => {
  if (isMobile.value) {
    isSidebarOpen.value = false;
  }
};

// Функция для переключения видимости доменов сервера
const toggleServer = (index) => {
  servers.value[index].isOpen = !servers.value[index].isOpen;
};

// Функция для перехода на страницу логов
const goToLogsPage = (serverName, domainName, event) => {
  if (event) {
    event.stopPropagation();
  }

  // Закрываем меню на мобильных при переходе
  if (isMobile.value) {
    closeSidebar();
  }

  if (router) {
    router.push({
      path: "/logs",
      query: {
        server: serverName,
        domain: domainName,
      },
    });
  } else {
    // Fallback на обычную навигацию если router не доступен
    window.location.href = `/logs?server=${encodeURIComponent(
      serverName
    )}&domain=${encodeURIComponent(domainName)}`;
  }
};

// Обработчики изменения размера окна
onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style scoped>
.server-sidebar {
  width: 320px;
  height: 100vh;
  font-family: "Montserrat", sans-serif;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 0;
  box-sizing: border-box;
  color: #2d3748;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  border-right: 1px solid #e2e8f0;
  flex-shrink: 0;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
}

/* Кнопка открытия меню */
.sidebar-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  background: #667eea;
  border: none;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  background: #5a67d8;
  transform: scale(1.05);
}

.sidebar-toggle.active {
  background: #4c51bf;
}

/* Затемняющий фон */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.sidebar-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Адаптивность для мобильных */
@media (max-width: 768px) {
  .server-sidebar.mobile-hidden {
    transform: translateX(-100%);
  }

  .server-sidebar.mobile-open {
    transform: translateX(0);
  }
}

@media (min-width: 769px) {
  .sidebar-toggle,
  .sidebar-overlay {
    display: none;
  }

  .server-sidebar {
    position: relative;
    transform: translateX(0) !important;
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.sidebar-header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #4a5568;
}

.header-icon {
  color: #667eea;
}

/* Кнопка закрытия для мобильных */
.close-sidebar {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #718096;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-sidebar:hover {
  color: #4a5568;
  background: #edf2f7;
}

@media (max-width: 768px) {
  .close-sidebar {
    display: block;
  }
}

.server-nav {
  padding: 16px 0;
}

.server-section {
  margin-bottom: 8px;
}

.server-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none;
}

.server-header:hover {
  background-color: #edf2f7;
}

.server-name-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.server-icon {
  color: #667eea;
}

.server-name {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #4a5568;
}

.chevron-icon {
  transition: transform 0.3s ease;
  color: #a0aec0;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.domain-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.domain-list-enter-active,
.domain-list-leave-active {
  transition: all 0.4s ease;
  max-height: 200px;
}

.domain-list-enter-from,
.domain-list-leave-to {
  opacity: 0;
  max-height: 0;
}

.domain-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px 12px 60px;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
  color: #718096;
}

.domain-item:hover {
  background-color: #edf2f7;
  color: #667eea;
}

.domain-icon {
  color: #68d391;
  flex-shrink: 0;
}

/* Стилизация скроллбара */
.server-sidebar::-webkit-scrollbar {
  width: 6px;
}

.server-sidebar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.server-sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.server-sidebar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
