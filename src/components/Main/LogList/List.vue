<template>
  <div class="log-list-container">
    <div v-if="domain && server" class="stats-toggle">
      <button class="toggle-btn" @click="showStats = !showStats">
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
        >
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        {{ showStats ? "Скрыть статистику" : "Показать статистику" }}
      </button>
      <button class="open-modal-btn" @click="chengeFilter">
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
        >
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line>
          <line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
        Фильтры
      </button>
    </div>

    <div v-if="showStats" class="log-stats">
      <div class="stat-item">
        <span class="stat-label">Всего записей:</span>
        <span class="stat-value">{{ filteredLogs.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Ошибки:</span>
        <span class="stat-value error">{{ logStats.error }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Предупреждения:</span>
        <span class="stat-value warning">{{ logStats.warning }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Успешно:</span>
        <span class="stat-value success">{{ logStats.success }}</span>
      </div>
    </div>

    <!-- Пагинация (перенесена наверх) -->
    <div
      v-if="!loading && !error && filteredLogs.length > 0"
      class="pagination pagination-top"
    >
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div class="pagination-pages">
        <!-- Первая страница -->
        <button v-if="currentPage > 3" class="page-btn" @click="changePage(1)">
          1
        </button>

        <!-- Многоточие после первой страницы -->
        <span v-if="currentPage > 4" class="pagination-ellipsis">...</span>

        <!-- Страницы вокруг текущей -->
        <button
          v-for="page in visiblePages"
          :key="page"
          class="page-btn"
          :class="{ active: page === currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>

        <!-- Многоточие перед последней страницей -->
        <span v-if="currentPage < totalPages - 3" class="pagination-ellipsis"
          >...</span
        >

        <!-- Последняя страница -->
        <button
          v-if="currentPage < totalPages - 2"
          class="page-btn"
          @click="changePage(totalPages)"
        >
          {{ totalPages }}
        </button>
      </div>

      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <div class="logs-wrapper">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка логов...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>Ошибка загрузки</h3>
        <p>{{ error }}</p>
        <button class="retry-btn" @click="fetchLogs">Попробовать снова</button>
      </div>

      <div v-else class="log-content">
        <!-- Блок логов с отдельным скроллом -->
        <div class="log-list" ref="logListRef">
          <div
            v-for="log in paginatedLogs"
            :key="log.id"
            :class="['log-item', log.level.toLowerCase()]"
          >
            <div class="log-main">
              <div class="log-time">{{ formatTime(log.timestamp) }}</div>
              <div class="log-level-badge" :class="log.level.toLowerCase()">
                {{ log.level }}
              </div>
              <div class="log-server">{{ log.server }}</div>
              <div class="log-message">{{ log.message }}</div>
              <div class="log-status" :class="getStatusClass(log.status)">
                {{ log.status }}
              </div>
            </div>

            <div class="log-details">
              <div class="detail-row">
                <span class="detail-label">Метод:</span>
                <span class="detail-value method">{{ log.method }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Эндпоинт:</span>
                <span class="detail-value endpoint">{{ log.endpoint }}</span>
              </div>
              <div v-if="log.error" class="detail-row">
                <span class="detail-label">Ошибка:</span>
                <span class="detail-value error-text">{{ log.error }}</span>
              </div>
              <div v-if="log.email" class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ log.email }}</span>
              </div>
              <div v-if="log.payload" class="detail-row">
                <span class="detail-label">Payload:</span>
                <span class="detail-value payload">{{
                  formatPayload(log.payload)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="
            !loading && !error && filteredLogs.length === 0 && server && domain
          "
          class="empty-state"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>Логи не найдены</h3>
        </div>
        <div class="select-date-section" v-if="!server && !domain">
          <div class="select-data-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 16 16"
            >
              <path
                fill="#4f4f4f"
                d="M9.854 5.854a.5.5 0 0 0-.708-.708L6.5 7.793L5.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0zM2 4.5A2.5 2.5 0 0 1 4.5 2h5A2.5 2.5 0 0 1 12 4.5v5A2.5 2.5 0 0 1 9.5 12h-5A2.5 2.5 0 0 1 2 9.5zM4.5 3A1.5 1.5 0 0 0 3 4.5v5A1.5 1.5 0 0 0 4.5 11h5A1.5 1.5 0 0 0 11 9.5v-5A1.5 1.5 0 0 0 9.5 3zM7 14a2.5 2.5 0 0 1-2-1h4.5A3.5 3.5 0 0 0 13 9.5V4c.607.456 1 1.182 1 2v3.5A4.5 4.5 0 0 1 9.5 14z"
              />
            </svg>
            <div class="select-date-text-cont">
              <h2 class="select-date-title">A-Logger</h2>
              <span class="select-date-subtitle"
                >Выберите домен и сервер <br />
                для просмотра логов</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  watch,
  defineProps,
  defineEmits,
  nextTick,
} from "vue";
import axios from "axios";

const VITE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const props = defineProps({
  server: {
    type: String,
    default: "",
  },
  domain: {
    type: String,
    default: "",
  },
  chengeFilter: {
    type: Function,
  },
  filters: {
    type: Object,
    default: () => ({
      searchQuery: "",
      level: "all",
      server: "all",
      status: "all",
      period: "all",
    }),
  },
});

const emit = defineEmits(["refresh"]);

const logs = ref([]);
const filteredLogs = ref([]);
const loading = ref(false);
const error = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(15); // Увеличил количество элементов на странице
const showStats = ref(false);
const logListRef = ref(null);

// Применение фильтров
const applyFilters = () => {
  if (!logs.value.length) {
    filteredLogs.value = [];
    return;
  }

  let result = [...logs.value];

  // Фильтр по поисковому запросу
  if (props.filters.searchQuery) {
    const query = props.filters.searchQuery.toLowerCase();
    result = result.filter(
      (log) =>
        log.message.toLowerCase().includes(query) ||
        (log.endpoint && log.endpoint.toLowerCase().includes(query)) ||
        (log.method && log.method.toLowerCase().includes(query)) ||
        (log.email && log.email.toLowerCase().includes(query)) ||
        (log.error && log.error.toLowerCase().includes(query))
    );
  }

  // Фильтр по уровню
  if (props.filters.level !== "all") {
    result = result.filter((log) => log.level === props.filters.level);
  }

  // Фильтр по серверу
  if (props.filters.server !== "all") {
    result = result.filter((log) => log.server === props.filters.server);
  }

  // Фильтр по статусу
  if (props.filters.status !== "all") {
    result = result.filter((log) => {
      const status = parseInt(log.status);
      switch (props.filters.status) {
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
  if (props.filters.period !== "all") {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    result = result.filter((log) => {
      const logDate = new Date(log.timestamp * 1000);

      switch (props.filters.period) {
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

  filteredLogs.value = result;
  currentPage.value = 1; // Сбрасываем на первую страницу при изменении фильтров
};

// Загрузка логов
// https://api28.apitter.com/api/getLogs
const fetchLogs = async () => {
  if (!props.server || !props.domain) {
    logs.value = [];
    filteredLogs.value = [];
    currentPage.value = 1;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    // Получаем токен из localStorage
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error(
        "Токен авторизации отсутствует. Пожалуйста, войдите снова."
      );
    }

    const response = await axios.post(
      `${VITE_FRONTEND_URL}getLogs`,
      {
        server: props.server,
        domain: props.domain,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      logs.value = response.data.data.rows || [];
      applyFilters(); // Применяем фильтры после загрузки
    } else {
      throw new Error(response.data.message || "Ошибка при получении логов");
    }
  } catch (err) {
    console.error("Ошибка загрузки логов:", err);

    // Обработка различных типов ошибок
    if (err.response?.status === 401) {
      error.value = "Ошибка авторизации. Пожалуйста, войдите снова.";
      // Очищаем токен и перенаправляем на логин
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      // router.push('/login'); // раскомментируй если используешь Vue Router
    } else if (err.response?.status === 403) {
      error.value = "Доступ запрещен";
    } else if (err.message?.includes("Токен авторизации отсутствует")) {
      error.value = err.message;
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else if (err.request) {
      error.value = "Ошибка сети: не удалось подключиться к серверу";
    } else {
      error.value = "Не удалось загрузить логи";
    }

    logs.value = [];
    filteredLogs.value = [];
  } finally {
    loading.value = false;
  }
};

// Пагинированные логи
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredLogs.value.slice(start, end);
});

// Автоматическая прокрутка при добавлении новых логов
watch(paginatedLogs, () => {}, { deep: true });

// Общее количество страниц
const totalPages = computed(() =>
  Math.ceil(filteredLogs.value.length / itemsPerPage.value)
);

// Видимые страницы в пагинации
const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Статистика логов
const logStats = computed(() => {
  return {
    error: filteredLogs.value.filter((log) => log.status >= 400).length,
    warning: filteredLogs.value.filter((log) => log.level === "WARN").length,
    success: filteredLogs.value.filter((log) => log.status < 400).length,
  };
});

// Смена страницы
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // Прокрутка к верху списка при смене страницы
    nextTick(() => {
      if (logListRef.value) {
        logListRef.value.scrollTop = 0;
      }
    });
  }
};

// Форматирование времени
const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Форматирование payload
const formatPayload = (payload) => {
  try {
    const parsed = JSON.parse(payload);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return payload;
  }
};

// Получение класса для статуса
const getStatusClass = (status) => {
  if (status >= 200 && status < 300) return "success";
  if (status >= 300 && status < 400) return "redirect";
  if (status >= 400 && status < 500) return "client-error";
  if (status >= 500) return "server-error";
  return "";
};

// Наблюдаем за изменениями props
watch(
  () => [props.server, props.domain],
  () => {
    fetchLogs();
  }
);

// Наблюдаем за изменениями фильтров
watch(
  () => props.filters,
  () => {
    applyFilters();
  },
  { deep: true }
);

// Загружаем логи при монтировании
onMounted(() => {
  if (props.server && props.domain) {
    fetchLogs();
  } else {
    console.log("Нет инфы");
  }
});
</script>

<style scoped>
.log-list-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;
}

/* Кнопка показа статистики */
.stats-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
  flex-shrink: 0;
}

/* Статистика */
.log-stats {
  display: flex;
  padding: 10px 12px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  gap: 12px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

/* Пагинация сверху */
.pagination-top {
  border-bottom: 1px solid #e2e8f0;
  border-top: none;
  padding: 8px 12px;
  flex-shrink: 0;
}

/* Основной контейнер контента */
.logs-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

/* Контейнер для логов */
.log-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

/* Блок логов с ВНУТРЕННИМ скроллом */
.log-list {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  min-height: 0;
  /* Гарантируем, что контент будет виден полностью */
  display: flex;
  flex-direction: column;
}

/* Элемент лога */
.log-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
  /* Гарантируем, что элементы не сжимаются */
  flex-shrink: 0;
}

.log-item:hover {
  background-color: #f8fafc;
}

.log-item.error {
  border-left: 3px solid #e53e3e;
}

.log-item.warn {
  border-left: 3px solid #ed8936;
}

.log-item.info {
  border-left: 3px solid #3182ce;
}

.log-item.success {
  border-left: 3px solid #38a169;
}

/* Состояния загрузки и ошибки */
.loading-state,
.error-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 0;
}
.empty-state {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

/* Пагинация снизу */
.pagination-bottom {
  padding: 8px 12px;
  flex-shrink: 0;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.open-modal-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: #f8fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.open-modal-btn:hover {
  background-color: #edf2f7;
  border-color: #cbd5e0;
}

.select-date-section {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-data-info {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
}

.select-date-text-cont {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 6px;
  text-align: center;
  /* width: 400px; */
}

/* Остальные стили остаются без изменений */
.toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.toggle-btn:hover {
  background-color: #5a67d8;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-label {
  font-size: 12px;
  color: #718096;
}

.stat-value {
  font-weight: 600;
  font-size: 12px;
  color: #4a5568;
}

.stat-value.error {
  color: #e53e3e;
}

.stat-value.warning {
  color: #dd6b20;
}

.stat-value.success {
  color: #38a169;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 12px;
  white-space: nowrap;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #5a67d8;
}

.pagination-btn:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
  opacity: 0.6;
}

.pagination-pages {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.page-btn {
  padding: 4px 8px;
  border: 1px solid #e2e8f0;
  background-color: white;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 28px;
  font-size: 11px;
  height: 24px;
}

.page-btn:hover {
  background-color: #edf2f7;
  border-color: #cbd5e0;
}

.page-btn.active {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.pagination-ellipsis {
  padding: 4px 2px;
  color: #a0aec0;
  font-size: 11px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.retry-btn {
  margin-top: 12px;
  padding: 8px 16px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: #5a67d8;
}

.log-main {
  display: grid;
  grid-template-columns: auto auto auto 1fr auto;
  gap: 10px;
  align-items: start;
  margin-bottom: 10px;
}

.log-time {
  font-size: 11px;
  color: #718096;
  white-space: nowrap;
}

.log-level-badge {
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.log-level-badge.error {
  background-color: #fed7d7;
  color: #c53030;
}

.log-level-badge.warn {
  background-color: #feebcb;
  color: #c05621;
}

.log-level-badge.info {
  background-color: #bee3f8;
  color: #2c5282;
}

.log-level-badge.success {
  background-color: #c6f6d5;
  color: #276749;
}

.log-server {
  font-size: 12px;
  font-weight: 500;
  color: #4a5568;
  white-space: nowrap;
}

.log-message {
  font-size: 13px;
  color: #2d3748;
  line-height: 1.4;
}

.log-status {
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.log-status.success {
  background-color: #c6f6d5;
  color: #276749;
}

.log-status.redirect {
  background-color: #bee3f8;
  color: #2c5282;
}

.log-status.client-error {
  background-color: #feebcb;
  color: #c05621;
}

.log-status.server-error {
  background-color: #fed7d7;
  color: #c53030;
}

.log-details {
  background-color: #f8fafc;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
}

.detail-row {
  display: flex;
  margin-bottom: 5px;
  gap: 6px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-weight: 600;
  color: #4a5568;
  min-width: 70px;
  font-size: 12px;
}

.detail-value {
  color: #718096;
  word-break: break-all;
  font-size: 12px;
}

.detail-value.method {
  font-weight: 600;
  color: #667eea;
}

.detail-value.endpoint {
  font-family: "Montserrat", sans-serif;
}

.detail-value.error-text {
  color: #e53e3e;
}

.detail-value.payload {
  white-space: pre-wrap;
  background-color: #edf2f7;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 11px;
}

.empty-state h3 {
  margin: 12px 0 6px 0;
  color: #4a5568;
  font-size: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 13px;
}

.error-state {
  color: #e53e3e;
  text-align: center;
}

/* Стилизация скроллбара ТОЛЬКО для списка логов */
.log-list::-webkit-scrollbar {
  width: 6px;
}

.log-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.log-list::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.log-list::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .log-main {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .log-stats {
    flex-wrap: wrap;
    gap: 8px;
  }

  .detail-row {
    flex-direction: column;
    gap: 3px;
  }

  .detail-label {
    min-width: auto;
  }

  .pagination-pages {
    order: -1;
  }
}
</style>
