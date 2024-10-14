import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        persian: '#2A9D8F',
        silver: '#F5F5F5',
        wolf: '#d6d6d6',
        myblue: '#1933ff'
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
