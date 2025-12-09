<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

const register = async () => {
  try {
   const formData = {
      name: name.value,
      email: email.value,
      password: password.value
    };

    const response = await axios.post(
    `${import.meta.env.VITE_APP_API_URL}/register`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }
    );
    const data = response.data;

    localStorage.setItem("access_token", data.token)

    router.push("/tasks")

  } catch (error) {
    console.log(error)
    alert("Something went wrong")
  }
}
</script>
<template>
  <div class="mt-10 bg-gray-300/40 border border-gray-400 rounded-lg shadow-lg p-5 w-96">
    <div class="mb-3">
      <label for="name" class="block text-left mb-2 text-bold">Name</label>
      <input v-model="name" type="text" name="name" id="name" class="p-2 border-1 border-gray-500 rounded-lg w-full" placeholder="Write your email here">
    </div>
    <div class="mb-3">
      <label for="email" class="block text-left mb-2 text-bold">Email</label>
      <input v-model="email" type="email" name="email" id="email" class="p-2 border-1 border-gray-500 rounded-lg w-full" placeholder="Write your email here">
    </div>
    <div>
       <label for="password" class="block text-left mb-2 text-bold">Password</label>
      <input v-model="password" type="password" name="password" id="password" class="p-2 border-1 border-gray-500 rounded-lg w-full" placeholder="Write your password here">
    </div>
    <div>
      <button @click="register" type="button" class="bg-[#853F2D] border-green-400 rounded-lg px-3 py-2 mt-3">Register</button>
    </div>
  </div>
   <nav class="mt-5">
    <router-link to="/">Login</router-link> |
    <router-link to="/register">Register</router-link>
  </nav>
</template>
