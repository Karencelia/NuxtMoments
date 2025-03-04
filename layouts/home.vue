<template>
    <div class="flex flex-col min-h-screen">
      <!-- Navigation Bar -->
      <nav class="bg-[#008289] border-b border-teal-500">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <NuxtLink to="/" class="text-white lg:text-[20px] md:text-[15px] font-semibold htext">
              Eventful Moments.
            </NuxtLink>
            <div class="space-x-4">
              <NuxtLink to="/" class="text-white">Login</NuxtLink>
              <NuxtLink to="/register" class="text-white">Register</NuxtLink>
            </div>
          </div>
        </div>
      </nav>
      
      <!-- Main Page Content -->
      <NuxtPage class="flex-grow" />
      
      <!-- Footer Component -->
      <Footer />
    </div>
  </template>
  
  <script setup>
  import Footer from '~/components/Footer.vue';
  </script>
  