/**
 * Spacing System
 * Strictly enforces 8px grid system for layout
 */

export const spacing = {
    // Base spacing unit (8px)
    unit: 8,

    // Grid System
    xs: 4,    // 0.5x (half unit)
    sm: 8,    // 1x (base unit)
    md: 16,   // 2x
    lg: 24,   // 3x
    xl: 32,   // 4x
    '2xl': 40,  // 5x
    '3xl': 48,  // 6x
    '4xl': 64,  // 8x
    '5xl': 80,  // 10x

    // Specific Use Cases
    screenPadding: 16,     // Left/Right padding for screens
    cardPadding: 16,       // Content padding inside cards
    sectionSpacing: 24,    // Vertical spacing between major sections
    componentGap: 16,      // Gap between related components (e.g. form fields)

    // Icon Sizes (Standardized)
    iconSizes: {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 32,
        xl: 40,
    },
};

export type Spacing = typeof spacing;
