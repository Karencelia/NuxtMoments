<script setup>
definePageMeta ({
    layout: 'default',
});
// import { useRoute , useRouter} from 'vue-router';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from "vue-router";
import moment from 'moment';

const route = useRoute();
const router = useRouter();
const item = ref(null);
const isLoading = ref(false);
const formError = ref("");

// Fetch single moment
const singleMoment = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    formError.value = "You are not logged in. Please login.";
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch(
      `https://eventful-moments-api.onrender.com/api/v1/moment/${route.params.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch single moment.");
    }

    const data = await response.json();
    console.log("API Response:", data);

    item.value = data.data || null;

    console.log(item.value);

    if (!item.value) {
      formError.value = "Moment not found.";
      router.push("/mybucket");
    }
  } catch (error) {
    console.error("Error fetching single moment:", error);
    formError.value = "Error fetching moment. Please try again later.";
  } finally {
    isLoading.value = false;
  }
};

// To Delete A moment
const deleteItem = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    formError.value = "You are not logged in. Please login.";
    return;
  }

  try {
    const response = await fetch(
      `https://eventful-moments-api.onrender.com/api/v1/moment/${route.params.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete moment.");
    }

    alert("Moment deleted successfully!");
    router.push("/mybucket");
  } catch (error) {
    console.error("Error deleting moment:", error);
    formError.value = "Error deleting moment. Please try again.";
  }
};

// Fetch the moment when the component is mounted
onMounted(() => {
  singleMoment();
});

</script>

<template>
  <div v-if="item" class="flex flex-col justify-start px-4 sm:px-6 md:px-10 pt-5">
    <div class="mb-6 sm:mb-8">
      <h3 class="font-bold text-lg sm:text-xl md:text-2xl mb-2">{{ item.title }}</h3>
      <p class="text-gray-500 text-sm sm:text-base">{{ moment(item.futureDate).format('DD/MM/YYYY') }}</p>
    </div>

    <p class="text-base sm:text-lg md:text-[14px] leading-6 sm:leading-7" v-html="item.details"></p>

    <div class="flex flex-col sm:flex-row gap-4 mt-10">
      <button @click="router.push(`/editlist/${String(route.params.id)}`)" class="w-full sm:w-40 h-10 py-2 bg-[#60CED4] text-white text-sm rounded-md hover:bg-[#50B6BE] transition">
        Edit
      </button>
      <button 
      @click="deleteItem"
      class="w-full sm:w-40 h-10 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition">
        Delete
      </button>
    </div>
  </div>

  <div v-else class="pt-5 px-4">
    <p class="text-gray-600">Item not found</p>
  </div>
</template>
