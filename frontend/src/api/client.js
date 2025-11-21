import axios from 'axios';

// Base URL preference order:
// 1. VITE_API_BASE (recommended)
// 2. USER_API_ENDPOINT (existing env entry)
// 3. Fallback to localhost
const BASE = import.meta.env.VITE_API_BASE || import.meta.env.USER_API_ENDPOINT || 'http://localhost:8000/api/v1';

const client = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

export default client;
