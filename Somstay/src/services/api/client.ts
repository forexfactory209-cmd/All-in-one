/**
 * API Client Configuration
 * Axios instance with interceptors for authentication and error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, API_TIMEOUT } from './endpoints';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});


// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            // Get auth token from SecureStore
            const token = await SecureStore.getItemAsync('authToken');

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        // Return successful response
        return response;
    },
    async (error: AxiosError) => {
        // Handle different error status codes
        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case 401:
                    // Unauthorized - Clear token and redirect to login
                    // await AsyncStorage.removeItem('authToken');
                    // NavigationService.navigate('Login');
                    console.error('Unauthorized - Please login again');
                    break;

                case 403:
                    // Forbidden
                    console.error('Access forbidden');
                    break;

                case 404:
                    // Not found
                    console.error(`[API 404] Resource not found: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
                    if (error.response?.data) {
                        console.error(`[API 404] Response data:`, JSON.stringify(error.response.data));
                    }
                    break;

                case 500:
                    // Server error
                    console.error('Server error - Please try again later');
                    break;

                default:
                    console.error('An error occurred:', error.message);
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network error - Please check your connection');
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
