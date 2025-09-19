import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'https://api28.apitter.com/api/getLogs'

export const useLogStore = defineStore('log', {
  state: () => ({
    logs: [],
    filteredLogs: [],
    servers: {
      be_pay: ['whatsApi', 'touchApi', 'chatserw', 'chatcrew', 'mwi'],
      frontend_vue: ['whatsApi', 'touchApi', 'chatserw', 'chatcrew', 'mwi'],
      be_auth: ['whatsApi', 'touchApi', 'chatserw', 'chatcrew', 'mwi']
    },
    currentServer: null,
    currentSubserver: null,
    searchQuery: '',
    filters: {
      level: '',
      method: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    },
    isLoading: false,
    stats: {
      total: 0,
      errors: 0,
      warnings: 0,
      success: 0
    }
  }),

  actions: {
    async fetchLogs(server, subserver = null) {
      this.isLoading = true
      try {
        const requestData = {
          server: server,
          domen: subserver || ''
        }
        
        console.log('Sending request:', requestData)
        
        const response = await axios.post(API_URL, requestData)
        console.log('Response:', response.data)
        
        // Исправлено: проверяем success вместо succsecc
        if (response.data.success) {
          this.logs = response.data.data.rows.map(log => ({
            ...log,
            timestamp: new Date(log.timestamp * 1000),
            // Безопасный парсинг payload
            payload: this.safeParsePayload(log.payload)
          }))
          this.filterLogs()
          this.calculateStats()
          console.log('Logs loaded:', this.logs.length)
        } else {
          console.error('API returned success: false')
        }
      } catch (error) {
        console.error('Error fetching logs:', error)
        // Добавим больше информации об ошибке
        if (error.response) {
          console.error('Response data:', error.response.data)
          console.error('Response status:', error.response.status)
        }
      } finally {
        this.isLoading = false
      }
    },

    safeParsePayload(payload) {
      try {
        if (typeof payload === 'string') {
          return JSON.parse(payload)
        }
        return payload || {}
      } catch (error) {
        console.warn('Failed to parse payload:', payload)
        return { raw: payload }
      }
    },

    filterLogs() {
      let filtered = [...this.logs]

      // Фильтрация по поисковому запросу
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(log => 
          (log.email?.toLowerCase().includes(query)) ||
          (log.method?.toLowerCase().includes(query)) ||
          (log.message?.toLowerCase().includes(query)) ||
          (log.endpoint?.toLowerCase().includes(query)) ||
          (log.error?.toLowerCase().includes(query))
        )
      }

      // Фильтрация по уровню
      if (this.filters.level) {
        filtered = filtered.filter(log => log.level === this.filters.level)
      }

      // Фильтрация по методу
      if (this.filters.method) {
        filtered = filtered.filter(log => log.method === this.filters.method)
      }

      // Фильтрация по статусу
      if (this.filters.status) {
        filtered = filtered.filter(log => log.status === parseInt(this.filters.status))
      }

      // Фильтрация по дате
      if (this.filters.dateFrom) {
        const fromDate = new Date(this.filters.dateFrom)
        filtered = filtered.filter(log => log.timestamp >= fromDate)
      }

      if (this.filters.dateTo) {
        const toDate = new Date(this.filters.dateTo)
        toDate.setHours(23, 59, 59, 999)
        filtered = filtered.filter(log => log.timestamp <= toDate)
      }

      this.filteredLogs = filtered
      this.calculateStats()
    },

    calculateStats() {
      this.stats = {
        total: this.filteredLogs.length,
        errors: this.filteredLogs.filter(log => log.level === 'ERROR').length,
        warnings: this.filteredLogs.filter(log => log.level === 'WARN').length,
        success: this.filteredLogs.filter(log => log.level === 'INFO' || (log.status && log.status < 400)).length
      }
    },

    setSearchQuery(query) {
      this.searchQuery = query
      this.filterLogs()
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
      this.filterLogs()
    },

    clearFilters() {
      this.filters = {
        level: '',
        method: '',
        status: '',
        dateFrom: '',
        dateTo: ''
      }
      this.searchQuery = ''
      this.filterLogs()
    }
  }
})