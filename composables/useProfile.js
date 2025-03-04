import { ref, onMounted } from 'vue';
import { useFetch } from '#app';

export function useProfile() {
  const profile = ref(null);
  const error = ref(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        error.value = 'No token found. Please log in again.';
        return;
      }

      const { data, error: fetchError, status } = await useFetch('https://eventful-moments-api.onrender.com/api/v1/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      

      if (status.value === 401) {
        error.value = 'Unauthorized. Please log in again.';
        localStorage.removeItem('authToken');
        return;
      }

      if (fetchError.value) {
        throw new Error(fetchError.value);
      }

      profile.value = data.value;
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching profile:', err);
    }
  };

  onMounted(fetchProfile);

  return { profile, error };
}
