
export const themeTokens = {
  colors: {
    primary: '#2563EB',        // Main brand action blue
    primaryHover: '#1D4ED8',   // Hover state blue
    primarySoft: '#EFF6FF',    // Light tinted blue background
    background: '#F8FAFC',     // Clean slate app background
    surface: '#FFFFFF',        // Pure white card/table surface
    textPrimary: '#0F172A',    // Dark slate headings/body text
    textSecondary: '#475569',  // Medium slate secondary labels
    textMuted: '#8b8c8fff',      // Light slate placeholders/icons
    border: '#E2E8F0',         // Subtle neutral border
    focusRing: 'rgba(10, 12, 15, 0.25)', // Subtle blue focus halo
    sidebar: '#0F172A',        // Dark slate sidebar background
    sidebarSecondary: '#172033', // Darker slate sidebar card/nav
    success: '#059669',        // Emerald success
    warning: '#D97706',        // Amber warning
    danger: '#E11D48',         // Rose/Red danger
    purple: '#7C3AED',         // Purple stage highlight
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    label: {
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0',
      transform: 'none', // Sentence case, avoid all-caps
    },
    body: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    heading: {
      fontSize: '22px',
      fontWeight: '700',
      letterSpacing: '-0.02em',
    },
  },
  controls: {
    height: '40px',          // 40px standard input/button height
    borderRadius: '8px',     // 8px rounded corners
    tableRowHeight: '56px',  // 56-60px row height
  },
  spacing: {
    4: '4px',
    8: '8px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    32: '32px',
    40: '40px',
    48: '48px',
  },
} as const;
