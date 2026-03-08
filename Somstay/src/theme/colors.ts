/**
 * Color Palette
 * Strictly follows the Design System
 */

export const colors = {
    // Brand Colors
    primary: '#0288AC',
    primaryDark: '#015f78', // Darker shade for press states
    primaryLight: '#34a0bd', // Lighter shade for backgrounds/accents

    // Accent Colors
    highlight: '#FFEA00', // Usage: Featured listings, Promo banners

    // Semantic Colors
    success: '#06A649', // Usage: Verified badge, Success alerts
    error: '#FE3335',   // Usage: Error messages, Delete buttons
    warning: '#FFEA00', // Using Highlight as warning/attention
    info: '#0288AC',    // Using Primary for info

    // Neutral Colors
    dark: '#000000',      // Maximum contrast for main text
    secondaryText: '#333333', // Deep gray for secondary text
    background: '#F3F4F6',    // Slightly darker gray background to make white cards pop
    white: '#FFFFFF',

    // Grays (for borders, dividers) - Derived from Secondary Text or Dark
    gray50: '#F9FAFB',
    gray100: '#E5E7EB', // Darker for cards to pop
    gray200: '#D1D5DB',
    gray300: '#9CA3AF',

    // Component Specific
    text: {
        primary: '#000000',
        secondary: '#333333',
        inverse: '#FFFFFF',
        error: '#FE3335',
        success: '#06A649',
    },

    button: {
        primary: '#0288AC',
        secondary: '#FFFFFF',
        textPrimary: '#FFFFFF',
        textSecondary: '#0288AC',
    },

    border: '#E5E7EB', // Light gray for subtle borders
};

export type Colors = typeof colors;
