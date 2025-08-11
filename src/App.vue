<script setup>
import Tab from './components/Tab.vue'
</script>

<template>
  <div class="app">
    <h1 class="app__title">آفرهای اسپانسرینگ</h1>
    <Tab />
  </div>
</template>

<style>
body {
  background-color: rgb(245 244 238);
  font-family: Vazirmatn, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
}
</style>

<style scoped>
.app__title {
  margin-top: 100px;
  margin-bottom: 30px;
  font-size: 36px;
  font-weight: 900;
  text-align: center;
}
</style>
