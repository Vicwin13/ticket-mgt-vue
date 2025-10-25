<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const router = useRouter()

const Login = async () => {
  try {
    const usersResponse = await axios.get('/api/users')
    const user = usersResponse.data.find((u) => u.email === email.value)

    if (user && user.password === password.value) {
      console.log('Login successful for:', email.value)
      localStorage.setItem('auth_token', user.token || 'mock-token')
      localStorage.setItem('user_id', user.id)
      successMessage.value = 'Login successful'
      errorMessage.value = ''
      router.push('/dashboard')
    } else {
      errorMessage.value = 'Invalid email or password'
      successMessage.value = ''
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Something went wrong, Please try again'
    successMessage.value = ''
  }
}
</script>

<template>
  <section class="total-container">
    <div class="first_container">This is the image part</div>

    <div class="login-container">
      <div class="login-form">
        <div class="heading">
          <h2>Login</h2>
          <p class="subtext">Transform your chaotic schedules into organized tickets</p>
        </div>
        <form @submit.prevent="Login">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required />
          </div>
          <button type="submit" class="login-btn">Login</button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.total-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.first_container {
  background-color: hotpink;
  height: inherit;
  width: 100%;
}

.login-container {
  background-color: #f7f7f7;
  height: inherit;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;

  height: auto;
  width: 100%;
  max-width: 400px;
}

h2 {
  color: #333;
  font-weight: 600;
}

.form-group {
  margin-bottom: 0.5rem;
}

label {
  display: block;
  margin-bottom: 0rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #0066ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}

.login-btn:hover {
  background-color: #0052cc;
}

.heading {
  margin-bottom: 2rem;
}

.heading p {
  color: #333;
  line-height: 20px;
  font-size: 12px;
}
</style>
