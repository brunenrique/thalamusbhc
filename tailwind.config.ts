import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Keeping theme extensions empty for now to isolate the issue
    },
  },
  plugins: [
    // Keeping plugins empty for now
  ],
  // darkMode: 'class', // Keeping darkMode commented out for now
};
export default config;
