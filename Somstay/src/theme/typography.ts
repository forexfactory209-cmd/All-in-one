/**
 * Typography System
 * Defines font families, sizes, weights, and line heights
 */

export const typography = {
    // Font Families
    fontFamily: {
        regular: 'System',
        medium: 'System',
        semiBold: 'System',
        bold: 'System',
    },

    // Font Sizes
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
    },

    // Font Weights
    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semiBold: '600' as const,
        bold: '700' as const,
        extraBold: '800' as const,
    },

    // Line Heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2,
    },

    // Text Styles (Predefined combinations)
    textStyles: {
        // Headings
        h1: {
            fontSize: 36,
            fontWeight: '700' as const,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: 30,
            fontWeight: '700' as const,
            lineHeight: 1.2,
        },
        h3: {
            fontSize: 24,
            fontWeight: '600' as const,
            lineHeight: 1.3,
        },
        h4: {
            fontSize: 20,
            fontWeight: '600' as const,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: 18,
            fontWeight: '600' as const,
            lineHeight: 1.4,
        },
        h6: {
            fontSize: 16,
            fontWeight: '600' as const,
            lineHeight: 1.5,
        },

        // Body Text
        bodyLarge: {
            fontSize: 18,
            fontWeight: '400' as const,
            lineHeight: 1.5,
        },
        body: {
            fontSize: 16,
            fontWeight: '400' as const,
            lineHeight: 1.5,
        },
        bodySmall: {
            fontSize: 14,
            fontWeight: '400' as const,
            lineHeight: 1.5,
        },

        // Labels
        label: {
            fontSize: 14,
            fontWeight: '500' as const,
            lineHeight: 1.4,
        },
        labelSmall: {
            fontSize: 12,
            fontWeight: '500' as const,
            lineHeight: 1.4,
        },

        // Captions
        caption: {
            fontSize: 12,
            fontWeight: '400' as const,
            lineHeight: 1.3,
        },
        captionSmall: {
            fontSize: 10,
            fontWeight: '400' as const,
            lineHeight: 1.3,
        },

        // Buttons
        button: {
            fontSize: 16,
            fontWeight: '600' as const,
            lineHeight: 1.2,
        },
        buttonSmall: {
            fontSize: 14,
            fontWeight: '600' as const,
            lineHeight: 1.2,
        },
    },
};

export type Typography = typeof typography;
