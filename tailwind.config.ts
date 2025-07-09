const config = {
  theme: {
    extend: {
      colors: {
        // force Tailwind to compile these as rgb()
        background: "#f9fafb",
        primary: "#4f46e5",
        secondary: "#a78bfa",
      },
    },
  },
  plugins: [],
  safelist: [],
  // ⛔️ Don't use experimental color formats like oklch
};

export default config;