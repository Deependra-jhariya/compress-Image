export const typography = {
    // Font sizes
    fontSize: {
        xs: 10,
        sm: 12,
        base: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 28,
        huge: 32,
        massive: 36,
        giant: 48,
    },

    // Font weights
    fontWeight: {
        light: '300' as const,
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
        extrabold: '800' as const,
    },

    // Line heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2,
    },

    // Letter spacing
    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
        wider: 1,
        widest: 2,
    },
} as const;

export type Typography = typeof typography;
