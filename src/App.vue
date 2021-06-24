<template>
  <div class="main-wrap">
    <div class="content-wrap">
      <!-- 路由匹配到的组件将渲染在这里 -->
      <router-view></router-view>
    </div>
    <MainFooter></MainFooter>
  </div>
</template>

<script setup>
import MainFooter from './components/MainFooter.vue'
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  position: relative;
}
#app {
  height: 100%;
}
.main-wrap {
  height: 100%;
  position: relative;
}
a {
  text-decoration: none;
}
.content-wrap {
  background: #fefefe;
}
</style>
