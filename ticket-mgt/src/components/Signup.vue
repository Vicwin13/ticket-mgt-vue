<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const router = useRouter()
const toast = useToast()

const Signup = async () => {
  if (
    !firstName.value ||
    !lastName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    toast.error('All fields are required')
    return
  }

  if (password.value !== confirmPassword.value) {
    toast.error('Passwords do not match')
    return
  }

  if (password.value.length < 6) {
    toast.error('Password must be at least 6 characters long')
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    toast.error('Please enter a valid email address')
    return
  }

  try {
    // Use Netlify Function for registration
    const response = await axios.post('/api/users/register', {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    })

    const { user, token } = response.data
    
    toast.success('Account created successfully! Please login.')
    router.push('/login')
  } catch (error) {
    console.error('Signup error:', error)
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

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<template>
  <section class="total-container">
    <div class="first_container">This is the image part</div>

    <div class="signup-container">
      <div class="signup-form">
        <div class="heading">
          <h2>Sign Up</h2>
          <p class="subtext">Create an account to manage your tickets efficiently</p>
        </div>
        <form @submit.prevent="Signup">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" v-model="firstName" required />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" v-model="lastName" required />
          </div>
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
          <div class="form-group password-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-input-container">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="confirmPassword"
                required
              />
              <button
                type="button"
                class="password-toggle"
                @click="toggleConfirmPasswordVisibility"
                aria-label="Toggle confirm password visibility"
              >
                <svg
                  v-if="showConfirmPassword"
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
          <button type="submit" class="signup-btn">Sign Up</button>
        </form>
        <p class="login-link">
          Already have an account?
          <router-link to="/login" class="link">Login</router-link>
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

.signup-container {
  background-color: #f7f7f7;
  height: inherit;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

.signup-form {
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

.signup-btn {
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

.signup-btn:hover {
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

.login-link {
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
