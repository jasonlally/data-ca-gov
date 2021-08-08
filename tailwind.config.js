module.exports = {
  // 2021-06-24 trying out fix for tailwind production that worked for main site
  // see https://github.com/datopian/portal.js/issues/571
  // purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  purge: [
    './pages/**/*.js',
    './pages/**/*.ts',
    './pages/**/*.jsx',
    './pages/**/*.tsx',
    './components/**/*.js',
    './components/**/*.ts',
    './components/**/*.jsx',
    './components/**/*.tsx',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Roboto', 'sans-serif'],
        headers: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        'accent-light': 'var(--color-accent-light)',
        'accent-bright': 'var(--color-accent-bright)',
        'accent-neutral': 'var(--color-accent-neutral)',
        negative: 'var(--color-negative)',
        positive: 'var(--color-positive)',
        'primary-background': 'var(--background-primary)',
        'sec-background': 'var(--background-sec)',
        'primary-text': 'var(--color-text-primary)',
      },
      fontSize: {
        tiny: 'var(--font-size-small)',
        md: 'var(--font-size-medium)',
        lg: 'var(--font-size-large)',
      },
    },
    backgroundColor: (theme) => ({
      ...theme('colors'),
    }),
  },
  variants: {
    backgroundColor: ['hover', 'active', 'odd'],
    cursor: ['hover', 'focus'],
    margin: ['last'],
  },
  plugins: ['font-size', require('@tailwindcss/typography')],
  corePlugins: {
    fontSize: true,
  },
};
