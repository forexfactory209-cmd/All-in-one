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
    dark: '#04252E',      // Usage: Main text, Header background
    secondaryText: '#5A5E5E', // Usage: Subtitles, Metadata
    background: '#FFFFFF',    // Usage: Default screen background
    white: '#FFFFFF',

    // Grays (for borders, dividers) - Derived from Secondary Text or Dark
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',

    // Component Specific
    text: {
        primary: '#04252E',   // Dark
        secondary: '#5A5E5E', // Secondary Text
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
