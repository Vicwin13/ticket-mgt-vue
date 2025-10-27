<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const router = useRouter()
const toast = useToast()

const Login = async () => {
  
  if (!email.value || !password.value) {
    toast.error('All fields are required')
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    toast.error('Please enter a valid email address')
    return
  }

  try {
    // Use Netlify Function for login
    const response = await axios.post('/api/users', {
      email: email.value,
      password: password.value
    })

    const { user, token } = response.data
    
    console.log('Login successful for:', email.value)
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_id', user.id)
    localStorage.setItem(
      'user_name',
      `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
    )
    toast.success('Login successful')
    router.push('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
    if (error.response && error.response.data && error.response.data.error) {
      toast.error(error.response.data.error)
    } else {
      toast.error('Something went wrong, Please try again')
    }
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
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
          <div class="form-group password-group">
            <label for="password">Password</label>
            <div class="password-input-container">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
              />
              <button
                type="button"
                class="password-toggle"
                @click="togglePasswordVisibility"
                aria-label="Toggle password visibility"
              >
                <svg
                  v-if="showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  ></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>
          <button type="submit" class="login-btn">Login</button>
        </form>
        <p class="signup-link">
          Don't have an account?
          <router-link to="/signup" class="link">Sign Up</router-link>
        </p>
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

.signup-link {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.link {
  color: #0066ff;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

.password-group {
  position: relative;
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-container input {
  padding-right: 2.5rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #333;
}
</style>
