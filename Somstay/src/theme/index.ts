/**
 * Theme Index
 * Central export for all theme values
 */

export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export { borderRadius } from './borderRadius';
export { shadows } from './shadows';

// Re-export types
export type { Colors } from './colors';
export type { Typography } from './typography';
export type { Spacing } from './spacing';
export type { BorderRadius } from './borderRadius';
export type { Shadows } from './shadows';

// Combined theme object
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { borderRadius } from './borderRadius';
import { shadows } from './shadows';

export const theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
};

export type Theme = typeof theme;
