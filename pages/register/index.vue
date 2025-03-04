<script setup> 
import { ref } from "vue";
import { useRouter } from "#app";

definePageMeta({
  layout: 'home'
});

const router = useRouter();

const fullname = ref("");
const email = ref("");
const password = ref("");

const nameError = ref("");
const emailError = ref("");
const passwordError = ref("");
const formError = ref("");

const isLoading = ref(false);

const handleCreateAccount = async (event) => {
  event.preventDefault();

  const fullnameValue = fullname.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  nameError.value = fullnameValue ? "" : "Please enter a name";
  emailError.value = emailValue ? "" : "Please enter an email";
  passwordError.value = passwordValue ? "" : "Please enter a password";

  if (!fullnameValue || !emailValue || !passwordValue) {
    setTimeout(() => {
      nameError.value = "";
      emailError.value = "";
      passwordError.value = "";
    }, 2000);
    return;
  }

  isLoading.value = true;
  try {
    const data = await $fetch('https://eventful-moments-api.onrender.com/api/v1/users/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    fullname: fullnameValue,
    email: emailValue,
    password: passwordValue
  }
});


    console.log('Registration successful:', data);

    localStorage.setItem('authToken', data.token);

    router.push('/mybucket');
  } catch (err) {
    console.error('Registration error:', err);
    formError.value = 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col">
    <main class="flex flex-col items-center justify-center flex-1 px-4">
      <div class="w-full max-w-md text-center">
        <h1 class="text-lg lg:text-[25px] font-bold mb-4 text-left create">
          Create an account,
        </h1>

        <form @submit="handleCreateAccount" class="space-y-4">
          <div>
            <p class="text-left text-[14px] mt-11">Fullname</p>
            <input type="text" v-model="fullname" name="fullName"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p v-if="nameError" class="text-red-500 text-sm mt-2">{{ nameError }}</p>
          </div>

          <div>
            <p class="text-left text-[14px]">Email</p>
            <input type="email" v-model="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p v-if="emailError" class="text-red-500 text-sm mt-2">{{ emailError }}</p>
          </div>

          <div>
            <p class="text-left text-[14px]">Password</p>
            <input type="password" v-model="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p v-if="passwordError" class="text-red-500 text-sm mt-2">{{ passwordError }}</p>
          </div>

          <button type="submit" :disabled="isLoading"
            class="w-48 h-10 py-2 bg-blue-500 mt-6 text-white text-[12px] rounded-md hover:bg-blue-600 border border-[#707070]">
            {{ isLoading ? 'Creating Account...' : 'Create' }}
          </button>

          <p v-if="formError" class="text-red-500 text-sm mt-2">{{ formError }}</p>
        </form>
      </div>
    </main>
  </div>
</template>
