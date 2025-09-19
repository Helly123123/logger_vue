<template>
  <header class="log-header">
    <div class="header-content">
      <div class="header-main">
        <h2>Системные логи</h2>
        <div class="header-actions">
          <button class="toggle-filters-btn" @click="toggleFilters">
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
            {{ showFilters ? "Скрыть фильтры" : "Фильтры" }}
          </button>
          <!-- <button class="refresh-btn" @click="$emit('refresh')">
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
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
              <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
            </svg>
            Обновить
          </button> -->
        </div>
      </div>

      <div v-if="showFilters" class="filters-expanded">
        <div class="search-box">
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
            class="search-icon"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск по логам..."
            @input="$emit('filter-change', getFilters())"
          />
        </div>

        <div class="filter-controls">
          <div class="filter-group">
            <label class="filter-label">Уровень:</label>
            <select
              v-model="selectedLevel"
              class="filter-select"
              @change="$emit('filter-change', getFilters())"
            >
              <option value="all">Все уровни</option>
              <option value="INFO">Info</option>
              <option value="WARN">Warning</option>
              <option value="ERROR">Error</option>
              <option value="DEBUG">Debug</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Сервер:</label>
            <select
              v-model="selectedServer"
              class="filter-select"
              @change="$emit('filter-change', getFilters())"
            >
              <option value="all">Все серверы</option>
              <option value="Frontend_vue">Frontend</option>
              <option value="Be_pay">Be Pay</option>
              <option value="Be_auth">Be Auth</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Статус:</label>
            <select
              v-model="selectedStatus"
              class="filter-select"
              @change="$emit('filter-change', getFilters())"
            >
              <option value="all">Все</option>
              <option value="success">2xx</option>
              <option value="redirect">3xx</option>
              <option value="client-error">4xx</option>
              <option value="server-error">5xx</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Период:</label>
            <select
              v-model="selectedPeriod"
              class="filter-select"
              @change="$emit('filter-change', getFilters())"
            >
              <option value="all">Все время</option>
              <option value="today">Сегодня</option>
              <option value="yesterday">Вчера</option>
              <option value="week">Неделя</option>
              <option value="month">Месяц</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, defineEmits, defineExpose } from "vue";

const emit = defineEmits(["refresh", "filter-change"]);

const showFilters = ref(false);
const searchQuery = ref("");
const selectedLevel = ref("all");
const selectedServer = ref("all");
const selectedStatus = ref("all");
const selectedPeriod = ref("all");

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const getFilters = () => {
  return {
    searchQuery: searchQuery.value,
    level: selectedLevel.value,
    server: selectedServer.value,
    status: selectedStatus.value,
    period: selectedPeriod.value,
  };
};

// Экспортируем значения фильтров для использования в родительском компоненте
defineExpose({
  searchQuery,
  selectedLevel,
  selectedServer,
  selectedStatus,
  selectedPeriod,
  getFilters,
  toggleFilters,
});
</script>

<style scoped>
.log-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0;
  box-sizing: border-box;
  margin: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  padding: 12px 16px;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.log-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-filters-btn {
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

.toggle-filters-btn:hover {
  background-color: #edf2f7;
  border-color: #cbd5e0;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.refresh-btn:hover {
  background-color: #5a67d8;
}

/* Расширенная область фильтров */
.filters-expanded {
  background-color: #f8fafc;
  border-radius: 6px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #a0aec0;
  z-index: 1;
}

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  background-color: #ffffff;
  transition: all 0.2s;
  font-weight: 400;
  height: 36px;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.filter-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
  color: #4a5568;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 400;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%234a5568' viewBox='0 0 16 16'><path d='M8 12L2 6h12L8 12z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
  padding-right: 32px;
  height: 36px;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.filter-select:hover {
  border-color: #cbd5e0;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .filter-controls {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .header-main {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 12px;
  }

  .header-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .filter-controls {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .search-box input {
    font-size: 14px;
    height: 34px;
  }

  .filter-select {
    font-size: 14px;
    height: 34px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 10px 12px;
  }

  .log-header h2 {
    font-size: 16px;
  }

  .header-actions {
    flex-direction: row;
    gap: 6px;
  }

  .toggle-filters-btn,
  .refresh-btn {
    padding: 6px 10px;
    font-size: 12px;
    flex: 1;
    min-width: auto;
  }

  .filters-expanded {
    padding: 12px;
  }

  .search-box {
    margin-bottom: 12px;
  }

  .filter-group {
    gap: 4px;
  }

  .filter-label {
    font-size: 11px;
  }
}
</style>
