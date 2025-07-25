
/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    color: { mode: "legacy" },       
  },
  plugins: [],
}