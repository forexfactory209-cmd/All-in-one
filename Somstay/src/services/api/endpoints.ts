/**
 * API Endpoints
 * Centralized API endpoint constants
 */

import Constants from 'expo-constants';

// Get the host machine's IP address dynamically in development
const getHostUrl = () => {
    const hostUri = Constants.expoConfig?.hostUri;
    if (!hostUri) return 'localhost';

    // hostUri usually looks like "192.168.1.106:19000"
    const host = hostUri.split(':')[0];
    console.log('getHostUrl:', host);
    return host;
};

// Base URL - Update this with your actual API URL
export const API_BASE_URL = __DEV__
    ? `http://${getHostUrl()}:5000/api/v1`  // Development - points to host machine
    : 'https://api.vacationrental.com/api/v1';  // Production

// API Timeout
export const API_TIMEOUT = 30000; // 30 seconds

// Auth Endpoints
export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_PHONE: '/auth/verify-phone',
};

// User Endpoints
export const USER_ENDPOINTS = {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPLOAD_PHOTO: '/users/profile/photo',
    VERIFICATION: '/users/verification',
    CHANGE_PASSWORD: '/users/change-password',
};

// Property Endpoints
export const PROPERTY_ENDPOINTS = {
    LIST: '/properties',
    DETAILS: (id: string) => `/properties/${id}`,
    CREATE: '/properties',
    UPDATE: (id: string) => `/properties/${id}`,
    DELETE: (id: string) => `/properties/${id}`,
    FEATURED: '/properties/featured',
    RECOMMENDATIONS: (userId: string) => `/properties/recommendations/${userId}`,
    SEARCH: '/properties/search',
    MY_PROPERTIES: '/properties/my-properties',
    UPLOAD_PHOTOS: (id: string) => `/properties/${id}/photos`,
    DELETE_PHOTO: (propertyId: string, photoId: string) =>
        `/properties/${propertyId}/photos/${photoId}`,
};

// Booking Endpoints
export const BOOKING_ENDPOINTS = {
    CREATE: '/bookings',
    LIST: '/bookings',
    DETAILS: (id: string) => `/bookings/${id}`,
    UPDATE: (id: string) => `/bookings/${id}`,
    CANCEL: (id: string) => `/bookings/${id}/cancel`,
    ACCEPT: (id: string) => `/bookings/${id}/accept`,
    DECLINE: (id: string) => `/bookings/${id}/decline`,
    MY_BOOKINGS: '/bookings/my-bookings',
    HOST_BOOKINGS: '/bookings/host-bookings',
};

// Review Endpoints
export const REVIEW_ENDPOINTS = {
    CREATE: '/reviews',
    LIST: (propertyId: string) => `/reviews/property/${propertyId}`,
    DETAILS: (id: string) => `/reviews/${id}`,
    UPDATE: (id: string) => `/reviews/${id}`,
    DELETE: (id: string) => `/reviews/${id}`,
    USER_REVIEWS: (userId: string) => `/reviews/user/${userId}`,
    STATS: (propertyId: string) => `/reviews/property/${propertyId}/stats`,
};

// Message Endpoints
export const MESSAGE_ENDPOINTS = {
    CONVERSATIONS: '/messages/conversations',
    CONVERSATION_DETAILS: (id: string) => `/messages/conversations/${id}`,
    SEND: '/messages',
    MARK_READ: (id: string) => `/messages/${id}/read`,
    UNREAD_COUNT: '/messages/unread-count',
};

// Payment Endpoints
export const PAYMENT_ENDPOINTS = {
    CREATE_INTENT: '/payments/create-intent',
    CONFIRM: '/payments/confirm',
    REFUND: (id: string) => `/payments/${id}/refund`,
    HISTORY: '/payments/history',
    PAYOUT_SETTINGS: '/payments/payout-settings',
};

// Upload Endpoints
export const UPLOAD_ENDPOINTS = {
    IMAGE: '/upload/image',
    DOCUMENT: '/upload/document',
    MULTIPLE: '/upload/multiple',
};

// Admin Endpoints (Phase 2+)
export const ADMIN_ENDPOINTS = {
    USERS: '/admin/users',
    PROPERTIES: '/admin/properties',
    BOOKINGS: '/admin/bookings',
    REVIEWS: '/admin/reviews',
    APPROVE_PROPERTY: (id: string) => `/admin/properties/${id}/approve`,
    REJECT_PROPERTY: (id: string) => `/admin/properties/${id}/reject`,
    SUSPEND_USER: (id: string) => `/admin/users/${id}/suspend`,
    ANALYTICS: '/admin/analytics',
};

// Service Endpoints
export const SERVICE_ENDPOINTS = {
    CARS: '/cars',
    CAR_DETAILS: (id: string) => `/cars/${id}`,
    CAR_BOOKINGS: '/car-bookings',
    MY_CAR_BOOKINGS: '/car-bookings/my-bookings',
    CHECK_CAR_AVAILABILITY: '/car-bookings/check-availability',
    TOURS: '/tours',
    TOUR_DETAILS: (id: string) => `/tours/${id}`,
};
