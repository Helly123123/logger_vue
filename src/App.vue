<template>
  <div class="container">
    <AsideMenu />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import AsideMenu from "./components/Menu/LeftAsideMenu/AsideMenu.vue";
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
