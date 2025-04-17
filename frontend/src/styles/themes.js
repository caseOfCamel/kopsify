// src/styles/theme.js
const theme = {
    colors: {
      primary: "rgb(255, 219, 0)", // Kops Records bright yellow
      background: "#ffffff", // Clean white background
      text: "#111111", // Very dark gray, almost black for text
      secondary: "#f5f5f5", // Light gray for secondary backgrounds
      accent: "#333333", // Dark gray for accents
      error: "#d32f2f", // Red for errors
      success: "#388e3c", // Green for success messages
    },
    typography: {
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        bold: 700,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
      }
    },
    spacing: {
      xs: "0.25rem", // 4px
      sm: "0.5rem", // 8px
      md: "1rem", // 16px
      lg: "1.5rem", // 24px
      xl: "2rem", // 32px
      "2xl": "2.5rem", // 40px
      "3xl": "3rem", // 48px
    },
    borderRadius: {
      none: "0",
      sm: "0.125rem", // 2px
      md: "0.25rem", // 4px
      lg: "0.5rem", // 8px
      xl: "1rem", // 16px
      full: "9999px", // Full rounded
    },
    shadows: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    transitions: {
      default: "0.2s ease-in-out",
      slow: "0.3s ease-in-out",
      fast: "0.1s ease-in-out",
    },
    zIndices: {
      header: 10,
      modal: 20,
      tooltip: 30,
    }
  };
  
  export default theme;