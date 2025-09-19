<template>
  <div class="logs-page">
    <LogHeader
      @refresh="loadLogs"
      @filter-change="handleFilterChange"
      ref="headerRef"
    />
    <LogList
      :server="server"
      :domain="domain"
      :logs="filteredLogs"
      :loading="loading"
      :filters="currentFilters"
      @refresh="loadLogs"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import LogHeader from "./LogComonent/LogHeader.vue";
import LogList from "./LogList/List.vue";

const props = defineProps({
  server: {
    type: String,
    default: "",
  },
  domain: {
    type: String,
    default: "",
  },
});

const logs = ref([]);
const loading = ref(false);
const headerRef = ref(null);
const currentFilters = ref({
  searchQuery: "",
  level: "all",
  server: "all",
  status: "all",
  period: "all",
});

// Обработчик изменения фильтров
const handleFilterChange = (filters) => {
  currentFilters.value = { ...filters };
};

// Фильтрация логов
const filteredLogs = computed(() => {
  if (!logs.value.length) return [];

  let result = [...logs.value];

  // Фильтр по поисковому запросу
  if (currentFilters.value.searchQuery) {
    const query = currentFilters.value.searchQuery.toLowerCase();
    result = result.filter(
      (log) =>
        log.message?.toLowerCase().includes(query) ||
        (log.endpoint && log.endpoint.toLowerCase().includes(query)) ||
        (log.method && log.method.toLowerCase().includes(query)) ||
        (log.email && log.email.toLowerCase().includes(query)) ||
        (log.error && log.error.toLowerCase().includes(query))
    );
  }

  // Фильтр по уровню
  if (currentFilters.value.level !== "all") {
    result = result.filter((log) => log.level === currentFilters.value.level);
  }

  // Фильтр по серверу
  if (currentFilters.value.server !== "all") {
    result = result.filter((log) => log.server === currentFilters.value.server);
  }

  // Фильтр по статусу
  if (currentFilters.value.status !== "all") {
    result = result.filter((log) => {
      const status = parseInt(log.status || 0);
      switch (currentFilters.value.status) {
        case "success":
          return status >= 200 && status < 300;
        case "redirect":
          return status >= 300 && status < 400;
        case "client-error":
          return status >= 400 && status < 500;
        case "server-error":
          return status >= 500;
        default:
          return true;
      }
    });
  }

  // Фильтр по периоду
  if (currentFilters.value.period !== "all") {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    result = result.filter((log) => {
      const logDate = new Date(log.timestamp * 1000 || log.timestamp);

      switch (currentFilters.value.period) {
        case "today":
          return logDate >= today;
        case "yesterday":
          return logDate >= yesterday && logDate < today;
        case "week":
          return logDate >= weekAgo;
        case "month":
          return logDate >= monthAgo;
        default:
          return true;
      }
    });
  }

  return result;
});

// Загрузка логов
const loadLogs = async () => {
  loading.value = true;

  // Имитация загрузки с сервера
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newLogs = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      timestamp: Math.floor(Date.now() / 1000) - Math.random() * 86400 * 30,
      level: ["INFO", "WARN", "ERROR", "DEBUG"][Math.floor(Math.random() * 4)],
      server: ["Frontend_vue", "Be_pay", "Be_auth"][
        Math.floor(Math.random() * 3)
      ],
      message: `Запись лога #${logs.value.length + i + 1} - ${
        ["Успешный запрос", "Ошибка валидации", "Предупреждение системы"][
          Math.floor(Math.random() * 3)
        ]
      }`,
      status: [200, 201, 400, 404, 500][Math.floor(Math.random() * 5)],
      method: ["GET", "POST", "PUT", "DELETE"][Math.floor(Math.random() * 4)],
      endpoint: `/api/${
        ["users", "posts", "auth", "payments"][Math.floor(Math.random() * 4)]
      }`,
      error: Math.random() > 0.7 ? "Ошибка соединения с базой данных" : null,
      email:
        Math.random() > 0.8
          ? `user${Math.floor(Math.random() * 100)}@example.com`
          : null,
      payload:
        Math.random() > 0.6
          ? JSON.stringify({
              action: "update",
              data: { id: Math.floor(Math.random() * 100) },
            })
          : null,
    }));

    logs.value = [...newLogs, ...logs.value].slice(0, 100); // Ограничиваем количество логов
  } catch (error) {
    console.error("Ошибка загрузки логов:", error);
  } finally {
    loading.value = false;
  }
};

// Имитация live-обновления логов
let intervalId = null;

onMounted(() => {
  // Загрузка начальных логов
  loadLogs();

  // Настройка интервала для имитации live-логов
  intervalId = setInterval(() => {
    if (Math.random() > 0.7) {
      const newLog = {
        id: Date.now(),
        timestamp: Math.floor(Date.now() / 1000),
        level: ["INFO", "WARN", "ERROR"][Math.floor(Math.random() * 3)],
        server: ["Frontend_vue", "Be_pay", "Be_auth"][
          Math.floor(Math.random() * 3)
        ],
        message: `Live запись - ${
          ["Новый пользователь", "Платеж обработан", "Ошибка аутентификации"][
            Math.floor(Math.random() * 3)
          ]
        }`,
        status: [200, 400, 500][Math.floor(Math.random() * 3)],
        method: ["GET", "POST"][Math.floor(Math.random() * 2)],
        endpoint: `/api/${
          ["auth", "payments", "users"][Math.floor(Math.random() * 3)]
        }`,
      };
      logs.value.unshift(newLog);
    }
  }, 3000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.logs-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 0; /* Убираем padding чтобы не было лишних отступов */
}

/* Убираем все возможные скроллы у родительских элементов */
:deep(.main-content) {
  padding: 24px;
  overflow: hidden; /* Убираем скролл у контейнера */
}

:deep(.log-container) {
  overflow: hidden; /* Убираем скролл у контейнера логов */
}
</style>
