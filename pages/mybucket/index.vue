<script setup>
import moment from 'moment';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const bucketList = ref([]);
const expandItems = ref({});
const fullname = ref('');
const formError = ref('');
const isLoading = ref(false);
const itemsToShow = ref(4);

const displayedMoments = computed(() => bucketList.value.slice(0, itemsToShow.value));

onMounted(() => {
  fullname.value = localStorage.getItem('fullname') || 'User';
  fetchAndAssignBucketList();
});

const fetchAndAssignBucketList = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    formError.value = 'You are not logged in. Please login.';
    return;
  }

  isLoading.value = true;
  try {
    const response = await fetch('https://eventful-moments-api.onrender.com/api/v1/moment', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bucket list.');
    }

    const data = await response.json();
    console.log('API Response:', data);

    bucketList.value = Array.isArray(data?.data[0].data) ? data.data[0].data : [];

    bucketList.value.forEach(item => {
      expandItems.value[item._id] = false;
    });

  } catch (error) {
    console.error('Error fetching bucket list:', error);
    formError.value = 'Error fetching bucket list. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

const loadMore = () => {
  if (itemsToShow.value < bucketList.value.length) {
    itemsToShow.value += 4;
  }
};

const hasMoreItems = computed(() => itemsToShow.value < bucketList.value.length);

const truncateText = (text, id) => {
  if (!text) return '';
  const words = text.split(' ');

  if (words.length > 150 && !expandItems.value[id]) {
    return words.slice(0, 150).join(' ') + '...';
  }
  return text;
};
</script>

<template>
  <div class="px-6 md:px-12 lg:px-24 py-10">
    <div class="flex flex-col md:flex-row md:justify-between items-start md:items-center">
      <div>
        <h1 class="text-xl md:text-[25px] text-left mt-[10px] mb-1 buckettext">
          Welcome {{ fullname ? fullname : 'User' }},
        </h1>
        <p class="text-xs md:text-[10px] mb-6">
          Here are items in your eventful moment bucket.
        </p>
        <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>
      </div>
      <div class="w-full md:w-auto flex justify-start md:justify-end">
        <button 
          @click="router.push('/addlist')"
          class="w-full md:w-40 h-10 py-2 mb-6 md:mb-10 bg-blue-500 mt-6 text-white text-sm rounded-md hover:bg-blue-600 border border-[#707070]">
          Add Item
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-lg">
      <div 
        class="shadow-lg rounded-md p-6 hover:bg-[#FFF5A7]" 
        v-for="item in displayedMoments" 
        :key="item._id">
        <h3 class="text-[14px] font-bold buckettext">{{ item.title }} </h3>

        <p class="mt-6 text-xs md:text-[12px] opacity-100 leading-5">
          {{ truncateText(item.details, item._id) }}
        </p>

        <div class="flex flex-col md:flex-row md:justify-between text-xs md:text-[12px] mt-4">
          <button @click="router.push(`/fulldetails/${item._id}`)">
            View Details
          </button>
          
          <div class="flex gap-4 md:gap-8 mt-2 md:mt-0">
            <p class="text-black">{{ moment(item.futureDate).format('DD/MM/YYYY') }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <button
      v-if="hasMoreItems"
    @click="loadMore"
        type="button"
        class="w-full md:w-40 h-10 py-2 mb-10 bg-blue-500 mt-6 text-white text-sm rounded-md hover:bg-blue-600 border border-[#707070]">
        Load More
      </button>
    </div>
  </div>
</template>
