import axios from 'axios';

// Relative base URL: the React build is served by the same Spring Boot
// server (same origin), so no CORS configuration is needed on the backend.
const api = axios.create({
  baseURL: '/api',
});

export default api;
