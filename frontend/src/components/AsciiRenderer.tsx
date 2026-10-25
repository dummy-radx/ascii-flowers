import React from 'react';

// Color map for standard cute botanical palette
export const COLOR_PALETTE: Record<string, string> = {
  // Sunflowers
  sunflower: '#fbbf24', // Amber/Yellow
  gold: '#f59e0b',
  amber: '#d97706',
  sunseed: '#78350f', // Dark amber/brown center
  sunseedLight: '#92400e',
  
  // Daisies
  white: '#f8fafc',
  cream: '#fef9c3',
  daisyCenter: '#facc15',
  daisyPetal: '#f1f5f9',
  softWhite: '#e2e8f0',

  // Lilies
  lilyPetal: '#f472b6', // Radiant blush/pink
  lilyDeep: '#db2777',
  lilyStamen: '#be185d',
  lilyWhite: '#ffffff',
  lilyPollen: '#f59e0b',
  stargazer: '#e879f9',

  // Tulips
  tulipPeach: '#fb923c',
  tulipPink: '#f43f5e',
  tulipPurple: '#a855f7',
  tulipYellow: '#fde047',

  // Lavender & Fairy bells
  lavender: '#c084fc',
  lavenderDeep: '#9333ea',
  forgetmenot: '#38bdf8',
  skyBlue: '#60a5fa',
  orchid: '#e879f9',
  bellBlue: '#818cf8',

  // Foliage & Stems
  stem: '#16a34a', // Emerald green
  leaf: '#22c55e', // Vibrant green
  leafDark: '#15803d',
  sprout: '#4ade80',
  fern: '#10b981',

  // Wrappers & Ribbons
  ribbon: '#ec4899',
  ribbonGold: '#fbbf24',
  kraft: '#b45309',
  kraftLight: '#d97706',
  paper: '#e2e8f0',
  glass: '#38bdf8',
  basket: '#92400e',

  // Cute critters & Accents
  sparkle: '#fef08a',
  heart: '#fb7185',
  blush: '#fda4af',
  kittyFur: '#f8fafc',
  bunnyFur: '#e0f2fe',
  duckBeak: '#f97316',
  duckBody: '#fde047',
  pondWater: '#0ea5e9',
  frogGreen: '#4ade80',
  dim: '#64748b',
};

export interface AsciiSegment {
  text: string;
  color?: string;
  isBold?: boolean;
}

export function parseAsciiLine(line: string): AsciiSegment[] {
  const segments: AsciiSegment[] = [];
  const tagRegex = /<([#a-zA-Z0-9_-]+)>(.*?)<\/\1>|<([#a-zA-Z0-9_-]+)>(.*?)(?=<|$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: line.substring(lastIndex, match.index) });
    }

    const tagName = match[1] || match[3];
    const content = match[2] !== undefined ? match[2] : match[4];
    
    // Resolve color
    const color = COLOR_PALETTE[tagName] || (tagName.startsWith('#') ? tagName : undefined);
    segments.push({ text: content, color });
    lastIndex = tagRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    segments.push({ text: line.substring(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ text: line }];
}

export function stripAsciiTags(raw: string): string {
  return raw.replace(/<\/?[#a-zA-Z0-9_-]+>/g, '');
}

interface AsciiRendererProps {
  lines: string[];
  className?: string;
  animate?: 'sway' | 'bounce' | 'glow' | 'none';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg';
}

export const AsciiRenderer: React.FC<AsciiRendererProps> = ({
  lines,
  className = '',
  animate = 'none',
  fontSize = 'sm',
}) => {
  const animClass =
    animate === 'sway'
      ? 'animate-sway'
      : animate === 'bounce'
      ? 'animate-gentle-bounce'
      : animate === 'glow'
      ? 'animate-pulse-glow'
      : '';

  const sizeClass =
    fontSize === 'xs'
      ? 'text-[14px] sm:text-[14.5px] leading-[18px]'
      : fontSize === 'sm'
      ? 'text-[16px] sm:text-[17px] leading-[21px]'
      : fontSize === 'lg'
      ? 'text-[22px] sm:text-[23px] leading-[28px]'
      : 'text-[18.5px] sm:text-[19.5px] leading-[25px]';

  return (
    <pre
      className={`ascii-art select-all font-mono whitespace-pre overflow-x-auto ${sizeClass} ${animClass} ${className}`}
      style={{
        fontFamily: "'JetBrains Mono', 'Space Mono', 'Courier New', monospace",
        textShadow: '0 0 1px currentColor',
      }}
    >
      {lines.map((line, lineIdx) => {
        const segments = parseAsciiLine(line);
        return (
          <div key={lineIdx} className="block whitespace-pre">
            {segments.map((seg, segIdx) => (
              <span
                key={segIdx}
                style={seg.color ? { color: seg.color } : undefined}
                className={!seg.color ? 'text-slate-300' : ''}
              >
                {seg.text}
              </span>
            ))}
          </div>
        );
      })}
    </pre>
  );
};
