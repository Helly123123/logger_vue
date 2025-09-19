<template>
  <div class="logs-page">
    <LogList :server="server" :domain="domain" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import LogList from "@/components/Main/Logs.vue";

const route = useRoute();
const server = ref("");
const domain = ref("");

const updateParams = () => {
  server.value = route.query.server || "";
  domain.value = route.query.domain || "";
};

onMounted(() => {
  updateParams();
});

watch(
  () => route.query,
  () => {
    updateParams();
  }
);
</script>

<style scoped>
.logs-page {
  height: 100%;
  width: 100%;
}
</style>
