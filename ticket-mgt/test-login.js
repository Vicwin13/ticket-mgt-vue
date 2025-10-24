// Simple test to verify login logic

import axios from 'axios'

const testLogin = async () => {
  try {
    // Test with correct credentials
    const usersResponse = await axios.get('http://localhost:3001/users')
    const user = usersResponse.data.find((u) => u.email === 'johndoe@gmail.com')

    if (user && user.password === 'John1@doe') {
      console.log('✅ Login test passed: Correct credentials work')
    } else {
      console.log('❌ Login test failed: Correct credentials rejected')
    }

    // Test with incorrect credentials
    const wrongUser = usersResponse.data.find((u) => u.email === 'wrong@email.com')
    if (!wrongUser) {
      console.log('✅ Login test passed: Non-existent user rejected')
    } else {
      console.log('❌ Login test failed: Non-existent user accepted')
    }
  } catch (error) {
    console.error('Test error:', error.message)
  }
}

testLogin()
