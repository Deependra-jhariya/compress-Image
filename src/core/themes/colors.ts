export const colors = {
    // Background colors
    background: {
        primary: '#ffffff', // White
        secondary: '#f8fafc', // Slate 50
        tertiary: '#f1f5f9', // Slate 100
    },

    // Brand colors (iLoveIMG inspired Blue)
    brand: {
        primary: '#2b75bb', // iLoveIMG Blue
        secondary: '#00c3cc', // Cyan accent
        purple: '#6366f1',
        purpleLight: '#818cf8',
        purpleDark: '#4f46e5',
        cyan: '#06b6d4',
        cyanLight: '#22d3ee',
        cyanDark: '#0891b2',
    },

    // Text colors
    text: {
        primary: '#0f172a', // Slate 900
        secondary: '#475569', // Slate 600
        tertiary: '#94a3b8', // Slate 400
        disabled: '#cbd5e1', // Slate 300
        inverse: '#ffffff',
    },

    // UI colors
    ui: {
        border: '#e2e8f0', // Slate 200
        borderActive: '#2b75bb',
        overlay: 'rgba(0, 0, 0, 0.5)',
        card: '#ffffff',
        cardHover: '#f8fafc',
    },

    // Status colors
    status: {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
    },

    // Gradients
    gradients: {
        primary: ['#2b75bb', '#00c3cc'], // Blue to Cyan
        secondary: ['#4b6cb7', '#182848'], // Deep Blue (Keep for contrast if needed)
        card: ['#ffffff', '#f8fafc'],
    },
} as const;

export type Colors = typeof colors;
