import axios from 'axios';
import { Server_URL } from '../utils/config';
import { utilityFunctions } from '../utils/module';

// Create configured Axios instance
const apiClient = axios.create({
    baseURL: Server_URL.endsWith('/') ? Server_URL.slice(0, -1) : Server_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Automatically attach token
apiClient.interceptors.request.use(
    (config) => {
        // Detect current route context (admin vs user)
        const isAdminPath = window.location.pathname.startsWith('/admin');
        const token = isAdminPath
            ? utilityFunctions.getCookieValue('adminAuthToken')
            : (utilityFunctions.getCookieValue('userAuthToken') || utilityFunctions.getCookieValue('adminAuthToken'));

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Global error and 401 handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const currentPath = window.location.pathname;

        if (status === 401) {
            if (currentPath.startsWith('/admin') && !currentPath.includes('/adminsignin')) {
                utilityFunctions.removeCookie('adminAuthToken');
                window.location.href = '/adminsignin';
            } else if (currentPath.startsWith('/user') && !currentPath.includes('/usersignin')) {
                utilityFunctions.removeCookie('userAuthToken');
                window.location.href = '/usersignin';
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Clean helper function as specified in __skills__/reusable-snippets.js
 * Keeps components dry from try-catch boilerplate
 */
export const handleApi = async (promise) => {
    try {
        const res = await promise;
        const data = res.data?.data !== undefined ? res.data.data : res.data?.result;
        return [data, null];
    } catch (err) {
        const errorMsg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            'Operation failed. Please try again.';
        return [null, errorMsg];
    }
};

export default apiClient;

