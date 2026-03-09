/* eslint-disable no-undef */
export const content = ['./index.html', './src/**/*.{js,ts,jsx,tsx}'];
export const plugins = [];
export const theme = {
  extend: {
    fontFamily: {
      mono: ["'Nova Mono'"],
      inter: ["'Inter'"],
      roboto: ["'Roboto'"],
    },
    colors: {
      black: 'rgba(0,0,0)',
      black100: 'rgba(0,0,0,0.2)',
      black200: '#252525',

      white: 'rgba(255,255,255)',
      white100: 'rgba(255,255,255, 0.20)',

      blue: '#009CDE',
      blue100: '#ADE4FB',
      blue200: '#6ACAF3',
      blue300: '#29B0E9',
      blue400: '#1976d2',
      blue500: '#114568',

      purple: 'rgba(51, 51, 102)',
      purple50: 'rgba(51, 51, 102, 0.50)',
      purple100: 'rgba(102, 102, 153)',
      purple500: 'rgba(102, 51, 102)',

      pink: 'rgba(153, 51, 102)',
      pink50: 'rgba(153, 51, 102, 0.50)',

      gray: '#BFBFBF',
      gray30: 'rgba(224, 224, 224, 1)',
      gray100: '#F6F6F6',
      gray50: 'rgba(255, 255, 255, 0.2)',
      gray200: '#5D5D5D',
      gray300: 'rgba(188, 188, 188, 0.90)',
      gray400: 'rgba(188, 188, 188, 0.60)',
      gray500: '#9E9E9E',
      gray600: '#6a6a6a',
      gray700: '#E8F0FE',

      red: '#F94449',
      red50: 'rgba(255, 0, 0, 0.20)',
      red100: '#ff2c2c',
      red200: '#ff0000',

      green: '#3F9C35',
      green10: '#37892f ',
      green50: 'rgba(87, 200, 77, 0.20)',
      green100: '#2eb62c',
      green200: '#57c84d',

      yellow: '#FEDB31',
      orange: '#F4A231',
    },
  },
  screens: {
    sm: '576px',
    md: '768px',
    mdx: '820px',
    lg: '992px',
  },
};
export const important = true;
