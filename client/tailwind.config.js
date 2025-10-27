module.exports = {
  theme: {
    extend: {
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "marquee-rtl": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        marquee: "marquee 20s linear infinite",
        "marquee-rtl": "marquee-rtl 20s linear infinite",
      },
    },
  },
  plugins: [],
};
