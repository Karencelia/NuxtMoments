<script setup>
definePageMeta({
  layout: 'default',
});

import { reactive, ref } from 'vue';

const form = reactive({
  date: '',
  title: '',
  details: '',
});

const formError = ref('');

const isValidDate = (dateString) => {
  const today = new Date();
  const date = new Date(dateString);
  return date > today;
};

const handleSubmit = async () => {
  formError.value = '';

  if (!form.date || !form.title || !form.details) {
    formError.value = 'Please fill in all fields';
    return;
  }

  if (!isValidDate(form.date)) {
    formError.value = 'Please enter a valid future date';
    return;
  }

  const token = localStorage.getItem('authToken');
  if (!token) {
    formError.value = 'You are not logged in. Please login.';
    return;
  }

  try {
    const response = await fetch('https://eventful-moments-api.onrender.com/api/v1/moment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        futureDate: form.date,
        title: form.title,
        details: form.details,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Server response:', data);
      throw new Error(data.message || 'Failed to add item. Please try again.');
    }

    console.log('Item added successfully:', data);

    localStorage.setItem('bucketListUpdated', Date.now());

    navigateTo('/mybucket');
    
  } catch (error) {
    console.error('Error adding item:', error);
    formError.value = 'Error adding item. Please try again later.';
  }
};
</script>

<template>
  <div class="flex justify-center lg:justify-start items-center px-4">
    <form @submit.prevent="handleSubmit" class="w-full sm:w-[450px] lg:pl-[120px] mb-[100px]">
      <div class="mb-6">
        <p class="mb-2 text-[12px] text-gray-700">Date in the future <span>(mm/dd/yyyy)</span></p>
        <input 
          type="date"
          v-model="form.date"
          id="date"
          name="date"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div v-if="formError" class="mb-4 text-red-600 text-[12px]">
          {{ formError }}
        </div>
      </div>

      <div class="mb-6">
        <p class="mb-2 text-[12px] text-gray-700">Title</p>
        <input 
          type="text"
          v-model="form.title"
          id="topic"
          name="topic"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter title"
        />
      </div>

      <div class="mb-6">
        <p class="mb-2 text-[12px] text-gray-700">Details</p>
        <textarea 
          v-model="form.details"
          id="details"
          name="details"
          class="w-full sm:w-[330px] h-[200px] resize-none border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter details"
        ></textarea>
      </div>

      <div class="text-center">
        <button 
          type="submit"
          class="w-full sm:w-48 h-10 bg-blue-500 text-white text-[12px] rounded-md hover:bg-blue-600 transition"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>
