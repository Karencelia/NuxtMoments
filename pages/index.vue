<script setup>
definePageMeta({
  layout: 'home'
});

import { ref } from 'vue';

const email = ref('');
const password = ref('');
const emailError = ref('');
const passwordError = ref('');
const formError = ref('');
const isLoading = ref(false);

const handleLogin = async (event) => {
  event.preventDefault();

  emailError.value = email.value ? '' : 'Email is required';
  passwordError.value = password.value ? '' : 'Password is required';
  formError.value = '';

  if (!emailError.value && !passwordError.value) {
    isLoading.value = true;
    try {
      const response = await $fetch('https://eventful-moments-api.onrender.com/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          email: email.value,
          password: password.value
        }
      });

      console.log('Login successful:', response);

      const token = response?.token;
      const user = response?.user; // Assuming response includes user details

      if (token && user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('fullname', user.fullname); // Save full name

        console.log("Saved Full Name:", user.fullname);
        navigateTo('/mybucket');
      } else {
        console.error('Token or user data not found in response:', response);
        formError.value = 'Something went wrong. Please try again.';
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      formError.value = 'Something went wrong. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }
};

</script>

<template>
  <div class="flex flex-col justify-between">
    <main class="flex flex-col items-center justify-center flex-1 mx-4">
      <div class="max-w-md w-full text-center">
        <h1 class="text-lg lg:text-[25px] font-bold mb-2 text-left welcome">
          Welcome back,
        </h1>
        <p class="text-black mb-4 mt-6 text-left text-base md:text-lg lg:text-[14px] leading-normal">
          Hi, my name is Eventful Moments, I am a bucket... no, not the bucket
          of water but I store awesome moments you will like to have in coming
          years.
        </p>

        <form @submit="handleLogin" class="space-y-4">
          <div>
            <p class="text-left text-gray-600 text-[14px]">Email</p>
            <input
              v-model="email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p v-if="emailError" class="text-red-500 text-sm">{{ emailError }}</p>
          </div>

          <div>
            <p class="text-left text-gray-600 text-[14px]">Password</p>
            <input
              v-model="password"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-48 h-10 py-2 bg-blue-500 mt-6 text-white text-[12px] rounded-md hover:bg-blue-600 border border-[#707070]"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
          <p v-if="formError" class="text-red-500 text-sm mt-2">{{ formError }}</p>
        </form>
      </div>
    </main>
  </div>
</template>
