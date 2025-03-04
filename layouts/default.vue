<script setup>
import { useRouter } from 'vue-router'; // Import useRouter
import Footer from "~/components/Footer.vue";

const router = useRouter();

function handleLogout() {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("fullName");
  localStorage.removeItem("email");

  // Redirect to login page
  router.push("/");
  
  // Optionally, force a reload to clear the state
  setTimeout(() => {
    window.location.reload();
  }, 500);
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <nav class="bg-[#008289] border-b border-teal-500">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="text-white lg:text-[20px] md:text-[15px] font-semibold htext">
            Eventful Moments.
          </NuxtLink>
          <div class="space-x-4">
            <NuxtLink to="/mybucket" class="text-white">My Bucket</NuxtLink>
            <button @click="handleLogout" class="text-white">Logout</button>
          </div>
        </div>
      </div>
    </nav>
    <NuxtPage class="flex-grow" />
    <Footer />
  </div>
</template>
