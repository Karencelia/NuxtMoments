export const useApi = () => {
    const baseUrl = 'https://eventful-moments-api.onrender.com/api/v1';
  
    const request = async (url, options = {}) => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = {
          'Content-Type': 'application/json',
          ...options.headers,
          ...(token && { 'Authorization': `Bearer ${token}` })
        };
  
        const response = await fetch(`${baseUrl}${url}`, {
          ...options,
          headers
        });
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'API Error');
        return data;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    };
  
    const get = (url, options = {}) => request(url, { ...options, method: 'GET' });
    const post = (url, body, options = {}) => request(url, { ...options, method: 'POST', body: JSON.stringify(body) });
    const put = (url, body, options = {}) => request(url, { ...options, method: 'PUT', body: JSON.stringify(body) });
    const del = (url, options = {}) => request(url, { ...options, method: 'DELETE' });
  
    return {
      get,
      post,
      put,
      del
    };
  };
  