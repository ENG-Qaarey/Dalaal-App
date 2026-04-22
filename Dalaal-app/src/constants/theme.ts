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
  brandBlue: '#5ea0ff',
  brandBlueDark: '#3e84f0',
  brandBlueLight: '#86bbff',
  brandBlueSoft: '#17253a',
  brandBorder: '#253a58',
  brandOrange: '#f7ae56',
  brandOrangeDark: '#e08f34',
  surface: '#0d1522',
  textMain: '#eff4fb',
  textMuted: '#b0bdd1',
  tableRow: '#0a101a',
  tableRowHover: '#070b0f',
  background: '#030407',
};

const Colors: { light: ThemePalette; dark: ThemePalette } = { light, dark };

export default Colors;
