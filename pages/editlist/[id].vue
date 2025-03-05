<script setup>
definePageMeta({
  layout: "default",
});

import moment from'moment';
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from '#imports';
import { useToast } from 'vue-toastification';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const isLoading = ref(false);

const form = reactive({
  futureDate: '',
  title: '',
  details: '',
});

const fetchMoment = async () => {
  try {
    isLoading.value = true;
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Unauthorized! Please log in.');
      router.push('/mybucket');
      return;
    }

    console.log('Fetching moment with ID:', route.params.id);

    const response = await fetch(
      `https://eventful-moments-api.onrender.com/api/v1/moment/${route.params.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        toast.error('Session expired. Please log in again.');
        router.push('/mybucket');
        return;
      }
      throw new Error('Failed to fetch moment');
    }

    const data = await response.json();
    if (data) {
      form.futureDate = moment(data.data.futureDate).format('MM/DD/YYYY');
      form.title = data.data.title;
      form.details = data.data.details;
    } else {
      toast.error('Moment not found!');
      router.push('/mybucket');
    }
  } catch (err) {
    toast.error(`Error fetching moment: ${err.message}`);
  } finally {
    isLoading.value = false;
  }
};

const editItem = async () => {
  if (!form.futureDate || !form.title || !form.details) {
    toast.error('All fields are required');
    return;
  }

  try {
    isLoading.value = true;

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Unauthorized! Please log in.');
      router.push('/mybucket');
      return;
    }

    const response = await fetch(
      `https://eventful-moments-api.onrender.com/api/v1/moment/${route.params.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        toast.error('Session expired. Please log in again.');
        router.push('/login');
        return;
      }
      throw new Error('Failed to update moment');
    }

    toast.success('Moment updated successfully');
    router.push('/mybucket');
  } catch (err) {
    toast.error(`Error updating moment: ${err.message}`);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchMoment);
</script>


<template>
  <div class="block">
    <form @submit.prevent="editItem">
      <div class="w-[450px] pl-[120px] mb-[100px]">
        <p class="mb-2 text-[12px]">Date in the future: {{ form.futureDate }}</p>
        <input
          type="date"
          v-model="form.futureDate"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <p class="mt-6 text-[12px]">Title</p>
        <input
          type="text"
          v-model="form.title"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <p class="mt-6 text-[12px]">Details</p>
        <textarea
          v-model="form.details"
          class="w-[330px] h-[200px] border rounded-md resize-none"
          required
        ></textarea>

        <div class="text-center mt-6">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-48 h-10 py-2 bg-blue-500 text-white text-[12px] rounded-md hover:bg-blue-600"
          >
            {{ isLoading ? 'Updating...' : 'Update' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
