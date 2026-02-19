# 🎨 UI & Design System

This document is the **single source of truth** for the application's design system. strict adherence to these rules is required to maintain a consistent, professional, and trustworthy user experience.

---

## 1. Brand Identity

**Core Values:**
- **Trust**: Clean, verified, professional.
- **Simplicity**: No clutter, clear actions.
- **Modern**: Rounded corners, soft shadows, ample whitespace.

---

## 2. Color System

### Primary Palette
| Name | Hex Code | Usage |
|------|----------|-------|
| **Primary** | `#0288AC` | Main buttons, active states, icons, links |
| **Highlight** | `#FFEA00` | Featured badges, promo banners, warnings |
| **Dark** | `#04252E` | Main text, headers, dark backgrounds |

### Semantic Colors
| Name | Hex Code | Usage |
|------|----------|-------|
| **Success** | `#06A649` | Verified badges, completion, success states |
| **Error** | `#FE3335` | Error messages, destructive actions (delete) |
| **Warning** | `#FFEA00` | Attention needed, pending states |
| **Info** | `#0288AC` | Information alerts, tips |

### Neutrals
| Name | Hex Code | Usage |
|------|----------|-------|
| **Background** | `#FFFFFF` | Default screen background |
| **Secondary Text** | `#5A5E5E` | Subtitles, captions, metadata |
| **Border** | `#E5E7EB` | Subtle dividers, card borders |
| **Surface** | `#F3F4F6` | Input fields, secondary backgrounds |

---

## 3. Typography

**Font Family**: System Font (San Francisco on iOS, Roboto on Android)

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **H1** | 30px | Bold (700) | 36px | Main Screen Titles |
| **H2** | 24px | SemiBold (600) | 32px | Section Headers |
| **H3** | 20px | SemiBold (600) | 28px | Card Titles |
| **Body Large** | 18px | Regular (400) | 28px | Featured descriptions |
| **Body** | 16px | Regular (400) | 24px | Standard text |
| **Body Small** | 14px | Regular (400) | 20px | Secondary details |
| **Caption** | 12px | Regular (400) | 16px | Metadata, timestamps |
| **Button** | 16px | SemiBold (600) | 20px | Action buttons |

---

## 4. Spacing & Layout

**Grid System**: 8px Base Unit

| Token | Size | Usage |
|-------|------|-------|
| `xs` | 4px | Minimal spacing (e.g., inside tags) |
| `sm` | 8px | Standard component padding (small) |
| `md` | 16px | Default content padding (1x) |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Major separation |
| `2xl` | 40px | Screen margins (large displays) |

**Screen Padding**: Always use `16px` (`spacing.md`) horizontal padding for main content.

---

## 5. Components & Shape

### Border Radius
- **Base (Cards, Inputs, Buttons)**: `12px`
- **Large (Modals, Bottom Sheets)**: `16px`
- **Small (Tags, Checkboxes)**: `4px`
- **Full (Avatars, Pills)**: `9999px`

### Shadows
Use soft, diffuse shadows. Avoid harsh, dark outlines.
- **Card Shadow**: `0px 2px 8px rgba(0, 0, 0, 0.05)`
- **Floating Action**: `0px 4px 12px rgba(2, 136, 172, 0.3)` (Primary color shadow)

---

## 6. Rules of Usage

1.  **Strict Color Limits**: Never use more than 3 strong colors on a single screen. Primary (`#0288AC`) must dominate.
2.  **Verified Badges**: MUST always use **Success Green** (`#06A649`). No exceptions.
3.  **Errors**: ALways use **Error Red** (`#FE3335`) for validation and critical issues.
4.  **No Hardcoding**: Always import from `src/theme`.
    - ❌ `color: '#0288AC'`
    - ✅ `color: colors.primary`
5.  **Whitespace**: Be generous. If in doubt, add more whitespace (use `spacing.lg` or `spacing.xl`).
6.  **Consistency**: Do not invent new font sizes or corner radii. Stick to the defined system.

---

## 7. Implementation Reference

**Theme Import:**
```typescript
import { colors, typography, spacing, borderRadius } from '@/theme';
```

**Common Styles:**
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md, // 16px
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.base, // 12px
    padding: spacing.md, // 16px
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.base, // 12px
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...typography.textStyles.button,
    color: colors.button.textPrimary,
  }
});
```
