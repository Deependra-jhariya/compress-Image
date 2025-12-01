export const spacing = {
    // Base spacing unit (4px)
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    huge: 48,
    massive: 64,

    // Specific use cases
    screen: {
        horizontal: 20,
        vertical: 24,
    },

    card: {
        padding: 16,
        margin: 12,
        gap: 16,
    },

    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },

    icon: {
        small: 20,
        medium: 24,
        large: 32,
        xlarge: 48,
    },
} as const;

export type Spacing = typeof spacing;
