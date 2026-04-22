export type ThemePalette = {
  brandBlue: string;
  brandBlueDark: string;
  brandBlueLight: string;
  brandBlueSoft: string;
  brandBorder: string;
  brandOrange: string;
  brandOrangeDark: string;
  surface: string;
  textMain: string;
  textMuted: string;
  tableRow: string;
  tableRowHover: string;
  // convenience aliases
  background?: string;
};

const light: ThemePalette = {
  brandBlue: '#1e5fb8',
  brandBlueDark: '#144a95',
  brandBlueLight: '#2e78d4',
  brandBlueSoft: '#e7f1ff',
  brandBorder: '#d6e6ff',
  brandOrange: '#f28c28',
  brandOrangeDark: '#d87316',
  surface: '#ffffff',
  textMain: '#16223a',
  textMuted: '#5b6b86',
  tableRow: '#f3f8ff',
  tableRowHover: '#e7f1ff',
  background: '#ffffff',
};

const dark: ThemePalette = {
  brandBlue: '#4c8ff0',
  brandBlueDark: '#2c6fda',
  brandBlueLight: '#6aa5f5',
  brandBlueSoft: '#1b2a44',
  brandBorder: '#243755',
  brandOrange: '#f4a54b',
  brandOrangeDark: '#db8a35',
  surface: '#101825',
  textMain: '#e6edf7',
  textMuted: '#a9b6cc',
  tableRow: '#141f31',
  tableRowHover: '#1b2a44',
  background: '#101825',
};

const Colors: { light: ThemePalette; dark: ThemePalette } = { light, dark };

export default Colors;
