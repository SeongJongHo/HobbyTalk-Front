import axios from 'axios';
import { useAuthStore } from '@/entities/user/store/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(
    config => {
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = token;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshClient = axios.create({
                    baseURL: BASE_URL,
                    timeout: 10000,
                    withCredentials: true,
                });

                const response = await refreshClient.get(
                    '/api/command/v1/auth/refresh-token'
                );
                const newToken = response.data?.data?.access_token;

                useAuthStore.getState().setToken(newToken);

                originalRequest.headers.Authorization = newToken;

                return apiClient(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().clearToken();

                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);
