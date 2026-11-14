// Centralized API backend URL with environment variable support
const envUrl = import.meta.env.VITE_API_BASE_URL;

export const Server_URL = envUrl
    ? (envUrl.endsWith('/') ? envUrl : `${envUrl}/`)
    : 'http://localhost:5000/';
