/**
 * Border Radius System
 * Strictly enforces 12px or 16px radius for major containers
 * Can use smaller consistent values for nested elements (like tags) if needed
 */

export const borderRadius = {
    // Base values from UI & DESIGN SYSTEM
    base: 12,    // Main border radius for cards, containers
    large: 16,   // Larger radius for dialogs, modals

    // Specific usages
    button: 12,
    card: 12,
    input: 12,
    modal: 16,

    // Other atomic values (if strictly needed for small elements)
    sm: 4,  // Minimal rounding (e.g. checkbox)
    md: 8,  // Medium elements
    full: 9999, // Circular (Avatars, pills)
};

export type BorderRadius = typeof borderRadius;
