<template>
  <header class="log-header">
    <div class="modal-overlay">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Фильтры логов</h3>
          <button @click="close" class="close-btn">
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

        <div class="modal-body">
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
              @input="applyFilters"
            />
          </div>

          <div class="filter-controls">
            <div class="filter-group">
              <label class="filter-label">Уровень:</label>
              <select
                v-model="selectedLevel"
                class="filter-select"
                @change="applyFilters"
              >
                <option value="all">Все уровни</option>
                <option value="SUCCESS">Success</option>
                <option value="ERROR">Error</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Статус:</label>
              <select
                v-model="selectedStatus"
                class="filter-select"
                @change="applyFilters"
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
                @change="applyFilters"
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

        <div class="modal-footer">
          <button class="apply-btn" @click="applyAndClose">Применить</button>
          <button class="reset-btn" @click="resetFilters">Сбросить</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, defineEmits, defineExpose } from "vue";

const emit = defineEmits(["refresh", "filter-change"]);

const props = defineProps({
  close: {
    type: Function,
  },
});

const showModal = ref(false);
const searchQuery = ref("");
const selectedLevel = ref("all");
const selectedServer = ref("all");
const selectedStatus = ref("all");
const selectedPeriod = ref("all");

const getFilters = () => {
  return {
    searchQuery: searchQuery.value,
    level: selectedLevel.value,
    server: selectedServer.value,
    status: selectedStatus.value,
    period: selectedPeriod.value,
  };
};

const applyFilters = () => {
  emit("filter-change", getFilters());
};

const applyAndClose = () => {
  applyFilters();
  props.close();
};

const resetFilters = () => {
  searchQuery.value = "";
  selectedLevel.value = "all";
  selectedServer.value = "all";
  selectedStatus.value = "all";
  selectedPeriod.value = "all";
  applyFilters();
};

// Экспортируем значения фильтров для использования в родительском компоненте
defineExpose({
  searchQuery,
  selectedLevel,
  selectedServer,
  selectedStatus,
  selectedPeriod,
  getFilters,
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

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #718096;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: #f7fafc;
  color: #4a5568;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
}

.apply-btn {
  padding: 8px 16px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.apply-btn:hover {
  background-color: #5a67d8;
}

.reset-btn {
  padding: 8px 16px;
  background-color: #f8fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background-color: #edf2f7;
  border-color: #cbd5e0;
}

/* Стили для фильтров (оставлены без изменений) */
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
  grid-template-columns: 1fr;
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
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-body {
    padding: 16px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .apply-btn,
  .reset-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 10px 12px;
  }

  .open-modal-btn {
    padding: 6px 10px;
    font-size: 12px;
    width: 100%;
    justify-content: center;
  }
}
</style>
