export type FlowerType = 'sunflower' | 'daisy' | 'lily' | 'tulip' | 'lavender' | 'forgetmenot' | 'orchid';

export interface FlowerData {
  id: string;
  name: string;
  type: FlowerType;
  symbol: string;
  meaning: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  asciiArt: string[]; // Tagged ASCII art with <colorName>...</colorName> or hex
  plainAscii: string;
}

export interface BouquetWrapper {
  id: string;
  name: string;
  icon: string;
  description: string;
  asciiWrapTop: string[];
  asciiWrapBottom: string[];
  color: string;
}

export interface BouquetItem {
  flowerId: string;
  count: number;
}

export interface PlantedFlower {
  id: string;
  flowerId: string;
  x: number;
  y: number;
  scale: number;
  createdAt: number;
  character: string;
  color: string;
}

export interface PetalReason {
  id: number;
  text: string;
  subtext: string;
  color: string;
  asciiArt?: string;
}

export interface LoveNote {
  id: string;
  title: string;
  badge: string;
  message: string;
  ps: string;
}

export type GardenTheme = 'midnight' | 'twilight' | 'strawberry' | 'matcha' | 'sunset';

export interface ThemeConfig {
  id: GardenTheme;
  name: string;
  bgClass: string;
  cardBg: string;
  borderClass: string;
  accentText: string;
  tag: string;
  previewColor: string;
}
