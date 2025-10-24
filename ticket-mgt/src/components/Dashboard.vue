<template>
  <section class="dashboard">
    <aside class="side">
      <button @click="logout" class="logout">Logout</button>
    </aside>
    <div class="bigger-side">
      <h1>Welcome to Tixly</h1>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const logout = () => {
  localStorage.removeItem('auth_token')
  window.location.href = '/login'
}
</script>

<style scoped>
.dashboard {
  display: flex;
  justify-content: center;
  align-items: center;
}

.side {
  border: 2px solid gray;
  width: 100%;
  max-width: 20rem;
  height: 100%;
}
.bigger-side {
  border: 2px solid green;
  width: 100%;
  height: 100%;
}
.logout {
  margin-bottom: 0rem;
}
</style>
