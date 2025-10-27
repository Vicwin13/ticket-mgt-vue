<template>
  <nav>
    <h1>Tixify</h1>

    <div class="cta">
      <router-link to="/login" class="login-btn">Login</router-link>
      <button @click="handleGetStarted" class="started">Get Started</button>
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
h1{
  font-weight: 700;
  color: gold;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0166ff;
  padding: 1rem;
}
.cta {
  display: flex;
  align-items: center;
  gap: 1rem;
}


.cta .login-btn {
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  
  
}

.started{
  padding: 15px 15px;
  border: none;
  border-radius: 8px;
  background-color: white;
  color: #0166ff;

}

.started:hover{
  background-color: gold;
}
.login-btn{
  background-color: #ffd700;
}

.login-btn:hover{
  background-color: white;
  color: #0166ff;
  font-weight: 500;
}

@media screen and (width <= 375px) {
  .cta .login-btn{
      padding: 6px 10px;
  }

  .started{
    padding: 10px 12px;
  }
}

</style>
