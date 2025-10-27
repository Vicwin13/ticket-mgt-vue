<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Footer from './components/Footer.vue'

const route = useRoute()
const showFooter = computed(() => {
  // Don't show footer on login and signup pages
  return route.name !== 'Login' && route.name !== 'Signup'
})
</script>

<template>
  <div class="app-container">
    <router-view />
    <Footer v-if="showFooter" />
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
