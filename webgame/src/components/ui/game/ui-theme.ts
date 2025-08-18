
// Color Palette for Retro Game Theme
const RETRO_COLORS = {
    // Primary browns (main UI backgrounds)
    brown: {
        50: '#f5f0e8',    // lightest cream
        100: '#e8dcc8',   // light cream
        200: '#d4c4a0',   // medium cream
        300: '#c4a882',   // warm tan
        400: '#b5a585',   // medium tan
        500: '#a0916b',   // base brown
        600: '#8b7355',   // dark brown
        700: '#6b5635',   // darker brown
        800: '#5a4628',   // very dark brown
        900: '#4a3618',   // darkest brown
        950: '#3a2610',   // ultra dark
    },

    // UI states
    surface: {
        primary: '#8b7355',     // main UI background
        secondary: '#6b5635',   // darker UI elements
        inset: '#4a3618',       // inset/depressed areas
        raised: '#d4c4a0',      // raised/active elements
        text: '#2a2a1a',        // dark text on light backgrounds
        textLight: '#d4c4a0',   // light text on dark backgrounds
    },

    // Status bars
    status: {
        health: '#dc2626',      // solid red
        mana: '#fbbf24',        // solid yellow/gold
        experience: '#3b82f6',  // solid blue
        background: '#3a2610',  // dark brown for bar backgrounds
    },

    // Chat colors
    chat: {
        service: '#90EE90',     // light green
        motd: '#87CEEB',        // sky blue
        message: '#ffd700',     // gold
        system: '#a78bfa',      // purple
        guild: '#f472b6',       // pink
    },

    // Interactive states
    interactive: {
        hover: '#e0d4b0',
        active: '#b5a585',
        disabled: '#5a4628',
    }
};