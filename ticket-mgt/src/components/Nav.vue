<template>
  <nav>
    <h1>Tixify</h1>

    <div class="cta">
      <router-link to="/login" class="login-btn">Login</router-link>
      <button @click="handleGetStarted">Get Started</button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGetStarted = () => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}
</script>

<style scope>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(39, 100, 90, 0.6);
  padding: 1rem;
}
.cta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cta button,
.cta .login-btn {
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}
</style>
