import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:3000/api/',
  withCredentials: true, // Agar cookie (refresh token) dikirim otomatis
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // // Coba refresh token
        // // const { data } = await api.post('auth/refresh-token', {}, { withCredentials: true });
        // console.log('Token refreshed blablabla:', data.accessToken);
        // // Update header dengan access token baru
        // api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        // originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

        // // Ulang request sebelumnya dengan token baru
        // return api(originalRequest);
      } catch (refreshError) {
        //  Pastikan error dicetak dengan benar
        // if (refreshError.response) {
        //   console.error('Token refresh failed:', refreshError.response.data);
        // } else {
        //   console.error('Token refresh failed:', refreshError.message);
        // }        //  Pakai router.push atau window.location.href
        // setTimeout(() =>  {
        //     window.location.href = '/login';
        //   }
        // ,100);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
